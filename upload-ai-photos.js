/**
 * upload-ai-photos.js
 * Uploads one AI image per dress to Supabase Storage,
 * then saves the public URL into each dress record's images array.
 *
 * Run from the vol-doiseau folder: node upload-ai-photos.js
 */

const fs   = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const AI_PHOTOS_DIR = path.join(__dirname, '..', 'ai-generated-photos')
const BUCKET        = 'dress-images'

const env = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const eq = line.indexOf('=')
    if (eq > 0) acc[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    return acc
  }, {})

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

// 23 evening + 2 wedding = 25 dresses
const MAPPING = [
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
  { slug: 'fleur-de-paris',     file: 'image-020.png' },
  { slug: 'marquise',           file: 'image-021.png' },
  { slug: 'reverie',            file: 'image-023.png' },
  { slug: 'saphir-celeste',     file: 'image-024.png' },
  { slug: 'magnolia',           file: 'image-025.png' },
  { slug: 'cascade-de-soie',    file: 'image-026.png' },
  { slug: 'coucher-de-soleil',  file: 'image-045.png' },
  // Wedding
  { slug: 'dentelle-eternelle', file: 'image-072.png' },
  { slug: 'wedding-dress-1',    file: 'image-074.png' },
]

async function run() {
  console.log(`Connecting to: ${env['NEXT_PUBLIC_SUPABASE_URL']}\n`)

  // Ensure bucket exists and is public
  const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (createErr && createErr.message.includes('already exists')) {
    await supabase.storage.updateBucket(BUCKET, { public: true })
    console.log(`Bucket "${BUCKET}" already exists — set to public ✓`)
  } else if (!createErr) {
    console.log(`Bucket "${BUCKET}" created (public) ✓`)
  }

  console.log(`\nUploading ${MAPPING.length} images...\n`)
  let ok = 0, skip = 0, fail = 0

  for (const { slug, file } of MAPPING) {
    const localPath = path.join(AI_PHOTOS_DIR, file)

    if (!fs.existsSync(localPath)) {
      console.log(`  [SKIP] ${slug} — file not found: ${file}`)
      skip++
      continue
    }

    const buffer = fs.readFileSync(localPath)
    const kb     = Math.round(buffer.length / 1024)
    process.stdout.write(`  ${slug} (${kb} KB)... `)

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(`dresses/${slug}.png`, buffer, { contentType: 'image/png', upsert: true })

    if (uploadErr) {
      console.log(`✗ ${uploadErr.message}`)
      fail++
      continue
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(`dresses/${slug}.png`)

    const { error: dbErr } = await supabase
      .from('dresses')
      .update({ images: [urlData.publicUrl] })
      .eq('slug', slug)

    if (dbErr) {
      console.log(`✗ DB error: ${dbErr.message}`)
      fail++
    } else {
      console.log(`✓`)
      ok++
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${skip} skipped (file missing), ${fail} failed.`)
}

run().catch(console.error)
