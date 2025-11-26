'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Code, 
  Zap,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react'

interface FeatureStatus {
  name: string
  progress: number
  status: 'completed' | 'in-progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
}

const projectFeatures: FeatureStatus[] = [
  { name: '项目基础架构', progress: 100, status: 'completed', priority: 'high' },
  { name: '用户认证系统', progress: 100, status: 'completed', priority: 'high' },
  { name: '流程编辑器', progress: 75, status: 'in-progress', priority: 'high' },
  { name: '表单设计器', progress: 50, status: 'in-progress', priority: 'medium' },
  { name: '数据模型设计', progress: 50, status: 'in-progress', priority: 'medium' },
  { name: 'AI 辅助功能', progress: 30, status: 'in-progress', priority: 'high' },
  { name: '代码生成器', progress: 40, status: 'in-progress', priority: 'medium' },
  { name: '部署导出功能', progress: 0, status: 'pending', priority: 'low' },
]

const milestones = [
  { name: 'MVP 完成', date: '2025-01-31', progress: 65 },
  { name: '功能增强', date: '2025-04-30', progress: 0 },
  { name: '生产就绪', date: '2025-07-31', progress: 0 },
]

const teamMetrics = {
  totalFeatures: 8,
  completedFeatures: 2,
  inProgressFeatures: 5,
  pendingFeatures: 1,
  overallProgress: 65,
  estimatedCompletion: '2025-07-31'
}

export function ProjectDashboard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return ''
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* 项目概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总体进度</p>
                <p className="text-2xl font-bold">{teamMetrics.overallProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={teamMetrics.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已完成功能</p>
                <p className="text-2xl font-bold">{teamMetrics.completedFeatures}/{teamMetrics.totalFeatures}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold">{teamMetrics.inProgressFeatures}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">预计完成</p>
                <p className="text-lg font-bold">2025-07</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 功能模块进度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            功能模块开发进度
          </CardTitle>
          <CardDescription>
            各个核心功能模块的开发状态和完成度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectFeatures.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(feature.status)}
                    <span className="font-medium">{feature.name}</span>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status === 'completed' ? '已完成' : 
                       feature.status === 'in-progress' ? '进行中' : '待开发'}
                    </Badge>
                    <Badge className={getPriorityColor(feature.priority)}>
                      {feature.priority === 'high' ? '高' : 
                       feature.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{feature.progress}%</span>
                </div>
                <Progress value={feature.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 里程碑 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            项目里程碑
          </CardTitle>
          <CardDescription>
            关键开发阶段和预期完成时间
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      milestone.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <span className="font-medium">{milestone.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{milestone.date}</div>
                    <div className="text-sm font-medium">{milestone.progress}%</div>
                  </div>
                </div>
                <Progress value={milestone.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 技术栈和资源 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              技术栈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Next.js 15 + React 19</span>
                <Badge variant="secondary">前端</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">TypeScript + Tailwind CSS</span>
                <Badge variant="secondary">样式</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">PostgreSQL + Prisma</span>
                <Badge variant="secondary">数据库</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NextAuth.js + OpenAI</span>
                <Badge variant="secondary">服务</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ReactFlow + Zustand</span>
                <Badge variant="secondary">状态管理</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              团队资源
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">全栈开发工程师</span>
                <Badge variant="outline">3-4人</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">UI/UX 设计师</span>
                <Badge variant="outline">1人</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">产品经理</span>
                <Badge variant="outline">1人</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">预算估算</span>
                <Badge variant="outline">100-150万</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">开发周期</span>
                <Badge variant="outline">8-12个月</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
