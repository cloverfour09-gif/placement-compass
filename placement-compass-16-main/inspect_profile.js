const supabaseUrl = 'https://shzonnkkojnetihaabwa.supabase.co';
const supabaseKey = 'sb_publishable_bixdXWJ_v5ytVpdLJ2BIxw_VwaJuEDR';

async function run() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey
      }
    });
    const schema = await res.json();
    console.log('Raw Schema:', JSON.stringify(schema, null, 2));
  } catch (err) {
    console.error('Error fetching OpenAPI schema:', err);
  }
}

run();
