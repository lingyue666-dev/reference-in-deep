"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchScopeConfirm } from "@/components/search-scope-confirm"
import { useRouter } from "next/navigation"

export default function SearchPage() {
  const router = useRouter()
  const [searchScope, setSearchScope] = useState<{
    topic: string
    keywords: string[]
    yearRange: [number, number]
    domain: string
  } | null>(null)

  const handleStartSearch = (scope: {
    topic: string
    keywords: string[]
    yearRange: [number, number]
    domain: string
  }) => {
    setSearchScope(scope)
    // Navigate to searching page with scope data
    router.push(
      "/searching?" +
        new URLSearchParams({
          topic: scope.topic,
          keywords: scope.keywords.join(","),
          yearStart: scope.yearRange[0].toString(),
          yearEnd: scope.yearRange[1].toString(),
          domain: scope.domain,
        }).toString(),
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <SearchScopeConfirm onStartSearch={handleStartSearch} />
      </main>
    </div>
  )
}
