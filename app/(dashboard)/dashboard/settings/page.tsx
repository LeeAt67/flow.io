import { Metadata } from 'next'
import { ProjectDashboard } from '@/components/project-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, BarChart3, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: '项目设置 - Flow.io',
  description: '项目进度、团队管理和系统配置',
}

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">项目设置</h2>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            项目仪表板
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            团队管理
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI 配置
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            系统设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <ProjectDashboard />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>团队成员</CardTitle>
              <CardDescription>
                管理项目团队成员和权限设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                团队管理功能开发中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI 服务配置</CardTitle>
              <CardDescription>
                配置 OpenAI API 和其他 AI 服务设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">OpenAI 配置</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">API 状态</span>
                          <span className="text-sm text-green-600">已连接</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">模型版本</span>
                          <span className="text-sm">GPT-4 Turbo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">本月使用量</span>
                          <span className="text-sm">$45.20</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">功能启用状态</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">流程生成</span>
                          <span className="text-sm text-green-600">已启用</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">表单生成</span>
                          <span className="text-sm text-green-600">已启用</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">代码优化</span>
                          <span className="text-sm text-green-600">已启用</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">聊天助手</span>
                          <span className="text-sm text-green-600">已启用</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统配置</CardTitle>
              <CardDescription>
                数据库、缓存和其他系统级设置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">数据库</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">类型</span>
                          <span className="text-sm">PostgreSQL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">版本</span>
                          <span className="text-sm">14.x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">状态</span>
                          <span className="text-sm text-green-600">正常</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">认证</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">服务</span>
                          <span className="text-sm">NextAuth.js</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">版本</span>
                          <span className="text-sm">v5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">状态</span>
                          <span className="text-sm text-green-600">正常</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">部署</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">环境</span>
                          <span className="text-sm">开发</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">版本</span>
                          <span className="text-sm">v0.1.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">最后部署</span>
                          <span className="text-sm">2025-11-27</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
