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
    const { nodes, edges, viewport } = body

    const flow = await db.flow.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!flow || flow.project.userId !== session.user.id) {
      return NextResponse.json({ error: '流程不存在或无权限' }, { status: 404 })
    }

    const updatedFlow = await db.flow.update({
      where: { id: params.id },
      data: {
        nodes,
        edges,
        viewport,
      },
    })

    return NextResponse.json(updatedFlow)
  } catch (error) {
    return NextResponse.json({ error: '保存流程失败' }, { status: 500 })
  }
}

