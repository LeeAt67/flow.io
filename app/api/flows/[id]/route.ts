import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const flow = await db.flow.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return NextResponse.json({ error: '流程不存在或无权限' }, { status: 404 })
    }

    return NextResponse.json(flow)
  } catch (error) {
    return NextResponse.json({ error: '获取流程失败' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, nodes, edges, viewport } = body

    const flow = await db.flow.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return NextResponse.json({ error: '流程不存在或无权限' }, { status: 404 })
    }

    // 如果更新名称，检查是否重复
    if (name && name !== flow.name) {
      const duplicateFlow = await db.flow.findFirst({
        where: {
          name,
          projectId: flow.projectId,
          id: { not: params.id },
        },
      })

      if (duplicateFlow) {
        return NextResponse.json(
          { error: '流程名称在该项目中已存在' },
          { status: 400 }
        )
      }
    }

    const updatedFlow = await db.flow.update({
      where: { id: params.id },
      data: {
        name,
        description,
        nodes,
        edges,
        viewport,
        updatedAt: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedFlow)
  } catch (error) {
    console.error('更新流程失败:', error)
    return NextResponse.json({ error: '更新流程失败' }, { status: 500 })
  }
}

// DELETE /api/flows/[id] - 删除流程
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查流程是否存在且用户有权限
    const flow = await db.flow.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return NextResponse.json({ error: '流程不存在或无权限访问' }, { status: 404 })
    }

    // 删除流程
    await db.flow.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '流程删除成功' })
  } catch (error) {
    console.error('删除流程失败:', error)
    return NextResponse.json(
      { error: '删除流程失败' },
      { status: 500 }
    )
  }
}
