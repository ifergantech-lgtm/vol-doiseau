/**
 * update-dress-titles.js
 * Re-titles all 25 dresses in macduggal.com style — descriptive, color-led,
 * feature-based names based on what each dress ACTUALLY looks like in its photo.
 * Also corrects each description to match the real photo.
 *
 * Updates ONLY `title` and `description`, matched by slug.
 * Does NOT touch images, prices, is_featured, is_active, category.
 *
 * Run from the vol-doiseau folder: node update-dress-titles.js
 */

const fs   = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const eq = line.indexOf('=')
    if (eq > 0) acc[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    return acc
  }, {})

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

// Titles follow macduggal.com convention: [Color] [Fabric/Embellishment] [Sleeve/Neckline] [Silhouette] Gown
const DRESSES = [
  {
    slug: 'lilas-en-fleur',
    title: { en: 'Black Chain Belt Jersey Column Gown', fr: 'Robe Colonne Noire en Jersey à Ceinture Chaîne', he: 'שמלת עמודה שחורה מג׳רזי עם חגורת שרשרת' },
    description: { en: 'A sleek black jersey column gown with three-quarter sleeves and a gold chain belt at the waist.', fr: 'Robe colonne noire en jersey à manches 3/4, rehaussée d\'une ceinture chaîne dorée.', he: 'שמלת עמודה שחורה מג׳רזי עם שרוול שלושת-רבעי וחגורת שרשרת זהובה.' },
  },
  {
    slug: 'emeraude-royale',
    title: { en: 'Blue Floral Appliqué Cape Sleeve Column Gown', fr: 'Robe Colonne Bleue Manches Cape Appliqué Floral', he: 'שמלת עמודה כחולה עם שרוול קייפ ואפליקציה פרחונית' },
    description: { en: 'A blue satin column gown with sheer cape sleeves and delicate floral lace appliqué at the hip.', fr: 'Robe colonne bleue en satin à manches cape transparentes, ornée d\'un appliqué floral en dentelle.', he: 'שמלת עמודה כחולה מסאטן עם שרוול קייפ שקוף ואפליקציית תחרה פרחונית.' },
  },
  {
    slug: 'rose-doree',
    title: { en: 'Charcoal High Neck Dolman Sleeve A-Line Gown', fr: 'Robe Ligne A Anthracite Col Montant Manches Dolman', he: 'שמלת גזרת A אפור פחם עם צוואר גבוה ושרוול דולמן' },
    description: { en: 'A charcoal A-line gown with a high neckline and softly bloused dolman sleeves.', fr: 'Robe ligne A anthracite à col montant et manches dolman légèrement bouffantes.', he: 'שמלת גזרת A בגוון אפור פחם עם צוואר גבוה ושרוול דולמן.' },
  },
  {
    slug: 'la-rouge',
    title: { en: 'Yellow Printed Pleated Long Sleeve A-Line Gown', fr: 'Robe Ligne A Jaune Imprimée Plissée Manches Longues', he: 'שמלת גזרת A צהובה מודפסת עם קפלים ושרוולים ארוכים' },
    description: { en: 'A pleated chiffon A-line gown in a yellow print with a surplice V-neck and long sleeves.', fr: 'Robe ligne A en mousseline plissée à imprimé jaune, col en V cache-cœur et manches longues.', he: 'שמלת גזרת A משיפון קפלים בהדפס צהוב, מחשוף V ושרוולים ארוכים.' },
  },
  {
    slug: 'velours-minuit',
    title: { en: 'Black Lace Long Sleeve Button-Front Gown', fr: 'Robe Noire en Dentelle Manches Longues Boutonnée', he: 'שמלה שחורה מתחרה עם שרוולים ארוכים וכפתורים' },
    description: { en: 'A black gown with lace panels, long sheer sleeves and a button-front bodice.', fr: 'Robe noire à empiècements en dentelle, manches longues transparentes et corsage boutonné.', he: 'שמלה שחורה עם פאנלים מתחרה, שרוולים ארוכים שקופים וקדמת כפתורים.' },
  },
  {
    slug: 'ivoire-brode',
    title: { en: 'Black Crystal Brooch Balloon Sleeve Mermaid Gown', fr: 'Robe Sirène Noire Manches Ballon Broche Cristal', he: 'שמלת בת ים שחורה עם שרוול בלון וסיכת קריסטל' },
    description: { en: 'A black mermaid gown with balloon sleeves and a crystal brooch at the waist.', fr: 'Robe sirène noire à manches ballon, ornée d\'une broche en cristal à la taille.', he: 'שמלת בת ים שחורה עם שרוול בלון וסיכת קריסטל במותן.' },
  },
  {
    slug: 'blush',
    title: { en: 'Pewter Beaded Draped Sleeve Column Gown', fr: 'Robe Colonne Gris Étain Perlée Manches Drapées', he: 'שמלת עמודה אפורה מחרוזים עם שרוול נשפך' },
    description: { en: 'A pewter-grey column gown with beaded detailing and softly draped sleeves.', fr: 'Robe colonne gris étain à détails perlés et manches drapées.', he: 'שמלת עמודה בגוון אפור עם עיטורי חרוזים ושרוול נשפך.' },
  },
  {
    slug: 'saphir-profond',
    title: { en: 'Black Lace Sleeve Pleated Chiffon A-Line Gown', fr: 'Robe Ligne A Noire Plissée Manches en Dentelle', he: 'שמלת גזרת A שחורה בקפלים עם שרוולי תחרה' },
    description: { en: 'A black pleated chiffon A-line gown with sheer lace sleeves.', fr: 'Robe ligne A en mousseline noire plissée à manches en dentelle transparente.', he: 'שמלת גזרת A שחורה משיפון קפלים עם שרוולי תחרה שקופים.' },
  },
  {
    slug: 'dentelle-noire',
    title: { en: 'Purple Printed Balloon Sleeve Pleated Gown', fr: 'Robe Plissée Violette Imprimée Manches Ballon', he: 'שמלת קפלים סגולה מודפסת עם שרוול בלון' },
    description: { en: 'A pleated chiffon A-line gown in a purple print with balloon sleeves and a beaded waist.', fr: 'Robe ligne A en mousseline plissée à imprimé violet, manches ballon et taille perlée.', he: 'שמלת גזרת A משיפון קפלים בהדפס סגול, שרוול בלון ומותן מעוטר חרוזים.' },
  },
  {
    slug: 'perle-de-lune',
    title: { en: 'Blue Sequin Tiered Ruffle Long Sleeve Gown', fr: 'Robe Bleue à Sequins Volantée Manches Longues', he: 'שמלה כחולה בפייטים עם שכבות ושרוולים ארוכים' },
    description: { en: 'A cornflower-blue tiered chiffon gown with sequin detailing and long sleeves.', fr: 'Robe bleue en mousseline à volants, détails sequins et manches longues.', he: 'שמלה כחולה משיפון בשכבות עם פייטים ושרוולים ארוכים.' },
  },
  {
    slug: 'aurore-doree',
    title: { en: 'Mauve Beaded Bow Neck Pleated Gown', fr: 'Robe Plissée Mauve Col Lavallière Perlée', he: 'שמלת קפלים ורוד עתיק עם צווארון פפיון וחרוזים' },
    description: { en: 'A mauve pleated chiffon gown with a pussy-bow high neck and a beaded waistband.', fr: 'Robe plissée mauve à col lavallière et taille perlée.', he: 'שמלת קפלים בגוון ורוד עתיק עם צווארון פפיון וחגורת חרוזים.' },
  },
  {
    slug: 'azur-etoile',
    title: { en: 'Champagne Beaded Draped Sleeve Mermaid Gown', fr: 'Robe Sirène Champagne Perlée Manches Drapées', he: 'שמלת בת ים בגוון שמפניה מחרוזים עם שרוול נשפך' },
    description: { en: 'A champagne mermaid gown with beaded detailing and draped bell sleeves.', fr: 'Robe sirène champagne à détails perlés et manches évasées drapées.', he: 'שמלת בת ים בגוון שמפניה עם חרוזים ושרוול פעמון נשפך.' },
  },
  {
    slug: 'caresse-satinee',
    title: { en: 'Lilac Embellished Bishop Sleeve Chiffon Gown', fr: 'Robe en Mousseline Lilas Manches Bishop Taille Ornée', he: 'שמלת שיפון לילך עם שרוול נפוח ומותן מעוטר' },
    description: { en: 'A lilac chiffon A-line gown with sheer bishop sleeves and an embellished waist.', fr: 'Robe ligne A en mousseline lilas à manches bishop transparentes et taille ornée.', he: 'שמלת גזרת A משיפון לילך עם שרוול נפוח ומותן מעוטר.' },
  },
  {
    slug: 'lumiere-romantique',
    title: { en: 'Green Bow Neck Tiered Long Sleeve Chiffon Gown', fr: 'Robe en Mousseline Verte à Volants Col Lavallière', he: 'שמלת שיפון ירוקה בשכבות עם צווארון פפיון' },
    description: { en: 'A green crinkle-chiffon tiered gown with a pussy-bow high neck and long sleeves.', fr: 'Robe verte en mousseline froissée à volants, col lavallière et manches longues.', he: 'שמלת שיפון ירוקה בשכבות עם צווארון פפיון ושרוולים ארוכים.' },
  },
  {
    slug: 'la-parisienne',
    title: { en: 'Navy Feather Shoulder Long Sleeve Satin Gown', fr: 'Robe en Satin Bleu Marine Épaules Plumes', he: 'שמלת סאטן כחול נייבי עם נוצות בכתפיים' },
    description: { en: 'A deep-navy satin A-line gown with feather trim at the shoulders and long sleeves.', fr: 'Robe ligne A en satin bleu marine à plumes aux épaules et manches longues.', he: 'שמלת סאטן כחול נייבי עם נוצות בכתפיים ושרוולים ארוכים.' },
  },
  {
    slug: 'reflet-argente',
    title: { en: 'Black Gold Floral Embroidered Illusion A-Line Gown', fr: 'Robe Ligne A Noire Brodée Floral Doré Illusion', he: 'שמלת גזרת A שחורה עם רקמה פרחונית זהובה ואילוזיה' },
    description: { en: 'A black A-line gown with an illusion neckline and gold floral embroidery.', fr: 'Robe ligne A noire à col illusion et broderie florale dorée.', he: 'שמלת גזרת A שחורה עם מחשוף אילוזיה ורקמה פרחונית זהובה.' },
  },
  {
    slug: 'fleur-de-paris',
    title: { en: 'Ivory Embroidered Sleeve Pleated A-Line Gown', fr: 'Robe Ligne A Ivoire Plissée Manches Brodées', he: 'שמלת גזרת A שנהב בקפלים עם שרוולים רקומים' },
    description: { en: 'An ivory pleated A-line gown with embroidered sleeve detail and a button front.', fr: 'Robe ligne A ivoire plissée à manches brodées et devant boutonné.', he: 'שמלת גזרת A שנהב בקפלים עם שרוול רקום וקדמת כפתורים.' },
  },
  {
    slug: 'marquise',
    title: { en: 'Ivory Floral Off-the-Shoulder Tiered Gown', fr: 'Robe Ivoire Florale Épaules Dénudées à Volants', he: 'שמלת שנהב פרחונית עם כתפיים חשופות ושכבות' },
    description: { en: 'An ivory floral-print gown with an off-the-shoulder neckline and a tiered skirt.', fr: 'Robe ivoire à imprimé floral, épaules dénudées et jupe à volants.', he: 'שמלת שנהב בהדפס פרחוני עם כתפיים חשופות וחצאית שכבות.' },
  },
  {
    slug: 'reverie',
    title: { en: 'Orange Floral Appliqué Tiered Ball Gown', fr: 'Robe de Bal Orange à Volants Appliqué Floral', he: 'שמלת נשף כתומה בשכבות עם אפליקציית פרחים' },
    description: { en: 'An orange floral ball gown with a tiered ruffled skirt and three-dimensional appliqué.', fr: 'Robe de bal orange florale à jupe à volants et appliqués en relief.', he: 'שמלת נשף כתומה פרחונית עם חצאית שכבות ואפליקציות תלת-ממד.' },
  },
  {
    slug: 'saphir-celeste',
    title: { en: 'Blush Brooch Detail Cascade Ruffle Gown', fr: 'Robe en Mousseline Rose Poudré Volant Cascade Broche', he: 'שמלת שיפון ורוד פודרה עם מפל מלמלה וסיכה' },
    description: { en: 'A blush chiffon A-line gown with a cascade ruffle and a brooch detail.', fr: 'Robe ligne A en mousseline rose poudré à volant cascade et broche.', he: 'שמלת גזרת A משיפון ורוד פודרה עם מפל מלמלה וסיכה.' },
  },
  {
    slug: 'magnolia',
    title: { en: 'Emerald Buckle Waist Bishop Sleeve Chiffon Gown', fr: 'Robe en Mousseline Émeraude Manches Bishop Boucle Taille', he: 'שמלת שיפון ירוק אמרלד עם שרוול נפוח ואבזם מותן' },
    description: { en: 'An emerald chiffon A-line gown with bishop sleeves and a circular buckle at the waist.', fr: 'Robe ligne A en mousseline émeraude à manches bishop et boucle à la taille.', he: 'שמלת גזרת A משיפון ירוק אמרלד עם שרוול נפוח ואבזם במותן.' },
  },
  {
    slug: 'cascade-de-soie',
    title: { en: 'Lime Beaded Cape Sleeve Satin Mermaid Gown', fr: 'Robe Sirène Vert Anis en Satin Perlée Manches Cape', he: 'שמלת בת ים ירוק ליים מסאטן עם שרוול קייפ' },
    description: { en: 'A lime satin mermaid gown with beaded shoulders and draped cape sleeves.', fr: 'Robe sirène vert anis en satin à épaules perlées et manches cape drapées.', he: 'שמלת בת ים ירוק ליים מסאטן עם כתפיים מעוטרות חרוזים ושרוול קייפ.' },
  },
  {
    slug: 'coucher-de-soleil',
    title: { en: 'Yellow Pleated Bishop Sleeve Button-Front Gown', fr: 'Robe Jaune Plissée Manches Bishop Boutonnée', he: 'שמלה צהובה בקפלים עם שרוול נפוח וכפתורים' },
    description: { en: 'A golden-yellow pleated chiffon A-line gown with bishop sleeves and a button front.', fr: 'Robe ligne A en mousseline jaune plissée à manches bishop et devant boutonné.', he: 'שמלת גזרת A משיפון צהוב בקפלים עם שרוול נפוח וקדמת כפתורים.' },
  },
  {
    slug: 'dentelle-eternelle',
    title: { en: 'Ivory Lace Long Sleeve Mermaid Gown', fr: 'Robe Sirène Ivoire en Dentelle Manches Longues', he: 'שמלת בת ים מתחרה בגוון שנהב עם שרוולים ארוכים' },
    description: { en: 'An ivory lace mermaid gown with long sleeves and a softly tiered hem.', fr: 'Robe sirène en dentelle ivoire à manches longues et ourlet à volants.', he: 'שמלת בת ים מתחרה בגוון שנהב עם שרוולים ארוכים ומכפלת שכבות.' },
  },
  {
    slug: 'wedding-dress-1',
    title: { en: 'Yellow Pleated Long Sleeve Shirt Gown', fr: 'Robe Jaune Plissée Manches Longues Col Chemise', he: 'שמלה צהובה בקפלים עם שרוולים ארוכים וצווארון חולצה' },
    description: { en: 'A golden-yellow pleated gown with long sleeves and a button-front shirt collar.', fr: 'Robe jaune plissée à manches longues et col chemise boutonné.', he: 'שמלה צהובה בקפלים עם שרוולים ארוכים וצווארון חולצה מכופתר.' },
  },
]

async function run() {
  console.log(`Updating ${DRESSES.length} dress titles in ${env['NEXT_PUBLIC_SUPABASE_URL']}...\n`)
  let ok = 0, fail = 0

  for (const d of DRESSES) {
    const { data, error } = await supabase
      .from('dresses')
      .update({ title: d.title, description: d.description })
      .eq('slug', d.slug)
      .select('slug')

    if (error) {
      console.error(`  ✗ ${d.slug}: ${error.message}`)
      fail++
    } else if (!data || data.length === 0) {
      console.error(`  ✗ ${d.slug}: no matching row found`)
      fail++
    } else {
      console.log(`  ✓ ${d.slug}  →  "${d.title.en}"`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} updated, ${fail} failed.`)
}

run().catch(console.error)
