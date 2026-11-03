// Prayer-times AEO layer (final30 cluster, extended 3 Nov 2026).
// ONE source for the visible AEO Q&A: PrayerTimesClient renders its
// AEO card from buildPrayerAeo(), and the server template
// (prayer-times/page.tsx) emits the FAQPage JSON-LD from the SAME
// array, composed from the SAME server-fetched Aladhan times, so
// visible text and schema can never drift apart.
//
// City scope:
//   lahore:    five keyword H3s + two problem H3s (not keyword targets)
//   karachi:   four keyword H3s
//   multan:    five keyword H3s (Fajr / Sehri / Maghrib / Asr / Jummah)
//   peshawar:  five keyword H3s (same set as Multan)
//   islamabad: flank ONLY, the single Fajr H3 (recorded research
//              decision; its targeting is not changed)
// Every other city returns an empty array and renders no AEO card.
// Times are the city's OWN live Aladhan timetable values (Karachi
// method, Hanafi school). A missing timetable yields the 'loading'
// placeholder the client has always used; the server only emits
// schema when it holds real times, never for the placeholder.
import type { AeoFaq } from '@/components/aeo/AnswerLayer';

export interface PrayerAeoTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/** Same 12-hour formatting the prayer client has always applied. */
export function formatPrayerTime(t: string): string {
  const match = t.match(/\d{1,2}:\d{2}/);
  if (!match) return t;
  const [h, m] = match[0].split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function buildPrayerAeo(
  citySlug: string,
  cityName: string,
  times: PrayerAeoTimes | null,
): AeoFaq[] {
  const lower = cityName.toLowerCase();
  const fajrT = times ? formatPrayerTime(times.Fajr) : 'loading';
  const maghribT = times ? formatPrayerTime(times.Maghrib) : 'loading';
  const asrT = times ? formatPrayerTime(times.Asr) : 'loading';
  const dhuhrT = times ? formatPrayerTime(times.Dhuhr) : 'loading';

  const fajr: AeoFaq = {
    q: `fajr time in ${lower} today`,
    a: `Fajr time in ${cityName} today is ${fajrT}. The Fajr prayer window opens at true dawn, at ${fajrT}, and closes at sunrise, so worshippers should pray after ${fajrT} and before sunrise. Times on this page use the University of Islamic Sciences, Karachi method with the Hanafi school and are fetched live from Aladhan, so the time shifts slightly each day.`,
  };
  const sehri: AeoFaq = {
    q: `sehri time in ${lower} today`,
    a: `Sehri in ${cityName} today ends at ${fajrT}, when Fajr begins. Worshippers fasting should finish eating and drinking before ${fajrT}, and many stop a few minutes early as a precaution. Sehri is the pre-dawn meal before the fast, and the fast then runs until Maghrib at sunset. This page's Sehri time is the live Fajr time from Aladhan, using the Karachi method.`,
  };
  const maghrib: AeoFaq = {
    q: `maghrib time in ${lower} today`,
    a: `Maghrib time in ${cityName} today is ${maghribT}. Maghrib begins at sunset, when the fast is broken at Iftar during Ramadan, and its prayer window runs until Isha. The time on this page is fetched live from Aladhan using the University of Islamic Sciences, Karachi method, so it moves a minute or two each day as sunset shifts.`,
  };
  const asr: AeoFaq = {
    q: `what time is asr prayer in ${lower} today`,
    a: `Asr prayer in ${cityName} today is at ${asrT}, using the Hanafi school, which is the default on this page. Under the Hanafi school, Asr begins when an object's shadow is twice its length, so it falls later than the Shafi'i start. The live Shafi'i Asr time for today is shown in the Calculation Method section below, fetched from the same source.`,
  };
  const jummah: AeoFaq = {
    q: `jummah prayer time in ${lower}`,
    a: `Jummah prayer in ${cityName} is held at ${dhuhrT}, replacing the Dhuhr prayer on Fridays. The khutbah, or sermon, begins shortly before the congregational prayer, so worshippers should arrive early to hear it in full. The time shown is today's live Dhuhr time from Aladhan, using the Karachi method, and Friday congregations are the week's largest.`,
  };

  switch (citySlug) {
    case 'lahore':
      return [
        fajr,
        sehri,
        maghrib,
        asr,
        jummah,
        {
          q: "Why is Hanafi Asr later than Shafi'i Asr?",
          a: `Hanafi Asr is later because the two schools define Asr's start differently. The Hanafi school starts Asr when an object's shadow reaches twice its length, plus the shadow at noon, while the Shafi'i, Maliki and Hanbali schools start it at one shadow length. The same afternoon sun therefore gives a later Hanafi time, often by about an hour.`,
        },
        {
          q: 'Why do prayer time apps show different times?',
          a: `Prayer apps differ because they use different calculation methods, schools and location settings. One app may use the Karachi method while another uses the Muslim World League method, one may follow Hanafi Asr and another Shafi'i Asr, and small differences in latitude, longitude or manual minute adjustments shift results further. Check the method and school settings before comparing times.`,
        },
      ];
    case 'karachi':
      return [fajr, sehri, maghrib, jummah];
    case 'multan':
    case 'peshawar':
      return [fajr, sehri, maghrib, asr, jummah];
    case 'islamabad':
      return [fajr];
    default:
      return [];
  }
}
