import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/components/stats - 获取组件统计
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 获取统计数据
    const [
      total,
      published,
      draft,
      archived,
      downloadStats,
      likeStats,
      viewStats
    ] = await Promise.all([
      // 总组件数
      db.component.count({
        where: { userId: session.user.id }
      }),
      // 已发布组件数
      db.component.count({
        where: { 
          userId: session.user.id,
          status: 'PUBLISHED'
        }
      }),
      // 草稿组件数
      db.component.count({
        where: { 
          userId: session.user.id,
          status: 'DRAFT'
        }
      }),
      // 已归档组件数
      db.component.count({
        where: { 
          userId: session.user.id,
          status: 'ARCHIVED'
        }
      }),
      // 总下载量
      db.component.aggregate({
        where: { userId: session.user.id },
        _sum: { downloads: true }
      }),
      // 总点赞数
      db.component.aggregate({
        where: { userId: session.user.id },
        _sum: { likes: true }
      }),
      // 总浏览量
      db.component.aggregate({
        where: { userId: session.user.id },
        _sum: { views: true }
      })
    ])

    const stats = {
      total,
      published,
      draft,
      archived,
      totalDownloads: downloadStats._sum.downloads || 0,
      totalLikes: likeStats._sum.likes || 0,
      totalViews: viewStats._sum.views || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
