import { Collection, ObjectId, WithId } from "mongodb";
import { getDb } from "./mongodb";
import { Paket, Sesi } from "./types";

type PaketDoc = Omit<Paket, "id">;
type SesiDoc = Omit<Sesi, "id">;

export async function paketCollection(): Promise<Collection<PaketDoc>> {
  const db = await getDb();
  return db.collection<PaketDoc>("paket");
}

export async function sesiCollection(): Promise<Collection<SesiDoc>> {
  const db = await getDb();
  return db.collection<SesiDoc>("sesi");
}

/** Mongo's `_id` (ObjectId) becomes the app's plain string `id`, same shape as before. */
export function toPaket(doc: WithId<PaketDoc>): Paket {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function toSesi(doc: WithId<SesiDoc>): Sesi {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function isValidId(id: string): boolean {
  return ObjectId.isValid(id);
}

export { ObjectId };
