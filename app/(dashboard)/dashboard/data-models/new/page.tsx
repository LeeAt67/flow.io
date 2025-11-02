'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { DataModelDesigner } from '@/components/data-model/data-model-designer'

const dataModelSchema = z.object({
  name: z.string().min(2, { message: '模型名称至少需要 2 个字符' }),
  description: z.string().optional(),
  projectId: z.string().min(1, { message: '请选择项目' }),
})

type DataModelFormValues = z.infer<typeof dataModelSchema>

export default function NewDataModelPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataModelFormValues>({
    resolver: zodResolver(dataModelSchema),
  })

  useEffect(() => {
    // 加载用户项目列表
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

  const onSubmit = async (data: DataModelFormValues) => {
    setIsLoading(true)
    try {
      // 这里应该调用创建数据模型的 API
      toast({
        title: '创建成功',
        description: '数据模型已成功创建',
      })
      router.push('/dashboard/data-models')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: '发生未知错误，请稍后重试',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">新建数据模型</h1>
        <p className="text-muted-foreground">定义应用的数据结构</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>填写数据模型的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">所属项目</Label>
              <select
                id="projectId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('projectId')}
                disabled={isLoading}
              >
                <option value="">选择项目</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-sm text-destructive">{errors.projectId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">模型名称</Label>
              <Input
                id="name"
                placeholder="User"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">模型描述（可选）</Label>
              <Input
                id="description"
                placeholder="用户信息表"
                {...register('description')}
                disabled={isLoading}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <DataModelDesigner />

      <div className="flex gap-4">
        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? '创建中...' : '创建数据模型'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          取消
        </Button>
      </div>
    </div>
  )
}

