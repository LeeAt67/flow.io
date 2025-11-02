import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Workflow, LayoutDashboard, FolderOpen, Package, Database, LogOut, User, Code2, Download, FileText } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Workflow className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Flow.io</span>
          </div>

          {/* 导航 */}
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                仪表板
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button variant="ghost" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                项目管理
              </Button>
            </Link>
            <Link href="/dashboard/forms">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                表单设计器
              </Button>
            </Link>
            <Link href="/dashboard/data-models">
              <Button variant="ghost" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                数据模型
              </Button>
            </Link>
            <Link href="/dashboard/code-generator">
              <Button variant="ghost" className="w-full justify-start">
                <Code2 className="mr-2 h-4 w-4" />
                代码生成器
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="ghost" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                导出项目
              </Button>
            </Link>
          </nav>

          {/* 用户信息 */}
          <div className="border-t p-4">
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted p-3">
              <User className="h-4 w-4" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{session.user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <Button type="submit" variant="ghost" className="w-full justify-start text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

