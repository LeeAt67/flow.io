'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Download, Package, FileJson, FileCode, Database as DatabaseIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ExportPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [exportOptions, setExportOptions] = useState({
    includeFlows: true,
    includeForms: true,
    includeDataModels: true,
    includeCode: true,
    format: 'json' as 'json' | 'zip',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => {
        toast({
          variant: 'destructive',
          title: '加载失败',
          description: '无法加载项目列表',
        })
      })
  }, [toast])

  const handleExport = async () => {
    if (!selectedProject) {
      toast({
        variant: 'destructive',
        title: '请选择项目',
      })
      return
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject,
          options: exportOptions,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `project-${selectedProject}.${exportOptions.format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: '导出成功',
          description: '项目已成功导出',
        })
      } else {
        throw new Error('导出失败')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '导出失败',
        description: '无法导出项目',
      })
    }
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">导出项目</h1>
        <p className="text-muted-foreground">将项目导出为可部署的格式</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 左侧配置面板 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">导出配置</CardTitle>
            <CardDescription>选择要导出的项目和内容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">选择项目</Label>
              <select
                id="project"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">选择项目</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-4">
              <Label>导出内容</Label>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeFlows" className="font-normal">
                  包含流程
                </Label>
                <Switch
                  id="includeFlows"
                  checked={exportOptions.includeFlows}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeFlows: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeForms" className="font-normal">
                  包含表单
                </Label>
                <Switch
                  id="includeForms"
                  checked={exportOptions.includeForms}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeForms: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeDataModels" className="font-normal">
                  包含数据模型
                </Label>
                <Switch
                  id="includeDataModels"
                  checked={exportOptions.includeDataModels}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeDataModels: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeCode" className="font-normal">
                  包含生成的代码
                </Label>
                <Switch
                  id="includeCode"
                  checked={exportOptions.includeCode}
                  onCheckedChange={(checked) =>
                    setExportOptions({ ...exportOptions, includeCode: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="format">导出格式</Label>
              <select
                id="format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={exportOptions.format}
                onChange={(e) =>
                  setExportOptions({ ...exportOptions, format: e.target.value as 'json' | 'zip' })
                }
              >
                <option value="json">JSON</option>
                <option value="zip">ZIP（包含代码）</option>
              </select>
            </div>

            <Button className="w-full" onClick={handleExport} disabled={!selectedProject}>
              <Download className="mr-2 h-4 w-4" />
              导出项目
            </Button>
          </CardContent>
        </Card>

        {/* 右侧预览面板 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">导出预览</CardTitle>
            <CardDescription>
              {selectedProjectData
                ? `项目: ${selectedProjectData.name}`
                : '选择一个项目查看详情'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProjectData ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                          <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">流程数量</p>
                          <p className="text-2xl font-bold">
                            {selectedProjectData._count?.flows || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                          <FileJson className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">表单数量</p>
                          <p className="text-2xl font-bold">0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900">
                          <DatabaseIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">数据模型</p>
                          <p className="text-2xl font-bold">
                            {selectedProjectData._count?.dataModels || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                          <FileCode className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">生成文件</p>
                          <p className="text-2xl font-bold">
                            {(selectedProjectData._count?.dataModels || 0) * 5}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">导出说明</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• JSON 格式：包含项目配置和数据的 JSON 文件</li>
                      <li>• ZIP 格式：完整的项目代码包，可直接部署</li>
                      <li>• 导出后可以在其他环境中导入或部署</li>
                      <li>• 建议定期导出项目作为备份</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="mb-4 h-16 w-16" />
                <p>选择一个项目开始导出</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

