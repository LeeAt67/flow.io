import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ComponentUpdateInput } from '@/types/component'
import { formatComponent } from '@/lib/utils'

// GET /api/components/[id] - 获取单个组件
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const component = await db.component.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!component) {
      return NextResponse.json({ error: '组件不存在' }, { status: 404 })
    }

    // 增加浏览量
    await db.component.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    // 格式化返回数据
    const formattedComponent = formatComponent(component)

    return NextResponse.json(formattedComponent)
  } catch (error) {
    console.error('获取组件详情失败:', error)
    return NextResponse.json(
      { error: '获取组件详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/components/[id] - 更新组件
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body: ComponentUpdateInput = await request.json()

    // 检查组件是否存在且属于当前用户
    const existingComponent = await db.component.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingComponent) {
      return NextResponse.json({ error: '组件不存在' }, { status: 404 })
    }

    // 如果更新名称，检查是否重复
    if (body.name && body.name !== existingComponent.name) {
      const duplicateComponent = await db.component.findFirst({
        where: {
          name: body.name,
          userId: session.user.id,
          id: { not: params.id },
        },
      })

      if (duplicateComponent) {
        return NextResponse.json(
          { error: '组件名称已存在' },
          { status: 400 }
        )
      }
    }

    // 更新组件
    const component = await db.component.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // 格式化返回数据
    const formattedComponent = formatComponent(component)

    return NextResponse.json(formattedComponent)
  } catch (error) {
    console.error('更新组件失败:', error)
    return NextResponse.json(
      { error: '更新组件失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/components/[id] - 删除组件
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查组件是否存在且属于当前用户
    const existingComponent = await db.component.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingComponent) {
      return NextResponse.json({ error: '组件不存在' }, { status: 404 })
    }

    // 删除组件
    await db.component.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '组件删除成功' })
  } catch (error) {
    console.error('删除组件失败:', error)
    return NextResponse.json(
      { error: '删除组件失败' },
      { status: 500 }
    )
  }
}
