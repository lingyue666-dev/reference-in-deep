"use client"
import { Header } from "@/components/header"
import { CitationGenerator } from "@/components/citation-generator"

export default function CitationsPage() {
  // Mock selected papers data
  const mockSelectedPapers = [
    {
      id: "1",
      title: "Deep Learning for Computer Vision: A Comprehensive Review",
      authors: ["Zhang, Y.", "Wang, L.", "Chen, M."],
      year: 2023,
      source: "arXiv",
      doi: "10.48550/arXiv.2301.12345",
      journal: "arXiv preprint",
      url: "https://arxiv.org/abs/2301.12345",
    },
    {
      id: "2",
      title: "Attention Is All You Need: Transformer Networks in NLP",
      authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
      year: 2023,
      source: "Google Scholar",
      doi: "10.1145/3544548.3580123",
      journal: "Neural Information Processing Systems",
      url: "https://proceedings.neurips.cc/paper/2023/hash/abc123.html",
    },
    {
      id: "3",
      title: "Transfer Learning in Deep Neural Networks: A Survey",
      authors: ["Liu, H.", "Simonyan, K.", "Yang, Y."],
      year: 2024,
      source: "CrossRef",
      doi: "10.1016/j.neunet.2024.01.001",
      journal: "Neural Networks",
      url: "https://www.sciencedirect.com/science/article/pii/S0893608024000012",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <CitationGenerator papers={mockSelectedPapers} />
      </main>
    </div>
  )
}
