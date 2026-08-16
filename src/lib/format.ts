const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** 
 * Mengubah tanggal ISO (YYYY-MM-DD) menjadi objek Date. 
 */
function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 
 * Memformat tanggal menjadi format lengkap Bahasa Indonesia. Contoh: "Jumat, 21 Agustus 2026". */
export function formatFullDate(dateStr: string): string {
  const d = parseISODate(dateStr);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** 
 * Memformat tanggal menjadi format singkat Contoh: "Jum, 21 Agu".
 */
export function formatShortDate(dateStr: string): string {
  const d = parseISODate(dateStr);
  return `${DAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** 
 * Memformat tahun dan bulan menjadi nama bulan dan tahun. Contoh: "Agustus 2026".
 
 * @param year Tahun.
 * @param month Index bulan, dimulai dari 0.
 */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

/** 
 * Mengambil tanggal hari ini dalam format ISO Contoh: "2026-08-16".
 */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 
 *   Membuat tanggal dalam format ISO dari tahun, bulan, dan hari.
 
 * @param year Tahun.
 * @param month Index bulan, dimulai dari 0.
 * @param day Tanggal.
 */
export function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Mengekspor nama hari dan bulan versi singkat untuk digunakan di komponen lain.
export { DAYS_SHORT, MONTHS };
