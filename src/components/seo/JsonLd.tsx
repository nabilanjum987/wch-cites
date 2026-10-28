// Shared JSON-LD script tag (P6, 28 Oct final sitting). Server-component
// safe: renders one <script type="application/ld+json"> block. Pages in
// the city cluster render exactly one BreadcrumbList block plus one typed
// block through this component — never two blocks of the same @type on
// one page.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
