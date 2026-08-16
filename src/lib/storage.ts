import { Paket, Sesi } from "./types";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Permintaan gagal (${res.status}).`);
  }
  return (await res.json()) as T;
}

// ---------- Paket ----------

export async function getAllPaket(): Promise<Paket[]> {
  return jsonOrThrow<Paket[]>(await fetch("/api/paket", { cache: "no-store" }));
}

export async function getPaket(id: string): Promise<Paket | undefined> {
  const res = await fetch(`/api/paket/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  return jsonOrThrow<Paket>(res);
}

export async function createPaket(data: Omit<Paket, "id" | "createdAt">): Promise<Paket> {
  const res = await fetch("/api/paket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return jsonOrThrow<Paket>(res);
}

export async function deletePaket(id: string): Promise<void> {
  await fetch(`/api/paket/${id}`, { method: "DELETE" });
}


export async function getAllSesi(): Promise<Sesi[]> {
  return jsonOrThrow<Sesi[]>(await fetch("/api/sesi", { cache: "no-store" }));
}

export async function getSesiByPaket(paketId: string): Promise<Sesi[]> {
  return jsonOrThrow<Sesi[]>(
    await fetch(`/api/sesi?paketId=${encodeURIComponent(paketId)}`, { cache: "no-store" })
  );
}

export async function getSesi(id: string): Promise<Sesi | undefined> {
  const res = await fetch(`/api/sesi/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  return jsonOrThrow<Sesi>(res);
}

export async function createSesi(data: Omit<Sesi, "id" | "createdAt">): Promise<Sesi> {
  const res = await fetch("/api/sesi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return jsonOrThrow<Sesi>(res);
}

export async function updateSesi(
  id: string,
  data: Omit<Sesi, "id" | "paketId" | "createdAt">
): Promise<Sesi | undefined> {
  const res = await fetch(`/api/sesi/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 404) return undefined;
  return jsonOrThrow<Sesi>(res);
}

export async function deleteSesi(id: string): Promise<void> {
  await fetch(`/api/sesi/${id}`, { method: "DELETE" });
}
