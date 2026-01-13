interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
      reasoning_details?: string
    }
  }>
}

export async function generateSearchKeywords(topic: string): Promise<{
  domain: string
  keywords: string[]
  yearRange: [number, number]
}> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured')
  }

  const prompt = `Based on the following research topic, generate appropriate search scope:

Research topic: ${topic}

Please return in JSON format with the following fields:
- domain: Research domain (brief description in English)
- keywords: 5-8 related search keywords (in English, array)
- yearRange: Suggested year range [start year, end year]

Requirements:
1. Keywords should be highly relevant to the research topic
2. Year range should be within the last 5-10 years
3. Return pure JSON format, no other text

Example format:
{
  "domain": "Artificial Intelligence and Machine Learning",
  "keywords": ["deep learning", "neural networks", "natural language processing", "computer vision", "reinforcement learning"],
  "yearRange": [2020, 2025]
}`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional academic research assistant, expert at generating appropriate search keywords and scope based on research topics. Always return results in pure JSON format. Generate English keywords only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data: OpenRouterResponse = await response.json()
    let content = data.choices[0].message.content

    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonBlockMatch) {
      content = jsonBlockMatch[1].trim()
    } else {
      const codeBlockMatch = content.match(/```\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch) {
        content = codeBlockMatch[1].trim()
      }
    }

    let parsedResult: { domain: string; keywords: string[]; yearRange: [number, number] }

    try {
      parsedResult = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('AI response format is incorrect, please try again')
    }

    return {
      domain: parsedResult.domain || 'Uncategorized',
      keywords: Array.isArray(parsedResult.keywords) ? parsedResult.keywords : [],
      yearRange: Array.isArray(parsedResult.yearRange) && parsedResult.yearRange.length === 2
        ? [parsedResult.yearRange[0], parsedResult.yearRange[1]]
        : [2020, 2025]
    }
  } catch (error) {
    console.error('Error generating search keywords:', error)
    throw error
  }
}
