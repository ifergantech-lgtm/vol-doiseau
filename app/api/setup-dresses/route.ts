import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function downloadImage(rawUrl: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(rawUrl, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    }).on('error', reject);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if service role key is configured
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: 'SUPABASE_SERVICE_ROLE_KEY not configured in environment',
          instructions: 'Add SUPABASE_SERVICE_ROLE_KEY to your .env.local file',
        },
        { status: 400 }
      );
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create anon client for signed URLs
    const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('Step 1: Creating "dresses" bucket...');

    // Create bucket
    const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.createBucket(
      'dresses',
      {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      }
    );

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw new Error(`Bucket creation failed: ${bucketError.message}`);
    }

    console.log('✓ Bucket "dresses" ready');

    // Get URLs from request body
    const { urls } = await request.json();

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const dressUrls = urls.slice(0, 27); // First 26 dresses + wedding dress 1
    const results: any[] = [];

    console.log(`\nStep 2: Uploading ${dressUrls.length} images...`);

    for (let i = 0; i < dressUrls.length; i++) {
      const urlObj = dressUrls[i];
      const dressId = i + 1;
      const isWeddingDress = dressId > 26;
      const fileName = isWeddingDress ? `wedding_1.jpg` : `dress_${dressId}.jpg`;
      const storagePath = `dresses/${fileName}`;

      try {
        console.log(`\n[${i + 1}/${dressUrls.length}] Processing ID ${dressId}`);

        // Download image
        console.log('  → Downloading from Higgsfield...');
        const imageBuffer = await downloadImage(urlObj.rawUrl);
        console.log(`    Downloaded ${imageBuffer.length} bytes`);

        // Upload to Supabase using admin client
        console.log('  → Uploading to Supabase...');
        const { error: uploadError } = await supabaseAdmin.storage
          .from('dresses')
          .upload(storagePath, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        console.log(`    Uploaded to: ${storagePath}`);

        // Get signed URL using admin client (service role has permission)
        console.log('  → Generating signed URL...');
        const { data: signedUrlData, error: signedError } = await supabaseAdmin.storage
          .from('dresses')
          .createSignedUrl(storagePath, 7 * 24 * 60 * 60); // 1 week

        if (signedError) {
          throw new Error(`Signed URL failed: ${signedError.message}`);
        }

        const signedUrl = signedUrlData.signedUrl;

        // Update database
        console.log(`  → Updating database ID ${dressId}...`);

        // Generate a UUID for this dress (deterministic based on dress number)
        const dressUuid = uuidv4();

        const { error: upsertError } = await supabaseAdmin
          .from('dresses')
          .insert({
            id: dressUuid,
            title: isWeddingDress ? `Wedding Dress 1` : `Dress ${dressId}`,
            slug: isWeddingDress ? `wedding-dress-1` : `dress-${dressId}`,
            category: isWeddingDress ? 'wedding' : 'evening',
            description: '',
            availability: 'sale',
            price_sale: 0,
            price_rental: 0,
            images: [signedUrl],
            is_featured: false,
            is_active: true,
          });

        if (upsertError) {
          throw new Error(`Database update failed: ${upsertError.message}`);
        }

        console.log(`    ✓ Complete`);

        results.push({
          id: dressId,
          fileName,
          status: 'success',
          imageUrl: signedUrl,
        });
      } catch (err: any) {
        console.error(`  ✗ ERROR: ${err.message}`);
        results.push({
          id: dressId,
          fileName,
          status: 'error',
          error: err.message,
        });
      }

      // Rate limiting
      if (i < dressUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`\n✓ Process complete!`);
    console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
    console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);

    return NextResponse.json({
      success: true,
      totalProcessed: results.length,
      results,
    });
  } catch (err: any) {
    console.error('Fatal error:', err.message);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
