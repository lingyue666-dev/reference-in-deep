import { Paper } from "@/types/paper";

interface SemanticScholarPaper {
  paperId: string;
  corpusId?: number;
  title: string;
  authors: Array<{
    authorId: string;
    name: string;
  }>;
  year: number;
  abstract?: string;
  url?: string;
  doi?: string;
  journal?: string;
  venue?: string;
  fieldsOfStudy?: string[];
  citationCount?: number;
  referenceCount?: number;
  isOpenAccess?: boolean;
  openAccessPdf?: {
    url?: string;
    status?: string;
  };
  publicationVenue?: {
    name?: string;
    alternate_names?: string[];
  };
  publicationDate?: string;
}

interface SearchResponse {
  total?: number;
  offset?: number;
  next?: number;
  data?: SemanticScholarPaper[];
}

export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
  year?: string;
  fieldsOfStudy?: string;
  venue?: string;
  publicationDateOrYear?: string;
  fields?: string;
}

export async function searchPapers(params: SearchParams): Promise<Paper[]> {
  const {
    query,
    limit = 100,
    offset = 0,
    year,
    fieldsOfStudy,
    venue,
    publicationDateOrYear,
  } = params;

  const queryParams = new URLSearchParams({
    query: query,
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (year) queryParams.append('year', year);
  if (fieldsOfStudy) queryParams.append('fieldsOfStudy', fieldsOfStudy);
  if (venue) queryParams.append('venue', venue);
  if (publicationDateOrYear) queryParams.append('publicationDateOrYear', publicationDateOrYear);

  const fields = 'title,authors,year,abstract,url,journal,venue,fieldsOfStudy,citationCount,referenceCount,isOpenAccess,publicationDate';
  queryParams.append('fields', fields);

  const response = await fetch(
    `https://ai4scholar.net/graph/v1/paper/search?${queryParams.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.AI4SCHOLAR_API_KEY || ''}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API 速率限制已超出。请检查您的积分余额，或访问 https://ai4scholar.net 获取更多积分。');
    }
    throw new Error(`Ai4Scholar API 请求失败: ${response.status} ${response.statusText}`);
  }

  const data: SearchResponse = await response.json();

  let papers: SemanticScholarPaper[] = [];

  if (Array.isArray(data)) {
    papers = data;
  } else if (Array.isArray(data.data)) {
    papers = data.data;
  } else {
    console.error('Invalid API response format:', data);
    return [];
  }

  return papers.map((paper) => {
    let abstractText = '';
    if (typeof paper.abstract === 'string') {
      abstractText = paper.abstract;
    } else if (typeof paper.abstract === 'object' && paper.abstract !== null) {
      try {
        abstractText = paper.abstract.en || Object.values(paper.abstract)[0] || '';
      } catch {
        abstractText = '';
      }
    } else {
      abstractText = 'Abstract not available';
    }
    
    return {
      id: paper.paperId,
      title: paper.title || 'Untitled',
      authors: paper.authors?.map(author => author.name) || [],
      year: paper.year || 0,
      source: paper.venue || 'Unknown',
      doi: paper.doi || '',
      journal: paper.journal?.name || paper.venue || 'Unknown Journal',
      abstract: abstractText,
      url: paper.url || '',
      aiSummary: generateAISummary(paper.abstract),
    };
  });
}

// 生成 AI 摘要的模拟函数，实际应用中可以使用 AI API
function generateAISummary(abstract: any): string {
  let abstractText = '';
  
  if (!abstract) {
    return 'AI 摘要生成失败：原文摘要不可用';
  }

  try {
    if (typeof abstract === 'string') {
      abstractText = abstract;
    } else if (typeof abstract === 'object' && abstract !== null) {
      try {
        abstractText = abstract.en || Object.values(abstract)[0] || '';
      } catch {
        abstractText = '';
      }
    } else {
      abstractText = String(abstract);
    }
    
    if (!abstractText || abstractText.trim().length === 0) {
      return 'AI 摘要生成失败：原文摘要不可用';
    }

    const sentences = abstractText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) {
      return '该文献没有可用的摘要信息。';
    }

    const aiSummary = sentences.slice(0, 2).join('. ') + '.';
    return aiSummary;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return 'AI 摘要生成失败，请稍后重试';
  }
}

// 根据论文 ID 获取单篇论文详情
export async function getPaperById(paperId: string): Promise<Paper> {
  try {
    const response = await fetch(
      `https://ai4scholar.net/graph/v1/paper/${paperId}?fields=title,authors,year,abstract,url,journal,venue,fieldsOfStudy,citationCount,referenceCount,isOpenAccess,publicationDate`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI4SCHOLAR_API_KEY || ''}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ai4Scholar API request failed: ${response.status} ${response.statusText}`);
    }

    const paper: SemanticScholarPaper = await response.json();

    let abstractText = '';
    if (typeof paper.abstract === 'string') {
      abstractText = paper.abstract;
    } else if (typeof paper.abstract === 'object' && paper.abstract !== null) {
      try {
        abstractText = paper.abstract.en || Object.values(paper.abstract)[0] || '';
      } catch {
        abstractText = '';
      }
    } else {
      abstractText = 'Abstract not available';
    }

    return {
      id: paper.paperId,
      title: paper.title || 'Untitled',
      authors: paper.authors?.map(author => author.name) || [],
      year: paper.year || 0,
      source: paper.venue || 'Unknown',
      doi: paper.doi || '',
      journal: paper.journal?.name || paper.venue || 'Unknown Journal',
      abstract: abstractText,
      url: paper.url || '',
      aiSummary: generateAISummary(paper.abstract),
    };
  } catch (error) {
    console.error('Error fetching paper:', error);
    throw error;
  }
}