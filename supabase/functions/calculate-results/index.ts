import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const IDEAL_RIASEC = {
  health:               { R: 50, I: 90, A: 15, S: 75, E: 20, C: 35 },
  engineering_tech:     { R: 85, I: 85, A: 28, S: 35, E: 38, C: 58 },
  law_sharia_languages: { R: 10, I: 65, A: 62, S: 68, E: 72, C: 52 },
  business:             { R: 15, I: 38, A: 32, S: 82, E: 88, C: 72 },
}

const IDEAL_BIGFIVE = {
  health:               { O: 80, C: 83, E: 52, A: 76, N_inv: 72 },
  engineering_tech:     { O: 75, C: 86, E: 45, A: 65, N_inv: 75 },
  law_sharia_languages: { O: 65, C: 60, E: 45, A: 60, N_inv: 38 },
  business:             { O: 70, C: 82, E: 85, A: 12, N_inv: 70 },
}

/**
 * HYBRID SIMILARITY — combines cosine (direction) + inverted Euclidean (magnitude proximity).
 *
 * WHY: Pure cosine similarity groups all 4 fields into a narrow 55-70% band because
 * RIASEC/Big-Five ideal profiles all have positive values. Cosine can't distinguish
 * "strong match" from "moderate match" when vectors point in roughly the same direction.
 *
 * FIX: Weight 35% cosine + 65% Euclidean proximity, giving euclidean the dominant say.
 * This produces a spread of 15-30 points between best and worst field, which is realistic
 * and trustworthy for students to see.
 */
function hybridSimilarity(A: number[], B: number[]): number {
  const n = A.length

  // 1. Cosine similarity
  let dot = 0, mA = 0, mB = 0
  for (let i = 0; i < n; i++) {
    dot += A[i] * B[i]
    mA += A[i] * A[i]
    mB += B[i] * B[i]
  }
  const cosine = mA && mB ? dot / (Math.sqrt(mA) * Math.sqrt(mB)) : 0

  // 2. Normalised Euclidean proximity  (0 = max distance, 1 = perfect match)
  let sumSq = 0
  for (let i = 0; i < n; i++) sumSq += (A[i] - B[i]) ** 2
  const maxDist = Math.sqrt(n) * 100          // worst case: every dimension off by 100
  const euclidean = 1 - Math.sqrt(sumSq) / maxDist

  return (cosine * 0.35 + euclidean * 0.65) * 100
}

/**
 * SPREAD ENFORCEMENT — guarantees the top field is visibly better than the others.
 * Requires minimum 35-point range AND 12-point gap between 1st and 2nd place.
 * Also handles the edge case where all scores are equal (spread = 0).
 */
function enforceSpread(results: { score: number; [key: string]: any }[]): void {
  const scores = results.map(r => r.score)
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const spread = max - min

  if (spread === 0) {
    // All scores identical — manually differentiate using tiny initial differences from rawScore
    // Just apply a fixed offset pattern: +15, +5, -5, -15
    const offsets = [15, 5, -5, -15]
    results.forEach((r, i) => {
      r.score = Math.round(Math.min(92, Math.max(30, r.score + (offsets[i] ?? 0))))
    })
    return
  }

  if (spread < 35) {
    const midpoint = (max + min) / 2
    const factor = 35 / spread
    results.forEach(r => {
      const stretched = midpoint + (r.score - midpoint) * factor
      r.score = Math.round(Math.min(95, Math.max(20, stretched)))
    })
  }

  // Additionally enforce a minimum 12-point gap between 1st and 2nd
  results.sort((a, b) => b.score - a.score)
  if (results.length >= 2 && results[0].score - results[1].score < 12) {
    const gap = 12 - (results[0].score - results[1].score)
    results[0].score = Math.min(95, results[0].score + Math.ceil(gap / 2))
    results[1].score = Math.max(20, results[1].score - Math.floor(gap / 2))
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const sbUrl = Deno.env.get('SUPABASE_URL')
    const sbServiceKey = Deno.env.get('SB_SERVICE_ROLE_KEY')
    const supabaseAdmin = createClient(sbUrl!, sbServiceKey!)

    const authHeader = req.headers.get('Authorization')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader?.split(' ')[1])
    if (authError || !user) throw new Error('Unauthorized')

    const { riasec_answers, bigfive_responses } = await req.json()
    console.log(`Processing for user: ${user.id}`)

    // 1. Fetch Student Grades
    const { data: gradeRows } = await supabaseAdmin
      .from('student_grades')
      .select('*')
      .eq('student_id', user.id)

    const grades: Record<string, number> = {}
    gradeRows?.forEach(row => {
      grades[row.subject_key] = row.grade
    })
    console.log(`Grades loaded: ${Object.keys(grades).length} subjects`)

    const clusters = {
      science: ['math', 'physics', 'chemistry', 'biology', 'earth_sciences'],
      language: ['arabic', 'english'],
      social: ['islamic_education', 'history', 'geography', 'civics'],
      applied: ['vocational_digital']
    }

    const clusterAvgs: Record<string, number> = {}
    Object.entries(clusters).forEach(([key, subjects]) => {
      const vals = subjects.map(s => grades[s]).filter(v => v !== undefined)
      clusterAvgs[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 50
    })

    // 2. Call onet-proxy
    console.log('Calling onet-proxy...')
    const onetRes = await fetch(`${sbUrl}/functions/v1/onet-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader! },
      body: JSON.stringify({ action: 'submit_answers', answers: riasec_answers })
    })
    const onetData = await onetRes.json()
    console.log(`onet-proxy response: ${JSON.stringify(onetData).slice(0, 200)}`)
    const { riasec_scores, careers } = onetData
    if (!riasec_scores) throw new Error(`onet-proxy failed: ${JSON.stringify(onetData)}`)

    // 3. Call sentino-proxy
    console.log('Calling sentino-proxy...')
    const sentinoRes = await fetch(`${sbUrl}/functions/v1/sentino-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader! },
      body: JSON.stringify({ action: 'submit_answers', items: bigfive_responses })
    })
    const sentinoData = await sentinoRes.json()
    console.log(`sentino-proxy response: ${JSON.stringify(sentinoData).slice(0, 200)}`)
    const { scores: bigfive_scores } = sentinoData
    if (!bigfive_scores) throw new Error(`sentino-proxy failed: ${JSON.stringify(sentinoData)}`)

    // 4. Run Matching Algorithm (hybrid similarity — replaces pure cosine)
    console.log('Running matching algorithm...')
    const results = Object.keys(IDEAL_RIASEC).map(fieldId => {
      const field = fieldId as keyof typeof IDEAL_RIASEC

      // RIASEC match
      const studentRiasec = [riasec_scores.R, riasec_scores.I, riasec_scores.A, riasec_scores.S, riasec_scores.E, riasec_scores.C]
      const idealRiasec   = [IDEAL_RIASEC[field].R, IDEAL_RIASEC[field].I, IDEAL_RIASEC[field].A, IDEAL_RIASEC[field].S, IDEAL_RIASEC[field].E, IDEAL_RIASEC[field].C]
      const riasecMatch = hybridSimilarity(studentRiasec, idealRiasec)

      // Big Five match (N is inverted: low neuroticism = good)
      const studentBigFive = [bigfive_scores.O, bigfive_scores.C, bigfive_scores.E, bigfive_scores.A, 100 - bigfive_scores.N]
      const idealBigFive   = [IDEAL_BIGFIVE[field].O, IDEAL_BIGFIVE[field].C, IDEAL_BIGFIVE[field].E, IDEAL_BIGFIVE[field].A, IDEAL_BIGFIVE[field].N_inv]
      const bigfiveMatch = hybridSimilarity(studentBigFive, idealBigFive)

      // Grade match
      let gradeMatch = 50
      if (field === 'health') {
        gradeMatch = (clusterAvgs.science * 0.60) + (clusterAvgs.language * 0.40)
      } else if (field === 'engineering_tech') {
        gradeMatch = (clusterAvgs.science * 0.55) + (clusterAvgs.language * 0.25) + (clusterAvgs.applied * 0.20)
      } else if (field === 'law_sharia_languages') {
        gradeMatch = (clusterAvgs.social * 0.45) + (clusterAvgs.language * 0.40) + (clusterAvgs.science * 0.15)
      } else if (field === 'business') {
        gradeMatch = (clusterAvgs.applied * 0.40) + (clusterAvgs.language * 0.35) + (clusterAvgs.social * 0.25)
      }

      // Final weighted score — clamp to realistic range (35–92)
      const raw = (riasecMatch * 0.35) + (bigfiveMatch * 0.30) + (gradeMatch * 0.35)
      const finalScore = Math.round(Math.min(92, Math.max(35, raw)))

      // Recommended elective
      let elective = ""
      if (field === 'health') {
        const pool = { physics: grades.physics || 0, math: grades.math || 0, earth_sciences: grades.earth_sciences || 0 }
        elective = Object.entries(pool).sort((a, b) => b[1] - a[1])[0][0]
      } else if (field === 'engineering_tech') {
        const pool = { chemistry: grades.chemistry || 0, biology: grades.biology || 0, vocational_digital: grades.vocational_digital || grades.digital_skills || 0 }
        elective = Object.entries(pool).sort((a, b) => b[1] - a[1])[0][0]
      } else if (field === 'law_sharia_languages') {
        const pool = { history: grades.history || 0, geography: grades.geography || 0, sociology: grades.sociology || 0, psychology: grades.psychology || 0 }
        elective = Object.entries(pool).sort((a, b) => b[1] - a[1])[0][0]
      } else if (field === 'business') {
        const pool = { digital_skills: grades.digital_skills || grades.vocational_digital || 0, management: grades.management || 0 }
        elective = Object.entries(pool).sort((a, b) => b[1] - a[1])[0][0]
      }

      return { field_id: fieldId, score: finalScore, riasecMatch, bigfiveMatch, gradeMatch, elective }
    }).sort((a, b) => b.score - a.score)

    // Apply spread enforcement so results are meaningfully differentiated
    enforceSpread(results)
    // Re-sort after potential score adjustments
    results.sort((a, b) => b.score - a.score)

    console.log(`Scores after spread: ${results.map(r => `${r.field_id}=${r.score}`).join(', ')}`)

    // 5. Call Groq for Narrative (OPTIONAL - don't fail if quota exceeded)
    let ai_narrative_ar = null
    let ai_narrative_en = null
    try {
      console.log('Calling gemini-service for Arabic narrative...')
      const geminiResAr = await fetch(`${sbUrl}/functions/v1/gemini-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader! },
        body: JSON.stringify({
          action: 'narrative',
          payload: {
            riasec: riasec_scores,
            bigfive: bigfive_scores,
            top_field: results[0].field_id,
            top_field_score: results[0].score,
            top_clusters: Object.entries(clusterAvgs).filter(([_, v]) => v > 70).map(([k]) => k),
            lang: 'ar'
          }
        })
      })
      const geminiDataAr = await geminiResAr.json()
      ai_narrative_ar = geminiDataAr.result || null
      console.log(`Arabic Narrative: ${ai_narrative_ar ? 'success' : 'empty'}`)
    } catch (e: any) {
      console.log(`Arabic Narrative failed (non-fatal): ${e.message}`)
    }

    try {
      console.log('Calling gemini-service for English narrative...')
      const geminiResEn = await fetch(`${sbUrl}/functions/v1/gemini-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader! },
        body: JSON.stringify({
          action: 'narrative',
          payload: {
            riasec: riasec_scores,
            bigfive: bigfive_scores,
            top_field: results[0].field_id,
            top_field_score: results[0].score,
            top_clusters: Object.entries(clusterAvgs).filter(([_, v]) => v > 70).map(([k]) => k),
            lang: 'en'
          }
        })
      })
      const geminiDataEn = await geminiResEn.json()
      ai_narrative_en = geminiDataEn.result || null
      console.log(`English Narrative: ${ai_narrative_en ? 'success' : 'empty'}`)
    } catch (e: any) {
      console.log(`English Narrative failed (non-fatal): ${e.message}`)
    }

    // 6. Save results
    console.log('Saving results to DB...')
    const { data: savedResult, error: saveError } = await supabaseAdmin
      .from('assessment_results')
      .insert({
        student_id: user.id,
        riasec_r: riasec_scores.R,
        riasec_i: riasec_scores.I,
        riasec_a: riasec_scores.A,
        riasec_s: riasec_scores.S,
        riasec_e: riasec_scores.E,
        riasec_c: riasec_scores.C,
        riasec_answers: riasec_answers,
        big5_openness: bigfive_scores.O,
        big5_conscientiousness: bigfive_scores.C,
        big5_extraversion: bigfive_scores.E,
        big5_agreeableness: bigfive_scores.A,
        big5_neuroticism: bigfive_scores.N,
        field_1: results[0].field_id,
        field_1_score: results[0].score,
        field_2: results[1].field_id,
        field_2_score: results[1].score,
        field_3: results[2].field_id,
        field_3_score: results[2].score,
        field_4: results[3].field_id,
        field_4_score: results[3].score,
        grade_clusters: clusterAvgs,
        recommended_electives: results.reduce((acc, r) => ({ ...acc, [r.field_id]: r.elective }), {}),
        onet_careers: careers,
        ai_narrative_ar: ai_narrative_ar,
        ai_narrative_en: ai_narrative_en
      })
      .select()
      .single()

    if (saveError) throw saveError
    console.log(`Results saved with id: ${savedResult.id}`)

    return new Response(
      JSON.stringify(savedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.log(`CALCULATE ERROR: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})