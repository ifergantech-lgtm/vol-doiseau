/**
 * upload-ai-photos.js
 * Uploads one AI-generated image per dress to Supabase Storage,
 * then saves the public URL into each dress record's `images` array.
 *
 * Run from the vol-doiseau folder:
 *   node upload-ai-photos.js
 */

const fs   = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ── Config ────────────────────────────────────────────────────────────────────

const AI_PHOTOS_DIR = path.join(__dirname, '..', 'ai-generated-photos')
const BUCKET        = 'dress-images'

// Read .env.local
const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const eq = line.indexOf('=')
    if (eq > 0) acc[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    return acc
  }, {})

const SUPABASE_URL  = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY   = env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Dress → image mapping ─────────────────────────────────────────────────────
// One image file per dress slug, in the same order as the seeded records.
// Images 002–026 = evening gowns (batch generated May 25)
// Image 045      = last evening gown
// Images 067–069 = wedding dresses (batch generated May 21)

const MAPPING = [
  { slug: 'nuit-etoilee',       file: 'image-002.png' },
  { slug: 'lilas-en-fleur',     file: 'image-003.png' },
  { slug: 'emeraude-royale',    file: 'image-004.png' },
  { slug: 'rose-doree',         file: 'image-005.png' },
  { slug: 'la-rouge',           file: 'image-006.png' },
  { slug: 'velours-minuit',     file: 'image-007.png' },
  { slug: 'ivoire-brode',       file: 'image-008.png' },
  { slug: 'blush',              file: 'image-009.png' },
  { slug: 'saphir-profond',     file: 'image-010.png' },
  { slug: 'dentelle-noire',     file: 'image-011.png' },
  { slug: 'perle-de-lune',      file: 'image-012.png' },
  { slug: 'aurore-doree',       file: 'image-013.png' },
  { slug: 'azur-etoile',        file: 'image-014.png' },
  { slug: 'caresse-satinee',    file: 'image-015.png' },
  { slug: 'lumiere-romantique', file: 'image-016.png' },
  { slug: 'la-parisienne',      file: 'image-017.png' },
  { slug: 'reflet-argente',     file: 'image-018.png' },
  { slug: 'brume-enchantee',    file: 'image-019.png' },
  { slug: 'fleur-de-paris',     file: 'image-020.png' },
  { slug: 'marquise',           file: 'image-021.png' },
  { slug: 'songe-dete',         file: 'image-022.png' },
  { slug: 'reverie',            file: 'image-023.png' },
  { slug: 'saphir-celeste',     file: 'image-024.png' },
  { slug: 'magnolia',           file: 'image-025.png' },
  { slug: 'cascade-de-soie',    file: 'image-026.png' },
  { slug: 'coucher-de-soleil',  file: 'image-045.png' },
  // Wedding dresses
  { slug: 'dentelle-eternelle', file: 'image-067.png' },
  { slug: 'grace-pure',         file: 'image-068.png' },
  { slug: 'voile-divoire',      file: 'image-069.png' },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {

  // 1. Ensure bucket exists and is public
  console.log(`Checking bucket "${BUCKET}"…`)
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (createErr && !createErr.message.includes('already exists')) {
    // Bucket might already exist — try to make it public
    const { error: updateErr } = await supabase.storage.updateBucket(BUCKET, { public: true })
    if (updateErr) console.warn(`  Could not update bucket: ${updateErr.message}`)
    else console.log(`  Bucket already existed — set to public ✓`)
  } else if (!createErr) {
    console.log(`  Bucket created (public) ✓`)
  }

  console.log(`\nUploading ${MAPPING.length} images…\n`)
  let ok = 0, fail = 0

  for (const { slug, file } of MAPPING) {
    const localPath = path.join(AI_PHOTOS_DIR, file)
    const storagePath = `dresses/${slug}.png`

    // Check file exists locally
    if (!fs.existsSync(localPath)) {
      console.log(`  [SKIP] ${slug} — local file not found: ${file}`)
      fail++
      continue
    }

    const buffer = fs.readFileSync(localPath)
    const kb = Math.round(buffer.length / 1024)
    process.stdout.write(`  ${slug} (${kb} KB)… `)

    // Upload (upsert so re-running is safe)
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true })

    if (uploadErr) {
      console.log(`✗  ${uploadErr.message}`)
      fail++
      continue
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl

    // Update dress record
    const { error: dbErr } = await supabase
      .from('dresses')
      .update({ images: [publicUrl] })
      .eq('slug', slug)

    if (dbErr) {
      console.log(`✗  DB update failed: ${dbErr.message}`)
      fail++
    } else {
      console.log(`✓`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${fail} failed.`)
  if (fail === 0) {
    console.log('\nAll dresses now have images. The collection page is ready.')
  }
}

run().catch(console.error)
