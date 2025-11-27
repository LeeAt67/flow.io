import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { BatchOperation } from '@/types/component'

// PUT /api/components/batch - 批量更新组件
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body: BatchOperation = await request.json()

    if (!body.ids || body.ids.length === 0) {
      return NextResponse.json(
        { error: '请选择要更新的组件' },
        { status: 400 }
      )
    }

    if (!body.updates) {
      return NextResponse.json(
        { error: '请提供更新数据' },
        { status: 400 }
      )
    }

    // 验证所有组件都属于当前用户
    const components = await db.component.findMany({
      where: {
        id: { in: body.ids },
        userId: session.user.id,
      },
    })

    if (components.length !== body.ids.length) {
      return NextResponse.json(
        { error: '部分组件不存在或无权限访问' },
        { status: 403 }
      )
    }

    // 批量更新
    await db.component.updateMany({
      where: {
        id: { in: body.ids },
        userId: session.user.id,
      },
      data: {
        ...body.updates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      message: `成功更新 ${body.ids.length} 个组件`,
      count: body.ids.length 
    })
  } catch (error) {
    console.error('批量更新组件失败:', error)
    return NextResponse.json(
      { error: '批量更新组件失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/components/batch - 批量删除组件
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body: { ids: string[] } = await request.json()

    if (!body.ids || body.ids.length === 0) {
      return NextResponse.json(
        { error: '请选择要删除的组件' },
        { status: 400 }
      )
    }

    // 验证所有组件都属于当前用户
    const components = await db.component.findMany({
      where: {
        id: { in: body.ids },
        userId: session.user.id,
      },
    })

    if (components.length !== body.ids.length) {
      return NextResponse.json(
        { error: '部分组件不存在或无权限访问' },
        { status: 403 }
      )
    }

    // 批量删除
    await db.component.deleteMany({
      where: {
        id: { in: body.ids },
        userId: session.user.id,
      },
    })

    return NextResponse.json({ 
      message: `成功删除 ${body.ids.length} 个组件`,
      count: body.ids.length 
    })
  } catch (error) {
    console.error('批量删除组件失败:', error)
    return NextResponse.json(
      { error: '批量删除组件失败' },
      { status: 500 }
    )
  }
}
