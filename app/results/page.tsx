"use client"

import { useState, Suspense, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchResults } from "@/components/search-results"
import { useSearchParams } from "next/navigation"

function ResultsContent() {
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic") || ""
  
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPapers, setSelectedPapers] = useState<any[]>([])

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/search?q=${encodeURIComponent(topic)}&limit=100&offset=0`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API request failed with status ${response.status}`)
        }
        
        const results = await response.json()
        setPapers(results)
        setError(null)
      } catch (err) {
        console.error("Error fetching papers:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch papers. Please try again later."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (topic) {
      fetchPapers()
    }
  }, [topic])

  const handleTogglePaper = (paper: any) => {
    setSelectedPapers((prev) => {
      const exists = prev.find((p) => p.id === paper.id)
      if (exists) {
        return prev.filter((p) => p.id !== paper.id)
      }
      return [...prev, paper]
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading papers...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header isLoggedIn={true} />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <div className="text-red-500 text-xl mb-4">搜索失败</div>
            <div className="text-gray-700 mb-6">{error}</div>
            <div className="text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2">提示：</p>
              <p>如果遇到 API 速率限制，请：</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>检查您的 Ai4Scholar 积分余额</li>
                <li>访问 https://ai4scholar.net 获取更多积分</li>
                <li>或等待积分重置后重试</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1">
        <SearchResults
          topic={topic}
          papers={papers}
          selectedPapers={selectedPapers}
          onTogglePaper={handleTogglePaper}
        />
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
