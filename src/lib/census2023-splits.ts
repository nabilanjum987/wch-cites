// ─────────────────────────────────────────────────────────────────────────────
// Population pie splits — PBS Census-2023 breakdowns that sum EXACTLY to a
// total held elsewhere. This file holds NO population total of its own for
// the three live cities: every city total comes from ./census2023 (F3's
// single store), and every split below is returned only when it sums to
// that total — otherwise the caller gets null and renders no pie at all.
// A missing pie is fine; an invented split is a defect.
//
// Sources (all PBS, 7th Population & Housing Census 2023):
//   Urban/rural  — Detailed Results, Table 1 (admin-unit totals).
//   Provinces    — Table 1 national row: the "PAKISTAN" total
//                  241,499,431 covers exactly the four provinces + ICT.
//   Faith        — Detailed Results, Table 9 (population by sex, religion
//                  and rural/urban). Table 9 records religion for FEWER
//                  people than the Table 1 total: for sensitive areas and
//                  some collective residences only population, sex and
//                  urban/rural could be determined, so religion was not
//                  enumerated for them. The difference (Table 1 total minus
//                  Table 9 responses) is therefore shown as its own
//                  "Religion not recorded" slice, so every faith pie sums
//                  exactly to its unit total instead of silently dropping
//                  those people. "Hindu" combines Table 9's two columns
//                  "Hindu Jati" + "Scheduled Castes", as the census's own
//                  national summary does.
// ─────────────────────────────────────────────────────────────────────────────

import { censusPopulationFor } from './census2023';

export interface SplitSlice {
  label: string;
  value: number;
}

export interface UnitSplit {
  /** Census unit the figures describe, printed on the pie. */
  unit: string;
  slices: SplitSlice[];
}

// ─── Urban / rural (Table 1) ────────────────────────────────────────────────
// Karachi Division: urban 18,868,021 (92.57%) / rural 1,514,860 (7.43%).
// ICT: urban 1,108,872 (46.91%) / rural 1,254,991 (53.09%) — the ICT row
// is sighted directly in PBS Table 1 (national): URBAN 1,108,872,
// RURAL 1,254,991. Lahore District is 100% urban, so it has no split:
// callers render "100% urban (district)" as text instead (a one-slice
// pie is a defect).

const URBAN_RURAL: Record<string, { unit: string; urban: number; rural: number }> = {
  'pakistan/sindh/karachi': { unit: 'Karachi Division', urban: 18868021, rural: 1514860 },
  'pakistan/islamabad-capital-territory/islamabad': { unit: 'Islamabad Capital Territory', urban: 1108872, rural: 1254991 },
};

export const LAHORE_DISTRICT_KEY = 'pakistan/punjab/lahore';

/** True for Lahore District, the one live city with no urban/rural split. */
export function isAllUrbanDistrict(key: string): boolean {
  return key === LAHORE_DISTRICT_KEY;
}

/**
 * Urban/rural slices for a city key, or null when there is no verified
 * split (Lahore, Faisalabad, Rawalpindi, …) or when the split does not
 * sum exactly to the F3 census total for that unit.
 */
export function urbanRuralSlicesFor(key: string): UnitSplit | null {
  const row = URBAN_RURAL[key];
  if (!row) return null;
  const total = censusPopulationFor(key);
  if (total == null || row.urban + row.rural !== total) return null;
  return {
    unit: row.unit,
    slices: [
      { label: 'Urban', value: row.urban },
      { label: 'Rural', value: row.rural },
    ],
  };
}

// ─── Provinces (Table 1) ────────────────────────────────────────────────────
// Exact PBS Table 1 figures. Their sum IS the national total shown on the
// country pie (241,499,431); no separate national-total constant exists.
// Gilgit-Baltistan and Azad Kashmir are tabulated separately by PBS and
// are not in this total — the pie says so on its face.

export const PAKISTAN_PROVINCE_POPULATION: SplitSlice[] = [
  { label: 'Punjab', value: 127688922 },
  { label: 'Sindh', value: 55696147 },
  { label: 'Khyber Pakhtunkhwa', value: 40856097 },
  { label: 'Balochistan', value: 14894402 },
  { label: 'Islamabad Capital Territory', value: 2363863 },
];

export const PAKISTAN_PROVINCE_TOTAL: number = PAKISTAN_PROVINCE_POPULATION.reduce(
  (sum, slice) => sum + slice.value,
  0,
); // 241,499,431

// ─── Faith (Table 9) ────────────────────────────────────────────────────────
// Table 9 "all localities, all sexes" responses per unit. The not-recorded
// remainder is computed, never typed: unit total minus responses.

interface FaithResponses {
  unit: string;
  responses: SplitSlice[];
}

const FAITH_RESPONSES_BY_CITY: Record<string, FaithResponses> = {
  // Karachi Division = sum of the 7 district rows in PBS Table 9
  // (Sindh districts): Central, East, South, West, Keamari, Korangi,
  // Malir. District responses sum to 20,357,474; the F3 division total
  // is 20,382,881, leaving 25,407 not recorded.
  'pakistan/sindh/karachi': {
    unit: 'Karachi Division',
    responses: [
      { label: 'Muslim', value: 19648754 },
      { label: 'Christian', value: 435621 },
      { label: 'Hindu', value: 244689 },
      { label: 'Ahmadi', value: 8260 },
      { label: 'Sikh', value: 2596 },
      { label: 'Parsi', value: 1656 },
      { label: 'Others', value: 15898 },
    ],
  },
  // Islamabad District row, PBS Table 9 (Islamabad): responses
  // 2,283,244; F3 ICT total 2,363,863; 80,619 not recorded.
  // Hindu here is Jati 839 + Scheduled Castes 45 = 884.
  'pakistan/islamabad-capital-territory/islamabad': {
    unit: 'Islamabad Capital Territory',
    responses: [
      { label: 'Muslim', value: 2181663 },
      { label: 'Christian', value: 97281 },
      { label: 'Hindu', value: 884 },
      { label: 'Ahmadi', value: 2398 },
      { label: 'Sikh', value: 60 },
      { label: 'Parsi', value: 10 },
      { label: 'Others', value: 948 },
    ],
  },
  // Lahore District is DELIBERATELY absent: the PBS Table 9 district row
  // was not directly sighted in this session, and the two secondary
  // summaries of it disagree on the Sikh / Scheduled Castes split
  // (715 vs 324). A reconstructed split would sum exactly but would not
  // be a sighted PBS row, so no Lahore faith pie ships. Faith list as
  // text is likewise not printed for Lahore — there is no pre-existing
  // city-page faith list to fall back to, and a partial list would need
  // the same disputed split.
};

/**
 * Faith slices for a city key (responses + a computed "Religion not
 * recorded" slice), or null when there is no verified breakdown or the
 * responses exceed the F3 census total for that unit.
 */
export function faithSlicesForCity(key: string): UnitSplit | null {
  const row = FAITH_RESPONSES_BY_CITY[key];
  if (!row) return null;
  const total = censusPopulationFor(key);
  if (total == null) return null;
  const responsesSum = row.responses.reduce((sum, slice) => sum + slice.value, 0);
  const notRecorded = total - responsesSum;
  if (notRecorded < 0) return null;
  return {
    unit: row.unit,
    slices: [
      ...row.responses,
      ...(notRecorded > 0 ? [{ label: 'Religion not recorded', value: notRecorded }] : []),
    ],
  };
}

// National faith pie (Table 9, Pakistan row): responses 240,458,089;
// Table 1 total 241,499,431 (the province sum above); 1,041,342 not
// recorded. Hindu here is Jati 3,867,729 + Scheduled Castes 1,349,487
// = 5,217,216.

const NATIONAL_FAITH_RESPONSES: SplitSlice[] = [
  { label: 'Muslim', value: 231686709 },
  { label: 'Christian', value: 3300788 },
  { label: 'Hindu', value: 5217216 },
  { label: 'Ahmadi', value: 162684 },
  { label: 'Sikh', value: 15998 },
  { label: 'Parsi', value: 2348 },
  { label: 'Others', value: 72346 },
];

export const NATIONAL_FAITH_SLICES: SplitSlice[] = (() => {
  const responsesSum = NATIONAL_FAITH_RESPONSES.reduce((sum, slice) => sum + slice.value, 0);
  const notRecorded = PAKISTAN_PROVINCE_TOTAL - responsesSum;
  return [
    ...NATIONAL_FAITH_RESPONSES,
    ...(notRecorded > 0 ? [{ label: 'Religion not recorded', value: notRecorded }] : []),
  ];
})();
