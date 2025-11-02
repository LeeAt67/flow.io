'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

const registerSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要 2 个字符' }),
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要 6 个字符' }),
})

const loginSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(1, { message: '请输入密码' }),
})

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '输入信息有误' }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: '该邮箱已被注册' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return { success: '注册成功！请登录' }
}

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '输入信息有误' }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    })
    return { success: '登录成功' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: '邮箱或密码错误' }
        default:
          return { error: '登录失败，请稍后重试' }
      }
    }
    throw error
  }
}

