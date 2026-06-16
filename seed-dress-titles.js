/**
 * seed-dress-titles.js
 * Upserts all 25 dress records into Supabase.
 * Run from the vol-doiseau folder: node seed-dress-titles.js
 */

const fs   = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=')
    if (k && v.length) acc[k.trim()] = v.join('=').trim()
    return acc
  }, {})

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

const DRESSES = [
  // ── Evening (23) ──────────────────────────────────────────────────────────
  {
    slug: 'lilas-en-fleur', category: 'evening',
    title: { en: 'Lilac Blossom', fr: 'Lilas en Fleur', he: 'לילך פורח' },
    description: { en: 'Soft lilac pleated chiffon gown with a delicate V-neckline and long flowing sleeves.', fr: 'Robe en mousseline plissée lilas avec décolleté en V et longues manches fluides.', he: 'שמלת שיפון קפלים סגול עדין עם מחשוף V ושרוולים זורמים.' },
  },
  {
    slug: 'emeraude-royale', category: 'evening',
    title: { en: 'Royal Emerald', fr: 'Émeraude Royale', he: 'אמרלד מלכותי' },
    description: { en: 'Rich emerald green pleated chiffon gown with a high neckline and long sleeves.', fr: 'Robe en mousseline plissée vert émeraude avec col haut et manches longues.', he: 'שמלת שיפון קפלים ירוק אמרלד עם צוואר גבוה ושרוולים ארוכים.' },
  },
  {
    slug: 'rose-doree', category: 'evening',
    title: { en: 'Golden Rose', fr: 'Rose Dorée', he: 'ורד זהב' },
    description: { en: 'A warm rose-toned gown with gold embroidery details and a graceful A-line silhouette.', fr: 'Robe aux tons roses chauds avec broderies dorées et silhouette A-line gracieuse.', he: 'שמלה בגוני ורד חמים עם רקמות זהב וסילואט A אלגנטי.' },
  },
  {
    slug: 'la-rouge', category: 'evening',
    title: { en: 'La Rouge', fr: 'La Rouge', he: 'לה רוז׳' },
    description: { en: 'Crimson red gown with elaborate floral beadwork on the bodice. Vibrant and glamorous.', fr: 'Robe rouge vif avec une broderie florale élaborée sur le corsage. Glamour et festive.', he: 'שמלה אדומה יוקרתית עם רקמת פרחים ופנינים על הקורסאז׳.' },
  },
  {
    slug: 'velours-minuit', category: 'evening',
    title: { en: 'Midnight Velvet', fr: 'Velours Minuit', he: 'קשמיר חצות' },
    description: { en: 'Deep midnight velvet gown with a clean silhouette and subtle draped back. Timeless luxury.', fr: 'Robe en velours minuit avec silhouette épurée et dos drapé subtil.', he: 'שמלת קשמיר כהה עם גב מדוחה עדין. יוקרה נצחית.' },
  },
  {
    slug: 'ivoire-brode', category: 'evening',
    title: { en: 'Ivory Embroidered', fr: 'Ivoire Brodé', he: 'שנהב מרוקם' },
    description: { en: 'Ivory beige evening gown with ornate embroidery and lace throughout. Long sleeves, floor-length.', fr: 'Robe de soirée ivoire avec broderies ornées et dentelle. Manches longues, longueur sol.', he: 'שמלת ערב שנהב עם רקמות ותחרה. שרוולים ארוכים ואלגנטיות של יד.' },
  },
  {
    slug: 'blush', category: 'evening',
    title: { en: 'Blush', fr: 'Rose Poudré', he: 'בלאש' },
    description: { en: 'Delicate blush pink gown with a fitted bodice and flowing skirt. Soft and effortlessly feminine.', fr: 'Robe rose poudrée avec corsage ajusté et jupe fluide.', he: 'שמלה ורודה עדינה עם קורסאז׳ מחוייט וחצאית זורמת.' },
  },
  {
    slug: 'saphir-profond', category: 'evening',
    title: { en: 'Deep Sapphire', fr: 'Saphir Profond', he: 'ספיר עמוק' },
    description: { en: 'Rich sapphire blue gown with a sleek column silhouette. Modern elegance for a grand entrance.', fr: 'Robe bleu saphir avec silhouette colonne élégante.', he: 'שמלה כחול ספיר עשיר עם סילואט עמודה ייצוגי.' },
  },
  {
    slug: 'dentelle-noire', category: 'evening',
    title: { en: 'Black Lace', fr: 'Dentelle Noire', he: 'תחרה שחורה' },
    description: { en: 'Classic black lace evening gown with a fitted silhouette and subtle train. Eternally chic.', fr: 'Robe de soirée en dentelle noire classique avec silhouette ajustée et légère traîne.', he: 'שמלת תחרה שחורה קלאסית עם פרטים מדויקים וזנב עדין.' },
  },
  {
    slug: 'perle-de-lune', category: 'evening',
    title: { en: 'Moon Pearl', fr: 'Perle de Lune', he: 'פנינת לבנה' },
    description: { en: 'Pearlescent white gown with delicate beading and a soft A-line silhouette. Pure and luminous.', fr: 'Robe blanche nacrée avec perles délicates et silhouette A-line douce.', he: 'שמלה לבנה מנצנצת עם פנינים עדינות וסילואט A רך.' },
  },
  {
    slug: 'aurore-doree', category: 'evening',
    title: { en: 'Golden Dawn', fr: 'Aurore Dorée', he: 'שחר זהב' },
    description: { en: 'Warm champagne gown with gold metallic thread woven through the fabric. Radiant from every angle.', fr: 'Robe champagne chaude avec fil métallique doré tissé dans le tissu.', he: 'שמלת שמפניה חמה עם חוט מתכת זהב. מבריקה מכל זווית.' },
  },
  {
    slug: 'azur-etoile', category: 'evening',
    title: { en: 'Starry Azure', fr: 'Azur Étoilé', he: 'תכלת כוכבים' },
    description: { en: 'Azure blue gown with scattered crystal embellishments that catch the light.', fr: 'Robe bleu azur avec ornements en cristal qui captent la lumière.', he: 'שמלה כחולה בגוון תכלת עם קישוטי קריסטל.' },
  },
  {
    slug: 'caresse-satinee', category: 'evening',
    title: { en: 'Satin Caress', fr: 'Caresse Satinée', he: 'ליטוף סאטן' },
    description: { en: 'Liquid satin gown with a bias-cut silhouette that drapes beautifully over the body.', fr: 'Robe en satin liquide avec silhouette en biais qui drapé magnifiquement.', he: 'שמלת סאטן נוזלי עם סילואט מושלם המתעטף על הגוף.' },
  },
  {
    slug: 'lumiere-romantique', category: 'evening',
    title: { en: 'Romantic Glow', fr: 'Lumière Romantique', he: 'זוהר רומנטי' },
    description: { en: 'Soft layered tulle gown in blush and nude tones. Romantic, airy, and full of movement.', fr: 'Robe en tulle superposé dans des tons blush et nude. Romantique et pleine de mouvement.', he: 'שמלת טול שכבות בגוני בלאש ונייד. רומנטית ומלאת תנועה.' },
  },
  {
    slug: 'la-parisienne', category: 'evening',
    title: { en: 'La Parisienne', fr: 'La Parisienne', he: 'לה פריזיין' },
    description: { en: 'Classic French elegance — a refined black evening gown with impeccable tailoring.', fr: 'Élégance française classique — robe de soirée noire raffinée à la coupe impeccable.', he: 'אלגנטיות צרפתית קלאסית — שמלת ערב שחורה מעודנת עם חיתוך מושלם.' },
  },
  {
    slug: 'reflet-argente', category: 'evening',
    title: { en: 'Silver Reflection', fr: 'Reflet Argenté', he: 'בבואת כסף' },
    description: { en: 'Silver sequin gown that moves like liquid mercury. Commanding attention without saying a word.', fr: 'Robe en sequins argentés qui bouge comme du mercure liquide.', he: 'שמלת פייטים כסף הזורמת כמו כסף נוזלי.' },
  },
  {
    slug: 'fleur-de-paris', category: 'evening',
    title: { en: 'Paris Flower', fr: 'Fleur de Paris', he: 'פרח פריז' },
    description: { en: 'Floral embroidered gown in soft rose tones. Delicate petals trace the bodice and cascade down the skirt.', fr: 'Robe brodée de fleurs dans des tons rose doux.', he: 'שמלה עם רקמת פרחים בגוני ורד. עלי כותרת מקשטים את הקורסאז׳.' },
  },
  {
    slug: 'marquise', category: 'evening',
    title: { en: 'Marquise', fr: 'Marquise', he: 'מרקיזה' },
    description: { en: 'A regal gown with a structured corset bodice, full skirt, and dramatic presence.', fr: 'Robe royale avec corsage corset structuré et jupe ample. Pour les soirées mémorables.', he: 'שמלה מלכותית עם קורסאז׳ קורסט וחצאית מלאה.' },
  },
  {
    slug: 'reverie', category: 'evening',
    title: { en: 'Reverie', fr: 'Rêverie', he: 'הזיה' },
    description: { en: 'A floor-length gown in soft grey with intricate pleating that creates a sculptural effect.', fr: 'Robe longue en gris doux avec plissage complexe qui crée un effet sculptural.', he: 'שמלה ארוכה באפור עדין עם קפלים המייצרים אפקט פיסולי.' },
  },
  {
    slug: 'saphir-celeste', category: 'evening',
    title: { en: 'Celestial Blue', fr: 'Saphir Céleste', he: 'כחול שמיים' },
    description: { en: 'Deep ocean blue gown with hand-placed crystal accents along the neckline and shoulders.', fr: 'Robe bleu océan profond avec accents de cristal sur l\'encolure et les épaules.', he: 'שמלה כחולה כהה עם קישוטי קריסטל על המחשוף.' },
  },
  {
    slug: 'magnolia', category: 'evening',
    title: { en: 'Magnolia', fr: 'Magnolia', he: 'מגנוליה' },
    description: { en: 'Creamy white gown with three-dimensional magnolia appliqués. Soft, sculptural, and unforgettable.', fr: 'Robe blanc crème avec appliqués magnolia en trois dimensions.', he: 'שמלה לבן קרמי עם קישוטי מגנוליה תלת-ממדיים.' },
  },
  {
    slug: 'cascade-de-soie', category: 'evening',
    title: { en: 'Silk Cascade', fr: 'Cascade de Soie', he: 'מפל משי' },
    description: { en: 'A waterfall of silk that flows from a fitted bodice into a dramatic sweeping skirt.', fr: 'Cascade de soie qui s\'écoule d\'un corsage ajusté vers une jupe ample et dramatique.', he: 'מפל משי הזורם מקורסאז׳ מחוייט לחצאית דרמטית.' },
  },
  {
    slug: 'coucher-de-soleil', category: 'evening',
    title: { en: 'Sunset', fr: 'Coucher de Soleil', he: 'שקיעה' },
    description: { en: 'An ombré gown that transitions from deep burgundy to soft peach, echoing a Tel Aviv sunset.', fr: 'Robe ombré qui passe du bordeaux profond à la pêche douce, évoquant un coucher de soleil à Tel Aviv.', he: 'שמלת אומברה עוברת מבורדו כהה לאפרסק עדין, כמו שקיעה בתל אביב.' },
  },
  // ── Wedding (2) ───────────────────────────────────────────────────────────
  {
    slug: 'dentelle-eternelle', category: 'wedding',
    title: { en: 'Eternal Lace', fr: 'Dentelle Éternelle', he: 'תחרה נצחית' },
    description: { en: 'A stunning ivory lace bridal gown with long sheer sleeves and a romantic silhouette.', fr: 'Magnifique robe de mariée en dentelle ivoire avec longues manches transparentes.', he: 'שמלת כלה עם תחרה איבורית ושרוולים שקופים.' },
  },
  {
    slug: 'wedding-dress-1', category: 'wedding',
    title: { en: 'La Mariée', fr: 'La Mariée', he: 'לה מריה' },
    description: { en: 'A timeless bridal gown with elegant detailing and a silhouette that flatters every figure.', fr: 'Une robe de mariée intemporelle avec des détails élégants et une silhouette qui flatte chaque silhouette.', he: 'שמלת כלה נצחית עם פרטים אלגנטיים וסילואט מחמיא.' },
  },
]

async function seed() {
  console.log(`Seeding ${DRESSES.length} dresses into ${env['NEXT_PUBLIC_SUPABASE_URL']}...\n`)
  let ok = 0, fail = 0

  for (const dress of DRESSES) {
    const { error } = await supabase
      .from('dresses')
      .upsert({
        slug:         dress.slug,
        title:        dress.title,
        description:  dress.description,
        category:     dress.category,
        availability: 'both',
        is_active:    true,
        is_featured:  false,
        images:       [],
      }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${dress.slug}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✓ ${dress.slug}`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} seeded, ${fail} failed.`)
}

seed().catch(console.error)
