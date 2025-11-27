import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/projects/[id] - 获取单个项目
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        flows: {
          orderBy: { updatedAt: 'desc' },
        },
        dataModels: {
          orderBy: { updatedAt: 'desc' },
        },
        _count: {
          select: {
            flows: true,
            dataModels: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('获取项目详情失败:', error)
    return NextResponse.json(
      { error: '获取项目详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - 更新项目
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
    const { name, description, isPublic } = body

    // 检查项目是否存在且属于当前用户
    const existingProject = await db.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 如果更新名称，检查是否重复
    if (name && name !== existingProject.name) {
      const duplicateProject = await db.project.findFirst({
        where: {
          name,
          userId: session.user.id,
          id: { not: params.id },
        },
      })

      if (duplicateProject) {
        return NextResponse.json(
          { error: '项目名称已存在' },
          { status: 400 }
        )
      }
    }

    // 更新项目
    const project = await db.project.update({
      where: { id: params.id },
      data: {
        name,
        description,
        isPublic,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('更新项目失败:', error)
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - 删除项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查项目是否存在且属于当前用户
    const existingProject = await db.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 删除项目（级联删除相关的flows和dataModels）
    await db.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '项目删除成功' })
  } catch (error) {
    console.error('删除项目失败:', error)
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    )
  }
}
