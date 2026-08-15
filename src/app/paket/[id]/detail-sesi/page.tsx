'use client';

import { Suspense, use, useEffect, useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { TriangleAlert } from 'lucide-react';

import { Screen, useGoBack } from '@/components/Screen';

import {
  Field,
  TextInput,
  TextArea,
  Select,
  PrimaryButton,
  SecondaryButton,
} from '@/components/Field';

import { PaketSummaryCard } from '@/components/PaketSummary';

import { ConfirmModal } from '@/components/ConfirmModal';

import {
  createSesi,
  deleteSesi,
  getAllSesi,
  getPaket,
  getSesi,
  updateSesi,
} from '@/lib/storage';

import { computeEndTime, findConflict, isDateBookable } from '@/lib/rules';

import { formatFullDate } from '@/lib/format';

import { Paket, Sesi } from '@/lib/types';

import { NotFound } from '@/components/NotFound';

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const totalMinutes = 6 * 60 + i * 30;

  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');

  const m = String(totalMinutes % 60).padStart(2, '0');

  return `${h}:${m}`;
});

export default function DetailSesiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <DetailSesiInner paketId={id} />
    </Suspense>
  );
}

function DetailSesiInner({ paketId }: { paketId: string }) {
  const router = useRouter();

  const goBack = useGoBack(`/paket/${paketId}/pilih-tanggal`);

  const searchParams = useSearchParams();

  const dateParam = searchParams.get('date');

  const sesiIdParam = searchParams.get('sesiId');

  const [paket, setPaket] = useState<Paket | null | undefined>(undefined);

  const [allSesi, setAllSesiState] = useState<Sesi[]>([]);

  const [existing, setExisting] = useState<Sesi | null | undefined>(
    sesiIdParam ? undefined : null,
  );

  const [startTime, setStartTime] = useState('09:00');

  const [location, setLocation] = useState('');

  const [topic, setTopic] = useState('');

  const [topicError, setTopicError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const [saveError, setSaveError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [p, all, s] = await Promise.all([
        getPaket(paketId),
        getAllSesi(),
        sesiIdParam ? getSesi(sesiIdParam) : Promise.resolve(null),
      ]);

      if (cancelled) return;

      setPaket(p ?? null);
      setAllSesiState(all);

      if (sesiIdParam) {
        setExisting(s ?? null);

        if (s) {
          setStartTime(s.startTime);
          setLocation(s.location);
          setTopic(s.topic);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [paketId, sesiIdParam]);

  const date = existing ? existing.date : dateParam;

  const endTime = useMemo(() => {
    if (!paket) return '';

    return computeEndTime(startTime, paket.duration);
  }, [startTime, paket]);

  const conflict = useMemo(() => {
    if (!date) return undefined;

    return findConflict(allSesi, date, startTime, endTime, existing?.id);
  }, [allSesi, date, startTime, endTime, existing]);

  if (paket === undefined || existing === undefined) {
    return null;
  }

  if (paket === null) {
    return <NotFound />;
  }

  if (!date || (dateParam && !isDateBookable(dateParam))) {
    return (
      <Screen title="Detail sesi" onBack={goBack}>
        <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-center">
          <p className="font-semibold text-navy">Tanggal tidak valid</p>

          <p className="mt-1 text-sm text-ink/60">
            Silakan pilih tanggal terlebih dahulu.
          </p>

          <button
            type="button"
            onClick={() => router.push(`/paket/${paketId}/pilih-tanggal`)}
            className="mt-4 text-sm font-semibold text-teal underline underline-offset-2"
          >
            Pilih tanggal
          </button>
        </div>
      </Screen>
    );
  }

  const sortedForPaket = [...allSesi]
    .filter((s) => s.paketId === paket.id)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const sesiIndex = existing
    ? sortedForPaket.findIndex((s) => s.id === existing.id) + 1
    : sortedForPaket.length + 1;

  const locationLabel =
    paket.mode === 'onsite'
      ? 'Tempat (alamat lokasi)'
      : 'Tempat (platform online)';

  const locationPlaceholder =
    paket.mode === 'onsite'
      ? 'Contoh: Rumah siswa — Jl. Kaliurang KM 5'
      : 'Contoh: Google Meet';

  async function handleSave() {
    if (!topic.trim()) {
      setTopicError('Wajib diisi, tidak boleh kosong.');
      return;
    }

    if (conflict) return;

    if (!paket || !date) return;

    setSaving(true);

    try {
      if (existing) {
        await updateSesi(existing.id, {
          date,
          startTime,
          endTime,
          location: location.trim(),
          topic: topic.trim(),
        });
      } else {
        await createSesi({
          paketId: paket.id,
          date,
          startTime,
          endTime,
          location: location.trim(),
          topic: topic.trim(),
        });
      }

      router.push(`/paket/${paket.id}/ringkasan`);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Gagal menyimpan sesi.');

      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;

    setDeleting(true);

    try {
      await deleteSesi(existing.id);

      router.push(`/paket/${paketId}/ringkasan`);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Gagal menghapus sesi.');

      setDeleting(false);
    }
  }

  return (
    <>
      <Screen
        title="Detail sesi"
        eyebrow={`${formatFullDate(date)} · sesi ke-${
          sesiIndex > 0 ? sesiIndex : sortedForPaket.length + 1
        }`}
        onBack={goBack}
        aside={
          <PaketSummaryCard
            paket={paket}
            footer={
              <p className="text-sm text-ink/60">
                {sortedForPaket.length} dari {paket.packageSize} sesi sudah
                dijadwalkan.
              </p>
            }
          />
        }
        bottom={
          <div className="flex flex-col gap-2">
            {saveError && (
              <p className="text-xs font-medium text-error">{saveError}</p>
            )}

            <PrimaryButton
              disabled={!!conflict || !topic.trim() || saving || deleting}
              onClick={handleSave}
            >
              {saving
                ? 'Menyimpan…'
                : existing
                  ? 'Simpan perubahan'
                  : 'Simpan sesi'}
            </PrimaryButton>

            {existing && (
              <SecondaryButton
                onClick={() => setConfirmDelete(true)}
                disabled={saving || deleting}
                className="border-error/30! text-error!"
              >
                Hapus sesi
              </SecondaryButton>
            )}
          </div>
        }
      >
        {/* JAM MULAI */}
        <Field label="Jam mulai" required>
          <Select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <p className="-mt-3 mb-5 text-xs text-ink/50">
          Selesai {endTime} · durasi {paket.duration} menit (dari paket)
        </p>

        {/* CONFLICT */}
        {conflict && (
          <div className="mb-5 rounded-xl border border-accent bg-accent/10 px-4 py-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-warning">
              <TriangleAlert size={16} strokeWidth={2.2} />
              Bentrok dengan sesi lain
            </p>

            <p className="mt-1 text-xs text-warning/90">
              {formatFullDate(conflict.date)} · {conflict.startTime}–
              {conflict.endTime} · {conflict.topic || 'Tanpa materi'}
            </p>

            <p className="mt-1 text-xs text-warning/70">
              Geser jam mulai untuk melanjutkan.
            </p>
          </div>
        )}

        {/* LOKASI */}
        <Field label={locationLabel} required>
          <TextInput
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={locationPlaceholder}
          />
        </Field>

        <p className="-mt-3 mb-5 text-xs text-ink/50">
          Mode: {paket.mode === 'onsite' ? 'Tutor datang ke lokasi' : 'Online'}
        </p>

        {/* MATERI */}
        <Field
          label="Materi yang akan disampaikan"
          required
          error={topicError ?? undefined}
        >
          <TextArea
            rows={4}
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);

              if (topicError) {
                setTopicError(null);
              }
            }}
            placeholder="Contoh: Persamaan linear dua variabel — soal cerita."
          />
        </Field>
      </Screen>

      {/* MODAL HAPUS SESI */}
      {confirmDelete && existing && (
        <ConfirmModal
          title="Hapus Sesi?"
          message={`Hapus sesi ${paket.studentName} pada ${formatFullDate(
            existing.date,
          )} pukul ${existing.startTime}–${existing.endTime}? Tindakan ini tidak dapat dibatalkan.`}
          deleting={deleting}
          confirmText="Hapus"
          cancelText="Batal"
          onCancel={() => {
            if (!deleting) {
              setConfirmDelete(false);
            }
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
