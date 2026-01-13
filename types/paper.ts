export interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  source: string
  doi?: string
  journal: string
  abstract: string
  url: string
  aiSummary: string
}
