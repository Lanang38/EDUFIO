import { ReactNode } from "react";
import { Paket, PROGRAM_LABEL, MODE_LABEL } from "@/lib/types";

/** Compact "who / what package" context card — used in the desktop aside panel
 * so the admin doesn't lose track of which student they're scheduling for. */
export function PaketSummaryCard({ paket, footer }: { paket: Paket; footer?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal">Menjadwalkan untuk</p>
      <p className="mt-2 text-lg font-bold text-navy">{paket.studentName}</p>
      <p className="text-sm text-ink/60">
        {PROGRAM_LABEL[paket.program]} · paket {paket.packageSize} sesi
      </p>
      <p className="text-sm text-ink/60">
        {paket.duration} menit per sesi · {MODE_LABEL[paket.mode]}
      </p>
      {footer && <div className="mt-4 border-t border-line pt-4">{footer}</div>}
    </div>
  );
}
