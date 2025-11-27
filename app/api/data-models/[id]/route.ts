import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/data-models/[id] - 获取单个数据模型
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const dataModel = await db.dataModel.findUnique({
      where: { id: params.id },
      include: { 
        project: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    })

    if (!dataModel || dataModel.project.userId !== session.user.id) {
      return NextResponse.json({ error: '数据模型不存在或无权限访问' }, { status: 404 })
    }

    return NextResponse.json(dataModel)
  } catch (error) {
    console.error('获取数据模型详情失败:', error)
    return NextResponse.json(
      { error: '获取数据模型详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/data-models/[id] - 更新数据模型
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, fields } = body

    // 检查数据模型是否存在且用户有权限
    const existingDataModel = await db.dataModel.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!existingDataModel || existingDataModel.project.userId !== session.user.id) {
      return NextResponse.json({ error: '数据模型不存在或无权限访问' }, { status: 404 })
    }

    // 如果更新名称，检查是否重复
    if (name && name !== existingDataModel.name) {
      const duplicateDataModel = await db.dataModel.findFirst({
        where: {
          name,
          projectId: existingDataModel.projectId,
          id: { not: params.id },
        },
      })

      if (duplicateDataModel) {
        return NextResponse.json(
          { error: '数据模型名称在该项目中已存在' },
          { status: 400 }
        )
      }
    }

    // 更新数据模型
    const dataModel = await db.dataModel.update({
      where: { id: params.id },
      data: {
        name,
        description,
        fields,
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

    return NextResponse.json(dataModel)
  } catch (error) {
    console.error('更新数据模型失败:', error)
    return NextResponse.json(
      { error: '更新数据模型失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/data-models/[id] - 删除数据模型
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查数据模型是否存在且用户有权限
    const existingDataModel = await db.dataModel.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!existingDataModel || existingDataModel.project.userId !== session.user.id) {
      return NextResponse.json({ error: '数据模型不存在或无权限访问' }, { status: 404 })
    }

    // 删除数据模型
    await db.dataModel.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '数据模型删除成功' })
  } catch (error) {
    console.error('删除数据模型失败:', error)
    return NextResponse.json(
      { error: '删除数据模型失败' },
      { status: 500 }
    )
  }
}
