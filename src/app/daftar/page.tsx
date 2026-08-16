'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Screen, useGoBack } from '@/components/Screen';
import {
  Field,
  TextInput,
  Select,
  PillGroup,
  RadioCard,
  PrimaryButton,
} from '@/components/Field';
import { createPaket } from '@/lib/storage';
import {
  Duration,
  Mode,
  PackageSize,
  Program,
  PROGRAM_LABEL,
  MODE_LABEL,
} from '@/lib/types';

export default function DaftarPage() {
  const router = useRouter();
  const goBack = useGoBack('/');

  const [isLoading, setIsLoading] = useState(true);

  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState<Program>('SMP');
  const [packageSize, setPackageSize] = useState<PackageSize>(8);
  const [duration, setDuration] = useState<Duration>(90);
  const [mode, setMode] = useState<Mode>('onsite');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit() {
    if (!studentName.trim()) {
      setError('Nama siswa wajib diisi.');
      return;
    }

    setSubmitting(true);

    try {
      const paket = await createPaket({
        studentName: studentName.trim(),
        program,
        packageSize,
        duration,
        mode,
      });

      router.push(`/paket/${paket.id}/pilih-tanggal`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan pendaftaran.');
      setSubmitting(false);
    }
  }

  // LOADING PAGE
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-ink/50">
        <Loader2
          size={26}
          className="animate-spin text-teal"
          strokeWidth={2.2}
        />
        <p className="text-sm">Memuat...</p>
      </div>
    );
  }

  return (
    <Screen
      title="Pendaftaran"
      eyebrow="Langkah 1 dari 4 · data paket les"
      onBack={goBack}
      aside={
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">
            Pratinjau paket
          </p>

          <p className="mt-2 text-lg font-bold text-navy">
            {studentName.trim() || 'Nama siswa'}
          </p>

          <p className="text-sm text-ink/60">
            {PROGRAM_LABEL[program]} · paket {packageSize} sesi
          </p>

          <p className="text-sm text-ink/60">
            {duration} menit per sesi · {MODE_LABEL[mode]}
          </p>

          <p className="mt-4 border-t border-line pt-4 text-sm text-ink/60">
            Setelah disimpan, Anda akan memilih tanggal untuk sesi pertama.
          </p>
        </div>
      }
      bottom={
        <PrimaryButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Menyimpan…' : 'Lanjut'}
        </PrimaryButton>
      }
    >
      <Field label="Nama siswa" required error={error ?? undefined}>
        <TextInput
          value={studentName}
          onChange={(e) => {
            setStudentName(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Contoh: Aruna Prameswari"
          autoFocus
        />
      </Field>

      <Field label="Program" required>
        <Select
          value={program}
          onChange={(e) => setProgram(e.target.value as Program)}
        >
          {(Object.keys(PROGRAM_LABEL) as Program[]).map((p) => (
            <option key={p} value={p}>
              {PROGRAM_LABEL[p]}
            </option>
          ))}
        </Select>
      </Field>

      <div className="sm:grid sm:grid-cols-2 sm:gap-x-4">
        <Field
          label="Jumlah sesi dalam paket"
          required
          hint="Menentukan kuota sesi yang boleh dijadwalkan."
        >
          <PillGroup
            options={[4, 8, 12].map((v) => ({
              value: v as PackageSize,
              label: `${v} sesi`,
            }))}
            value={packageSize}
            onChange={setPackageSize}
          />
        </Field>

        <Field
          label="Durasi per sesi"
          required
          hint="Menentukan jam selesai tiap sesi secara otomatis."
        >
          <PillGroup
            options={[60, 90, 120].map((v) => ({
              value: v as Duration,
              label: `${v} mnt`,
            }))}
            value={duration}
            onChange={setDuration}
          />
        </Field>
      </div>

      <Field label="Mode belajar" required>
        <RadioCard
          options={[
            {
              value: 'onsite' as Mode,
              label: MODE_LABEL.onsite,
              description: 'Sesi dilakukan di lokasi siswa',
            },
            {
              value: 'online' as Mode,
              label: MODE_LABEL.online,
              description: 'Sesi dilakukan lewat panggilan video',
            },
          ]}
          value={mode}
          onChange={setMode}
        />
      </Field>

      <p className="mt-2 text-xs text-ink/40">
        Jumlah sesi &amp; durasi mengunci kuota dan jam selesai tiap sesi. Data
        ini tidak bisa diubah setelah sesi mulai dijadwalkan.
      </p>
    </Screen>
  );
}
