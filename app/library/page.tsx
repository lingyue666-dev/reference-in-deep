"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Trash2, BookMarked } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LibraryPaper {
  id: string
  title: string
  authors: string[]
  year: number
  journal: string
  url: string
  addedAt: string
  note?: string
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [library, setLibrary] = useState<LibraryPaper[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('libraryPapers')
      if (stored) {
        try {
          const papers = JSON.parse(stored)
          setLibrary(papers)
        } catch (error) {
          console.error('Failed to parse library papers:', error)
        }
      }
    }
  }, [])

  const filteredLibrary = library.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDelete = (id: string) => {
    const newLibrary = library.filter((paper) => paper.id !== id)
    setLibrary(newLibrary)
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('libraryPapers', JSON.stringify(newLibrary))
    }
    
    toast({
      title: "删除成功",
      description: "文献已从文献库中移除",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">文献库</h1>
              <p className="text-muted-foreground">您收藏的 {library.length} 篇文献</p>
            </div>
            <BookMarked className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="搜索文献标题、作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Library List */}
          <div className="space-y-4">
            {filteredLibrary.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">没有找到相关文献</p>
                </CardContent>
              </Card>
            ) : (
              filteredLibrary.map((paper) => (
                <Card key={paper.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold flex-1 text-balance">{paper.title}</h3>
                        <Badge variant="secondary">{paper.year}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {paper.authors.join(", ")} · {paper.journal}
                      </p>
                    </div>

                    {paper.note && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">备注：</span>
                          {paper.note}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>添加于 {paper.addedAt}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild className="gap-2">
                          <a href={paper.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            查看原文
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(paper.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
