import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvbysksipxlvicnanqvu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Ynlza3NpcHhsdmljbmFucXZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzU1NzYwNywiZXhwIjoyMTAzMTMzNjA3fQ.B7WGA1hdJTQzXAUV5NUWFQvuTSx23su__4Ot0fMKBa0'

export const supabase = createClient(supabaseUrl, supabaseKey)