import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 })
  }
}

// POST /api/projects - 创建项目
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    // 验证必填字段
    if (!name) {
      return NextResponse.json(
        { error: '项目名称不能为空' },
        { status: 400 }
      )
    }

    // 检查项目名称是否已存在
    const existingProject = await db.project.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    })

    if (existingProject) {
      return NextResponse.json(
        { error: '项目名称已存在' },
        { status: 400 }
      )
    }

    // 创建项目
    const project = await db.project.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('创建项目失败:', error)
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    )
  }
}
