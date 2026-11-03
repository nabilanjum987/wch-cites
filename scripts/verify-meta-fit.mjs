// B2 acceptance test — runs the SHIPPED meta-fit algorithm
// (src/lib/seo/meta-fit.ts) over all 35 canonical profiles'
// name + title + description, gathered from every record source:
//   • seed (src/lib/data/personalities-seed.ts)
//   • extension (src/lib/data/personalities-extension.ts)
//   • migration records: the two consolidated survivors and Malala
//     carry their production name/title/summary from migration 0019
//     (encoded below verbatim; Malala's seed record mirrors them).
// Asserts: every fitted title ≤ 60 chars, every fitted description
// ≤ 155 chars, and NONE ends on a function word or separator.
//
// Run: node scripts/verify-meta-fit.mjs   (Node ≥ 22, type stripping)

import { fitMetaTitle, fitMetaDescription, SITE_SUFFIX } from '../src/lib/seo/meta-fit.ts';
import { PERSONALITIES_SEED } from '../src/lib/data/personalities-seed.ts';
import { EXTENSION_PERSONALITIES } from '../src/lib/data/personalities-extension.ts';

// The canonical 35 — mirrors CANONICAL_PROFILE_SLUGS in
// src/lib/personalities.ts and PROFILE_SLUGS in src/app/sitemap.ts
// (that module is not imported here: it uses extensionless Next-style
// imports that Node's resolver cannot follow).
const CANONICAL_PROFILE_SLUGS = [
  'abdul-qadeer-khan', 'abdul-sattar-edhi',
  'allama-iqbal', 'ameer-haider-khan-hoti', 'amrita-pritam',
  'ashfaq-ahmed', 'azam-khan-hoti', 'bahawal-khan-i', 'bano-qudsia',
  'benazir-bhutto', 'dr-abdus-salam', 'faiz-ahmed-faiz', 'fatima-jinnah',
  'feroz-khan-noon', 'habib-jalib', 'haider-zaman-khan', 'imran-khan',
  'james-abbott', 'khurshid-ahmed-shah', 'malala-yousafzai',
  'mehdi-hasan', 'mir-muhammad-masum', 'mohammad-hafeez',
  'mushaf-ali-mir', 'nasir-hussain-shah',
  'noor-jehan', 'nusrat-fateh-ali-khan', 'pervez-musharraf',
  'quaid-e-azam-jinnah', 'sadequain', 'sadiq-muhammad-khan-iv',
  'sadiq-muhammad-khan-v', 'sardar-mehtab-abbasi',
  'wasim-akram', 'younis-khan',
];

// Production display records from migration 0019 (the DB rows for the
// consolidated survivors; their seed twins carry different titles).
const MIGRATION_RECORDS = {
  'dr-abdus-salam': {
    name: 'Dr Abdus Salam',
    title: 'Nobel Laureate Physicist',
    description:
      'Dr Abdus Salam, born in Jhang and educated at Government College Lahore, shared the 1979 Nobel Prize in Physics for electroweak unification.',
  },
  'quaid-e-azam-jinnah': {
    name: 'Quaid-e-Azam Muhammad Ali Jinnah',
    title: 'Founder',
    description:
      "Quaid-e-Azam Muhammad Ali Jinnah, born in Karachi, was the barrister who led the Pakistan Movement and became Pakistan's first Governor-General in 1947.",
  },
};

const FUNCTION_WORDS = new Set([
  '&', 'and', 'or', 'of', 'the', 'a', 'an', 'to', 'for', 'in', 'on',
  'at', 'by', 'with', 'from', 'per', 'vs', 'as', 'into', 'over',
]);

function endsClean(text) {
  const t = text.replace(/\.+$/, '').trimEnd();
  if (/[&—,;:·•/(]$/.test(t)) return false;
  const last = t.split(/\s+/).pop().toLowerCase().replace(/[.']+$/, '');
  return !FUNCTION_WORDS.has(last);
}

const records = [];
for (const slug of CANONICAL_PROFILE_SLUGS) {
  if (MIGRATION_RECORDS[slug]) {
    records.push({ slug, ...MIGRATION_RECORDS[slug] });
    continue;
  }
  const seed = PERSONALITIES_SEED[slug];
  if (seed) {
    records.push({ slug, name: seed.name, title: seed.title, description: seed.description });
    continue;
  }
  const ext = EXTENSION_PERSONALITIES.find((e) => e.slug === slug);
  if (ext) {
    records.push({ slug, name: ext.name, title: ext.title, description: ext.summary });
    continue;
  }
  throw new Error(`No record source found for canonical slug: ${slug}`);
}

console.log(`Profiles under test: ${records.length}`);
if (records.length !== 35) {
  console.error(`FAIL: expected 35 profiles, got ${records.length}`);
  process.exit(1);
}

let failures = 0;
for (const r of records) {
  const title = fitMetaTitle(r.name, r.title);
  const desc = fitMetaDescription(r.description, r.name, r.title);
  const innerTitle = title.endsWith(SITE_SUFFIX) ? title.slice(0, -SITE_SUFFIX.length) : title;
  const problems = [];
  if (title.length > 60) problems.push(`title ${title.length} > 60`);
  if (desc.length > 155) problems.push(`description ${desc.length} > 155`);
  if (!endsClean(innerTitle)) problems.push('title ends on a function word/separator');
  if (!endsClean(desc)) problems.push('description ends on a function word/separator');
  if (problems.length > 0) failures++;
  console.log(
    `${problems.length ? 'FAIL' : 'ok  '} ${r.slug}\n     T(${title.length}): ${title}\n     D(${desc.length}): ${desc}`,
  );
  for (const p of problems) console.log(`     !! ${p}`);
}

console.log(failures === 0 ? '\nALL 35 PASS' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
