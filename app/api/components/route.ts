import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ComponentCreateInput, ComponentQuery } from '@/types/component'
import { formatComponent } from '@/lib/utils'

// GET /api/components - 获取组件列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query: ComponentQuery = {
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as any) || 'all',
      visibility: (searchParams.get('visibility') as any) || 'all',
      category: searchParams.get('category') || undefined,
      framework: (searchParams.get('framework') as any) || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    }

    // 构建查询条件
    const where: any = {
      userId: session.user.id,
    }

    // 搜索条件
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { hasSome: [query.search] } },
      ]
    }

    // 状态筛选
    if (query.status && query.status !== 'all') {
      where.status = query.status
    }

    // 可见性筛选
    if (query.visibility && query.visibility !== 'all') {
      where.visibility = query.visibility
    }

    // 分类筛选
    if (query.category) {
      where.category = query.category
    }

    // 框架筛选
    if (query.framework) {
      where.framework = query.framework
    }

    // 排序
    const orderBy: any = {}
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'desc'
    }

    // 分页
    const skip = ((query.page || 1) - 1) * (query.limit || 10)
    const take = query.limit || 10

    // 查询数据
    const [components, total] = await Promise.all([
      db.component.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      db.component.count({ where }),
    ])

    // 格式化返回数据
    const formattedComponents = components.map(formatComponent)

    return NextResponse.json({
      components: formattedComponents,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    })
  } catch (error) {
    console.error('获取组件列表失败:', error)
    return NextResponse.json(
      { error: '获取组件列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/components - 创建组件
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body: ComponentCreateInput = await request.json()

    // 验证必填字段
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: '组件名称和代码不能为空' },
        { status: 400 }
      )
    }

    // 检查组件名称是否已存在
    const existingComponent = await db.component.findFirst({
      where: {
        name: body.name,
        userId: session.user.id,
      },
    })

    if (existingComponent) {
      return NextResponse.json(
        { error: '组件名称已存在' },
        { status: 400 }
      )
    }

    // 创建组件
    const component = await db.component.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        framework: body.framework,
        visibility: body.visibility,
        tags: body.tags,
        code: body.code,
        documentation: body.documentation,
        status: 'DRAFT', // 默认为草稿状态
        version: '1.0.0', // 默认版本
        downloads: 0,
        likes: 0,
        views: 0,
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

    // 格式化返回数据
    const formattedComponent = formatComponent(component)

    return NextResponse.json(formattedComponent, { status: 201 })
  } catch (error) {
    console.error('创建组件失败:', error)
    return NextResponse.json(
      { error: '创建组件失败' },
      { status: 500 }
    )
  }
}
