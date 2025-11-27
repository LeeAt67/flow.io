import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Workflow, LayoutDashboard, FolderOpen, Package, Settings, LogOut, User, Code2, Download, FileText, Sparkles, Library } from 'lucide-react'
import { UserProfileSection } from '../../components/user/user-profile-section'
import { NavLink } from '../../components/ui/nav-link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex h-full">
      {/* 侧边栏 */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Workflow className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Flow.io</span>
          </div>

          {/* 导航 */}
          <nav className="flex-1 space-y-2 p-4">
            <div className="pt-2">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">工作空间</p>
              <div className="mt-2 space-y-1">
                <NavLink href="/dashboard/workspaces">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  我的工作区
                </NavLink>
                <NavLink href="/dashboard/my-components">
                  <User className="mr-2 h-4 w-4" />
                  我的组件
                </NavLink>
                <NavLink href="/dashboard/component-library">
                  <Library className="mr-2 h-4 w-4" />
                  组件库
                </NavLink>
                <NavLink href="/dashboard/projects">
                  <Package className="mr-2 h-4 w-4" />
                  项目管理
                </NavLink>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">AI 工具</p>
              <div className="mt-2 space-y-1">
                <NavLink href="/dashboard/ai-assistant">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI 助手
                </NavLink>
                <NavLink href="/dashboard/code-generator">
                  <Code2 className="mr-2 h-4 w-4" />
                  代码生成器
                </NavLink>
              </div>
            </div>
            
          </nav>

          {/* 用户信息 */}
          <UserProfileSection user={session.user} />
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-8">{children}</div>
      </main>
    </div>
  )
}

