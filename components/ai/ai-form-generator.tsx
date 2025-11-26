'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Download, Eye, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIFormGeneratorProps {
  onGenerated?: (fields: any[]) => void
}

export function AIFormGenerator({ onGenerated }: AIFormGeneratorProps) {
  const [purpose, setPurpose] = useState('')
  const [dataType, setDataType] = useState('')
  const [presetFields, setPresetFields] = useState<string[]>([])
  const [newField, setNewField] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedForm, setGeneratedForm] = useState<any>(null)
  const { toast } = useToast()

  const handleAddField = () => {
    if (newField.trim() && !presetFields.includes(newField.trim())) {
      setPresetFields([...presetFields, newField.trim()])
      setNewField('')
    }
  }

  const handleRemoveField = (field: string) => {
    setPresetFields(presetFields.filter(f => f !== field))
  }

  const handleGenerate = async () => {
    if (!purpose.trim()) {
      toast({
        title: '请输入表单用途',
        description: '表单用途描述不能为空',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purpose,
          dataType: dataType || undefined,
          fields: presetFields.length > 0 ? presetFields : undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '生成失败')
      }

      setGeneratedForm(result.data)
      
      toast({
        title: '表单生成成功！',
        description: `已生成 ${result.data.fields?.length || 0} 个字段的表单`,
      })

    } catch (error) {
      console.error('AI 表单生成失败:', error)
      toast({
        title: '生成失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApplyForm = () => {
    if (generatedForm?.fields) {
      onGenerated?.(generatedForm.fields)
      
      toast({
        title: '表单已应用',
        description: 'AI 生成的表单已应用到设计器中',
      })
    }
  }

  const handleExportForm = () => {
    if (generatedForm) {
      const dataStr = JSON.stringify(generatedForm, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = 'ai-generated-form.json'
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      number: 'bg-purple-100 text-purple-800',
      select: 'bg-orange-100 text-orange-800',
      checkbox: 'bg-pink-100 text-pink-800',
      radio: 'bg-indigo-100 text-indigo-800',
      textarea: 'bg-gray-100 text-gray-800',
      date: 'bg-red-100 text-red-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI 表单生成器
          </CardTitle>
          <CardDescription>
            描述您的表单需求，AI 将自动生成对应的表单字段配置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              表单用途 <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="例如：用户注册表单，收集用户基本信息和偏好设置..."
              value={purpose}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">数据类型/业务场景</label>
            <Input
              placeholder="例如：用户信息、订单数据、产品信息等"
              value={dataType}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDataType(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">预设字段 (可选)</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="输入字段名称，如：姓名、邮箱、电话等"
                value={newField}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewField(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
              />
              <Button onClick={handleAddField} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {presetFields.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {presetFields.map((field, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {field}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => handleRemoveField(field)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !purpose.trim()}
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
                生成表单
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>生成结果</span>
              <Badge variant="secondary">
                {generatedForm.fields?.length || 0} 个字段
              </Badge>
            </CardTitle>
            <CardDescription>
              AI 已根据您的需求生成表单字段，您可以预览、应用或导出
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={handleApplyForm} className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                应用到设计器
              </Button>
              <Button onClick={handleExportForm} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                导出 JSON
              </Button>
            </div>
            
            {/* 表单字段预览 */}
            <div className="space-y-3">
              <h4 className="font-medium">表单字段预览：</h4>
              <div className="grid gap-3">
                {generatedForm.fields?.map((field: any, index: number) => (
                  <div key={field.id || index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.label}</span>
                        {field.required && (
                          <Badge variant="destructive" className="text-xs">必填</Badge>
                        )}
                      </div>
                      <Badge className={getFieldTypeColor(field.type)}>
                        {field.type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>字段名：</strong>{field.name}</div>
                      {field.validation && (
                        <div><strong>验证规则：</strong>
                          {Object.entries(field.validation).map(([key, value]) => (
                            <span key={key} className="ml-1">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                      {field.options && (
                        <div><strong>选项：</strong>
                          {field.options.map((option: any, i: number) => (
                            <span key={i} className="ml-1 text-xs bg-white px-1 rounded">
                              {typeof option === 'string' ? option : option.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
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
