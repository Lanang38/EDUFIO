"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, useGoBack } from "@/components/Screen";
import { Calendar } from "@/components/Calendar";
import { PrimaryButton } from "@/components/Field";
import { PaketSummaryCard } from "@/components/PaketSummary";
import { getAllSesi, getPaket } from "@/lib/storage";
import { minBookableDate, remainingQuota, scheduledCount } from "@/lib/rules";
import { Paket, Sesi } from "@/lib/types";
import { NotFound } from "@/components/NotFound";

export default function PilihTanggalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const goBack = useGoBack("/");

  const [paket, setPaket] = useState<Paket | null | undefined>(undefined);
  const [allSesi, setAllSesi] = useState<Sesi[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [p, s] = await Promise.all([getPaket(id), getAllSesi()]);
      if (!cancelled) {
        setPaket(p ?? null);
        setAllSesi(s);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const minDate = useMemo(() => minBookableDate(), []);

  if (paket === undefined) return null;
  if (paket === null) return <NotFound />;

  const sesiTerjadwal = allSesi.filter((s) => s.paketId === paket.id);
  const markedDates = new Set(sesiTerjadwal.map((s) => s.date));
  const used = scheduledCount(paket.id, allSesi);
  const remaining = remainingQuota(paket, allSesi);

  if (remaining <= 0) {
    return (
      <Screen title="Pilih tanggal" onBack={goBack}>
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-center">
          <p className="font-semibold text-navy">Paket sudah penuh</p>
          <p className="mt-1 text-sm text-ink/60">
            Seluruh {paket.packageSize} sesi dalam paket {paket.studentName} sudah dijadwalkan.
          </p>
          <button
            onClick={() => router.push(`/paket/${paket.id}/ringkasan`)}
            className="mt-4 text-sm font-semibold text-teal underline underline-offset-2"
          >
            Lihat ringkasan
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen
      title="Pilih tanggal"
      eyebrow={`Sesi ke-${used + 1} · ${used} dari ${paket.packageSize} sesi terjadwal`}
      onBack={goBack}
      aside={
        <PaketSummaryCard
          paket={paket}
          footer={
            <p className="text-sm text-ink/60">
              {remaining} dari {paket.packageSize} sesi belum dijadwalkan.
            </p>
          }
        />
      }
      bottom={
        <PrimaryButton
          disabled={!selectedDate}
          onClick={() => router.push(`/paket/${paket.id}/detail-sesi?date=${selectedDate}`)}
        >
          Lanjut
        </PrimaryButton>
      }
    >
      <Calendar value={selectedDate} onChange={setSelectedDate} minDate={minDate} markedDates={markedDates} />
    </Screen>
  );
}
