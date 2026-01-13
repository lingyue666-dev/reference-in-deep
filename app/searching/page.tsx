"use client"

import { useEffect, useState, Suspense } from "react"
import { Header } from "@/components/header"
import { SearchingProgress } from "@/components/searching-progress"
import { useRouter, useSearchParams } from "next/navigation"

function SearchingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchComplete, setSearchComplete] = useState(false)

  const topic = searchParams.get("topic") || ""
  const keywords = searchParams.get("keywords")?.split(",") || []
  const yearStart = searchParams.get("yearStart") || "2020"
  const yearEnd = searchParams.get("yearEnd") || "2025"
  const domain = searchParams.get("domain") || ""

  useEffect(() => {
    // Simulate search completion after progress is done
    const timer = setTimeout(() => {
      setSearchComplete(true)
      // Navigate to results page
      router.push(
        "/results?" +
          new URLSearchParams({
            topic,
            keywords: keywords.join(","),
            yearStart,
            yearEnd,
            domain,
          }).toString(),
      )
    }, 8000) // 8 seconds for demo

    return () => clearTimeout(timer)
  }, [router, topic, keywords, yearStart, yearEnd, domain])

  const handleCancel = () => {
    router.push("/search")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <SearchingProgress topic={topic} onCancel={handleCancel} />
      </main>
    </div>
  )
}

export default function SearchingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchingContent />
    </Suspense>
  )
}
