"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, Database, FileSearch, Sparkles, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchingProgressProps {
  topic: string
  onCancel: () => void
}

const searchSteps = [
  { id: 1, name: "解析搜索范围", icon: Sparkles },
  { id: 2, name: "查询 Google Scholar", icon: Database },
  { id: 3, name: "查询 arXiv", icon: Database },
  { id: 4, name: "查询 CrossRef", icon: Database },
  { id: 5, name: "去重与验证", icon: FileSearch },
  { id: 6, name: "生成AI摘要", icon: Sparkles },
]

export function SearchingProgress({ topic, onCancel }: SearchingProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [foundCount, setFoundCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(8)

  useEffect(() => {
    // Simulate progress
    const stepDuration = 1300 // ms per step
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2
        return next >= 100 ? 100 : next
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < searchSteps.length - 1) {
          // Simulate finding papers at different steps
          setFoundCount((count) => count + Math.floor(Math.random() * 15) + 5)
          return prev + 1
        }
        return prev
      })
    }, stepDuration)

    const timeInterval = setInterval(() => {
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">正在搜索文献</h1>
        <p className="text-muted-foreground">AI正在多个数据库中为您搜索相关文献</p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-8">
          {/* Search Topic */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">搜索主题</p>
            <p className="text-lg">{topic}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">整体进度</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已找到文献</p>
              <p className="text-3xl font-bold text-accent">{foundCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">预计剩余时间</p>
              <p className="text-3xl font-bold">{estimatedTime}s</p>
            </div>
          </div>

          {/* Search Steps */}
          <div className="space-y-3">
            <p className="text-sm font-medium">搜索进度</p>
            <div className="space-y-2">
              {searchSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? "bg-accent/10 border-accent"
                        : isCompleted
                          ? "bg-muted/50 border-border"
                          : "border-border opacity-50"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isCompleted
                          ? "bg-accent text-accent-foreground"
                          : isCurrent
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`flex-1 ${isCurrent ? "font-medium" : ""}`}>{step.name}</span>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-accent" />}
                    {isCurrent && <Badge variant="secondary">进行中</Badge>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cancel Button */}
          <div className="pt-4">
            <Button onClick={onCancel} variant="outline" className="w-full gap-2 bg-transparent">
              <X className="w-4 h-4" />
              取消搜索
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
