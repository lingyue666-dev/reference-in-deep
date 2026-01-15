"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, BookmarkPlus, Bookmark, ExternalLink, ChevronDown, ChevronUp, FileText } from "lucide-react"
import Link from "next/link"

interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  source: string
  doi: string
  journal: string
  abstract: string
  url: string
  aiSummary: string
}

interface SearchResultsProps {
  topic: string
  papers: Paper[]
  selectedPapers: Paper[]
  onTogglePaper: (paper: Paper) => void
  onAddToLibrary: (paper: Paper) => void
}

export function SearchResults({ topic, papers, selectedPapers, onTogglePaper, onAddToLibrary }: SearchResultsProps) {
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState("relevance")
  const [filterYear, setFilterYear] = useState("all")
  const [filterSource, setFilterSource] = useState("all")

  const toggleExpanded = (paperId: string) => {
    setExpandedPapers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(paperId)) {
        newSet.delete(paperId)
      } else {
        newSet.add(paperId)
      }
      return newSet
    })
  }

  const isSelected = (paperId: string) => selectedPapers.some((p) => p.id === paperId)
  const isExpanded = (paperId: string) => expandedPapers.has(paperId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Results Area */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">搜索结果</h1>
            <p className="text-muted-foreground">
              为主题 "<span className="text-foreground font-medium">{topic}</span>" 找到 {papers.length} 篇相关文献
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">相关性</SelectItem>
                      <SelectItem value="year-desc">年份（新到旧）</SelectItem>
                      <SelectItem value="year-asc">年份（旧到新）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="年份筛选" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有年份</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="数据源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有来源</SelectItem>
                      <SelectItem value="arxiv">arXiv</SelectItem>
                      <SelectItem value="scholar">Google Scholar</SelectItem>
                      <SelectItem value="crossref">CrossRef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="space-y-4">
            {papers.map((paper) => (
              <Card
                key={paper.id}
                className={`hover:shadow-md transition-shadow ${isSelected(paper.id) ? "ring-2 ring-accent" : ""}`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Title and Year */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-foreground leading-tight flex-1 text-pretty">
                        {paper.title}
                      </h3>
                      <Badge variant="secondary">{paper.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {paper.authors.join(", ")} · {paper.journal}
                    </p>
                  </div>

                  {/* AI Summary */}
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-md space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">AI 摘要</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {paper.aiSummary || 'AI 摘要生成中...'}
                    </p>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded(paper.id) && (
                    <div className="space-y-3 pt-2">
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">原文摘要</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{paper.abstract}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">DOI: </span>
                          <span className="font-mono">{paper.doi}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">来源: </span>
                          <span>{paper.source}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant={isSelected(paper.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => onTogglePaper(paper)}
                      className="gap-2"
                    >
                      {isSelected(paper.id) ? (
                        <>
                          <Bookmark className="w-4 h-4" />
                          已加入引用
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4" />
                          加入引用
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToLibrary(paper)}
                      className="gap-2"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      加入文献库
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => toggleExpanded(paper.id)} className="gap-2">
                      {isExpanded(paper.id) ? (
                        <>
                          收起详情
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          展开详情
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <Button variant="ghost" size="sm" asChild className="gap-2 ml-auto">
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        查看原文
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Selected Papers */}
        <div className="lg:w-80 space-y-4">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">已选择的文献</h3>
                <p className="text-sm text-muted-foreground">已选择 {selectedPapers.length} 篇文献</p>
              </div>

              <Separator />

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedPapers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无选择的文献</p>
                ) : (
                  selectedPapers.slice(0, 3).map((paper) => (
                    <div key={paper.id} className="p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium line-clamp-2">{paper.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {paper.authors[0]} et al., {paper.year}
                      </p>
                    </div>
                  ))
                )}
                {selectedPapers.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">+{selectedPapers.length - 3} 篇...</p>
                )}
              </div>

              <Button asChild className="w-full gap-2" size="lg" disabled={selectedPapers.length === 0}>
                <Link href={selectedPapers.length > 0 ? "/citations" : "#"}>
                  生成引用
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
