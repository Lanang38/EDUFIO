/**
 * Jenjang pendidikan yang tersedia untuk program les.
 */
export type Program = 'SD' | 'SMP' | 'SMA';

/**
 * Pilihan jumlah sesi dalam satu paket.
 */
export type PackageSize = 4 | 8 | 12;

/**
 * Pilihan durasi sesi dalam menit.
 */
export type Duration = 60 | 90 | 120;

/**
 * Mode pelaksanaan sesi les.
 * - onsite: tutor datang ke lokasi
 * - online: sesi dilakukan secara online
 */
export type Mode = 'onsite' | 'online';

/**
 * Label tampilan untuk setiap program pendidikan.
 */
export const PROGRAM_LABEL: Record<Program, string> = {
  SD: 'Les Privat SD',
  SMP: 'Les Privat SMP',
  SMA: 'Les Privat SMA',
};

/**
 * Label tampilan untuk setiap mode pelaksanaan les.
 */
export const MODE_LABEL: Record<Mode, string> = {
  onsite: 'Tutor datang ke lokasi',
  online: 'Online',
};

/**
 * Data paket les yang terdaftar untuk satu siswa.
 * Digunakan pada halaman awal pembuatan paket.
 */
export interface Paket {
  id: string;
  studentName: string;
  program: Program;
  packageSize: PackageSize;
  duration: Duration;
  mode: Mode;
  createdAt: string;
}

/**
 * Data satu sesi les yang dijadwalkan dalam sebuah paket.
 * Digunakan pada halaman pemilihan tanggal dan detail sesi.
 */
export interface Sesi {
  id: string;
  paketId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  topic: string;
  createdAt: string;
}
