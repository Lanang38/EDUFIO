import { Paket, Sesi } from "./types";

/**
 * Client-side data layer untuk mengakses data Paket dan Sesi  melalui API MongoDB.
 * Setiap function melakukan request menggunakan fetch() dan harus dipanggil dengan await.
 */

/**
 * Memeriksa response API dan mengembalikan data JSON.
 * Akan melempar error jika response tidak berhasil.
 */

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Permintaan gagal (${res.status}).`);
  }
  return (await res.json()) as T;
}

// ---------- Paket ---------- //

/**
 * Mengambil seluruh data paket dari API.
 */
export async function getAllPaket(): Promise<Paket[]> {
  return jsonOrThrow<Paket[]>(await fetch("/api/paket", { cache: "no-store" }));
}

/**
 * Mengambil satu paket berdasarkan ID.
 * Mengembalikan undefined jika paket tidak ditemukan.
 */
export async function getPaket(id: string): Promise<Paket | undefined> {
  const res = await fetch(`/api/paket/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  return jsonOrThrow<Paket>(res);
}

/**
 * Membuat paket baru melalui API.
 */
export async function createPaket(data: Omit<Paket, "id" | "createdAt">): Promise<Paket> {
  const res = await fetch("/api/paket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return jsonOrThrow<Paket>(res);
}

/**
 * Menghapus paket berdasarkan ID.
 */
export async function deletePaket(id: string): Promise<void> {
  await fetch(`/api/paket/${id}`, { method: "DELETE" });
}

// ---------- Sesi ---------- //

/**
 * Mengambil seluruh data sesi dari API.
 */
export async function getAllSesi(): Promise<Sesi[]> {
  return jsonOrThrow<Sesi[]>(await fetch("/api/sesi", { cache: "no-store" }));
}

/**
 * Mengambil sesi berdasarkan ID paket.
 */
export async function getSesiByPaket(paketId: string): Promise<Sesi[]> {
  return jsonOrThrow<Sesi[]>(
    await fetch(`/api/sesi?paketId=${encodeURIComponent(paketId)}`, { cache: "no-store" })
  );
}

/**
 * Mengambil satu sesi berdasarkan ID.
 * Mengembalikan undefined jika sesi tidak ditemukan.
 */
export async function getSesi(id: string): Promise<Sesi | undefined> {
  const res = await fetch(`/api/sesi/${id}`, { cache: "no-store" });
  if (res.status === 404) return undefined;
  return jsonOrThrow<Sesi>(res);
}

/**
 * Membuat sesi baru melalui API.
 */
export async function createSesi(data: Omit<Sesi, "id" | "createdAt">): Promise<Sesi> {
  const res = await fetch("/api/sesi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return jsonOrThrow<Sesi>(res);
}

/**
 * Memperbarui data sesi berdasarkan ID.
 * Mengembalikan undefined jika sesi tidak ditemukan.
 */
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

/**
 * Menghapus sesi berdasarkan ID.
 */
export async function deleteSesi(id: string): Promise<void> {
  await fetch(`/api/sesi/${id}`, { method: "DELETE" });
}
