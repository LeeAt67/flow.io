import {
  generatePrismaSchema,
  generateTypeScriptInterface,
  generateNextJSPage,
  generateServerAction,
  generateAPIRoute,
} from './templates'
import { DataField } from '@/types'

export interface GeneratedCode {
  fileName: string
  content: string
  language: string
}

export function generateCode(modelName: string, fields: DataField[]): GeneratedCode[] {
  const results: GeneratedCode[] = []

  // 生成 Prisma Schema
  results.push({
    fileName: 'schema.prisma',
    content: generatePrismaSchema(modelName, fields),
    language: 'prisma',
  })

  // 生成 TypeScript 接口
  results.push({
    fileName: `types/${modelName.toLowerCase()}.ts`,
    content: generateTypeScriptInterface(modelName, fields),
    language: 'typescript',
  })

  // 生成 Next.js 页面
  results.push({
    fileName: `app/${modelName.toLowerCase()}s/page.tsx`,
    content: generateNextJSPage(modelName, fields),
    language: 'typescript',
  })

  // 生成 Server Actions
  results.push({
    fileName: `actions/${modelName.toLowerCase()}.ts`,
    content: generateServerAction(modelName, fields),
    language: 'typescript',
  })

  // 生成 API 路由
  results.push({
    fileName: `app/api/${modelName.toLowerCase()}s/route.ts`,
    content: generateAPIRoute(modelName),
    language: 'typescript',
  })

  return results
}

export function downloadCode(code: GeneratedCode) {
  const blob = new Blob([code.content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = code.fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadAllAsZip(codes: GeneratedCode[], projectName: string) {
  // 这里可以使用 JSZip 库来打包所有文件
  // 为了简化，我们先实现单个文件下载
  codes.forEach((code) => {
    downloadCode(code)
  })
}

