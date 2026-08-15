'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import { Screen } from '@/components/Screen';
import { PrimaryButton, SecondaryButton } from '@/components/Field';
import { getPaket, getSesiByPaket, deletePaket } from '@/lib/storage';
import { formatShortDate } from '@/lib/format';
import { Paket, Sesi, PROGRAM_LABEL, MODE_LABEL } from '@/lib/types';
import { NotFound } from '@/components/NotFound';

export default function RingkasanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [paket, setPaket] = useState<Paket | null | undefined>(undefined);
  const [sesiList, setSesiList] = useState<Sesi[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const goBack = () => {
    router.push('/');
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [p, s] = await Promise.all([getPaket(id), getSesiByPaket(id)]);

      if (!cancelled) {
        setPaket(p ?? null);
        setSesiList(s);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (paket === undefined) return null;

  if (paket === null) {
    return <NotFound />;
  }

  const remaining = paket.packageSize - sesiList.length;

  const pct = Math.min(
    100,
    Math.round((sesiList.length / paket.packageSize) * 100),
  );

  return (
    <Screen title="Ringkasan" wide>
      <div className="mx-auto w-full max-w-6xl">
        {/* INFORMASI PAKET */}
        <div className="mb-5 rounded-2xl border border-line bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-bold text-navy sm:text-xl">
                {paket.studentName}
              </p>

              <p className="text-sm text-ink/60">
                {PROGRAM_LABEL[paket.program]} · paket {paket.packageSize} sesi
              </p>

              <p className="text-sm text-ink/60">
                {paket.duration} menit · {MODE_LABEL[paket.mode]}
              </p>
            </div>

            <button
              onClick={() => setConfirmDelete(true)}
              aria-label="Hapus paket ini"
              title="Hapus paket ini"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-error/70 transition hover:bg-error/10"
            >
              <Trash2 size={16} strokeWidth={2.2} />
            </button>
          </div>

          <p className="mt-4 text-sm font-medium text-navy">
            {sesiList.length} sesi terjadwal · {remaining} belum dijadwalkan
          </p>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-teal transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* DAFTAR SESI */}
        {sesiList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white px-5 py-8 text-center">
            <p className="text-sm text-ink/50">
              Belum ada sesi yang dijadwalkan untuk paket ini.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sesiList.map((sesi, i) => (
              <li key={sesi.id}>
                <Link
                  href={`/paket/${paket.id}/detail-sesi?sesiId=${sesi.id}`}
                  className="flex h-full min-h-[108px] items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-teal-light active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                      Sesi {i + 1}
                    </p>

                    <p className="truncate font-semibold text-navy">
                      {formatShortDate(sesi.date)} · {sesi.startTime}–
                      {sesi.endTime}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-ink/60">
                      {sesi.location || 'Tempat belum diisi'} · {sesi.topic}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    strokeWidth={2.2}
                    className="shrink-0 text-ink/30"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* TAMBAH SESI - MOBILE DI ATAS */}
          {remaining > 0 ? (
            <PrimaryButton
              fullWidth={false}
              className="order-1 w-full sm:order-2 sm:w-auto sm:px-8"
              onClick={() => router.push(`/paket/${paket.id}/pilih-tanggal`)}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Plus size={17} strokeWidth={2.2} className="hidden sm:block" />
                Tambah sesi
              </span>
            </PrimaryButton>
          ) : (
            <div className="order-1 w-full rounded-xl bg-teal/10 px-4 py-3 text-center text-sm font-medium text-navy sm:order-2 sm:w-auto">
              Semua sesi dalam paket ini sudah terjadwalkan 🎉
            </div>
          )}

          {/* KEMBALI - MOBILE DI BAWAH */}
          <div className="order-2 sm:order-1">
            <SecondaryButton onClick={goBack}>
              <span className="flex items-center justify-center gap-2">
                <ChevronLeft
                  size={18}
                  strokeWidth={2.2}
                  className="hidden sm:block"
                />
                Kembali
              </span>
            </SecondaryButton>
          </div>
        </div>

        {/* KONFIRMASI HAPUS */}
        {confirmDelete && (
          <div className="mt-8 rounded-xl border border-error/30 bg-error/5 p-4">
            <p className="text-sm text-ink">
              Hapus paket <strong>{paket.studentName}</strong> beserta seluruh{' '}
              {sesiList.length} sesi di dalamnya? Tindakan ini tidak bisa
              dibatalkan.
            </p>

            <div className="mt-3 flex gap-2">
              <SecondaryButton onClick={() => setConfirmDelete(false)}>
                Batal
              </SecondaryButton>

              <PrimaryButton
                disabled={deleting}
                className="bg-error! enabled:hover:bg-error-dark!"
                onClick={async () => {
                  setDeleting(true);
                  await deletePaket(paket.id);
                  router.push('/');
                }}
              >
                {deleting ? 'Menghapus…' : 'Hapus'}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
