'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Code2, Download, FileCode, Copy, Sparkles, Plus, X, Edit } from 'lucide-react'
import { CodeEditor } from '@/components/code-editor/code-editor'
import { CodePreview } from '@/components/code-editor/code-preview'
import { 
  generateReadyToUseForm, 
  generateReadyToUseTable, 
  generateReadyToUseHook,
  generateReadyToUseAPIRoute,
  generateReadyToUseSingleAPIRoute,
  ComponentField 
} from '@/lib/code-generator/ready-to-use-templates'
import { useToast } from '@/hooks/use-toast'

interface GeneratedComponent {
  name: string
  type: 'form' | 'table' | 'hook' | 'api' | 'single-api'
  code: string
}

export default function CodeGeneratorPage() {
  const [componentName, setComponentName] = useState('')
  const [fields, setFields] = useState<ComponentField[]>([])
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<GeneratedComponent | null>(null)
  const [editingComponent, setEditingComponent] = useState<GeneratedComponent | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [newField, setNewField] = useState<ComponentField>({
    name: '',
    type: 'string',
    label: '',
    required: false
  })
  const { toast } = useToast()

  const addField = () => {
    if (!newField.name || !newField.label) {
      toast({
        title: '请填写完整信息',
        description: '字段名称和标签不能为空',
        variant: 'destructive',
      })
      return
    }

    setFields(prev => [...prev, { ...newField }])
    setNewField({
      name: '',
      type: 'string',
      label: '',
      required: false
    })
  }

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (!componentName.trim()) {
      toast({
        title: '请输入组件名称',
        variant: 'destructive',
      })
      return
    }

    if (fields.length === 0) {
      toast({
        title: '请至少添加一个字段',
        variant: 'destructive',
      })
      return
    }

    const components: GeneratedComponent[] = [
      {
        name: `${componentName}Form.tsx`,
        type: 'form',
        code: generateReadyToUseForm(componentName, fields)
      },
      {
        name: `${componentName}Table.tsx`,
        type: 'table',
        code: generateReadyToUseTable(componentName, fields)
      },
      {
        name: `use${componentName}s.ts`,
        type: 'hook',
        code: generateReadyToUseHook(componentName)
      },
      {
        name: `api/${componentName.toLowerCase()}s/route.ts`,
        type: 'api',
        code: generateReadyToUseAPIRoute(componentName)
      },
      {
        name: `api/${componentName.toLowerCase()}s/[id]/route.ts`,
        type: 'single-api',
        code: generateReadyToUseSingleAPIRoute(componentName)
      }
    ]

    setGeneratedComponents(components)
    setSelectedComponent(components[0])

    toast({
      title: '组件生成成功！',
      description: `已生成 ${components.length} 个可直接使用的组件`,
    })
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: '复制成功！',
      description: '代码已复制到剪贴板，可以直接粘贴使用',
    })
  }

  const handleDownload = (component: GeneratedComponent) => {
    const blob = new Blob([component.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = component.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: '下载成功',
      description: `已下载 ${component.name}`,
    })
  }

  const handleEditComponent = (component: GeneratedComponent) => {
    setEditingComponent(component)
    toast({
      title: '进入编辑模式',
      description: `正在编辑 ${component.name}`,
    })
  }

  const handleCodeChange = (newCode: string) => {
    if (editingComponent) {
      setEditingComponent({
        ...editingComponent,
        code: newCode
      })
      
      // 同步更新到生成的组件列表
      setGeneratedComponents(prev => 
        prev.map(comp => 
          comp.name === editingComponent.name 
            ? { ...comp, code: newCode }
            : comp
        )
      )
    }
  }

  const getLanguageFromFileName = (fileName: string) => {
    if (fileName.endsWith('.tsx')) return 'typescript'
    if (fileName.endsWith('.ts')) return 'typescript'
    if (fileName.endsWith('.jsx')) return 'javascript'
    if (fileName.endsWith('.js')) return 'javascript'
    if (fileName.endsWith('.json')) return 'json'
    return 'typescript'
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            智能代码生成器
          </h1>
          <p className="text-muted-foreground">
            生成可直接复制粘贴使用的 React 组件代码
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Code2 className="mr-1 h-4 w-4" />
          开箱即用
        </Badge>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator">组件生成器</TabsTrigger>
          <TabsTrigger value="preview">代码预览</TabsTrigger>
          <TabsTrigger value="editor" disabled={!editingComponent}>
            <Edit className="mr-1 h-4 w-4" />
            代码编辑器
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 左侧配置面板 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  组件配置
                </CardTitle>
                <CardDescription>
                  配置组件名称和字段信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 组件名称 */}
                <div className="space-y-2">
                  <Label htmlFor="componentName">组件名称 *</Label>
                  <Input
                    id="componentName"
                    placeholder="例如：User, Product, Order"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                  />
                </div>

                {/* 字段配置 */}
                <div className="space-y-4">
                  <Label>字段配置</Label>
                  
                  {/* 添加字段表单 */}
                  <Card className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">字段名称</Label>
                        <Input
                          placeholder="name"
                          value={newField.name}
                          onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">显示标签</Label>
                        <Input
                          placeholder="姓名"
                          value={newField.label}
                          onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">字段类型</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                          value={newField.type}
                          onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as any }))}
                        >
                          <option value="string">文本</option>
                          <option value="number">数字</option>
                          <option value="boolean">布尔值</option>
                          <option value="date">日期</option>
                          <option value="select">下拉选择</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addField} size="sm" className="w-full">
                          <Plus className="mr-1 h-3 w-3" />
                          添加
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* 字段列表 */}
                  {fields.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">已添加的字段 ({fields.length})</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {fields.map((field, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {field.type}
                              </Badge>
                              <span className="text-sm font-medium">{field.label}</span>
                              <span className="text-xs text-muted-foreground">({field.name})</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeField(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={!componentName.trim() || fields.length === 0}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  生成组件代码
                </Button>
              </CardContent>
            </Card>

            {/* 右侧生成结果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  生成结果
                </CardTitle>
                <CardDescription>
                  {generatedComponents.length > 0 
                    ? `已生成 ${generatedComponents.length} 个组件文件`
                    : '配置完成后点击生成按钮'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedComponents.length > 0 ? (
                  <div className="space-y-3">
                    {generatedComponents.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {component.type}
                          </Badge>
                          <span className="text-sm font-medium">{component.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditComponent(component)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(component.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(component)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Code2 className="mb-4 h-12 w-12" />
                    <p className="text-sm">还没有生成组件</p>
                    <p className="text-xs">配置组件信息后点击生成</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {generatedComponents.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-4">
              {/* 文件列表 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">文件列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {generatedComponents.map((component, index) => (
                      <button
                        key={index}
                        className={`w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors ${
                          selectedComponent?.name === component.name ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedComponent(component)}
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="h-4 w-4" />
                          <span className="truncate">{component.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 代码预览 */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">代码预览</CardTitle>
                      <CardDescription>
                        {selectedComponent ? selectedComponent.name : '选择文件查看代码'}
                      </CardDescription>
                    </div>
                    {selectedComponent && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(selectedComponent.code)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          复制代码
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(selectedComponent)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          下载文件
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedComponent ? (
                    <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                      <code>{selectedComponent.code}</code>
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <FileCode className="mb-4 h-16 w-16" />
                      <p>选择文件查看代码</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Code2 className="mb-4 h-16 w-16" />
                  <p>还没有生成代码</p>
                  <p className="text-sm">请先在组件生成器中配置并生成代码</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {editingComponent ? (
            <div className="grid gap-6 lg:grid-cols-2 h-[800px]">
              {/* 左侧代码编辑器 */}
              <CodeEditor
                initialCode={editingComponent.code}
                language={getLanguageFromFileName(editingComponent.name)}
                fileName={editingComponent.name}
                onCodeChange={handleCodeChange}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />

              {/* 右侧预览区域 */}
              {showPreview && (
                <CodePreview
                  code={editingComponent.code}
                  language={getLanguageFromFileName(editingComponent.name)}
                  fileName={editingComponent.name}
                />
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Edit className="mb-4 h-16 w-16" />
                  <p>选择一个组件开始编辑</p>
                  <p className="text-sm">在生成结果中点击编辑按钮</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

