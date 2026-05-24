import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shzonnkkojnetihaabwa.supabase.co';
const supabaseKey = 'sb_publishable_bixdXWJ_v5ytVpdLJ2BIxw_VwaJuEDR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = [
    'profiles', 'students', 'users', 'placement', 
    'student_placement_profile', 'student_profiles', 
    'student_readiness', 'analytics_profiles', 'resume_profiles'
  ];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`Table '${table}' exists!`, data);
    } else {
      console.log(`Table '${table}' query error:`, error.message);
    }
  }
}

checkTables();
