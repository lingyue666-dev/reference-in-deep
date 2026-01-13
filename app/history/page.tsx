"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HistoryItem {
  id: string
  topic: string
  keywords: string[]
  resultsCount: number
  searchedAt: string
  yearStart?: string
  yearEnd?: string
  domain?: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('searchHistory')
      if (stored) {
        try {
          const historyData = JSON.parse(stored)
          setHistory(historyData)
        } catch (error) {
          console.error('Failed to parse search history:', error)
        }
      }
    }
  }, [])

  const handleRepeatSearch = (historyItem: HistoryItem) => {
    const params = new URLSearchParams()
    params.append('topic', historyItem.topic)
    if (historyItem.keywords.length > 0) {
      params.append('keywords', historyItem.keywords.join(','))
    }
    if (historyItem.yearStart) {
      params.append('yearStart', historyItem.yearStart)
    }
    if (historyItem.yearEnd) {
      params.append('yearEnd', historyItem.yearEnd)
    }
    if (historyItem.domain) {
      params.append('domain', historyItem.domain)
    }
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">搜索历史</h1>
              <p className="text-muted-foreground">您最近的 {history.length} 次搜索记录</p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* History List */}
          <div className="space-y-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无搜索历史</h3>
                  <p className="text-muted-foreground mb-6">您还没有进行过文献搜索</p>
                  <Button asChild>
                    <Link href="/search">开始搜索</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              history.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold flex-1">{item.topic}</h3>
                        <Badge variant="outline" className="shrink-0">
                          {item.resultsCount} 篇
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{item.searchedAt}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRepeatSearch(item)} className="gap-2">
                          <Search className="w-4 h-4" />
                          重新搜索
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleRepeatSearch(item)} className="gap-2">
                          查看结果
                          <ArrowRight className="w-4 h-4" />
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
