'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const flowSchema = z.object({
  name: z.string().min(2, { message: '流程名称至少需要 2 个字符' }),
  description: z.string().optional(),
  projectId: z.string(),
})

const saveFlowSchema = z.object({
  flowId: z.string(),
  nodes: z.any(),
  edges: z.any(),
  viewport: z.any().optional(),
})

export async function createFlow(values: z.infer<typeof flowSchema>) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  const validatedFields = flowSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '输入信息有误' }
  }

  const { name, description, projectId } = validatedFields.data

  try {
    // 验证项目权限
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.userId !== session.user.id) {
      return { error: '项目不存在或无权限' }
    }

    const flow = await db.flow.create({
      data: {
        name,
        description,
        projectId,
      },
    })

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { flow }
  } catch (error) {
    return { error: '创建流程失败' }
  }
}

export async function saveFlow(values: z.infer<typeof saveFlowSchema>) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  const validatedFields = saveFlowSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '数据格式有误' }
  }

  const { flowId, nodes, edges, viewport } = validatedFields.data

  try {
    const flow = await db.flow.findUnique({
      where: { id: flowId },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return { error: '流程不存在或无权限' }
    }

    await db.flow.update({
      where: { id: flowId },
      data: {
        nodes,
        edges,
        viewport,
      },
    })

    revalidatePath(`/editor/${flowId}`)
    return { success: '保存成功' }
  } catch (error) {
    return { error: '保存失败' }
  }
}

export async function deleteFlow(flowId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  try {
    const flow = await db.flow.findUnique({
      where: { id: flowId },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return { error: '流程不存在或无权限' }
    }

    await db.flow.delete({
      where: { id: flowId },
    })

    revalidatePath(`/dashboard/projects/${flow.projectId}`)
    return { success: '流程已删除' }
  } catch (error) {
    return { error: '删除失败' }
  }
}

