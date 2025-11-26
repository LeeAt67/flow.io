import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatWithAI } from '@/lib/ai/openai'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, '消息不能为空'),
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
    const validatedData = chatSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          details: validatedData.error.errors
        },
        { status: 400 }
      )
    }

    // 调用 AI 聊天
    const result = await chatWithAI(validatedData.data.message, validatedData.data.context)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI 回复失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      usage: result.usage
    })

  } catch (error) {
    console.error('AI 聊天 API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
