import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AIFlowGenerator } from '@/components/ai/ai-flow-generator'
import { AIFormGenerator } from '@/components/ai/ai-form-generator'
import { AICodeOptimizer } from '@/components/ai/ai-code-optimizer'
import { AIChatAssistant } from '@/components/ai/ai-chat-assistant'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Workflow, FileText, Code, MessageCircle, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI 助手 - Flow.io',
  description: 'AI 驱动的智能开发助手，提供流程生成、表单设计、代码优化等功能',
}

export default function AIAssistantPage() {
  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            AI 工具中心
          </h2>
          <p className="text-muted-foreground">
            利用人工智能技术，快速生成业务流程、表单设计、代码优化和专业咨询
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Zap className="mr-1 h-4 w-4" />
          GPT-4 Turbo
        </Badge>
      </div>

      {/* AI 功能概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">流程生成</p>
                <p className="text-sm text-muted-foreground">智能业务流程设计</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">表单生成</p>
                <p className="text-sm text-muted-foreground">自动表单字段配置</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">代码优化</p>
                <p className="text-sm text-muted-foreground">智能代码分析优化</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">智能问答</p>
                <p className="text-sm text-muted-foreground">专业技术咨询</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI 功能选项卡 */}
      <Tabs defaultValue="flow" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flow" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            流程生成
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            表单生成
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            代码优化
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            智能问答
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-blue-500" />
                AI 流程生成器
              </CardTitle>
              <CardDescription>
                通过自然语言描述，AI 将自动生成完整的业务流程图
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIFlowGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                AI 表单生成器
              </CardTitle>
              <CardDescription>
                根据业务需求，智能推荐表单字段和验证规则
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIFormGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                AI 代码优化器
              </CardTitle>
              <CardDescription>
                分析代码质量，提供优化建议和安全性改进方案
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AICodeOptimizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIChatAssistant 
                context="Flow.io 低代码平台开发"
                placeholder="询问关于流程设计、表单创建、数据建模等问题..."
              />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">常见问题</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">流程设计</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 如何设计用户注册流程？</li>
                      <li>• 条件节点如何配置？</li>
                      <li>• 流程执行顺序规则</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">表单创建</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 表单验证规则设置</li>
                      <li>• 动态字段配置</li>
                      <li>• 表单样式自定义</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">数据建模</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 数据库关系设计</li>
                      <li>• 字段类型选择</li>
                      <li>• 索引优化建议</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">AI 使用统计</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>流程生成</span>
                    <Badge variant="secondary">12 次</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>表单生成</span>
                    <Badge variant="secondary">8 次</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>代码优化</span>
                    <Badge variant="secondary">5 次</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>智能问答</span>
                    <Badge variant="secondary">23 次</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
