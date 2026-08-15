"use client";

import Link from "next/link";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-bold text-navy">Paket tidak ditemukan</p>
      <p className="mt-1 text-sm text-ink/60">Data ini mungkin sudah dihapus atau tautannya salah.</p>
      <Link href="/" className="mt-4 text-sm font-semibold text-teal underline underline-offset-2">
        Kembali ke beranda
      </Link>
    </div>
  );
}
