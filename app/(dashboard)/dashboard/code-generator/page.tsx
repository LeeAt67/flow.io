'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Code2, Download, FileCode } from 'lucide-react'
import { generateCode, downloadCode, GeneratedCode } from '@/lib/code-generator/generator'
import { useToast } from '@/hooks/use-toast'

export default function CodeGeneratorPage() {
  const [dataModels, setDataModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode[]>([])
  const [selectedFile, setSelectedFile] = useState<GeneratedCode | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // 加载数据模型列表
    fetch('/api/data-models')
      .then((res) => res.json())
      .then((data) => setDataModels(data))
      .catch(() => {
        toast({
          variant: 'destructive',
          title: '加载失败',
          description: '无法加载数据模型列表',
        })
      })
  }, [toast])

  const handleGenerate = () => {
    if (!selectedModel) {
      toast({
        variant: 'destructive',
        title: '请选择数据模型',
      })
      return
    }

    const model = dataModels.find((m) => m.id === selectedModel)
    if (!model) return

    const code = generateCode(model.name, model.fields || [])
    setGeneratedCode(code)
    setSelectedFile(code[0])

    toast({
      title: '代码生成成功',
      description: `已生成 ${code.length} 个文件`,
    })
  }

  const handleDownload = (code: GeneratedCode) => {
    downloadCode(code)
    toast({
      title: '下载成功',
      description: `已下载 ${code.fileName}`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">代码生成器</h1>
        <p className="text-muted-foreground">基于数据模型自动生成代码</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 左侧配置面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">生成配置</CardTitle>
            <CardDescription>选择要生成代码的数据模型</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">数据模型</Label>
              <select
                id="model"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">选择模型</option>
                {dataModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full" onClick={handleGenerate}>
              <Code2 className="mr-2 h-4 w-4" />
              生成代码
            </Button>

            {generatedCode.length > 0 && (
              <div className="space-y-2 pt-4">
                <Label>生成的文件</Label>
                <div className="space-y-1">
                  {generatedCode.map((code, index) => (
                    <button
                      key={index}
                      className={`w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors ${
                        selectedFile?.fileName === code.fileName ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedFile(code)}
                    >
                      <FileCode className="inline mr-2 h-4 w-4" />
                      {code.fileName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右侧代码预览 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">代码预览</CardTitle>
                <CardDescription>
                  {selectedFile ? selectedFile.fileName : '选择文件查看代码'}
                </CardDescription>
              </div>
              {selectedFile && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  下载
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                <code>{selectedFile.content}</code>
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Code2 className="mb-4 h-16 w-16" />
                <p>选择数据模型并生成代码</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

