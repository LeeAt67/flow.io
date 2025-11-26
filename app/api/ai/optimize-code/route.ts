import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { optimizeCodeWithAI } from '@/lib/ai/openai'
import { z } from 'zod'

const optimizeCodeSchema = z.object({
  code: z.string().min(10, '代码内容至少10个字符'),
  language: z.string().min(1, '请指定编程语言'),
  context: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    // 验证请求数据
    const body = await request.json()
    const validatedData = optimizeCodeSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          details: validatedData.error.errors
        },
        { status: 400 }
      )
    }

    // 调用 AI 优化代码
    const result = await optimizeCodeWithAI(validatedData.data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI 分析失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      usage: result.usage
    })

  } catch (error) {
    console.error('AI 代码优化 API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
