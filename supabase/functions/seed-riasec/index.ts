import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-seed-secret',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const seedSecret = req.headers.get('x-seed-secret')
    if (seedSecret !== Deno.env.get('SEED_SECRET')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const sbUrl = Deno.env.get('SUPABASE_URL')
    const sbServiceKey = Deno.env.get('SB_SERVICE_ROLE_KEY')
    const supabaseAdmin = createClient(sbUrl!, sbServiceKey!)

    const { count } = await supabaseAdmin
      .from('riasec_translations')
      .select('*', { count: 'exact', head: true })

    console.log(`Current row count: ${count}`)

    if (count === 30) {
      return new Response(JSON.stringify({ seeded: 30, message: 'Already seeded' }), { headers: corsHeaders })
    }

    const onetRes = await fetch(
      "https://api-v2.onetcenter.org/mnm/interestprofiler/questions_30?start=1&end=30",
      {
        headers: {
          "X-API-Key": Deno.env.get("ONET_API_KEY")!,
          "Accept": "application/json",
        },
      }
    )

    const onetBody = await onetRes.text()
    console.log(`O*NET status: ${onetRes.status}`)

    if (!onetRes.ok) {
      throw new Error(`O*NET failed: ${onetRes.status} — ${onetBody.slice(0, 200)}`)
    }

    const data = JSON.parse(onetBody)
    const allQuestions = data.question
    console.log(`Got ${allQuestions?.length} questions from O*NET`)

    const geminiRes = await fetch(`${sbUrl}/functions/v1/gemini-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sbServiceKey}`
      },
      body: JSON.stringify({
        action: 'translate_riasec',
        payload: {
          items: allQuestions.map((q: any) => ({ index: q.index, text: q.text }))
        }
      })
    })

    const geminiJson = await geminiRes.json()
    console.log(`Gemini status: ${geminiRes.status}`)
    console.log(`Gemini response: ${JSON.stringify(geminiJson).slice(0, 300)}`)
    const translations = geminiJson.result || []

    const finalData = allQuestions.map((q: any) => {
      const trans = translations.find((t: any) => t.index === q.index)
      return {
        onet_index: q.index,
        area: q.area,
        text_en: q.text,
        text_ar: trans?.text_ar || q.text
      }
    })

    const { error: insertError } = await supabaseAdmin
      .from('riasec_translations')
      .upsert(finalData)

    if (insertError) throw insertError

    return new Response(JSON.stringify({ seeded: finalData.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.log(`CAUGHT ERROR: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})