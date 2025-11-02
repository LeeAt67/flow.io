import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { projectId, options } = body

    // 获取项目数据
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        flows: options.includeFlows,
        dataModels: options.includeDataModels,
      },
    })

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: '项目不存在或无权限' }, { status: 404 })
    }

    // 构建导出数据
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: {
        name: project.name,
        description: project.description,
      },
      flows: options.includeFlows ? project.flows : [],
      dataModels: options.includeDataModels ? project.dataModels : [],
    }

    // 根据格式返回数据
    if (options.format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="project-${projectId}.json"`,
        },
      })
    }

    // TODO: 实现 ZIP 格式导出
    // 这里需要使用 JSZip 或类似库来打包所有文件
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="project-${projectId}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: '导出失败' }, { status: 500 })
  }
}

