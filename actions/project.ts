'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const projectSchema = z.object({
  name: z.string().min(2, { message: '项目名称至少需要 2 个字符' }),
  description: z.string().optional(),
})

export async function createProject(values: z.infer<typeof projectSchema>) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  const validatedFields = projectSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '输入信息有误' }
  }

  const { name, description } = validatedFields.data

  try {
    const project = await db.project.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard')
    return { project }
  } catch (error) {
    return { error: '创建项目失败' }
  }
}

export async function deleteProject(projectId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project || project.userId !== session.user.id) {
      return { error: '项目不存在或无权限' }
    }

    await db.project.delete({
      where: { id: projectId },
    })

    revalidatePath('/dashboard')
    return { success: '项目已删除' }
  } catch (error) {
    return { error: '删除项目失败' }
  }
}

