"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CitationGenerator } from "@/components/citation-generator"

export default function CitationsPage() {
  const [selectedPapers, setSelectedPapers] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedPapers')
      if (stored) {
        try {
          const papers = JSON.parse(stored)
          setSelectedPapers(papers)
        } catch (error) {
          console.error('Failed to parse selected papers:', error)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {selectedPapers.length > 0 ? (
          <CitationGenerator papers={selectedPapers} />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">暂无选择的文献</h2>
            <p className="text-muted-foreground mb-6">请先在搜索结果页面选择要生成引用的文献</p>
          </div>
        )}
      </main>
    </div>
  )
}
