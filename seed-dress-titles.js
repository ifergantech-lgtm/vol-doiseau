/**
 * seed-dress-titles.js
 * Upserts all 29 dress records in Supabase with boutique-style names.
 * Run once from the vol-doiseau folder: node ../seed-dress-titles.js
 *
 * Uses the service-role key so it bypasses RLS.
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
const env = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=');
    if (k && v.length) acc[k.trim()] = v.join('=').trim();
    return acc;
  }, {});

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// 26 evening dresses + 3 wedding dresses
// Titles: { en, fr, he }   Descriptions: { en, fr, he }
const DRESSES = [
  {
    slug: 'nuit-etoilee',
    category: 'evening',
    title: { en: 'Starlit Night', fr: 'Nuit Étoilée', he: 'ליל כוכבים' },
    description: { en: 'A floor-length evening gown that captures the drama of a clear night sky. Structured bodice, fluid skirt.', fr: 'Une robe de soirée longue qui capture le drame d\'un ciel nocturne. Corsage structuré, jupe fluide.', he: 'שמלת ערב ארוכה עם קורסאז׳ מובנה וחצאית זורמת.' },
  },
  {
    slug: 'lilas-en-fleur',
    category: 'evening',
    title: { en: 'Lilac Blossom', fr: 'Lilas en Fleur', he: 'לילך פורח' },
    description: { en: 'Soft lilac pleated chiffon gown with a delicate V-neckline and long flowing sleeves. Floor-length, romantic silhouette.', fr: 'Robe en mousseline plissée lilas avec un décolleté en V délicat et de longues manches fluides.', he: 'שמלת שיפון קפלים סגול עדין עם מחשוף V ושרוולים זורמים.' },
  },
  {
    slug: 'emeraude-royale',
    category: 'evening',
    title: { en: 'Royal Emerald', fr: 'Émeraude Royale', he: 'אמרלד מלכותי' },
    description: { en: 'Rich emerald green pleated chiffon gown with a high neckline and long sleeves. Bold, structured, unforgettable.', fr: 'Robe en mousseline plissée vert émeraude avec un col haut et des manches longues. Audacieuse et structurée.', he: 'שמלת שיפון קפלים ירוק אמרלד עם צוואר גבוה ושרוולים ארוכים.' },
  },
  {
    slug: 'rose-doree',
    category: 'evening',
    title: { en: 'Golden Rose', fr: 'Rose Dorée', he: 'ורד זהב' },
    description: { en: 'A warm rose-toned gown with gold embroidery details and a graceful A-line silhouette.', fr: 'Une robe aux tons roses chauds avec des détails brodés dorés et une silhouette A-line gracieuse.', he: 'שמלה בגוני ורד חמים עם רקמות זהב וסילואט A אלגנטי.' },
  },
  {
    slug: 'la-rouge',
    category: 'evening',
    title: { en: 'La Rouge', fr: 'La Rouge', he: 'לה רוז׳' },
    description: { en: 'Crimson red cocktail gown with elaborate floral beadwork on the bodice. Vibrant, glamorous, celebration-ready.', fr: 'Robe rouge vif avec une broderie florale élaborée sur le corsage. Glamour et festive.', he: 'שמלה אדומה יוקרתית עם רקמת פרחים ופנינים על הקורסאז׳.' },
  },
  {
    slug: 'velours-minuit',
    category: 'evening',
    title: { en: 'Midnight Velvet', fr: 'Velours Minuit', he: 'קשמיר חצות' },
    description: { en: 'Deep midnight velvet gown with a clean silhouette and subtle draped back. Timeless luxury.', fr: 'Robe en velours minuit avec une silhouette épurée et un dos drapé subtil.', he: 'שמלת קשמיר כהה עם גב מדוחה עדין. יוקרה נצחית.' },
  },
  {
    slug: 'ivoire-brode',
    category: 'evening',
    title: { en: 'Ivory Embroidered', fr: 'Ivoire Brodé', he: 'שנהב מרוקם' },
    description: { en: 'Ivory beige evening gown with ornate embroidery and lace throughout. Long sleeves, floor-length, handcrafted elegance.', fr: 'Robe de soirée ivoire avec broderies ornées et dentelle. Manches longues, longueur sol, élégance artisanale.', he: 'שמלת ערב שנהב עם רקמות ותחרה. שרוולים ארוכים ואלגנטיות של יד.' },
  },
  {
    slug: 'blush',
    category: 'evening',
    title: { en: 'Blush', fr: 'Rose Poudré', he: 'בלאש' },
    description: { en: 'Delicate blush pink gown with a fitted bodice and flowing skirt. Soft and effortlessly feminine.', fr: 'Robe rose poudrée délicate avec corsage ajusté et jupe fluide. Féminité sans effort.', he: 'שמלה ורודה עדינה עם קורסאז׳ מחוייט וחצאית זורמת.' },
  },
  {
    slug: 'saphir-profond',
    category: 'evening',
    title: { en: 'Deep Sapphire', fr: 'Saphir Profond', he: 'ספיר עמוק' },
    description: { en: 'Rich sapphire blue gown with a sleek column silhouette. Modern elegance for a grand entrance.', fr: 'Robe bleu saphir avec une silhouette colonne élégante. Modernité et grandeur.', he: 'שמלה כחול ספיר עשיר עם סילואט עמודה ייצוגי.' },
  },
  {
    slug: 'dentelle-noire',
    category: 'evening',
    title: { en: 'Black Lace', fr: 'Dentelle Noire', he: 'תחרה שחורה' },
    description: { en: 'Classic black lace evening gown with a fitted silhouette and subtle train. Eternally chic.', fr: 'Robe de soirée en dentelle noire classique avec silhouette ajustée et légère traîne.', he: 'שמלת תחרה שחורה קלאסית עם פרטים מדויקים וזנב עדין.' },
  },
  {
    slug: 'perle-de-lune',
    category: 'evening',
    title: { en: 'Moon Pearl', fr: 'Perle de Lune', he: 'פנינת לבנה' },
    description: { en: 'Pearlescent white gown with delicate beading and a soft A-line silhouette. Pure and luminous.', fr: 'Robe blanche nacrée avec perles délicates et silhouette A-line douce.', he: 'שמלה לבנה מנצנצת עם פנינים עדינות וסילואט A רך.' },
  },
  {
    slug: 'aurore-doree',
    category: 'evening',
    title: { en: 'Golden Dawn', fr: 'Aurore Dorée', he: 'שחר זהב' },
    description: { en: 'Warm champagne gown with gold metallic thread woven through the fabric. Radiant from every angle.', fr: 'Robe champagne chaude avec fil métallique doré tissé dans le tissu.', he: 'שמלת שמפניה חמה עם חוט מתכת זהב. מבריקה מכל זווית.' },
  },
  {
    slug: 'azur-etoile',
    category: 'evening',
    title: { en: 'Starry Azure', fr: 'Azur Étoilé', he: 'תכלת כוכבים' },
    description: { en: 'Azure blue gown with scattered crystal embellishments that catch the light. Ethereal and striking.', fr: 'Robe bleu azur avec des ornements en cristal qui captent la lumière.', he: 'שמלה כחולה בגוון תכלת עם קישוטי קריסטל.' },
  },
  {
    slug: 'caresse-satinee',
    category: 'evening',
    title: { en: 'Satin Caress', fr: 'Caresse Satinée', he: 'ליטוף סאטן' },
    description: { en: 'Liquid satin gown with a bias-cut silhouette that drapes beautifully over the body.', fr: 'Robe en satin liquide avec une silhouette en biais qui drapé magnifiquement.', he: 'שמלת סאטן נוזלי עם סילואט מושלם המתעטף על הגוף.' },
  },
  {
    slug: 'lumiere-romantique',
    category: 'evening',
    title: { en: 'Romantic Glow', fr: 'Lumière Romantique', he: 'זוהר רומנטי' },
    description: { en: 'Soft layered tulle gown in blush and nude tones. Romantic, airy, and full of movement.', fr: 'Robe en tulle superposé dans des tons blush et nude. Romantique et pleine de mouvement.', he: 'שמלת טול שכבות בגוני בלאש ונייד. רומנטית ומלאת תנועה.' },
  },
  {
    slug: 'la-parisienne',
    category: 'evening',
    title: { en: 'La Parisienne', fr: 'La Parisienne', he: 'לה פריזיין' },
    description: { en: 'Classic French elegance — a refined black evening gown with impeccable tailoring and subtle flair.', fr: 'Élégance française classique — une robe de soirée noire raffinée à la coupe impeccable.', he: 'אלגנטיות צרפתית קלאסית — שמלת ערב שחורה מעודנת עם חיתוך מושלם.' },
  },
  {
    slug: 'reflet-argente',
    category: 'evening',
    title: { en: 'Silver Reflection', fr: 'Reflet Argenté', he: 'בבואת כסף' },
    description: { en: 'Silver sequin gown that moves like liquid mercury. Commanding attention without saying a word.', fr: 'Robe en sequins argentés qui bouge comme du mercure liquide.', he: 'שמלת פייטים כסף הזורמת כמו כסף נוזלי.' },
  },
  {
    slug: 'brume-enchantee',
    category: 'evening',
    title: { en: 'Enchanted Mist', fr: 'Brume Enchantée', he: 'ערפל קסום' },
    description: { en: 'Dusty lavender tulle gown with a dreamy, whimsical silhouette. Like stepping into a fairytale.', fr: 'Robe en tulle lavande poussiéreuse avec une silhouette onirique.', he: 'שמלת טול לבנדר עם סילואט חלומי.' },
  },
  {
    slug: 'fleur-de-paris',
    category: 'evening',
    title: { en: 'Paris Flower', fr: 'Fleur de Paris', he: 'פרח פריז' },
    description: { en: 'Floral embroidered gown in soft rose tones. Delicate petals trace the bodice and cascade down the skirt.', fr: 'Robe brodée de fleurs dans des tons rose doux. Des pétales délicats ornent le corsage et la jupe.', he: 'שמלה עם רקמת פרחים בגוני ורד. עלי כותרת מקשטים את הקורסאז׳.' },
  },
  {
    slug: 'marquise',
    category: 'evening',
    title: { en: 'Marquise', fr: 'Marquise', he: 'מרקיזה' },
    description: { en: 'A regal gown with a structured corset bodice, full skirt, and dramatic presence. Made for memorable evenings.', fr: 'Une robe royale avec un corsage corset structuré et une jupe ample. Pour les soirées mémorables.', he: 'שמלה מלכותית עם קורסאז׳ קורסט וחצאית מלאה.' },
  },
  {
    slug: 'songe-dete',
    category: 'evening',
    title: { en: 'Summer Dream', fr: 'Songe d\'Été', he: 'חלום קיץ' },
    description: { en: 'Lightweight chiffon in warm sunset hues. Relaxed silhouette, perfect for warm-weather celebrations.', fr: 'Mousseline légère dans des tons coucher de soleil. Silhouette décontractée, parfaite pour les célébrations estivales.', he: 'שיפון קל בגוני שקיעה. סילואט קליל לחגיגות קיץ.' },
  },
  {
    slug: 'reverie',
    category: 'evening',
    title: { en: 'Reverie', fr: 'Rêverie', he: 'הזיה' },
    description: { en: 'A floor-length gown in soft grey with intricate pleating that creates a sculptural effect.', fr: 'Une robe longue en gris doux avec un plissage complexe qui crée un effet sculptural.', he: 'שמלה ארוכה באפור עדין עם קפלים המייצרים אפקט פיסולי.' },
  },
  {
    slug: 'saphir-celeste',
    category: 'evening',
    title: { en: 'Celestial Blue', fr: 'Saphir Céleste', he: 'כחול שמיים' },
    description: { en: 'Deep ocean blue gown with hand-placed crystal accents along the neckline and shoulders.', fr: 'Robe bleu océan profond avec des accents de cristal placés à la main sur l\'encolure et les épaules.', he: 'שמלה כחולה כהה עם קישוטי קריסטל על המחשוף.' },
  },
  {
    slug: 'magnolia',
    category: 'evening',
    title: { en: 'Magnolia', fr: 'Magnolia', he: 'מגנוליה' },
    description: { en: 'Creamy white gown with three-dimensional magnolia appliqués. Soft, sculptural, and unforgettable.', fr: 'Robe blanc crème avec des appliqués magnolia en trois dimensions.', he: 'שמלה לבן קרמי עם קישוטי מגנוליה תלת-ממדיים.' },
  },
  {
    slug: 'cascade-de-soie',
    category: 'evening',
    title: { en: 'Silk Cascade', fr: 'Cascade de Soie', he: 'מפל משי' },
    description: { en: 'A waterfall of silk that flows from a fitted bodice into a dramatic, sweeping skirt.', fr: 'Une cascade de soie qui s\'écoule d\'un corsage ajusté vers une jupe ample et dramatique.', he: 'מפל משי הזורם מקורסאז׳ מחוייט לחצאית דרמטית.' },
  },
  {
    slug: 'coucher-de-soleil',
    category: 'evening',
    title: { en: 'Sunset', fr: 'Coucher de Soleil', he: 'שקיעה' },
    description: { en: 'An ombré gown that transitions from deep burgundy to soft peach, echoing a Tel Aviv sunset.', fr: 'Une robe ombré qui passe du bordeaux profond à la pêche douce, évoquant un coucher de soleil à Tel Aviv.', he: 'שמלת אומברה עוברת מבורדו כהה לאפרסק עדין, כמו שקיעה בתל אביב.' },
  },
  // Wedding dresses
  {
    slug: 'dentelle-eternelle',
    category: 'wedding',
    title: { en: 'Eternal Lace', fr: 'Dentelle Éternelle', he: 'תחרה נצחית' },
    description: { en: 'A stunning ivory lace bridal gown with long sheer sleeves and a romantic silhouette. Every detail is a work of art.', fr: 'Une magnifique robe de mariée en dentelle ivoire avec de longues manches transparentes et une silhouette romantique.', he: 'שמלת כלה עם תחרה איבורית ושרוולים שקופים. כל פרט הוא יצירת אמנות.' },
  },
  {
    slug: 'grace-pure',
    category: 'wedding',
    title: { en: 'Pure Grace', fr: 'Grâce Pure', he: 'חן טהור' },
    description: { en: 'Minimalist ivory bridal gown with clean lines and understated refinement. Modern elegance for the contemporary bride.', fr: 'Robe de mariée ivoire minimaliste avec des lignes épurées. Élégance moderne pour la mariée contemporaine.', he: 'שמלת כלה מינימליסטית באיבורי. אלגנטיות מודרנית לכלה העכשווית.' },
  },
  {
    slug: 'voile-divoire',
    category: 'wedding',
    title: { en: 'Ivory Veil', fr: "Voile d'Ivoire", he: 'רדיד שנהב' },
    description: { en: 'A flowing ivory bridal gown with soft draped details and a cathedral-length silhouette. Timeless and breathtaking.', fr: "Une robe de mariée ivoire fluide avec des détails drapés doux et une silhouette longueur cathédrale.", he: 'שמלת כלה זורמת באיבורי עם פרטים מדוחים ועיצוב מלכותי.' },
  },
];

async function seed() {
  console.log(`Upserting ${DRESSES.length} dresses...\n`);
  let ok = 0, fail = 0;

  for (const dress of DRESSES) {
    const payload = {
      slug:         dress.slug,
      title:        dress.title,
      description:  dress.description,
      category:     dress.category,
      availability: 'both',
      is_active:    true,
      is_featured:  false,
      images:       [],
    };

    const { error } = await supabase
      .from('dresses')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.error(`  ✗ ${dress.slug}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${dress.slug}`);
      ok++;
    }
  }

  console.log(`\nDone. ${ok} upserted, ${fail} failed.`);
}

seed().catch(console.error);
