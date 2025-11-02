import { NextResponse } from 'next/server'
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
      include: {
        dataModels: true,
      },
    })

    const allDataModels = projects.flatMap((p) => p.dataModels)

    return NextResponse.json(allDataModels)
  } catch (error) {
    return NextResponse.json({ error: '获取数据模型列表失败' }, { status: 500 })
  }
}

