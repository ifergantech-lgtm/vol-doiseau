/**
 * list-dresses.js — read-only. Prints the CURRENT live dress records from Supabase
 * (slug, current titles, image URL) so we work from live data, not the seed file.
 * Run from the vol-doiseau folder: node list-dresses.js
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

function txt(v) {
  if (v && typeof v === 'object') return v.en || v.fr || Object.values(v)[0] || ''
  return v || ''
}

;(async () => {
  const { data, error } = await supabase
    .from('dresses')
    .select('slug,title,category,is_active,is_featured,images')
    .order('category', { ascending: true })
    .order('slug', { ascending: true })

  if (error) { console.error('ERROR:', error.message); return }

  data.forEach((d, i) => {
    const en  = txt(d.title)
    const fr  = (d.title && typeof d.title === 'object') ? (d.title.fr || '') : ''
    const img = Array.isArray(d.images) && d.images.length ? d.images[0] : '(no image)'
    console.log(`${String(i + 1).padStart(2)}. [${d.category}] ${d.slug}  active:${d.is_active} feat:${d.is_featured}`)
    console.log(`    EN: ${en}`)
    if (fr) console.log(`    FR: ${fr}`)
    console.log(`    IMG: ${img}`)
  })
  console.log(`\nTotal dresses: ${data.length}`)
})().catch(console.error)
