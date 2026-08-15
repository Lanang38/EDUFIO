"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllPaket, getAllSesi } from "@/lib/storage";
import { Paket, Sesi, PROGRAM_LABEL } from "@/lib/types";
import { PrimaryButton } from "@/components/Field";

export default function DashboardPage() {
  const [paketList, setPaketList] = useState<Paket[] | null>(null);
  const [sesiList, setSesiList] = useState<Sesi[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [p, s] = await Promise.all([getAllPaket(), getAllSesi()]);
      if (!cancelled) {
        setPaketList(p);
        setSesiList(s);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4 px-5 pb-5 pt-8 sm:flex-row sm:items-end sm:justify-between sm:px-0 sm:pt-10 lg:pt-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Edufio</p>
            <h1 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">Penjadwalan Sesi Les</h1>
            <p className="mt-1 text-sm text-ink/60">Kelola jadwal les setiap siswa di satu tempat.</p>
          </div>
          <Link href="/daftar" className="hidden sm:block">
            <PrimaryButton fullWidth={false} className="px-6">
              + Daftar siswa baru
            </PrimaryButton>
          </Link>
        </header>

        <main className="flex-1 px-5 pb-28 sm:px-0 sm:pb-16">
          {paketList === null ? (
            <p className="py-10 text-center text-sm text-ink/40">Memuat…</p>
          ) : paketList.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-5 py-10 text-center sm:mt-4">
              <p className="text-[15px] font-semibold text-navy">Belum ada siswa terdaftar</p>
              <p className="mt-1 text-sm text-ink/50">
                Mulai dengan mendaftarkan siswa dan paket lesnya.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paketList.map((paket) => {
                const count = sesiList.filter((s) => s.paketId === paket.id).length;
                const pct = Math.min(100, Math.round((count / paket.packageSize) * 100));
                return (
                  <li key={paket.id}>
                    <Link
                      href={`/paket/${paket.id}/ringkasan`}
                      className="block h-full rounded-2xl border border-line bg-white p-4 transition hover:border-teal-light hover:shadow-sm active:scale-[0.99] sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-navy">{paket.studentName}</p>
                          <p className="text-sm text-ink/60">
                            {PROGRAM_LABEL[paket.program]} · paket {paket.packageSize} sesi
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-pastel/40 px-2.5 py-1 text-xs font-semibold text-navy">
                          {count}/{paket.packageSize}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </main>

        <div className="sticky bottom-0 border-t border-line bg-bg/95 px-5 py-4 backdrop-blur sm:hidden">
          <Link href="/daftar">
            <PrimaryButton>+ Daftar siswa baru</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
