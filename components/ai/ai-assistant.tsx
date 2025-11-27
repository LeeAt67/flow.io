'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Wand2, 
  Sparkles, 
  Code, 
  Lightbulb, 
  Zap,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIAssistantProps {
  code: string
  language: string
  fileName: string
  onCodeSuggestion?: (suggestion: string) => void
}

interface AISuggestion {
  id: string
  type: 'optimization' | 'refactor' | 'bug-fix' | 'enhancement'
  title: string
  description: string
  code?: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
}

export function AIAssistant({ code, language, fileName, onCodeSuggestion }: AIAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [userQuery, setUserQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<string[]>([])
  const { toast } = useToast()

  // 模拟AI分析代码
  const analyzeCode = async () => {
    setIsAnalyzing(true)
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 生成模拟建议
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'optimization',
          title: '性能优化建议',
          description: '使用 useMemo 优化重复计算，减少不必要的重渲染',
          code: `const memoizedValue = useMemo(() => {
  return expensiveCalculation(props.data)
}, [props.data])`,
          confidence: 85,
          impact: 'medium'
        },
        {
          id: '2',
          type: 'refactor',
          title: '代码重构建议',
          description: '将复杂的组件拆分为更小的子组件，提高可维护性',
          confidence: 92,
          impact: 'high'
        },
        {
          id: '3',
          type: 'enhancement',
          title: '功能增强建议',
          description: '添加错误边界处理，提高组件的健壮性',
          code: `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`,
          confidence: 78,
          impact: 'medium'
        }
      ]
      
      setSuggestions(mockSuggestions)
      setAnalysisHistory(prev => [...prev, `分析了 ${fileName} - ${new Date().toLocaleTimeString()}`])
      
      toast({
        title: 'AI 分析完成',
        description: `发现 ${mockSuggestions.length} 个优化建议`,
      })
    } catch (error) {
      toast({
        title: '分析失败',
        description: 'AI 分析过程中出现错误',
        variant: 'destructive'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 处理用户查询
  const handleUserQuery = async () => {
    if (!userQuery.trim()) return
    
    setIsProcessing(true)
    try {
      // 模拟AI回答
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const response = `基于您的问题"${userQuery}"，我建议您可以考虑以下几点：
      
1. 确保组件的 props 类型定义完整
2. 使用 React.memo 来优化性能
3. 添加适当的错误处理机制
4. 考虑使用自定义 Hook 来复用逻辑

这些改进可以让您的代码更加健壮和高效。`

      // 添加到建议列表
      const newSuggestion: AISuggestion = {
        id: Date.now().toString(),
        type: 'enhancement',
        title: `回答：${userQuery}`,
        description: response,
        confidence: 88,
        impact: 'medium'
      }
      
      setSuggestions(prev => [newSuggestion, ...prev])
      setUserQuery('')
      
      toast({
        title: 'AI 回答完成',
        description: '已生成针对您问题的建议',
      })
    } catch (error) {
      toast({
        title: '处理失败',
        description: 'AI 处理您的问题时出现错误',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.code && onCodeSuggestion) {
      onCodeSuggestion(suggestion.code)
      toast({
        title: '建议已应用',
        description: '代码建议已插入到编辑器中',
      })
    }
  }

  const handleCopySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.code) {
      navigator.clipboard.writeText(suggestion.code)
      toast({
        title: '复制成功',
        description: '建议代码已复制到剪贴板',
      })
    }
  }

  const getTypeColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'optimization': return 'bg-blue-100 text-blue-800'
      case 'refactor': return 'bg-purple-100 text-purple-800'
      case 'bug-fix': return 'bg-red-100 text-red-800'
      case 'enhancement': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactIcon = (impact: AISuggestion['impact']) => {
    switch (impact) {
      case 'high': return <Zap className="h-4 w-4 text-red-500" />
      case 'medium': return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <Card className="h-full border-0 shadow-none flex flex-col">
      <CardHeader className="pb-1 px-4 py-2 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <h3 className="font-medium text-gray-900">AI 助手</h3>
          </div>
          <Button 
            onClick={analyzeCode} 
            disabled={isAnalyzing}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3"
          >
            {isAnalyzing ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Wand2 className="mr-1 h-3 w-3" />
            )}
            {isAnalyzing ? '分析中' : '分析'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden p-3">
        {/* 用户查询输入 */}
        <div className="space-y-2 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="询问 AI 关于代码的问题..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserQuery()}
            />
            <Button 
              onClick={handleUserQuery}
              disabled={isProcessing || !userQuery.trim()}
              size="sm"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* AI 建议列表 */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>点击"分析代码"获取 AI 建议</p>
              <p className="text-sm">或者在上方输入框询问问题</p>
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-4">
                <div className="space-y-3">
                  {/* 建议头部 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getTypeColor(suggestion.type)}>
                          {suggestion.type === 'optimization' ? '优化' :
                           suggestion.type === 'refactor' ? '重构' :
                           suggestion.type === 'bug-fix' ? '修复' : '增强'}
                        </Badge>
                        {getImpactIcon(suggestion.impact)}
                        <Badge variant="outline">
                          {suggestion.confidence}% 置信度
                        </Badge>
                      </div>
                      <h4 className="font-medium">{suggestion.title}</h4>
                    </div>
                  </div>
                  
                  {/* 建议描述 */}
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {suggestion.description}
                  </p>
                  
                  {/* 建议代码 */}
                  {suggestion.code && (
                    <div className="bg-gray-50 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto">
                        <code>{suggestion.code}</code>
                      </pre>
                    </div>
                  )}
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2">
                    {suggestion.code && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          应用
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCopySuggestion(suggestion)}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          复制
                        </Button>
                      </>
                    )}
                    <div className="flex-1" />
                    <Button size="sm" variant="ghost">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* 分析历史 */}
        {analysisHistory.length > 0 && (
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium mb-2">分析历史</h5>
            <div className="space-y-1">
              {analysisHistory.slice(-3).map((history, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  {history}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
