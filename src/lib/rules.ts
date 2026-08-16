import { addDays, addMinutes, format, parse } from "date-fns";
import { Paket, Sesi } from "./types";

export function minBookableDate(today: Date = new Date()): string {
  return format(addDays(today, 3), "yyyy-MM-dd");
}

export function isDateBookable(dateStr: string, today: Date = new Date()): boolean {
  return dateStr >= minBookableDate(today);
}

export function computeEndTime(startTime: string, durationMinutes: number): string {
  const base = parse(startTime, "HH:mm", new Date(2000, 0, 1));
  return format(addMinutes(base, durationMinutes), "HH:mm");
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

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

export function scheduledCount(paketId: string, allSesi: Sesi[]): number {
  return allSesi.filter((s) => s.paketId === paketId).length;
}

export function remainingQuota(paket: Paket, allSesi: Sesi[], ignoreSesiId?: string): number {
  const used = allSesi.filter((s) => s.paketId === paket.id && s.id !== ignoreSesiId).length;
  return paket.packageSize - used;
}

export function isQuotaFull(paket: Paket, allSesi: Sesi[]): boolean {
  return remainingQuota(paket, allSesi) <= 0;
}
