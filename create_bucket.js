const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wtmbnnicvtkcmhiqmjsn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bWJubmljdnRrY21oaXFtanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDQxODcsImV4cCI6MjA5NDYyMDE4N30.FoxSoXz6dR1NgRvgqBKOsnFpJHhinMx06x_c8Hw2MLI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createBucket() {
  try {
    console.log('Creating "dresses" bucket...');

    // For public bucket without authentication
    const { data, error } = await supabase.storage.createBucket('dresses', {
      public: false,
      allowedMimeTypes: ['image/jpeg', 'image/png'],
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✓ Bucket "dresses" already exists');
      } else {
        console.error(`Error: ${error.message}`);
      }
    } else {
      console.log('✓ Bucket "dresses" created successfully');
    }
  } catch (err) {
    console.error(`Exception: ${err.message}`);
  }
}

createBucket();
