"use client";

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

export function Screen({
  title,
  eyebrow,
  onBack,
  children,
  bottom,
  aside,
  wide = false,
  hideBackOnMobile = false,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  children: ReactNode;
  bottom?: ReactNode;
  /** Extra context panel shown beside the content on large screens (lg+). Hidden on mobile/tablet. */
  aside?: ReactNode;
  /** Use the full container width for content (list/grid screens) instead of capping it to form width. */
  wide?: boolean;
  /** Hide the header back button on mobile (e.g. when a back button is placed inline in the page content instead). */
  hideBackOnMobile?: boolean;
}) {
  const container = wide ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div
          className={`mx-auto flex w-full ${container} items-center gap-3 px-5 py-6 sm:px-8 lg:px-12`}
        >
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className={
                `-ml-1 h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy transition hover:bg-blue-pastel/40 ` +
                (hideBackOnMobile ? 'hidden sm:flex' : 'flex')
              }
            >
              <ChevronLeft size={20} strokeWidth={2.2} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-navy sm:text-2xl">{title}</h1>
            {eyebrow && <p className="mt-1 text-sm text-ink/60">{eyebrow}</p>}
          </div>
        </div>
      </header>

      <main
        className={`mx-auto flex w-full ${container} flex-1 flex-col gap-8 px-5 py-5 sm:px-8 lg:flex-row lg:items-start lg:px-12 lg:py-10`}
      >
        <div className={'min-w-0 flex-1 ' + (wide ? '' : 'max-w-xl')}>
          {children}
        </div>
        {aside && (
          <aside className="hidden shrink-0 lg:sticky lg:top-28 lg:block lg:w-80 xl:w-96">
            {aside}
          </aside>
        )}
      </main>

      {bottom && (
        <div className="sticky bottom-0 border-t border-line bg-bg/95 backdrop-blur">
          <div
            className={`mx-auto w-full ${container} px-5 py-4 sm:px-8 lg:px-12`}
          >
            <div className={wide ? '' : 'max-w-xl'}>{bottom}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function useGoBack(fallback: string) {
  const router = useRouter();
  return () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };
}
