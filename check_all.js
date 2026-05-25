const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wtmbnnicvtkcmhiqmjsn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bWJubmljdnRrY21oaXFtanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDQxODcsImV4cCI6MjA5NDYyMDE4N30.FoxSoXz6dR1NgRvgqBKOsnFpJHhinMx06x_c8Hw2MLI'
);

async function checkDresses() {
  const { data, error } = await supabase
    .from('dresses')
    .select('id, slug, title')
    .order('created_at', { ascending: true })
    .limit(50);
  
  if (error) {
    console.error('Error:', error);
  } else {
    data.forEach((d, i) => {
      console.log(`${i+1}. ${d.slug}`);
    });
  }
}

checkDresses();
