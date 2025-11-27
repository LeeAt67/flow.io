import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化组件数据，将 user 信息转换为 author 格式
 * @param component 包含 user 信息的组件对象
 * @returns 格式化后的组件对象，包含 author 字段，移除 user 字段
 */
export function formatComponent<T extends Record<string, any>>(
  component: T & { user?: { id: string; name: string | null; image: string | null } }
): Omit<T, 'user'> & { author?: { id: string; name: string; avatar?: string } } {
  const { user, ...rest } = component
  
  return {
    ...rest,
    author: user ? {
      id: user.id,
      name: user.name || 'Unknown',
      avatar: user.image || undefined,
    } : undefined,
  }
}

