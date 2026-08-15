import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB || "edufio";

// mongodb+srv:// needs a DNS SRV (and TXT) lookup over UDP port 53 to find
// the Atlas cluster's real hosts. Some networks block that query type
// entirely, so the driver fails with "querySrv ECONNREFUSED" even with a
// correct URI/credentials. We resolve the same records ourselves over
// DNS-over-HTTPS (port 443, effectively never blocked) and rewrite the URI
// to the standard mongodb://host1,host2,.../ form, which needs no SRV query.
async function dohQuery(name: string, type: "SRV" | "TXT"): Promise<{ data: string }[]> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const res = await fetch(url, { headers: { accept: "application/dns-json" } });
  if (!res.ok) {
    throw new Error(`Gagal resolve DNS ${type} untuk ${name} (HTTP ${res.status}).`);
  }
  const json = (await res.json()) as { Answer?: { data: string }[] };
  return json.Answer ?? [];
}

async function resolveSrvUri(uri: string): Promise<string> {
  const match = uri.match(/^mongodb\+srv:\/\/(?:([^@]+)@)?([^/?]+)(\/[^?]*)?(?:\?(.*))?$/);
  if (!match) throw new Error("Format MONGODB_URI (mongodb+srv://) tidak dikenali.");
  const [, auth, host, path, query] = match;

  const srvAnswers = await dohQuery(`_mongodb._tcp.${host}`, "SRV");
  if (srvAnswers.length === 0) {
    throw new Error(`DNS SRV untuk ${host} tidak ditemukan lewat DoH.`);
  }
  const hosts = srvAnswers.map((a) => {
    const [, , port, target] = a.data.split(" ");
    return `${target.replace(/\.$/, "")}:${port}`;
  });

  const txtAnswers = await dohQuery(host, "TXT");
  const txtOptions = txtAnswers.map((a) => a.data.replace(/^"|"$/g, "")).join("&");

  const params = new URLSearchParams(query ?? "");
  if (!params.has("ssl") && !params.has("tls")) params.set("tls", "true");
  for (const [k, v] of new URLSearchParams(txtOptions)) {
    if (!params.has(k)) params.set(k, v);
  }

  return `mongodb://${auth ? `${auth}@` : ""}${hosts.join(",")}${path || "/"}?${params.toString()}`;
}

async function buildConnectableUri(): Promise<string> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI belum diset. Salin .env.local.example ke .env.local lalu isi connection string MongoDB (lokal atau Atlas)."
    );
  }
  return uri.startsWith("mongodb+srv://") ? resolveSrvUri(uri) : uri;
}

// Reuse the client (and the resolved-URI work) across Next.js dev
// hot-reloads so we don't redo DNS-over-HTTPS resolution on every file save.
// In production each server instance gets its own single client.
declare global {
  // eslint-disable-next-line no-var
  var _edufioMongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const connect = async () => new MongoClient(await buildConnectableUri()).connect();

  if (process.env.NODE_ENV === "development") {
    if (!global._edufioMongoClientPromise) {
      global._edufioMongoClientPromise = connect();
    }
    return global._edufioMongoClientPromise;
  }

  return connect();
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
