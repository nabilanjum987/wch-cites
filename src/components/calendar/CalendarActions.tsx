'use client';

// Download + embed actions for the country calendar page (owner spec,
// 3 Nov 2026): ICS download, PDF download and a website embed, every
// one carrying the WorldCityHub branding lock.
//   * ICS is a plain link to the calendar's .ics route; the file itself
//     carries the WorldCityHub name and URL on the calendar and on
//     every entry (see buildCalendarIcs in src/lib/calendar.ts).
//   * PDF is generated in the browser with jsPDF, the PDF library the
//     codebase already carries, and stamps the WorldCityHub name and
//     the calendar URL in the header and footer of every page.
//   * The embed snippet points at the chrome-free embed route; the
//     widget itself renders a WorldCityHub credit line, so the credit
//     cannot be removed by the site embedding it.

import { useState } from 'react';
import type { CalendarEntry } from '@/lib/calendar';

function longDate(yyyyMmDd: string): string {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function CalendarActions({
  entries,
  year,
  countryName,
  countrySlug,
  calendarUrl,
  icsUrl,
  embedUrl,
}: {
  entries: CalendarEntry[];
  year: number;
  countryName: string;
  countrySlug: string;
  calendarUrl: string;
  icsUrl: string;
  embedUrl: string;
}) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${embedUrl}" width="100%" height="430" style="border:0;border-radius:12px;max-width:420px" loading="lazy" title="${countryName} Calendar by WorldCityHub"></iframe>`;

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      let y = 0;

      const header = () => {
        doc.setFillColor(10, 15, 30);
        doc.rect(0, 0, pageWidth, 64, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(17);
        doc.text('WorldCityHub', margin, 30);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`${countryName} Calendar ${year}: Holidays & Events`, margin, 50);
        y = 92;
      };
      const footer = () => {
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(
          `WorldCityHub · ${calendarUrl} · Page ${doc.getNumberOfPages()}`,
          margin,
          pageHeight - 26,
        );
      };
      const line = (text: string, size: number, bold = false, color = 30) => {
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(size);
        doc.setTextColor(color, color, color);
        const wrapped = doc.splitTextToSize(text, pageWidth - margin * 2) as string[];
        for (const w of wrapped) {
          if (y > pageHeight - 64) {
            footer();
            doc.addPage();
            header();
          }
          doc.text(w, margin, y);
          y += size + 5;
        }
      };

      header();
      let lastMonth = -1;
      for (const e of entries) {
        const month = Number(e.date.slice(5, 7)) - 1;
        if (month !== lastMonth) {
          lastMonth = month;
          y += 6;
          line(
            new Date(Date.UTC(year, month, 1)).toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' }),
            13,
            true,
          );
        }
        line(
          `${longDate(e.date)}${e.endDate ? ` to ${longDate(e.endDate)}` : ''} · ${e.hijri}`,
          10.5,
          false,
          90,
        );
        line(`${e.title} (${e.kind === 'holiday' ? 'Public holiday' : 'Event'} · ${e.cityLabel})`, 11.5, true);
        if (e.description) line(e.description, 10);
        y += 6;
      }
      if (entries.length === 0) {
        line(`No holidays or events are listed for ${year} yet.`, 11);
      }
      y += 8;
      line(
        'Islamic holidays whose dates are set by official announcement (Eid ul-Fitr, Eid ul-Adha, Ashura, Eid Milad-un-Nabi) are added when confirmed; they are never guessed. Hijri dates are calendar conversions of the Gregorian dates shown.',
        9.5,
        false,
        90,
      );
      footer();
      doc.save(`worldcityhub-${countrySlug}-calendar-${year}.pdf`);
    } finally {
      setPdfBusy(false);
    }
  }

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Download this calendar</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Take the whole year with you. The ICS file adds every holiday and event to Google
          Calendar, Apple Calendar or Outlook; the PDF is a printable year list. Both carry the
          WorldCityHub name and this page&apos;s address, in the file itself.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={icsUrl}
            className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#0a0f1e] transition hover:bg-cyan-300"
          >
            Download ICS (.ics)
          </a>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={pdfBusy}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            {pdfBusy ? 'Preparing PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Add this calendar to your website</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">
          Paste this code where you want the calendar to appear. The widget shows the current
          month and always carries a WorldCityHub credit line at its foot; the credit is part of
          the widget and stays with it wherever it is embedded.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-black/40 p-4 text-xs leading-relaxed text-cyan-100">
          {embedCode}
        </pre>
        <button
          type="button"
          onClick={copyEmbed}
          className="mt-3 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {copied ? 'Copied' : 'Copy embed code'}
        </button>
      </div>
    </div>
  );
}
