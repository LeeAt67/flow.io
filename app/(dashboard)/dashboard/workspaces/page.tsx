'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Users, 
  User, 
  Settings, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Eye,
  Lock,
  Globe,
  Package
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface WorkspaceData {
  id: string
  name: string
  description?: string
  type: 'personal' | 'team'
  memberCount: number
  componentCount: number
  isOwner: boolean
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  lastActivity: string
  isPublic: boolean
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 模拟数据
  useEffect(() => {
    const mockWorkspaces: WorkspaceData[] = [
      {
        id: '1',
        name: '我的个人工作区',
        description: '个人组件库和实验项目',
        type: 'personal',
        memberCount: 1,
        componentCount: 12,
        isOwner: true,
        role: 'owner',
        lastActivity: '2小时前',
        isPublic: false
      },
      {
        id: '2',
        name: 'UI 设计团队',
        description: '公司 UI 组件库和设计系统',
        type: 'team',
        memberCount: 8,
        componentCount: 45,
        isOwner: true,
        role: 'owner',
        lastActivity: '1天前',
        isPublic: false
      },
      {
        id: '3',
        name: '开源组件库',
        description: '面向社区的开源 React 组件',
        type: 'team',
        memberCount: 15,
        componentCount: 28,
        isOwner: false,
        role: 'editor',
        lastActivity: '3天前',
        isPublic: true
      }
    ]
    setWorkspaces(mockWorkspaces)
  }, [])

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const personalWorkspaces = filteredWorkspaces.filter(w => w.type === 'personal')
  const teamWorkspaces = filteredWorkspaces.filter(w => w.type === 'team')

  const handleCreateWorkspace = () => {
    toast({
      title: '创建工作区',
      description: '工作区创建功能开发中...',
    })
  }

  const WorkspaceCard = ({ workspace }: { workspace: WorkspaceData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{workspace.name}</CardTitle>
              {workspace.isPublic ? (
                <Globe className="h-4 w-4 text-blue-500" />
              ) : (
                <Lock className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {workspace.description || '暂无描述'}
            </CardDescription>
          </div>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{workspace.memberCount} 成员</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{workspace.componentCount} 组件</span>
              </div>
            </div>
          </div>

          {/* 角色和状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={workspace.type === 'personal' ? 'secondary' : 'default'}>
                {workspace.type === 'personal' ? '个人' : '团队'}
              </Badge>
              <Badge variant="outline">
                {workspace.role === 'owner' ? '拥有者' : 
                 workspace.role === 'admin' ? '管理员' : 
                 workspace.role === 'editor' ? '编辑者' : '查看者'}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {workspace.lastActivity}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/dashboard/workspaces/${workspace.id}`}>
                <Eye className="mr-1 h-3 w-3" />
                进入工作区
              </Link>
            </Button>
            {workspace.isOwner && (
              <Button size="sm" variant="outline">
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">工作区</h1>
          <p className="text-muted-foreground">
            管理你的个人和团队工作区，创建和分享组件
          </p>
        </div>
        <Button onClick={handleCreateWorkspace}>
          <Plus className="mr-2 h-4 w-4" />
          创建工作区
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索工作区..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">全部工作区 ({filteredWorkspaces.length})</TabsTrigger>
          <TabsTrigger value="personal">个人 ({personalWorkspaces.length})</TabsTrigger>
          <TabsTrigger value="team">团队 ({teamWorkspaces.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredWorkspaces.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Users className="mb-4 h-16 w-16" />
                  <p>没有找到工作区</p>
                  <p className="text-sm">创建你的第一个工作区开始使用</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          {personalWorkspaces.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {personalWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <User className="mb-4 h-16 w-16" />
                  <p>还没有个人工作区</p>
                  <Button onClick={handleCreateWorkspace} className="mt-4">
                    创建个人工作区
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {teamWorkspaces.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamWorkspaces.map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Users className="mb-4 h-16 w-16" />
                  <p>还没有加入团队工作区</p>
                  <Button onClick={handleCreateWorkspace} className="mt-4">
                    创建团队工作区
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
