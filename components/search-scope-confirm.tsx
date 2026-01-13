"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, X, Upload, ArrowRight } from "lucide-react"

interface SearchScopeConfirmProps {
  onStartSearch: (scope: {
    topic: string
    keywords: string[]
    yearRange: [number, number]
    domain: string
  }) => void
}

export function SearchScopeConfirm({ onStartSearch }: SearchScopeConfirmProps) {
  const [step, setStep] = useState<"input" | "confirm">("input")
  const [topic, setTopic] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [generatedScope, setGeneratedScope] = useState<{
    domain: string
    keywords: string[]
    yearRange: [number, number]
  } | null>(null)

  const [editableKeywords, setEditableKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [yearStart, setYearStart] = useState(2020)
  const [yearEnd, setYearEnd] = useState(2025)
  const [domain, setDomain] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateScope = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate search scope')
      }

      const result = await response.json()

      setGeneratedScope({
        domain: result.domain,
        keywords: result.keywords,
        yearRange: result.yearRange,
      })
      setEditableKeywords(result.keywords)
      setYearStart(result.yearRange[0])
      setYearEnd(result.yearRange[1])
      setDomain(result.domain)
      setStep("confirm")
    } catch (err) {
      console.error('Error generating search scope:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate search scope'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const readFileContent = async (file: File): Promise<string> => {
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    const baseName = file.name.replace(/\.[^/.]+$/, "")

    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      return await file.text()
    }

    return baseName
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)

      setIsGenerating(true)
      setError(null)

      try {
        const fileContent = await readFileContent(uploadedFile)
        const topicWithFile = fileContent

        const response = await fetch('/api/generate-keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: topicWithFile }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to generate search scope')
        }

        const result = await response.json()

        setGeneratedScope({
          domain: result.domain,
          keywords: result.keywords,
          yearRange: result.yearRange,
        })
        setEditableKeywords(result.keywords)
        setYearStart(result.yearRange[0])
        setYearEnd(result.yearRange[1])
        setDomain(result.domain)
        setTopic(topicWithFile)
        setStep("confirm")
      } catch (err) {
        console.error('Error generating search scope:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate search scope'
        setError(errorMessage)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !editableKeywords.includes(newKeyword.trim())) {
      setEditableKeywords([...editableKeywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setEditableKeywords(editableKeywords.filter((k) => k !== keyword))
  }

  const handleConfirmSearch = () => {
    onStartSearch({
      topic,
      keywords: editableKeywords,
      yearRange: [yearStart, yearEnd],
      domain,
    })
  }

  if (step === "input") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">开始文献搜索</h1>
          <p className="text-muted-foreground">输入研究主题或上传文件，AI将帮助您圈定搜索范围</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI智能搜索范围圈定
            </CardTitle>
            <CardDescription>通过对话或表单输入您的研究主题，系统将智能生成搜索范围</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">研究主题</Label>
              <Textarea
                id="topic"
                placeholder="例如：深度学习在图像识别中的应用研究..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">上传研究文件</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {file ? file.name : "选择文件 (PDF, DOC, TXT)"}
                  </label>
                </Button>
              </div>
            </div>

            <Button onClick={handleGenerateScope} disabled={!topic.trim() || isGenerating} className="w-full gap-2" size="lg">
              {isGenerating ? '生成中...' : '生成搜索范围'}
              <ArrowRight className="w-4 h-4" />
            </Button>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">确认搜索范围</h1>
        <p className="text-muted-foreground">AI已为您生成搜索范围，您可以编辑后开始搜索</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>搜索范围</CardTitle>
          <CardDescription>请确认或修改AI生成的搜索范围</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>研究主题</Label>
            <p className="text-sm bg-muted p-3 rounded-md">{topic}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">研究领域</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="例如：人工智能与机器学习"
            />
          </div>

          <div className="space-y-2">
            <Label>关键词</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editableKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1 px-3 py-1">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                placeholder="添加关键词"
              />
              <Button onClick={addKeyword} variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>年份范围</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={yearStart}
                onChange={(e) => setYearStart(Number(e.target.value))}
                min={1900}
                max={2025}
                className="w-32"
              />
              <span className="text-muted-foreground">至</span>
              <Input
                type="number"
                value={yearEnd}
                onChange={(e) => setYearEnd(Number(e.target.value))}
                min={yearStart}
                max={2025}
                className="w-32"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setStep("input")} variant="outline" className="flex-1">
              返回修改主题
            </Button>
            <Button onClick={handleConfirmSearch} className="flex-1 gap-2">
              开始搜索
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
