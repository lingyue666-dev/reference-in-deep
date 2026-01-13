import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, Sparkles, FileText, BookMarked } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              智能文献搜索与引用管理平台
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
              让文献搜索和引用
              <span className="text-accent"> 更简单高效</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              几分钟内完成文献搜索、智能分析、引用生成和存档。专为学术研究者打造的一站式解决方案。
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  开始免费使用
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  登录账户
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">解决学术写作中的核心痛点</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">智能搜索</h3>
                  <p className="text-sm text-muted-foreground">
                    AI自动识别领域和关键词，多源聚合搜索，快速找到相关文献
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">AI摘要</h3>
                  <p className="text-sm text-muted-foreground">自动生成文献摘要，快速了解核心内容，提高阅读效率</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">引用生成</h3>
                  <p className="text-sm text-muted-foreground">支持APA、MLA、GB/T 7714等多种格式，一键生成标准引用</p>
                </CardContent>
              </Card>

              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold">文献管理</h3>
                  <p className="text-sm text-muted-foreground">自动存档搜索历史，建立个人文献库，随时查看和引用</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">准备好提升您的学术效率了吗？</h2>
            <p className="text-lg text-muted-foreground">立即注册，开始使用AI文献搜索助手</p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                免费开始使用
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AI文献助手. 智能学术研究平台</p>
        </div>
      </footer>
    </div>
  )
}
