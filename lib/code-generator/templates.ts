import { DataField } from '@/types'

export function generatePrismaSchema(modelName: string, fields: DataField[]): string {
  const fieldDefinitions = fields
    .map((field) => {
      const attrs = []
      if (field.unique) attrs.push('@unique')
      if (field.default) attrs.push(`@default(${field.default})`)
      
      const optional = field.required ? '' : '?'
      return `  ${field.name}  ${field.type}${optional}  ${attrs.join(' ')}`
    })
    .join('\n')

  return `model ${modelName} {
  id        String   @id @default(cuid())
${fieldDefinitions}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("${modelName.toLowerCase()}s")
}
`
}

export function generateTypeScriptInterface(modelName: string, fields: DataField[]): string {
  const fieldDefinitions = fields
    .map((field) => {
      const optional = field.required ? '' : '?'
      let tsType = field.type
      if (field.type === 'Int' || field.type === 'Float') tsType = 'number'
      if (field.type === 'Boolean') tsType = 'boolean'
      if (field.type === 'DateTime') tsType = 'Date'
      if (field.type === 'Json') tsType = 'any'
      
      return `  ${field.name}${optional}: ${tsType}`
    })
    .join('\n')

  return `export interface ${modelName} {
  id: string
${fieldDefinitions}
  createdAt: Date
  updatedAt: Date
}
`
}

export function generateNextJSPage(modelName: string, fields: DataField[]): string {
  const modelNameLower = modelName.toLowerCase()
  const modelNamePlural = `${modelNameLower}s`

  return `import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ${modelName}ListPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const ${modelNamePlural} = await db.${modelNameLower}.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">${modelName} 列表</h1>
        <Button asChild>
          <Link href="/${modelNamePlural}/new">
            <Plus className="mr-2 h-4 w-4" />
            新建
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {${modelNamePlural}.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name || item.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link href={\`/${modelNamePlural}/\${item.id}\`}>查看详情</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`
}

export function generateServerAction(modelName: string, fields: DataField[]): string {
  const modelNameLower = modelName.toLowerCase()

  const createFields = fields
    .map((field) => `    ${field.name},`)
    .join('\n')

  const zodFields = fields
    .map((field) => {
      let zodType = 'z.string()'
      if (field.type === 'Int' || field.type === 'Float') zodType = 'z.number()'
      if (field.type === 'Boolean') zodType = 'z.boolean()'
      if (field.type === 'DateTime') zodType = 'z.date()'
      
      if (!field.required) {
        zodType += '.optional()'
      }
      
      return `  ${field.name}: ${zodType},`
    })
    .join('\n')

  return `'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const ${modelNameLower}Schema = z.object({
${zodFields}
})

export async function create${modelName}(values: z.infer<typeof ${modelNameLower}Schema>) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  const validatedFields = ${modelNameLower}Schema.safeParse(values)

  if (!validatedFields.success) {
    return { error: '输入信息有误' }
  }

  const {
${createFields}
  } = validatedFields.data

  try {
    const ${modelNameLower} = await db.${modelNameLower}.create({
      data: {
${createFields}
      },
    })

    revalidatePath('/${modelNameLower}s')
    return { ${modelNameLower} }
  } catch (error) {
    return { error: '创建失败' }
  }
}

export async function delete${modelName}(id: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: '未登录' }
  }

  try {
    await db.${modelNameLower}.delete({
      where: { id },
    })

    revalidatePath('/${modelNameLower}s')
    return { success: '删除成功' }
  } catch (error) {
    return { error: '删除失败' }
  }
}
`
}

export function generateAPIRoute(modelName: string): string {
  const modelNameLower = modelName.toLowerCase()
  const modelNamePlural = `${modelNameLower}s`

  return `import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const ${modelNamePlural} = await db.${modelNameLower}.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(${modelNamePlural})
  } catch (error) {
    return NextResponse.json({ error: '获取列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const ${modelNameLower} = await db.${modelNameLower}.create({
      data: body,
    })

    return NextResponse.json(${modelNameLower})
  } catch (error) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
`
}

