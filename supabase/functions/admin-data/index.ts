import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const { action } = await req.json()

  // Use SERVICE ROLE key — bypasses RLS completely
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (action === 'get_stats') {
    const [
      { count: totalTests },
      { data: allResults },
      { data: { users } }
    ] = await Promise.all([
      supabase.from('assessment_results').select('*', { count: 'exact', head: true }),
      supabase.from('assessment_results').select('field_1, field_1_score, created_at, student_id'),
      supabase.auth.admin.listUsers()
    ])

    // Field distribution counting
    const fieldCounts: Record<string, number> = {}
    allResults?.forEach((r) => {
      if (r.field_1) fieldCounts[r.field_1] = (fieldCounts[r.field_1] || 0) + 1
    })

    // Average score
    const avgScore = allResults?.length
      ? Math.round(allResults.reduce((s, r) => s + (r.field_1_score || 0), 0) / allResults.length)
      : 0

    // Today's tests count
    const today = new Date().toISOString().split('T')[0]
    const todayTests = allResults?.filter(r => r.created_at?.startsWith(today)).length || 0

    // User assessment counts mapping
    const userAssessmentCounts: Record<string, number> = {}
    allResults?.forEach((r) => {
      if (r.student_id) {
        userAssessmentCounts[r.student_id] = (userAssessmentCounts[r.student_id] || 0) + 1
      }
    })

    // Daily timeline grouping and sorting
    const dayCounts: Record<string, { rawDate: Date; dateStr: string; count: number }> = {}
    allResults?.forEach((r) => {
      if (r.created_at) {
        const date = new Date(r.created_at)
        const rDateStr = date.toISOString().split('T')[0]
        const dayStr = date.toLocaleDateString('ar-JO', { month: 'numeric', day: 'numeric' })
        if (!dayCounts[rDateStr]) {
          dayCounts[rDateStr] = { rawDate: date, dateStr: dayStr, count: 0 }
        }
        dayCounts[rDateStr].count += 1
      }
    })
    const dailyTests = Object.entries(dayCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, v]) => ({
        name: v.dateStr,
        count: v.count,
      }))

    return new Response(JSON.stringify({
      totalUsers: users.length,
      totalTests: totalTests || 0,
      avgScore,
      todayTests,
      fieldCounts,
      dailyTests,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'مجهول',
        created_at: u.created_at,
        tests_count: userAssessmentCounts[u.id] || 0,
      }))
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (action === 'get_recent') {
    const { data } = await supabase
      .from('assessment_results')
      .select('id, created_at, field_1, field_1_score, student_id')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get names separately
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const userMap = Object.fromEntries(users.map(u => [u.id, u.user_metadata?.full_name || u.email]))

    return new Response(JSON.stringify({
      rows: data?.map(r => ({ ...r, full_name: userMap[r.student_id] || 'مجهول' }))
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
