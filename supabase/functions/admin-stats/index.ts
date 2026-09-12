import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })

  return new Response(JSON.stringify({ 
    total: users.length,
    users: users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.full_name || u.user_metadata?.name || 'مجهول',
      created_at: u.created_at,
      last_sign_in: u.last_sign_in_at
    }))
  }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
