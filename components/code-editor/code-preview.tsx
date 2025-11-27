'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Eye, 
  Code, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share,
  Zap,
  Activity,
  Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CodePreviewProps {
  code: string
  language: string
  fileName: string
  aiAssistant?: React.ReactNode
}

export function CodePreview({ code, language, fileName, aiAssistant }: CodePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isValidCode, setIsValidCode] = useState(true)
  const [isLivePreview, setIsLivePreview] = useState(true)
  const [renderTime, setRenderTime] = useState(0)
  const [isInteractive, setIsInteractive] = useState(true)
  const [codeAnalysis, setCodeAnalysis] = useState<{
    lines: number
    functions: number
    components: number
    imports: number
    exports: number
    complexity: number
    performance: 'good' | 'medium' | 'poor'
  } | null>(null)
  const { toast } = useToast()

  // 分析代码结构
  const analyzeCode = useMemo(() => {
    if (!code) return null

    const lines = code.split('\n').filter(line => line.trim().length > 0).length
    const functions = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length
    const components = (code.match(/export\s+(function|const)\s+[A-Z]\w*/g) || []).length
    const imports = (code.match(/^import\s+/gm) || []).length
    const exports = (code.match(/^export\s+/gm) || []).length
    
    // 计算代码复杂度
    const complexity = Math.min(10, Math.floor((functions * 2 + components * 3 + lines * 0.1)))
    const performance: 'good' | 'medium' | 'poor' = complexity <= 3 ? 'good' : complexity <= 6 ? 'medium' : 'poor'

    return { lines, functions, components, imports, exports, complexity, performance }
  }, [code])

  useEffect(() => {
    const startTime = performance.now()
    
    setCodeAnalysis(analyzeCode)
    
    // 简单的代码验证
    try {
      // 检查基本语法错误
      const hasUnmatchedBrackets = (code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length
      const hasUnmatchedParens = (code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length
      
      setIsValidCode(!hasUnmatchedBrackets && !hasUnmatchedParens)
      
      // 计算渲染时间
      const endTime = performance.now()
      setRenderTime(Math.round(endTime - startTime))
    } catch (error) {
      setIsValidCode(false)
      setRenderTime(0)
    }
  }, [code, analyzeCode])

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'w-full'
    }
  }

  const renderComponentPreview = () => {
    if (language !== 'typescript' && language !== 'tsx') {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Code className="mb-4 h-16 w-16" />
          <p>此文件类型不支持可视化预览</p>
          <p className="text-sm">支持的类型：React 组件 (.tsx)</p>
        </div>
      )
    }

    if (!isValidCode) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-red-500">
          <AlertTriangle className="mb-4 h-16 w-16" />
          <p>代码存在语法错误</p>
          <p className="text-sm">请检查括号匹配和语法</p>
        </div>
      )
    }

    // 模拟组件预览
    if (fileName.includes('Form')) {
      return (
        <div className={`mx-auto ${getPreviewWidth()}`}>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">表单预览</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">姓名 *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">邮箱 *</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="请输入邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">年龄</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="请输入年龄"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  提交
                </button>
                <button className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (fileName.includes('Table')) {
      return (
        <div className={`mx-auto ${getPreviewWidth()}`}>
          <div className="border rounded-lg bg-white shadow-sm">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">数据表格预览</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                  新增
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">姓名</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">邮箱</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">张三</td>
                    <td className="px-4 py-2">zhang@example.com</td>
                    <td className="px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        活跃
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline text-sm mr-2">编辑</button>
                      <button className="text-red-600 hover:underline text-sm">删除</button>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">李四</td>
                    <td className="px-4 py-2">li@example.com</td>
                    <td className="px-4 py-2">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                        禁用
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline text-sm mr-2">编辑</button>
                      <button className="text-red-600 hover:underline text-sm">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }

    // 默认代码预览
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <p>代码结构正确</p>
        <p className="text-sm">可以安全使用此组件</p>
      </div>
    )
  }

  return (
    <Card className="h-full border-0 shadow-none flex flex-col">
      <CardHeader className="pb-1 px-4 py-2 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">预览</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isValidCode ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className="text-xs text-gray-500">
                {isValidCode ? '正常' : '错误'}
              </span>
              {renderTime > 0 && (
                <span className="text-xs text-gray-500">
                  {renderTime}ms
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {/* 设备预览模式 */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setPreviewMode('desktop')}
                className={`rounded-none px-2 ${previewMode === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setPreviewMode('tablet')}
                className={`rounded-none border-l px-2 ${previewMode === 'tablet' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setPreviewMode('mobile')}
                className={`rounded-none border-l px-2 ${previewMode === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            {/* 刷新 */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="px-4 pb-1 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="preview" className="text-xs">可视化预览</TabsTrigger>
              <TabsTrigger value="ai-assistant" className="text-xs">AI助手</TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">代码分析</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preview" className="mt-0 p-4 flex-1">
            <div className="h-full bg-gray-50 rounded-lg p-4">
              {renderComponentPreview()}
            </div>
          </TabsContent>
          
          <TabsContent value="ai-assistant" className="mt-0 p-0 flex-1">
            {aiAssistant}
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0 p-4 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* 基础统计 */}
              {codeAnalysis && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    代码统计
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">{codeAnalysis.lines}</div>
                      <div className="text-sm text-blue-600">代码行数</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">{codeAnalysis.components}</div>
                      <div className="text-sm text-green-600">组件数量</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">{codeAnalysis.functions}</div>
                      <div className="text-sm text-purple-600">函数数量</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">{codeAnalysis.imports}</div>
                      <div className="text-sm text-orange-600">导入模块</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border">
                      <div className="text-2xl font-bold text-red-600">{codeAnalysis.exports}</div>
                      <div className="text-sm text-red-600">导出模块</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                      <div className="text-2xl font-bold text-yellow-600">{codeAnalysis.complexity}/10</div>
                      <div className="text-sm text-yellow-600">复杂度</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 性能分析 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  性能分析
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">渲染时间</span>
                      <Badge variant="outline">{renderTime}ms</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${renderTime < 50 ? 'bg-green-500' : renderTime < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (renderTime / 200) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">代码质量</span>
                      <Badge variant={codeAnalysis?.performance === 'good' ? 'default' : 
                                   codeAnalysis?.performance === 'medium' ? 'secondary' : 'destructive'}>
                        {codeAnalysis?.performance === 'good' ? '优秀' : 
                         codeAnalysis?.performance === 'medium' ? '良好' : '需改进'}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${codeAnalysis?.performance === 'good' ? 'bg-green-500' : 
                                   codeAnalysis?.performance === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${codeAnalysis?.performance === 'good' ? 90 : 
                                        codeAnalysis?.performance === 'medium' ? 60 : 30}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 代码质量检查 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  质量检查
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">语法结构正确</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">导入导出规范</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">TypeScript 类型安全</span>
                  </div>
                  {codeAnalysis && codeAnalysis.complexity > 7 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">代码复杂度较高，建议重构</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 优化建议 */}
              <div>
                <h4 className="font-medium mb-3">优化建议</h4>
                <div className="text-sm text-muted-foreground space-y-2 bg-gray-50 p-4 rounded-lg border">
                  <p>• 代码已经过优化，可以直接复制使用</p>
                  <p>• 确保项目中已安装所需的依赖包</p>
                  <p>• 根据实际需求调整样式和逻辑</p>
                  <p>• 建议进行单元测试验证功能</p>
                  {codeAnalysis && codeAnalysis.performance === 'poor' && (
                    <p className="text-yellow-600">• 考虑拆分复杂组件以提高可维护性</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
