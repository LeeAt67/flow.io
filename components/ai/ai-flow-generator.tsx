'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Download, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useFlowStore } from '@/store/flow-store'

interface AIFlowGeneratorProps {
  onGenerated?: (nodes: any[], edges: any[]) => void
}

export function AIFlowGenerator({ onGenerated }: AIFlowGeneratorProps) {
  const [description, setDescription] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFlow, setGeneratedFlow] = useState<any>(null)
  const { toast } = useToast()
  const { setNodes, setEdges } = useFlowStore()

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: '请输入需求描述',
        description: '需求描述不能为空',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          businessType: businessType || undefined,
          complexity,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '生成失败')
      }

      setGeneratedFlow(result.data)
      
      toast({
        title: '流程生成成功！',
        description: `已生成 ${result.data.nodes?.length || 0} 个节点的业务流程`,
      })

    } catch (error) {
      console.error('AI 流程生成失败:', error)
      toast({
        title: '生成失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyFlow = () => {
    if (generatedFlow) {
      setNodes(generatedFlow.nodes || [])
      setEdges(generatedFlow.edges || [])
      onGenerated?.(generatedFlow.nodes || [], generatedFlow.edges || [])
      
      toast({
        title: '流程已应用',
        description: 'AI 生成的流程已应用到编辑器中',
      })
    }
  }

  const handleExportFlow = () => {
    if (generatedFlow) {
      const dataStr = JSON.stringify(generatedFlow, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = 'ai-generated-flow.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI 流程生成器
          </CardTitle>
          <CardDescription>
            描述您的业务需求，AI 将自动生成对应的业务流程图
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              需求描述 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="例如：用户注册流程，包含邮箱验证、信息填写、审核等步骤..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">业务类型</label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择业务类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">电商</SelectItem>
                  <SelectItem value="finance">金融</SelectItem>
                  <SelectItem value="education">教育</SelectItem>
                  <SelectItem value="healthcare">医疗</SelectItem>
                  <SelectItem value="manufacturing">制造业</SelectItem>
                  <SelectItem value="logistics">物流</SelectItem>
                  <SelectItem value="hr">人力资源</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">复杂度</label>
              <Select value={complexity} onValueChange={(value: 'simple' | 'medium' | 'complex') => setComplexity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">简单 (3-5个节点)</SelectItem>
                  <SelectItem value="medium">中等 (5-10个节点)</SelectItem>
                  <SelectItem value="complex">复杂 (10+个节点)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !description.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 正在生成中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                生成流程图
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedFlow && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>生成结果</span>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {generatedFlow.nodes?.length || 0} 个节点
                </Badge>
                <Badge variant="secondary">
                  {generatedFlow.edges?.length || 0} 个连接
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              AI 已根据您的需求生成业务流程，您可以预览、应用或导出
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={handleApplyFlow} className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                应用到编辑器
              </Button>
              <Button onClick={handleExportFlow} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                导出 JSON
              </Button>
            </div>
            
            {/* 流程预览 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">流程节点预览：</h4>
              <div className="space-y-2">
                {generatedFlow.nodes?.map((node: any, index: number) => (
                  <div key={node.id} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {node.type}
                    </Badge>
                    <span>{node.data?.label || `节点 ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
