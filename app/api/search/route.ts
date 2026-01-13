import { NextRequest } from 'next/server'
import { searchPapers } from '@/lib/semantic-scholar-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const year = searchParams.get('year')
    const fieldsOfStudy = searchParams.get('fieldsOfStudy')
    const venue = searchParams.get('venue')
    const publicationDateOrYear = searchParams.get('publicationDateOrYear')

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const params = {
      query,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0,
      ...(year && { year }),
      ...(fieldsOfStudy && { fieldsOfStudy }),
      ...(venue && { venue }),
      ...(publicationDateOrYear && { publicationDateOrYear }),
    }

    const papers = await searchPapers(params)

    return new Response(JSON.stringify(papers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in search API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to search papers'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}