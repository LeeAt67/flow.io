'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Activity,
  Clock,
  TrendingUp,
  Package,
  Eye,
  Download,
  Share2,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { api, Project } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const getStatusText = (isPublic: boolean) => {
  return isPublic ? '公开' : '私有'
}

const getStatusColor = (isPublic: boolean) => {
  return isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
}

const getCategoryIcon = () => {
  return <Package className="h-4 w-4" />
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return '刚刚'
  if (diffInHours < 24) return `${diffInHours}小时前`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}天前`
  return formatDate(dateString)
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  // 加载项目列表
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    const result = await api.projects.list()
    
    if (result.success) {
      setProjects(result.data as Project[] || [])
    } else {
      toast({
        title: '加载失败',
        description: result.error || '无法加载项目列表',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`确定要删除项目 "${projectName}" 吗？`)) {
      return
    }

    const result = await api.projects.delete(projectId)
    if (result.success) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
      toast({
        title: '删除成功',
        description: `项目 "${projectName}" 已被删除`
      })
    } else {
      toast({
        title: '删除失败',
        description: result.error || '无法删除项目',
        variant: 'destructive'
      })
    }
  }

  // 筛选项目
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'public') return matchesSearch && project.isPublic
    if (activeTab === 'private') return matchesSearch && !project.isPublic
    
    return matchesSearch
  })

  // 统计数据
  const stats = {
    total: projects.length,
    public: projects.filter(p => p.isPublic).length,
    private: projects.filter(p => !p.isPublic).length,
    recent: projects.filter(p => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.isPublic)}>
              {getStatusText(project.isPublic)}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteProject(project.id, project.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {project.description || '暂无描述'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 项目信息 */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>创建: {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>更新: {getTimeAgo(project.updatedAt)}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/dashboard/projects/${project.id}`}>
              <Eye className="mr-2 h-3 w-3" />
              查看详情
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="mr-2 h-3 w-3" />
            编辑
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleDeleteProject(project.id, project.name)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ title, description, showCreateButton = true }: {
    title: string
    description: string
    showCreateButton?: boolean
  }) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {showCreateButton && (
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Link>
          </Button>
        )}
      </div>
    </div>
  )

  const LoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )

  const ProjectGrid = ({ projects }: { projects: Project[] }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* 页面头部 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            项目管理
          </h1>
          <p className="text-muted-foreground mt-1">
            管理你的所有项目，跟踪进度和团队协作
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Link>
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.total}</p>
                <p className="text-sm text-muted-foreground">总项目数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.public}</p>
                <p className="text-sm text-muted-foreground">公开项目</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.private}</p>
                <p className="text-sm text-muted-foreground">私有项目</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.recent}</p>
                <p className="text-sm text-muted-foreground">近期更新</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          筛选
        </Button>
      </div>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="all">全部项目</TabsTrigger>
          <TabsTrigger value="public">公开项目</TabsTrigger>
          <TabsTrigger value="private">私有项目</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 overflow-y-auto">
          {loading ? (
            <LoadingState />
          ) : filteredProjects.length === 0 ? (
            <EmptyState 
              title="没有找到项目"
              description={searchTerm ? '试试修改搜索条件' : '创建你的第一个项目吧'}
            />
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </TabsContent>

        <TabsContent value="public" className="flex-1 overflow-y-auto">
          {loading ? (
            <LoadingState />
          ) : filteredProjects.length === 0 ? (
            <EmptyState 
              title="没有公开项目"
              description="公开项目可以被其他用户查看"
              showCreateButton={false}
            />
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </TabsContent>

        <TabsContent value="private" className="flex-1 overflow-y-auto">
          {loading ? (
            <LoadingState />
          ) : filteredProjects.length === 0 ? (
            <EmptyState 
              title="没有私有项目"
              description="私有项目只有你可以查看"
              showCreateButton={false}
            />
          ) : (
            <ProjectGrid projects={filteredProjects} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
