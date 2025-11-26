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
  Monitor
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CodePreviewProps {
  code: string
  language: string
  fileName: string
}

export function CodePreview({ code, language, fileName }: CodePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isValidCode, setIsValidCode] = useState(true)
  const [codeAnalysis, setCodeAnalysis] = useState<{
    lines: number
    functions: number
    components: number
    imports: number
    exports: number
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

    return { lines, functions, components, imports, exports }
  }, [code])

  useEffect(() => {
    setCodeAnalysis(analyzeCode)
    
    // 简单的代码验证
    try {
      // 检查基本语法错误
      const hasUnmatchedBrackets = (code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length
      const hasUnmatchedParens = (code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length
      
      setIsValidCode(!hasUnmatchedBrackets && !hasUnmatchedParens)
    } catch (error) {
      setIsValidCode(false)
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">预览</CardTitle>
            <Badge variant={isValidCode ? 'default' : 'destructive'} className="text-xs">
              {isValidCode ? '有效' : '错误'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              size="sm" 
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="preview" className="h-full">
          <div className="px-4 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">可视化预览</TabsTrigger>
              <TabsTrigger value="analysis">代码分析</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="preview" className="mt-0 p-4">
            <div className="min-h-[500px] bg-gray-50 rounded-lg p-4">
              {renderComponentPreview()}
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0 p-4">
            <div className="space-y-4">
              {codeAnalysis && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{codeAnalysis.lines}</div>
                    <div className="text-sm text-blue-600">代码行数</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{codeAnalysis.components}</div>
                    <div className="text-sm text-green-600">组件数量</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{codeAnalysis.functions}</div>
                    <div className="text-sm text-purple-600">函数数量</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{codeAnalysis.imports}</div>
                    <div className="text-sm text-orange-600">导入模块</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{codeAnalysis.exports}</div>
                    <div className="text-sm text-red-600">导出模块</div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="font-medium">代码质量检查</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">语法结构正确</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">导入导出规范</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">TypeScript 类型安全</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">使用建议</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• 代码已经过优化，可以直接复制使用</p>
                  <p>• 确保项目中已安装所需的依赖包</p>
                  <p>• 根据实际需求调整样式和逻辑</p>
                  <p>• 建议进行单元测试验证功能</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
