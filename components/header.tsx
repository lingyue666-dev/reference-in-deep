"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Library, History, User } from "lucide-react"

interface HeaderProps {
  isLoggedIn?: boolean
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-foreground">AI文献助手</span>
          </Link>

          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/search"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-4 h-4" />
                搜索文献
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Library className="w-4 h-4" />
                文献库
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <History className="w-4 h-4" />
                历史记录
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/register">
                  <Button>注册</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
