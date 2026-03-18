import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tazravfmixapmyqhyljy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhenJhdmZtaXhhcG15cWh5bGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODczMTIsImV4cCI6MjA4OTM2MzMxMn0.ab9f-1iaRAjnPuEN5mcbFsBg5mclmhTKOTfmJ4uHclM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);