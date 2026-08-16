"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS_SHORT, MONTHS, todayISO, toISODate } from '@/lib/format';

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function Calendar({
  value,
  onChange,
  minDate,
  markedDates,
}: {
  value: string | null;
  onChange: (dateISO: string) => void;
  minDate: string;
  markedDates: Set<string>;
}) {
  const initial = value ? new Date(value) : new Date(minDate);
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const today = todayISO();

  const firstOfMonth = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leading = (firstOfMonth.getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function changeMonth(delta: number) {
    let month = cursor.month + delta;
    let year = cursor.year;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setCursor({ year, month });
  }

  return (
    <div>
      {/* Header kalender dan navigasi bulan */}
      <div className="mb-3 flex items-center justify-between rounded-xl border border-line bg-white px-2 py-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Bulan sebelumnya"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-blue-pastel/30"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <span className="text-[15px] font-bold text-navy">
          {MONTHS[cursor.month]} {cursor.year}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Bulan berikutnya"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-blue-pastel/30"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* Grid kalender */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_ORDER.map((d) => (
          <div key={d} className="pb-1 text-xs font-semibold text-ink/40">
            {DAYS_SHORT[d]}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateISO = toISODate(cursor.year, cursor.month, day);
          const disabled = dateISO < minDate;
          const isToday = dateISO === today;
          const isSelected = dateISO === value;
          const isMarked = markedDates.has(dateISO);

          return (
            <div key={dateISO} className="flex justify-center py-0.5">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(dateISO)}
                className={
                  'relative flex h-10 w-10 flex-col items-center justify-center rounded-full text-[15px] transition sm:h-11 sm:w-11 ' +
                  (isSelected
                    ? 'bg-navy font-bold text-white'
                    : disabled
                      ? 'text-ink/25'
                      : isToday
                        ? 'border border-teal font-semibold text-navy'
                        : 'font-medium text-ink hover:bg-blue-pastel/30')
                }
              >
                {day}
                {isMarked && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-teal" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Keterangan indikator kalender */}
      <div className="mt-4 flex flex-col gap-1.5 text-xs text-ink/50">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> sudah ada sesi
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-teal" /> hari ini
        </div>
        <div>
          <span className="text-ink/40">
            belum bisa dipilih — minimal 3 hari dari hari ini
          </span>
        </div>
      </div>
    </div>
  );
}
