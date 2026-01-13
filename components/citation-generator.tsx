"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Check, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  doi: string
  journal: string
  url: string
}

interface CitationGeneratorProps {
  papers: Paper[]
}

export function CitationGenerator({ papers }: CitationGeneratorProps) {
  const [format, setFormat] = useState<"apa" | "mla" | "gbt">("apa")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()

  const generateAPACitation = (paper: Paper) => {
    const authors = paper.authors.join(", ")
    const doi = paper.doi ? ` https://doi.org/${paper.doi}` : ''
    return `${authors} (${paper.year}). ${paper.title}. ${paper.journal}.${doi}`
  }

  const generateMLACitation = (paper: Paper) => {
    const authors = paper.authors.join(", ")
    return `${authors}. "${paper.title}." ${paper.journal} (${paper.year}). Web.`
  }

  const generateGBTCitation = (paper: Paper) => {
    const authors = paper.authors.join(", ")
    const doi = paper.doi ? ` DOI: ${paper.doi}` : ''
    return `${authors}. ${paper.title}[J]. ${paper.journal}, ${paper.year}.${doi}`
  }

  const getCitation = (paper: Paper) => {
    switch (format) {
      case "apa":
        return generateAPACitation(paper)
      case "mla":
        return generateMLACitation(paper)
      case "gbt":
        return generateGBTCitation(paper)
      default:
        return generateAPACitation(paper)
    }
  }

  const getAllCitations = () => {
    return papers.map((paper, index) => `[${index + 1}] ${getCitation(paper)}`).join("\n\n")
  }

  const handleCopy = (text: string, index?: number) => {
    navigator.clipboard.writeText(text)
    if (index !== undefined) {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
    toast({
      title: "复制成功",
      description: "引用已复制到剪贴板",
    })
  }

  const handleCopyAll = () => {
    handleCopy(getAllCitations())
  }

  const handleExportWord = () => {
    // In a real app, this would generate and download a Word document
    const content = `参考文献\n\n${getAllCitations()}`
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `references-${format}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: "引用文件已下载",
    })
  }

  const handleExportBibtex = () => {
    // Generate BibTeX format
    const bibtex = papers
      .map(
        (paper, index) => `@article{ref${index + 1},
  author = {${paper.authors.join(" and ")}},
  title = {${paper.title}},
  journal = {${paper.journal}},
  year = {${paper.year}},
  doi = {${paper.doi}}
}`,
      )
      .join("\n\n")

    const blob = new Blob([bibtex], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "references.bib"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: "BibTeX 文件已下载",
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">引用生成</h1>
        <p className="text-muted-foreground">为您选择的 {papers.length} 篇文献生成标准引用格式</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side - Selected Papers */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">已选择的文献</CardTitle>
              <CardDescription>{papers.length} 篇文献</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {papers.map((paper, index) => (
                <div key={paper.id} className="p-3 bg-muted rounded-md space-y-1">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{paper.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {paper.authors[0]} et al., {paper.year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Citations Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>引用格式</CardTitle>
              <CardDescription>选择您需要的引用格式，系统将自动生成标准引用</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="apa">APA</TabsTrigger>
                  <TabsTrigger value="mla">MLA</TabsTrigger>
                  <TabsTrigger value="gbt">GB/T 7714</TabsTrigger>
                </TabsList>

                <TabsContent value="apa" className="space-y-4 mt-6">
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">APA (American Psychological Association) 格式</p>
                    <p className="text-xs text-muted-foreground">适用于心理学、教育学和社会科学领域</p>
                  </div>
                </TabsContent>

                <TabsContent value="mla" className="space-y-4 mt-6">
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">MLA (Modern Language Association) 格式</p>
                    <p className="text-xs text-muted-foreground">适用于文学、语言学和人文学科领域</p>
                  </div>
                </TabsContent>

                <TabsContent value="gbt" className="space-y-4 mt-6">
                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">GB/T 7714 国家标准格式</p>
                    <p className="text-xs text-muted-foreground">适用于中国学术期刊和论文</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Citations Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>参考文献预览</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-2 bg-transparent">
                  <Copy className="w-4 h-4" />
                  复制全部
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {papers.map((paper, index) => (
                  <div key={paper.id} className="p-4 bg-muted rounded-md space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-mono text-muted-foreground">[{index + 1}]</span>
                      <p className="flex-1 text-sm leading-relaxed">{getCitation(paper)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(getCitation(paper), index)}
                        className="shrink-0"
                      >
                        {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>导出选项</CardTitle>
              <CardDescription>选择您需要的导出格式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExportWord}
                variant="outline"
                className="w-full justify-start gap-3 bg-transparent"
              >
                <FileText className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <p className="font-medium">导出为 Word / Text</p>
                  <p className="text-xs text-muted-foreground">导出为 .txt 文件</p>
                </div>
                <Download className="w-4 h-4" />
              </Button>

              <Button
                onClick={handleExportBibtex}
                variant="outline"
                className="w-full justify-start gap-3 bg-transparent"
              >
                <FileText className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <p className="font-medium">导出为 BibTeX</p>
                  <p className="text-xs text-muted-foreground">适用于 LaTeX 文档</p>
                </div>
                <Download className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
