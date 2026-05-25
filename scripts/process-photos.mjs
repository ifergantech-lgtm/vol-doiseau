#!/usr/bin/env node
/**
 * Process boutique photos for the web:
 *  - Auto-rotate based on EXIF
 *  - Resize to web-friendly dimensions
 *  - Light tonal pass (gentle warmth + slight brightness + light sharpen)
 *  - Save as optimised JPG to /public/dresses/ or /public/shop/
 *
 * Usage:  node scripts/process-photos.mjs
 */

import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('..')
const PHOTOS_ROOT = path.resolve(ROOT, 'photos', 'Elisheva Ifergan')
const OUT_DRESSES = path.resolve('public', 'dresses')
const OUT_SHOP = path.resolve('public', 'shop')

// (sourceFile, targetSlug) — best representative photo per unique dress.
// Multiple files per dress allowed -> exported as <slug>.jpg and <slug>-2.jpg
const DRESSES = [
  { slug: 'yellow-pleated', files: ['80AE6D82-73AE-4346-80AF-867A1D741A85.JPG', '2235EA67-2276-473F-BE13-2566EE8EE637.JPG'] },
  { slug: 'lilac-pleated', files: ['1CC93EB3-A4EA-41D4-8DC2-09DF3F712021.JPG'] },
  { slug: 'dusty-rose-pleated', files: ['0BA361F4-F254-4A22-B2D8-596596253913.JPG', '400F7FE5-824B-48D8-80E4-A4F7247722F8.JPG'] },
  { slug: 'cream-floral-chiffon', files: ['0BB3906E-371B-4C5B-BADD-975E057C40F8.JPG', '3E2A7407-9B0E-4A4A-9C78-B0BFEF83DDF7.JPG'] },
  { slug: 'periwinkle-lace', files: ['0DA189A3-FDDB-4372-9CA1-F38B325A166C.JPG'] },
  { slug: 'champagne-satin-sequin', files: ['17962365-6A69-43B7-AA7A-C71A01FA62B9.JPG', '5923C2F5-ADA0-4465-A9B2-81CF7EA234CE.JPG'] },
  { slug: 'grey-satin-sparkle', files: ['198660C7-61F2-4CF0-8ABB-B8D096D134D1.JPG'] },
  { slug: 'black-lace-insert', files: ['24530A28-55D3-42FF-A080-EEBCF9FEBBFD.JPG'] },
  { slug: 'blue-marbled-lace', files: ['32790AFD-284B-4D5D-BC57-099B50CF9AEF.JPG', '34BB7764-24DF-447D-81B4-971E9ADBCB3D.JPG'] },
  { slug: 'emerald-pleated', files: ['52E58F73-7BE9-4A97-891D-36A5233424AE.JPG'] },
  { slug: 'peach-pleated-ring', files: ['3E4A7FAA-1767-4AB2-A956-A45615372DC2.JPG', '4D92EBFA-CE75-4224-B133-09CC93A68C9C.JPG'] },
  { slug: 'purple-yellow-abstract', files: ['502DA4F6-203D-49F4-A821-87DE82BAEAFD.JPG'] },
  { slug: 'purple-orange-tiedye', files: ['06882F13-94D2-4F2B-897D-0977742AEA1D.JPG'] },
  { slug: 'ivory-pleated-beaded', files: ['53464DAB-C5A8-4CD5-B9DF-113A6E06DF65.JPG'] },
  { slug: 'sage-green-pleated', files: ['5FC36DA8-66E8-4F4A-8DC2-064CF4320CFA.JPG'] },
  { slug: 'orange-pink-floral', files: ['6341D299-A49C-49A0-82A5-322B41CB6C8C.JPG', '694EB947-CD18-41E8-9B90-4C09A0096047.JPG'] },
]

const SHOP_PHOTOS = [
  // exterior with VOL DOISEAU branding (replacing the old AI hero)
  { source: '477C6B10-7372-46DF-A05F-77C1E14237A9.JPG', target: 'hero-storefront.jpg', size: { w: 1920, h: 1080 } },
  // interior with mannequin / racks (for About / interior section)
  { source: '1CC93EB3-A4EA-41D4-8DC2-09DF3F712021.JPG', target: 'interior-1.jpg', size: { w: 1600, h: 1200 } },
  { source: '04246AAA-58D8-474D-A4B4-6F6BBB81502F.JPG', target: 'exterior-1.jpg', size: { w: 1600, h: 1200 } },
  { source: '54FCAD0A-9291-4727-AD88-DBFE4012ABF3.JPG', target: 'exterior-2.jpg', size: { w: 1600, h: 1200 } },
]

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

/**
 * Run the standard boutique "look-good" pipeline on one image.
 * - rotate() applies the EXIF orientation (so iPhone shots aren't sideways)
 * - resize() fits inside max box, keeping aspect ratio
 * - modulate() slight brightness/saturation bump for warmth
 * - sharpen() very gentle, just to crisp the edges after resize
 * - withMetadata() drops the EXIF tag we already applied so we don't double-rotate
 */
async function processImage(srcPath, outPath, maxW, maxH) {
  await sharp(srcPath)
    .rotate()
    .resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true })
    .modulate({ brightness: 1.04, saturation: 1.06 })
    .sharpen({ sigma: 0.6, m1: 0.3, m2: 0.5 })
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(outPath)
}

async function main() {
  await ensureDir(OUT_DRESSES)
  await ensureDir(OUT_SHOP)

  console.log('--- Dresses ---')
  for (const dress of DRESSES) {
    for (let i = 0; i < dress.files.length; i++) {
      const src = path.join(PHOTOS_ROOT, dress.files[i])
      const suffix = i === 0 ? '' : `-${i + 1}`
      const out = path.join(OUT_DRESSES, `${dress.slug}${suffix}.jpg`)
      try {
        await processImage(src, out, 1200, 1600)
        console.log(`✓ ${dress.slug}${suffix}.jpg`)
      } catch (err) {
        console.error(`✗ ${dress.slug}${suffix}.jpg -- ${err.message}`)
      }
    }
  }

  console.log('--- Shop ---')
  for (const shop of SHOP_PHOTOS) {
    const src = path.join(PHOTOS_ROOT, shop.source)
    const out = path.join(OUT_SHOP, shop.target)
    try {
      await processImage(src, out, shop.size.w, shop.size.h)
      console.log(`✓ shop/${shop.target}`)
    } catch (err) {
      console.error(`✗ shop/${shop.target} -- ${err.message}`)
    }
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
