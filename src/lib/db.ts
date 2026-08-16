import { Collection, ObjectId, WithId } from "mongodb";
import { getDb } from "./mongodb";
import { Paket, Sesi } from "./types";

type PaketDoc = Omit<Paket, "id">;
type SesiDoc = Omit<Sesi, "id">;

/** 
 * Mengambil collection "paket" dari database MongoDB. 
 */
export async function paketCollection(): Promise<Collection<PaketDoc>> {
  const db = await getDb();
  return db.collection<PaketDoc>("paket");
}

/** 
 * Mengambil collection "sesi" dari database MongoDB. 
 */
export async function sesiCollection(): Promise<Collection<SesiDoc>> {
  const db = await getDb();
  return db.collection<SesiDoc>("sesi");
}

/** 
 * Mengubah dokumen Paket MongoDB menjadi objek Paket aplikasi.MongoDB _id dikonversi menjadi string id. 
 */
export function toPaket(doc: WithId<PaketDoc>): Paket {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

/** 
 * Mengubah dokumen Sesi MongoDB menjadi objek Sesi aplikasi. MongoDB _id dikonversi menjadi string id. 
 */
export function toSesi(doc: WithId<SesiDoc>): Sesi {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

/** 
 * Memeriksa apakah string merupakan ID MongoDB yang valid. 
 */
export function isValidId(id: string): boolean {
  return ObjectId.isValid(id);
}

/**
 * Mengekspor ObjectId untuk digunakan pada operasi MongoDB lainnya.
 */
export { ObjectId };
