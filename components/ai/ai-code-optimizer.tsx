'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Zap, Copy, Download, CheckCircle, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AICodeOptimizerProps {
  initialCode?: string
  initialLanguage?: string
}

export function AICodeOptimizer({ initialCode = '', initialLanguage = 'typescript' }: AICodeOptimizerProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [context, setContext] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: '请输入代码',
        description: '代码内容不能为空',
        variant: 'destructive',
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/ai/optimize-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          context: context || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '分析失败')
      }

      setAnalysisResult(result.data)
      
      toast({
        title: '代码分析完成！',
        description: `代码质量评分：${result.data.score}/10`,
      })

    } catch (error) {
      console.error('AI 代码分析失败:', error)
      toast({
        title: '分析失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText)
    toast({
      title: '已复制到剪贴板',
      description: '代码已成功复制',
    })
  }

  const handleExportAnalysis = () => {
    if (analysisResult) {
      const reportData = {
        originalCode: code,
        language,
        context,
        analysis: analysisResult,
        timestamp: new Date().toISOString(),
      }
      
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = 'code-analysis-report.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800'
    if (score >= 6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            AI 代码优化器
          </CardTitle>
          <CardDescription>
            输入您的代码，AI 将分析并提供优化建议、性能改进和安全建议
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">编程语言</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">上下文信息 (可选)</label>
              <Textarea
                placeholder="描述代码的用途、框架、特殊要求等..."
                value={context}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              代码内容 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="粘贴您的代码..."
              value={code}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !code.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 正在分析中...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                分析代码
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>分析结果</span>
              <div className="flex items-center gap-2">
                <Badge className={getScoreBadgeColor(analysisResult.score)}>
                  质量评分: {analysisResult.score}/10
                </Badge>
                <Button onClick={handleExportAnalysis} size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出报告
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="suggestions">优化建议</TabsTrigger>
                <TabsTrigger value="optimized">优化代码</TabsTrigger>
                <TabsTrigger value="details">详细分析</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">代码质量</p>
                          <p className={`text-2xl font-bold ${getScoreColor(analysisResult.score)}`}>
                            {analysisResult.score}/10
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">优化建议</p>
                          <p className="text-2xl font-bold">{analysisResult.suggestions?.length || 0}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">安全建议</p>
                          <p className="text-2xl font-bold">{analysisResult.security?.length || 0}</p>
                        </div>
                        <Shield className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    优化建议
                  </h4>
                  {analysisResult.suggestions?.map((suggestion: string, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>

                {analysisResult.performance && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      性能改进
                    </h4>
                    {analysisResult.performance.map((item: string, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {analysisResult.security && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      安全建议
                    </h4>
                    {analysisResult.security.map((item: string, index: number) => (
                      <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="optimized" className="space-y-4">
                {analysisResult.optimizedCode ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">优化后的代码</h4>
                      <Button 
                        onClick={() => handleCopyCode(analysisResult.optimizedCode)} 
                        size="sm" 
                        variant="outline"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        复制代码
                      </Button>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{analysisResult.optimizedCode}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无优化代码建议
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium mb-2">原始代码</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">分析参数</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">编程语言:</span> {language}
                      </div>
                      <div>
                        <span className="font-medium">代码行数:</span> {code.split('\n').length}
                      </div>
                      {context && (
                        <div className="col-span-2">
                          <span className="font-medium">上下文:</span> {context}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
