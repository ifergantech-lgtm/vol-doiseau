const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wtmbnnicvtkcmhiqmjsn.supabase.co';
// Using service role key for admin operations (from env if available)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

async function listBuckets() {
  try {
    console.log('Listing storage buckets...\n');

    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('Error:', error.message);
      console.log('\nNote: Listing buckets requires SUPABASE_SERVICE_ROLE_KEY');
      return;
    }

    if (data && data.length > 0) {
      data.forEach(bucket => {
        console.log(`- ${bucket.name} (public: ${bucket.public})`);
      });
    } else {
      console.log('No buckets found');
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

listBuckets();
