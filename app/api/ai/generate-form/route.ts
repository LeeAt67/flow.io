import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateFormWithAI } from '@/lib/ai/openai'
import { z } from 'zod'

const generateFormSchema = z.object({
  purpose: z.string().min(5, '表单用途描述至少5个字符'),
  dataType: z.string().optional(),
  fields: z.array(z.string()).optional(),
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
    const validatedData = generateFormSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          details: validatedData.error.errors
        },
        { status: 400 }
      )
    }

    // 调用 AI 生成表单
    const result = await generateFormWithAI(validatedData.data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI 生成失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      usage: result.usage
    })

  } catch (error) {
    console.error('AI 表单生成 API 错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
