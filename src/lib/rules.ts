import { addDays, addMinutes, format, parse } from "date-fns";
import { Paket, Sesi } from "./types";

/**
 * Mengembalikan tanggal paling awal yang dapat digunakan untuk menjadwalkan sesi baru, yaitu 3 hari dari hari ini.
 */
export function minBookableDate(today: Date = new Date()): string {
  return format(addDays(today, 3), "yyyy-MM-dd");
}

/**
 * Memeriksa apakah tanggal dapat digunakan untuk menjadwalkan sesi.
 */
export function isDateBookable(dateStr: string, today: Date = new Date()): boolean {
  return dateStr >= minBookableDate(today);
}

/**
 * Menghitung waktu selesai berdasarkan waktu mulai dan durasi sesi dalam menit.
 */
export function computeEndTime(startTime: string, durationMinutes: number): string {
  const base = parse(startTime, "HH:mm", new Date(2000, 0, 1));
  return format(addMinutes(base, durationMinutes), "HH:mm");
}

/**
 * Mengonversi waktu dalam format HH:mm menjadi jumlah menit sejak tengah malam.
 */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Memeriksa apakah dua rentang waktu pada tanggal yang sama saling bertabrakan.
 */
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

/**
 * Mencari sesi lain yang memiliki jadwal bertabrakan
 * dengan tanggal dan waktu yang diberikan.
 * Pemeriksaan dilakukan pada seluruh sesi, bukan hanya sesi dalam paket yang sama.
 */
export function findConflict(
  allSesi: Sesi[],
  date: string,
  startTime: string,
  endTime: string,
  ignoreSesiId?: string
): Sesi | undefined {
  return allSesi.find(
    (s) =>
      s.id !== ignoreSesiId &&
      s.date === date &&
      rangesOverlap(startTime, endTime, s.startTime, s.endTime)
  );
}

/**
 * Menghitung jumlah sesi yang sudah dijadwalkan dalam suatu paket.
 */
export function scheduledCount(paketId: string, allSesi: Sesi[]): number {
  return allSesi.filter((s) => s.paketId === paketId).length;
}

/**
 * Menghitung sisa kuota sesi yang tersedia dalam paket.
 * Sesi tertentu dapat diabaikan saat melakukan pengecekan.
 */
export function remainingQuota(paket: Paket, allSesi: Sesi[], ignoreSesiId?: string): number {
  const used = allSesi.filter((s) => s.paketId === paket.id && s.id !== ignoreSesiId).length;
  return paket.packageSize - used;
}

/**
 * Memeriksa apakah seluruh kuota sesi dalam paket sudah digunakan.
 */
export function isQuotaFull(paket: Paket, allSesi: Sesi[]): boolean {
  return remainingQuota(paket, allSesi) <= 0;
}
