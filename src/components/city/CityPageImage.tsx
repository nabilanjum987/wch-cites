// CityPageImage (Final28 P12) — one licensed/open photo per city page.
// Server component: the <img> is in the SSR HTML. Returns null for any city
// or variant without a record — no placeholder, no generic stock shot.
// Plain <img> (not next/image) following the homepage photo pattern, with a
// visible credit line so the licence attribution travels with the photo.
import { getCityImage, type CityImageVariant } from '@/lib/data/cityImages';

interface Props {
  citySlug: string;
  variant: CityImageVariant;
  /** 'banner': full-width strip above a subpage. 'card': rounded figure inside the city-main hero. */
  layout?: 'banner' | 'card';
}

export default function CityPageImage({ citySlug, variant, layout = 'banner' }: Props) {
  const image = getCityImage(citySlug, variant);
  if (!image) return null;
  if (layout === 'card') {
    return (
      <figure className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(12,122,61,0.3)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="eager"
          decoding="async"
          className="w-full h-64 md:h-80 object-cover"
        />
        <figcaption className="px-4 py-2 text-xs text-gray-400" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          {image.alt} — {image.credit}, via Wikimedia Commons
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="relative w-full overflow-hidden" style={{ backgroundColor: '#0a0f1e' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="w-full h-56 md:h-72 object-cover"
      />
      <figcaption className="px-4 py-2 text-xs text-gray-400" style={{ backgroundColor: '#0a0f1e' }}>
        {image.alt} — {image.credit}, via Wikimedia Commons
      </figcaption>
    </figure>
  );
}
