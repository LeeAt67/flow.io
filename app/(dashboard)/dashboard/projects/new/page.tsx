'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createProject } from '@/actions/project'

const projectSchema = z.object({
  name: z.string().min(2, { message: '项目名称至少需要 2 个字符' }),
  description: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true)
    try {
      const result = await createProject(data)

      if (result.error) {
        toast({
          variant: 'destructive',
          title: '创建失败',
          description: result.error,
        })
      } else if (result.project) {
        toast({
          title: '创建成功',
          description: '项目已成功创建',
        })
        router.push(`/dashboard/projects/${result.project.id}`)
      }
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
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">新建项目</h1>
        <p className="text-muted-foreground">创建一个新的低代码项目</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>填写项目的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">项目名称</Label>
              <Input
                id="name"
                placeholder="我的低代码项目"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">项目描述（可选）</Label>
              <Input
                id="description"
                placeholder="描述这个项目的用途..."
                {...register('description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '创建中...' : '创建项目'}
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

