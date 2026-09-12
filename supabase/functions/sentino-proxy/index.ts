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
    if (Array.isArray(parsed)) return parsed
    if (parsed.translations && Array.isArray(parsed.translations)) return parsed.translations
    if (parsed.result && Array.isArray(parsed.result)) return parsed.result
    if (parsed.items && Array.isArray(parsed.items)) return parsed.items
    for (const val of Object.values(parsed)) {
      if (Array.isArray(val)) return val as any[]
    }
    return []
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (match) {
      try { return JSON.parse(match[0]) } catch { return [] }
    }
    return []
  }
}

const CHUNK_SIZE = 10

async function translateBigfiveToArabic(
  items: string[],
  groqKey: string
): Promise<any[]> {
  const indexedItems = items.map((t, i) => ({ index: i, text: t }))
  const allTranslations: any[] = []

  for (let start = 0; start < indexedItems.length; start += CHUNK_SIZE) {
    const chunk = indexedItems.slice(start, start + CHUNK_SIZE)
    console.log(`translate_bf: chunk ${start}-${start + chunk.length - 1} of ${indexedItems.length}`)
    try {
      const textsOnly = chunk.map(item => `${item.index}. ${item.text}`).join('\n')
      const raw = await callGroqTranslation(
        [
          {
            role: 'system',
            content: `You are a translator. You MUST translate English text to Arabic (العربية).
Return a JSON object with a "translations" array.
Each item has "index" (number) and "text_ar" (the Arabic translation).
Keep first-person perspective.

Example input: 0. I am the life of the party
Example output: {"translations": [{"index": 0, "text_ar": "أنا روح الحفلة"}]}

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
      
      const hasArabic = parsed.some((t: any) => t.text_ar && /[\u0600-\u06FF]/.test(t.text_ar))
      if (hasArabic) {
        allTranslations.push(...parsed)
        console.log(`Chunk OK: ${parsed.length} items with Arabic`)
      } else {
        console.error(`Chunk returned non-Arabic, falling back`)
        chunk.forEach((item) => allTranslations.push({ index: item.index, text_ar: item.text }))
      }
    } catch (chunkErr: any) {
      console.error(`translate_bf chunk failed: ${chunkErr.message}`)
      chunk.forEach((item) => allTranslations.push({ index: item.index, text_ar: item.text }))
    }
  }

  console.log(`translate_bf: total = ${allTranslations.length}`)
  return allTranslations
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log(`Action received: ${body.action}`)

    const { action, items, questionnaire_id } = body
    const token = Deno.env.get('SENTINO_API_TOKEN')
    const groqKey = Deno.env.get('GROQ_API_KEY')

    if (!token) throw new Error('Sentino API token not configured')

    const sentinoHeaders = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (action === 'get_questions') {
      const response = await fetch('https://api.sentino.org/api/questionnaire/create', {
        method: 'POST',
        headers: sentinoHeaders,
        body: JSON.stringify({
          inventories: ['big5'],
          n_per_index: 4,
          name: 'assessment'
        })
      })

      const responseText = await response.text()
      console.log(`Sentino status: ${response.status}`)

      if (!response.ok) {
        throw new Error(`Sentino failed: ${response.status} - ${responseText.slice(0, 200)}`)
      }

      const data = JSON.parse(responseText)
      const qId = data.id || data.questionnaire_id || (data.questionnaire && data.questionnaire.id)
      const questionItems: any[] = data.items || data.questions || (data.questionnaire && data.questionnaire.items) || []
      console.log(`Got ${questionItems.length} Big Five questions`)

      if (groqKey) {
        try {
          const texts = questionItems.map((q: any) => q.item || q.text || '')
          const translations = await translateBigfiveToArabic(texts, groqKey)
          console.log(`Got ${translations.length} Big Five translations`)

          const translatedItems = questionItems.map((q: any, i: number) => {
            const t = translations.find((tr: any) => tr.index === i)
            const englishText = typeof q === 'string' ? q : (q.item || q.text || '')
            const arabicText = (t?.text_ar && t.text_ar.trim() !== '' && /[\u0600-\u06FF]/.test(t.text_ar)) ? t.text_ar : englishText
            return { item: englishText, text: englishText, text_ar: arabicText }
          })

          return new Response(JSON.stringify({ ...data, items: translatedItems, questionnaire_id: qId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } catch (translateErr: any) {
          console.error(`Translation failed: ${translateErr.message}`)
        }
      }

      return new Response(JSON.stringify({ ...data, questionnaire_id: qId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'submit_answers') {
      if (!items || !Array.isArray(items)) {
        throw new Error('Items array required for scoring')
      }

      console.log(`Sending ${items.length} items to Sentino for scoring`)

      const response = await fetch('https://api.sentino.org/api/score/items', {
        method: 'POST',
        headers: sentinoHeaders,
        body: JSON.stringify({
          questionnaire_id,
          inventories: ['big5'],
          items: items.map((i: any) => ({ item: i.text, response: i.response }))
        })
      })

      const responseText = await response.text()
      if (!response.ok) {
        throw new Error(`Sentino scoring failed: ${response.status} - ${responseText.slice(0, 200)}`)
      }

      const data = JSON.parse(responseText)
      if (!data.scoring || !data.scoring.big5) {
        throw new Error(`Invalid Sentino response: ${JSON.stringify(data).slice(0, 200)}`)
      }

      const big5 = data.scoring.big5
      const scores = {
        O: Math.round((big5.openness?.quantile || 0) * 100),
        C: Math.round((big5.conscientiousness?.quantile || 0) * 100),
        E: Math.round((big5.extraversion?.quantile || 0) * 100),
        A: Math.round((big5.agreeableness?.quantile || 0) * 100),
        N: Math.round((big5.neuroticism?.quantile || 0) * 100)
      }

      console.log(`Big Five scores: ${JSON.stringify(scores)}`)
      return new Response(JSON.stringify({ scores }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')

  } catch (error: any) {
    console.log(`SENTINO ERROR: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})