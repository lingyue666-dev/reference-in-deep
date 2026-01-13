"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  // Mock history data
  const mockHistory = [
    {
      id: "1",
      topic: "深度学习在图像识别中的应用研究",
      keywords: ["深度学习", "神经网络", "图像识别"],
      resultsCount: 127,
      searchedAt: "2024-12-16 14:30",
    },
    {
      id: "2",
      topic: "自然语言处理中的Transformer模型",
      keywords: ["Transformer", "BERT", "GPT", "NLP"],
      resultsCount: 89,
      searchedAt: "2024-12-15 09:15",
    },
    {
      id: "3",
      topic: "强化学习在机器人控制中的应用",
      keywords: ["强化学习", "机器人", "深度Q学习"],
      resultsCount: 56,
      searchedAt: "2024-12-14 16:45",
    },
    {
      id: "4",
      topic: "迁移学习理论与实践",
      keywords: ["迁移学习", "域适应", "预训练模型"],
      resultsCount: 103,
      searchedAt: "2024-12-13 11:20",
    },
    {
      id: "5",
      topic: "生成对抗网络最新进展",
      keywords: ["GAN", "图像生成", "对抗学习"],
      resultsCount: 74,
      searchedAt: "2024-12-12 15:00",
    },
  ]

  const handleRepeatSearch = (historyItem: (typeof mockHistory)[0]) => {
    // In real app, would navigate to search with pre-filled data
    console.log("Repeat search:", historyItem)
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
              <p className="text-muted-foreground">您最近的 {mockHistory.length} 次搜索记录</p>
            </div>
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* History List */}
          <div className="space-y-4">
            {mockHistory.map((item) => (
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
                      <Button variant="default" size="sm" asChild className="gap-2">
                        <Link href="/results">
                          查看结果
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
