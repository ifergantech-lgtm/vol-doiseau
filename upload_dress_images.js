const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wtmbnnicvtkcmhiqmjsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bWJubmljdnRrY21oaXFtanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDQxODcsImV4cCI6MjA5NDYyMDE4N30.FoxSoXz6dR1NgRvgqBKOsnFpJHhinMx06x_c8Hw2MLI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read generated URLs
const urlsPath = path.join(__dirname, 'generated_urls.json');
const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));

console.log(`Found ${urls.length} URLs to process`);
console.log('Note: We will process the first 26 (dresses 1-26 + wedding dress 1)');

const dressUrls = urls.slice(0, 27); // First 26 dresses + wedding dress 1

async function downloadImage(rawUrl) {
  return new Promise((resolve, reject) => {
    https.get(rawUrl, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    }).on('error', reject);
  });
}

async function uploadAndUpdate() {
  console.log(`\nStarting upload process for ${dressUrls.length} images...`);

  for (let i = 0; i < dressUrls.length; i++) {
    const urlObj = dressUrls[i];
    const dressId = i + 1; // IDs: 1, 2, 3, ...26, 27 (wedding dress 1)
    const isWeddingDress = dressId > 26;
    const fileName = isWeddingDress ? `wedding_1.jpg` : `dress_${dressId}.jpg`;
    const storagePath = `dresses/${fileName}`;

    try {
      console.log(`\n[${i + 1}/${dressUrls.length}] Processing ID ${dressId} (${fileName})`);

      // Download image
      console.log('  → Downloading from Higgsfield...');
      const imageBuffer = await downloadImage(urlObj.rawUrl);
      console.log(`    Downloaded ${imageBuffer.length} bytes`);

      // Upload to Supabase
      console.log('  → Uploading to Supabase storage...');
      const { data, error: uploadError } = await supabase.storage
        .from('dresses')
        .upload(storagePath, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error(`    ERROR: ${uploadError.message}`);
        continue;
      }

      console.log(`    Uploaded to: ${storagePath}`);

      // Get signed URL (1-week expiration)
      const { data: signedUrlData, error: signedError } = await supabase.storage
        .from('dresses')
        .createSignedUrl(storagePath, 7 * 24 * 60 * 60); // 1 week

      if (signedError) {
        console.error(`    ERROR getting signed URL: ${signedError.message}`);
        continue;
      }

      const signedUrl = signedUrlData.signedUrl;
      console.log('    Signed URL generated');

      // Update database
      console.log(`  → Updating database for ID ${dressId}...`);

      // Get current record
      const { data: existingRecord, error: fetchError } = await supabase
        .from('dresses')
        .select('*')
        .eq('id', dressId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
        console.error(`    ERROR fetching record: ${fetchError.message}`);
        continue;
      }

      // Prepare images array
      let imagesArray = [];
      if (existingRecord && existingRecord.images) {
        imagesArray = Array.isArray(existingRecord.images) ? existingRecord.images : [];
      }

      // Add or replace image in array
      const imageEntry = { url: signedUrl, uploadedAt: new Date().toISOString() };
      imagesArray = [imageEntry]; // Replace with single image

      // Update record
      const { error: updateError } = await supabase
        .from('dresses')
        .upsert({
          id: dressId,
          title: isWeddingDress ? `Wedding Dress 1` : `Dress ${dressId}`,
          slug: isWeddingDress ? `wedding-dress-1` : `dress-${dressId}`,
          category: isWeddingDress ? 'wedding' : 'evening',
          description: '',
          availability: 'sale',
          price_sale: 0,
          price_rental: 0,
          images: imagesArray,
          is_featured: false,
          is_active: true,
        }, {
          onConflict: 'id',
        });

      if (updateError) {
        console.error(`    ERROR updating DB: ${updateError.message}`);
        continue;
      }

      console.log(`    ✓ Database updated with image URL`);
    } catch (err) {
      console.error(`  ERROR processing ${fileName}: ${err.message}`);
    }

    // Rate limiting - Supabase has request limits
    if (i < dressUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms between requests
    }
  }

  console.log(`\n✓ Upload process complete!`);
}

uploadAndUpdate().catch(console.error);
