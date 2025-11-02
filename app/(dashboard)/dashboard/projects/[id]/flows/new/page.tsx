'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createFlow } from '@/actions/flow'

const flowSchema = z.object({
  name: z.string().min(2, { message: '流程名称至少需要 2 个字符' }),
  description: z.string().optional(),
})

type FlowFormValues = z.infer<typeof flowSchema>

export default function NewFlowPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlowFormValues>({
    resolver: zodResolver(flowSchema),
  })

  const onSubmit = async (data: FlowFormValues) => {
    setIsLoading(true)
    try {
      const result = await createFlow({ ...data, projectId })

      if (result.error) {
        toast({
          variant: 'destructive',
          title: '创建失败',
          description: result.error,
        })
      } else if (result.flow) {
        toast({
          title: '创建成功',
          description: '流程已成功创建',
        })
        router.push(`/editor/${result.flow.id}`)
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
        <h1 className="text-3xl font-bold">新建流程</h1>
        <p className="text-muted-foreground">为项目创建一个新的流程</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>流程信息</CardTitle>
          <CardDescription>填写流程的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">流程名称</Label>
              <Input
                id="name"
                placeholder="用户注册流程"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">流程描述（可选）</Label>
              <Input
                id="description"
                placeholder="描述这个流程的用途..."
                {...register('description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '创建中...' : '创建流程'}
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

