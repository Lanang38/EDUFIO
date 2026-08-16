export type Program = "SD" | "SMP" | "SMA";

export type PackageSize = 4 | 8 | 12;

export type Duration = 60 | 90 | 120;

export type Mode = "onsite" | "online";

export const PROGRAM_LABEL: Record<Program, string> = {
  SD: "Les Privat SD",
  SMP: "Les Privat SMP",
  SMA: "Les Privat SMA",
};

export const MODE_LABEL: Record<Mode, string> = {
  onsite: "Tutor datang ke lokasi",
  online: "Online",
};

export interface Paket {
  id: string;
  studentName: string;
  program: Program;
  packageSize: PackageSize;
  duration: Duration;
  mode: Mode;
  createdAt: string;
}

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
