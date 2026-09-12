const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Groq translation helpers ──

async function callGroqTranslation(
  messages: { role: string; content: string }[],
  groqKey: string,
  maxTokens = 2048
): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Groq: ${data.error.message}`)
  return data.choices[0].message.content
}

function safeParseTranslations(raw: string): any[] {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  try {
    const parsed = JSON.parse(cleaned)
    // Could be { translations: [...] } or just [...]
    if (Array.isArray(parsed)) return parsed
    if (parsed.translations && Array.isArray(parsed.translations)) return parsed.translations
    if (parsed.result && Array.isArray(parsed.result)) return parsed.result
    if (parsed.items && Array.isArray(parsed.items)) return parsed.items
    // Try to find first array value in the object
    for (const val of Object.values(parsed)) {
      if (Array.isArray(val)) return val as any[]
    }
    return []
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return []
      }
    }
    return []
  }
}

const CHUNK_SIZE = 10

async function translateItemsToArabic(
  items: { index: number; text: string }[],
  groqKey: string
): Promise<any[]> {
  const allTranslations: any[] = []

  for (let start = 0; start < items.length; start += CHUNK_SIZE) {
    const chunk = items.slice(start, start + CHUNK_SIZE)
    console.log(`translate: chunk ${start}-${start + chunk.length - 1} of ${items.length}`)
    try {
      const textsOnly = chunk.map(item => `${item.index}. ${item.text}`).join('\n')
      const raw = await callGroqTranslation(
        [
          {
            role: 'system',
            content: `You are a translator. You MUST translate English text to Arabic (العربية).
Return a JSON object with a "translations" array.
Each item has "index" (number) and "text_ar" (the Arabic translation).

Example input: 1. Build kitchen cabinets
Example output: {"translations": [{"index": 1, "text_ar": "بناء خزائن المطبخ"}]}

IMPORTANT: text_ar MUST contain Arabic text, NOT English.`,
          },
          {
            role: 'user',
            content: `Translate ALL of the following English sentences to Arabic (العربية). Return JSON with "translations" array:\n\n${textsOnly}`,
          },
        ],
        groqKey
      )
      console.log(`Groq response: ${raw.slice(0, 400)}`)
      const parsed = safeParseTranslations(raw)
      
      // Verify we got actual Arabic - check if text_ar contains Arabic characters
      const hasArabic = parsed.some((t: any) => t.text_ar && /[\u0600-\u06FF]/.test(t.text_ar))
      if (hasArabic) {
        allTranslations.push(...parsed)
        console.log(`Chunk translated successfully: ${parsed.length} items with Arabic text`)
      } else {
        console.error(`Chunk returned non-Arabic text, falling back`)
        chunk.forEach((item) => allTranslations.push({ index: item.index, text_ar: item.text }))
      }
    } catch (chunkErr: any) {
      console.error(`translate chunk failed: ${chunkErr.message}`)
      chunk.forEach((item) => allTranslations.push({ index: item.index, text_ar: item.text }))
    }
  }

  console.log(`translate: total = ${allTranslations.length}`)
  return allTranslations
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, answers } = await req.json()
    const apiKey = Deno.env.get('ONET_API_KEY')
    const groqKey = Deno.env.get('GROQ_API_KEY')

    if (!apiKey) throw new Error('O*NET API Key not configured')

    const onetHeaders = {
      'X-API-Key': apiKey,
      'Accept': 'application/json'
    }

    if (action === 'get_questions') {
      const res = await fetch(
        'https://api-v2.onetcenter.org/mnm/interestprofiler/questions_30?start=1&end=30',
        { headers: onetHeaders }
      )
      const data = await res.json()
      const questions: any[] = data.question || []
      console.log(`Fetched ${questions.length} RIASEC questions from O*NET`)

      if (groqKey) {
        try {
          const items = questions.map((q: any) => ({ index: q.index, text: q.text }))
          const translations = await translateItemsToArabic(items, groqKey)
          console.log(`Got ${translations.length} RIASEC translations`)

          const translatedQuestions = questions.map((q: any) => {
            const t = translations.find((tr: any) => tr.index === q.index)
            return { ...q, text_ar: t?.text_ar || q.text }
          })

          return new Response(
            JSON.stringify({ questions: translatedQuestions }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (translateErr: any) {
          console.error(`Translation failed: ${translateErr.message}`)
        }
      } else {
        console.error('GROQ_API_KEY not set')
      }

      return new Response(
        JSON.stringify({ questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'submit_answers') {
      if (!answers || answers.length !== 30) {
        throw new Error('Invalid answers string. Must be exactly 30 digits.')
      }

      console.log(`Submitting answers: ${answers}`)

      const resultsRes = await fetch(
        `https://api-v2.onetcenter.org/mnm/interestprofiler/results?answers=${answers}`,
        { headers: onetHeaders }
      )
      const resultsBody = await resultsRes.text()
      if (!resultsRes.ok) {
        throw new Error(`O*NET results failed: ${resultsRes.status} - ${resultsBody.slice(0, 200)}`)
      }

      const resultsData = JSON.parse(resultsBody)
      const careersUrl = resultsData.careers
      const urlParams = new URL(careersUrl).searchParams

      const riasec_scores: Record<string, number> = {
        R: Math.min(100, Math.round((parseInt(urlParams.get('realistic') || '0') / 20) * 100)),
        I: Math.min(100, Math.round((parseInt(urlParams.get('investigative') || '0') / 20) * 100)),
        A: Math.min(100, Math.round((parseInt(urlParams.get('artistic') || '0') / 20) * 100)),
        S: Math.min(100, Math.round((parseInt(urlParams.get('social') || '0') / 20) * 100)),
        E: Math.min(100, Math.round((parseInt(urlParams.get('enterprising') || '0') / 20) * 100)),
        C: Math.min(100, Math.round((parseInt(urlParams.get('conventional') || '0') / 20) * 100)),
      }

      const careersRes = await fetch(careersUrl, { headers: onetHeaders })
      const careersData = await careersRes.json()
      console.log(`RIASEC scores: ${JSON.stringify(riasec_scores)}`)

      return new Response(
        JSON.stringify({ riasec_scores, careers: careersData.career || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

  } catch (error: any) {
    console.log(`ERROR: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})