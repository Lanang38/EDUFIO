import { addDays, addMinutes, format, parse } from "date-fns";
import { Paket, Sesi } from "./types";

/** Earliest calendar date (YYYY-MM-DD) a new session may be booked on. */
export function minBookableDate(today: Date = new Date()): string {
  return format(addDays(today, 3), "yyyy-MM-dd");
}

export function isDateBookable(dateStr: string, today: Date = new Date()): boolean {
  return dateStr >= minBookableDate(today);
}

/** HH:mm + duration in minutes -> HH:mm */
export function computeEndTime(startTime: string, durationMinutes: number): string {
  const base = parse(startTime, "HH:mm", new Date(2000, 0, 1));
  return format(addMinutes(base, durationMinutes), "HH:mm");
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Two [start,end) ranges on the same date overlap if one starts before the other ends. */
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

/**
 * Finds a session that clashes in time with the given date/start/end.
 * Checked across every scheduled session in the app (not just the same
 * package) since one admin/tutor cannot be in two places at once — see
 * README "Keputusan" for the reasoning.
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
