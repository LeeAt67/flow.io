import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Code2, Database, Layers, Workflow } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 导航栏 */}
      <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Flow.io</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/register">注册</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            企业级 ToB Web
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              低代码实现平台
            </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            可视化流程编辑 · 表单设计 · 数据建模 · 代码生成
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                开始使用
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">查看文档</Link>
            </Button>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Workflow className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>可视化编辑器</CardTitle>
              <CardDescription>基于 ReactFlow 的强大流程编辑器</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                拖拽式节点连接，直观的流程设计，支持多种节点类型和自定义配置
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Layers className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>组件库管理</CardTitle>
              <CardDescription>可复用的组件模板系统</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                预置丰富的组件库，支持自定义组件，快速构建企业应用
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>数据模型设计</CardTitle>
              <CardDescription>灵活的数据建模工具</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                可视化数据表设计，自动生成 Prisma Schema，支持关联关系
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code2 className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>代码生成</CardTitle>
              <CardDescription>一键生成生产级代码</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                基于最佳实践的代码模板，生成 Next.js + TypeScript 应用
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 技术栈 */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">技术栈</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>前端</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js 15 + React 19</li>
                  <li>• TypeScript 5</li>
                  <li>• ReactFlow 12</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• shadcn/ui</li>
                  <li>• Zustand</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>后端</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js API Routes</li>
                  <li>• Server Actions</li>
                  <li>• PostgreSQL</li>
                  <li>• Prisma ORM</li>
                  <li>• NextAuth.js v5</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>开发工具</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• pnpm</li>
                  <li>• ESLint + Prettier</li>
                  <li>• React Hook Form</li>
                  <li>• Zod</li>
                  <li>• Lucide Icons</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Flow.io. All rights reserved.</p>
      </footer>
    </div>
  )
}

