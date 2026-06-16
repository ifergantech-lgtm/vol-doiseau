/**
 * Renders one or more schema.org objects as a JSON-LD <script> tag.
 * Escaping `<` blocks any "</script>" breakout from admin-editable dress
 * titles/descriptions — the standard, safe way to embed JSON-LD in React.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
