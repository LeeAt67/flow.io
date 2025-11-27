import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/flows - 获取流程列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    // 构建查询条件
    const where: any = {}
    
    if (projectId) {
      // 验证项目是否属于当前用户
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          userId: session.user.id,
        },
      })

      if (!project) {
        return NextResponse.json({ error: '项目不存在或无权限访问' }, { status: 403 })
      }

      where.projectId = projectId
    } else {
      // 如果没有指定项目，获取用户所有项目的流程
      const userProjects = await db.project.findMany({
        where: { userId: session.user.id },
        select: { id: true },
      })
      
      where.projectId = {
        in: userProjects.map(p => p.id),
      }
    }

    const flows = await db.flow.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(flows)
  } catch (error) {
    console.error('获取流程列表失败:', error)
    return NextResponse.json(
      { error: '获取流程列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/flows - 创建流程
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, projectId, nodes = [], edges = [], viewport } = body

    // 验证必填字段
    if (!name || !projectId) {
      return NextResponse.json(
        { error: '流程名称和项目ID不能为空' },
        { status: 400 }
      )
    }

    // 验证项目是否存在且属于当前用户
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在或无权限访问' },
        { status: 403 }
      )
    }

    // 检查流程名称是否在项目中已存在
    const existingFlow = await db.flow.findFirst({
      where: {
        name,
        projectId,
      },
    })

    if (existingFlow) {
      return NextResponse.json(
        { error: '流程名称在该项目中已存在' },
        { status: 400 }
      )
    }

    // 创建流程
    const flow = await db.flow.create({
      data: {
        name,
        description,
        projectId,
        nodes,
        edges,
        viewport,
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

    return NextResponse.json(flow, { status: 201 })
  } catch (error) {
    console.error('创建流程失败:', error)
    return NextResponse.json(
      { error: '创建流程失败' },
      { status: 500 }
    )
  }
}
