import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Algorithmic fallback narrative
function generateAlgorithmicNarrative(
  riasec: Record<string, number>,
  bigfive: Record<string, number>,
  top_field: string,
  lang = 'ar'
): string {
  const isEn = lang === 'en';
  const fieldNames: Record<string, string> = isEn ? {
    health: 'Health Sciences',
    engineering_tech: 'Engineering & Technology',
    business: 'Business & Management',
    law_sharia_languages: 'Humanities & Social Sciences',
  } : {
    health: 'الحقل الصحي',
    engineering_tech: 'حقل العلوم والتكنولوجيا والهندسة',
    business: 'حقل الأعمال',
    law_sharia_languages: 'حقل العلوم الإنسانية والاجتماعية',
  }
  const riasecDesc: Record<string, string> = isEn ? {
    R: 'your strong leaning towards practical and applied work',
    I: 'your investigative curiosity and love for analysis and research',
    A: 'your creative and artistic nature',
    S: 'your social ability and skill in communicating and helping others',
    E: 'your leadership spirit and initiative',
    C: 'your precision and methodology in organization and planning',
  } : {
    R: 'ميلك القوي نحو العمل العملي والتطبيقي',
    I: 'فضولك الاستقصائي وحبك للتحليل والبحث',
    A: 'طبيعتك الإبداعية والفنية',
    S: 'قدرتك الاجتماعية ومهارتك في التواصل ومساعدة الآخرين',
    E: 'روح القيادة والمبادرة التي تتميز بها',
    C: 'دقتك ومنهجيتك في التنظيم والتخطيط',
  }
  const big5Desc: Record<string, string> = isEn ? {
    O: 'your openness to new ideas and different experiences',
    C: 'your high commitment and methodology',
    E: 'your extroverted personality and interaction with others',
    A: 'your cooperation and empathy with those around you',
  } : {
    O: 'انفتاحك على الأفكار الجديدة والتجارب المختلفة',
    C: 'التزامك ومنهجيتك العالية',
    E: 'شخصيتك المنبسطة وتفاعلك مع الآخرين',
    A: 'تعاونك وتعاطفك مع من حولك',
  }
  const topR = Object.entries(riasec).sort((a, b) => b[1] - a[1])[0]?.[0] || 'I'
  const topB = Object.entries(bigfive).filter(([k]) => k !== 'N').sort((a, b) => b[1] - a[1])[0]?.[0] || 'C'
  const fn = fieldNames[top_field] || top_field
  
  if (isEn) {
    return `Your outstanding strength in ${riasecDesc[topR]} makes ${fn} a natural choice that matches your way of thinking. Also, ${big5Desc[topB] || 'your unique personality'} gives you a real advantage in this field. In ${fn}, you will find an environment that allows you to leverage your true strengths and grow constantly.`
  }
  return `تميّزك في ${riasecDesc[topR]} يجعل ${fn} خياراً طبيعياً يتوافق مع طريقة تفكيرك. كما أن ${big5Desc[topB] || 'شخصيتك المتميزة'} يمنحك ميزة حقيقية في هذا المجال. ستجد في ${fn} بيئة تتيح لك توظيف نقاط قوتك الحقيقية والنمو فيها باستمرار.`
}

// Groq caller
async function callGroq(
  messages: { role: string; content: string }[],
  groqKey: string,
  maxTokens = 1024,
  model = 'llama-3.3-70b-versatile'
): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: maxTokens }),
  })
  const data = await res.json()
  if (data.error) throw new Error(`Groq: ${data.error.message}`)
  return data.choices[0].message.content
}

// Safe JSON array parser
function safeParseJsonArray(raw: string): any[] {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  try {
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/)
    if (match) {
      try {
        const parsed = JSON.parse(match[0])
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }
}

// Safe JSON object parser
function safeParseJsonObject(raw: string): Record<string, any> | null {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  try {
    const parsed = JSON.parse(cleaned)
    return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch { return null }
    }
    return null
  }
}

async function translateChunk(
  items: { index: number; text: string }[],
  systemPrompt: string,
  groqKey: string
): Promise<any[]> {
  // Filter out empty strings — Groq returns "لا يوجد نص لترجمة" for blank inputs
  const validItems = items.filter(item => item.text.trim() !== '')
  if (validItems.length === 0) return []
  const textsOnly = validItems.map(item => `${item.index}. ${item.text}`).join('\n')
  const raw = await callGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `ترجم كل جملة من الإنجليزية إلى العربية:\n${textsOnly}` },
  ], groqKey, 2048)
  return safeParseJsonArray(raw)
}

const CHUNK_SIZE = 10

// Static fallbacks for field careers (used if Groq fails)
const CAREERS_FALLBACK: Record<string, { ar: { jobs: string[]; majors: string[] }; en: { jobs: string[]; majors: string[] } }> = {
  health: {
    ar: {
      jobs: ['طبيب / طبيبة', 'صيدلاني / صيدلانية', 'ممرض / ممرضة متخصص'],
      majors: ['الطب البشري', 'طب الأسنان', 'الصيدلة'],
    },
    en: {
      jobs: ['General Practitioner / Doctor', 'Pharmacist', 'Specialist Nurse'],
      majors: ['Medicine', 'Dentistry', 'Pharmacy'],
    },
  },
  engineering_tech: {
    ar: {
      jobs: ['مهندس برمجيات', 'مهندس مدني', 'محلل بيانات وذكاء اصطناعي'],
      majors: ['هندسة الحاسوب', 'الهندسة المدنية', 'علم البيانات والذكاء الاصطناعي'],
    },
    en: {
      jobs: ['Software Engineer', 'Civil Engineer', 'Data & AI Analyst'],
      majors: ['Computer Engineering', 'Civil Engineering', 'Data Science & AI'],
    },
  },
  business: {
    ar: {
      jobs: ['مدير أعمال', 'محاسب قانوني', 'مختص تسويق رقمي'],
      majors: ['إدارة الأعمال', 'المحاسبة', 'التسويق الرقمي'],
    },
    en: {
      jobs: ['Business Manager', 'Certified Accountant', 'Digital Marketing Specialist'],
      majors: ['Business Administration', 'Accounting', 'Digital Marketing'],
    },
  },
  law_sharia_languages: {
    ar: {
      jobs: ['محامٍ / محامية', 'صحفي / إعلامي', 'مترجم معتمد'],
      majors: ['القانون', 'الإعلام والاتصال', 'اللغة الإنجليزية التطبيقية'],
    },
    en: {
      jobs: ['Lawyer', 'Journalist / Media Specialist', 'Certified Translator'],
      majors: ['Law', 'Media & Communication', 'Applied English'],
    },
  },
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    const groqKey = Deno.env.get('GROQ_API_KEY')
    const sbUrl = Deno.env.get('SUPABASE_URL')
    const sbServiceKey = Deno.env.get('SB_SERVICE_ROLE_KEY')
    const supabaseAdmin = createClient(sbUrl!, sbServiceKey!)

    if (!groqKey) throw new Error('GROQ_API_KEY not configured')

    let result: any

    // TRANSLATE BIG FIVE (chunked)
    if (action === 'translate_bigfive') {
      const items: string[] = payload.items
      const indexedItems = items.map((t: string, i: number) => ({ index: i, text: t }))
      const systemPrompt = 'أنت مترجم محترف. ترجم عبارات الاستبيان النفسي من الإنجليزية إلى العربية الفصحى الحديثة. حافظ على صيغة المتكلم. أجب فقط بمصفوفة JSON صالحة بدون أي شرح أو markdown.\nمثال:\nInput: 0. I am the life of the party\nOutput: [{"index": 0, "text_ar": "أنا روح الحفلة"}]'

      const allTranslations: any[] = []
      for (let start = 0; start < indexedItems.length; start += CHUNK_SIZE) {
        const chunk = indexedItems.slice(start, start + CHUNK_SIZE)
        try {
          const chunkResult = await translateChunk(chunk, systemPrompt, groqKey)
          allTranslations.push(...chunkResult)
        } catch (chunkErr: any) {
          chunk.forEach(item => allTranslations.push({ index: item.index, text_ar: item.text }))
        }
      }
      result = allTranslations
    }

    // TRANSLATE RIASEC (chunked)
    else if (action === 'translate_riasec') {
      const items: { index: number; text: string }[] = payload.items
      const systemPrompt = 'أنت مترجم محترف. ترجم كل جملة من الإنجليزية إلى العربية الفصحى الحديثة. أجب فقط بمصفوفة JSON صالحة بدون أي شرح أو markdown.\nمثال:\nInput: 1. Build kitchen cabinets\nOutput: [{"index": 1, "text_ar": "بناء خزائن المطبخ"}]'

      const allTranslations: any[] = []
      for (let start = 0; start < items.length; start += CHUNK_SIZE) {
        const chunk = items.slice(start, start + CHUNK_SIZE)
        try {
          const chunkResult = await translateChunk(chunk, systemPrompt, groqKey)
          allTranslations.push(...chunkResult)
        } catch (chunkErr: any) {
          chunk.forEach(item => allTranslations.push({ index: item.index, text_ar: item.text }))
        }
      }
      result = allTranslations
    }

    // NARRATIVE
    else if (action === 'narrative') {
      const { riasec, bigfive, top_field, top_field_score, lang = 'ar' } = payload
      const isEn = lang === 'en'

      const riasecLabels: Record<string, string> = isEn ? {
        R: 'Realistic (practical/hands-on)',
        I: 'Investigative (analytical/curious)',
        A: 'Artistic (creative/expressive)',
        S: 'Social (communicative/helpful)',
        E: 'Enterprising (leadership/initiative)',
        C: 'Conventional (precise/methodical)',
      } : {
        R: 'الميل العملي والتطبيقي',
        I: 'الفضول الاستقصائي والتحليلي',
        A: 'الطبع الإبداعي والفني',
        S: 'القدرة على التواصل ومساعدة الآخرين',
        E: 'روح القيادة والمبادرة',
        C: 'الدقة والتنظيم المنهجي',
      }
      const big5Labels: Record<string, string> = isEn ? {
        O: 'Openness',
        C: 'Conscientiousness',
        E: 'Extraversion',
        A: 'Agreeableness',
        N: 'Neuroticism',
      } : {
        O: 'الانفتاح الفكري',
        C: 'الالتزام والمنهجية',
        E: 'الانبساط والتفاعل الاجتماعي',
        A: 'التعاون والتعاطف',
        N: 'الحساسية العاطفية',
      }
      const fieldNames: Record<string, string> = isEn ? {
        health: 'Health Sciences',
        engineering_tech: 'Engineering & Technology',
        business: 'Business & Management',
        law_sharia_languages: 'Humanities & Social Sciences',
      } : {
        health: 'الحقل الصحي',
        engineering_tech: 'حقل العلوم والتكنولوجيا والهندسة',
        business: 'حقل الأعمال',
        law_sharia_languages: 'حقل العلوم الإنسانية والاجتماعية',
      }

      const topRiasec = Object.entries(riasec as Record<string, number>)
        .sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => riasecLabels[k]).filter(Boolean)

      const topBig5 = Object.entries(bigfive as Record<string, number>)
        .filter(([k]) => k !== 'N')
        .sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => big5Labels[k]).filter(Boolean)

      const fieldName = fieldNames[top_field] || top_field

      try {
        let messages
        if (isEn) {
          messages = [
            {
              role: 'system',
              content: `You are an academic advisor for Jordanian Tawjihi students.
Rules:
- Speak directly to the student using second-person pronouns (you, your, you have, you are)
- NEVER mention any numbers or percentages
- NEVER refer to the test, questions, or assessment itself
- Mention the top RIASEC trait and top Big 5 personality trait by name naturally
- Explain clearly why specifically these traits make the student suitable for this field
- Style: Direct, personal, encouraging, professional
- In English only
- Exactly 4 sentences, no more`,
            },
            {
              role: 'user',
              content: `Write directly to the student why they fit ${fieldName}.\nTheir top career interests: ${topRiasec.join(' and ')}.\nTheir top personality traits: ${topBig5.join(' and ')}.\nBegin speaking to them directly.`,
            },
          ]
        } else {
          messages = [
            {
              role: 'system',
              content: `انت مستشار اكاديمي لطلاب التوجيهي الاردني.
القواعد:
- تحدث مباشرة الى الطالب بضمير المخاطب (انت، لديك، تتميز، ستجد)
- لا تذكر ارقاما او نسبا مئوية ابدا
- لا تشر الى الاختبار او الاسئلة ابدا
- اذكر سمة RIASEC الاقوى وسمة الشخصية الاقوى بالاسم بشكل طبيعي
- اشرح بوضوح لماذا تحديدا هذه السمات تجعل الطالب مناسبا لهذا الحقل
- اسلوبك: مباشر، شخصي، مشجع
- باللغة العربية فقط
- 4 جمل فقط لا اكثر`,
            },
            {
              role: 'user',
              content: `اكتب للطالب مباشرة لماذا يناسبه ${fieldName}.\nاقوى ميوله المهنية: ${topRiasec.join(' و')}.\nابرز سمات شخصيته: ${topBig5.join(' و')}.\nابدا الكلام مباشرة اليه.`,
            },
          ]
        }

        result = await callGroq(messages, groqKey, 512)
      } catch (e: any) {
        result = generateAlgorithmicNarrative(riasec, bigfive, top_field, lang)
      }
    }

    // MAJOR DESCRIPTION - cached
    else if (action === 'major_description') {
      const { major_name, lang = 'ar' } = payload
      const cacheString = `${major_name}_${lang}`
      const hash = Array.from(
        new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(cacheString)))
      ).map(b => b.toString(16).padStart(2, '0')).join('')

      const { data: cached } = await supabaseAdmin
        .from('gemini_cache').select('response_ar').eq('prompt_hash', hash).maybeSingle()

      if (cached) {
        result = cached.response_ar
      } else {
        try {
          let messages
          if (lang === 'en') {
            messages = [
              { role: 'system', content: 'You are a Jordanian university advisor. Answer in English only. Be concise.' },
              {
                role: 'user',
                content: `Explain the university major "${major_name}" in Jordanian universities:
- What does the student study? (3-4 main subjects)
- Career opportunities after graduation? (3-4 jobs)
- What skills does it develop?
Simple style for a high school student. Do not exceed 8 sentences.`,
              },
            ]
          } else {
            messages = [
              { role: 'system', content: 'انت مستشار جامعي اردني. اجب بالعربية فقط. كن موجزا.' },
              {
                role: 'user',
                content: `اشرح تخصص "${major_name}" في الجامعات الاردنية:
- ماذا يدرس الطالب؟ (3-4 مواد رئيسية)
- فرص العمل بعد التخرج؟ (3-4 وظائف)
- المهارات التي يطورها؟
اسلوب بسيط لطالب ثانوي. لا تزيد عن 8 جمل.`,
              },
            ]
          }

          result = await callGroq(messages, groqKey, 600)
          await supabaseAdmin.from('gemini_cache').insert({ prompt_hash: hash, response_ar: result })
        } catch (e: any) {
          result = lang === 'en'
            ? `${major_name} is a university major that provides diverse career opportunities in the Jordanian job market.`
            : `${major_name} تخصص جامعي يوفر فرصا مهنية متنوعة في سوق العمل الاردني.`
        }
      }
    }

    // FIELD CAREERS — top 3 jobs + top 3 recommended majors for a given field
    // Cached separately per language so AR and EN users get correct results
    else if (action === 'field_careers') {
      const { field_id, field_name, lang = 'ar' } = payload
      const cacheKey = `field_careers_v1_${field_id}_${lang}`

      const { data: cached } = await supabaseAdmin
        .from('gemini_cache').select('response_ar').eq('prompt_hash', cacheKey).maybeSingle()

      if (cached) {
        try {
          const parsed = JSON.parse(cached.response_ar)
          // Validate the shape before using cached data
          result = parsed?.jobs && parsed?.majors ? parsed : CAREERS_FALLBACK[field_id]?.[lang] || { jobs: [], majors: [] }
        } catch {
          // Corrupt cache entry — fall through to fresh fetch
          result = CAREERS_FALLBACK[field_id]?.[lang] || { jobs: [], majors: [] }
        }
      } else {
        try {
          let messages
          if (lang === 'en') {
            messages = [
              {
                role: 'system',
                content: 'You are a Jordanian academic advisor. Reply only with valid JSON and no extra text or markdown.',
              },
              {
                role: 'user',
                content: `For the field "${field_name}" in Jordanian universities, provide:
- The top 3 recommended university majors (realistic, available in Jordan)
- The top 3 expected career paths after graduation in the Jordanian and Gulf job market

Reply with this JSON only (all values in English):
{"jobs": ["Job1", "Job2", "Job3"], "majors": ["Major1", "Major2", "Major3"]}`,
              },
            ]
          } else {
            messages = [
              {
                role: 'system',
                content: 'أنت مستشار مهني أردني متخصص. أجب فقط بـ JSON صالح بلا أي نص إضافي أو markdown.',
              },
              {
                role: 'user',
                content: `بالنسبة لـ "${field_name}" في الجامعات الأردنية، أعطني:
- أفضل 3 تخصصات جامعية موصى بها (واقعية ومتوفرة في الأردن)
- أبرز 3 وظائف متوقعة بعد التخرج في سوق العمل الأردني والخليجي

أجب بهذا الـ JSON فقط:
{"jobs": ["وظيفة1", "وظيفة2", "وظيفة3"], "majors": ["تخصص1", "تخصص2", "تخصص3"]}`,
              },
            ]
          }

          const raw = await callGroq(messages, groqKey, 400)
          const parsed = safeParseJsonObject(raw)
          result = parsed && parsed.jobs && parsed.majors ? parsed : CAREERS_FALLBACK[field_id]?.[lang] || { jobs: [], majors: [] }
          // Cache the result
          await supabaseAdmin.from('gemini_cache').insert({
            prompt_hash: cacheKey,
            response_ar: JSON.stringify(result),
          })
        } catch (e: any) {
          console.log(`field_careers Groq failed (${e.message}) — using fallback`)
          result = CAREERS_FALLBACK[field_id]?.[lang] || { jobs: [], majors: [] }
        }
      }
    }

    // CHATBOT
    else if (action === 'chatbot') {
      const { message, context, history, lang = 'ar' } = payload
      const isEn = lang === 'en'
      try {
        result = await callGroq([
          {
            role: 'system',
            content: isEn
              ? `You are a TawjihiPath academic advisor specializing in the Jordanian Tawjihi system (2009 generation). The four fields are: Health, Science & Technology & Engineering, Humanities & Social Sciences, Business. This student's results: ${JSON.stringify(context)}. Always respond in English. Be encouraging and specific. No more than 5 sentences.`
              : `انت مستشار طريق التوجيهي. متخصص في نظام التوجيهي الاردني جيل 2009. الحقول الاربعة فقط: الحقل الصحي، حقل العلوم والتكنولوجيا والهندسة، حقل العلوم الإنسانية والاجتماعية، حقل الأعمال. نتائج هذا الطالب: ${JSON.stringify(context)} اجب بالعربية فقط. كن مشجعا ومحددا. لا تزيد عن 5 جمل.`,
          },
          ...(history || []).map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content,
          })),
          { role: 'user', content: message },
        ], groqKey, 512)
      } catch (e: any) {
        result = isEn ? 'Sorry, the assistant is unavailable right now. Please try again.' : 'عذرا، تعذر الاتصال بالمساعد الان. حاول مجددا.'
      }
    }

    else {
      throw new Error('Invalid action')
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.log(`ERROR: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
