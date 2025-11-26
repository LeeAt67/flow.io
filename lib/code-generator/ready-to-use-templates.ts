// 生成可直接使用的 React 组件模板

export interface ComponentField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'select'
  label: string
  required?: boolean
  options?: string[]
}

// 生成表单组件 - 可直接复制粘贴使用
export function generateReadyToUseForm(componentName: string, fields: ComponentField[]): string {
  const formFields = fields.map(field => {
    const { name, type, label, required = false, options } = field
    
    switch (type) {
      case 'boolean':
        return `        <div className="flex items-center space-x-2">
          <Checkbox
            id="${name}"
            checked={formData.${name}}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, ${name}: checked }))
            }
          />
          <Label htmlFor="${name}">${label}</Label>
        </div>`
      
      case 'date':
        return `        <div className="space-y-2">
          <Label htmlFor="${name}">${label}${required ? ' *' : ''}</Label>
          <Input
            id="${name}"
            type="date"
            value={formData.${name}}
            onChange={(e) => setFormData(prev => ({ ...prev, ${name}: e.target.value }))}
            ${required ? 'required' : ''}
          />
        </div>`
      
      case 'select':
        const selectOptions = options?.map(opt => 
          `            <SelectItem value="${opt}">${opt}</SelectItem>`
        ).join('\n') || ''
        
        return `        <div className="space-y-2">
          <Label htmlFor="${name}">${label}${required ? ' *' : ''}</Label>
          <Select value={formData.${name}} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, ${name}: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="请选择${label}" />
            </SelectTrigger>
            <SelectContent>
${selectOptions}
            </SelectContent>
          </Select>
        </div>`
      
      case 'number':
        return `        <div className="space-y-2">
          <Label htmlFor="${name}">${label}${required ? ' *' : ''}</Label>
          <Input
            id="${name}"
            type="number"
            value={formData.${name}}
            onChange={(e) => setFormData(prev => ({ ...prev, ${name}: Number(e.target.value) }))}
            placeholder="请输入${label}"
            ${required ? 'required' : ''}
          />
        </div>`
      
      default: // string
        const inputType = name.includes('email') ? 'email' : 
                         name.includes('password') ? 'password' : 'text'
        
        return `        <div className="space-y-2">
          <Label htmlFor="${name}">${label}${required ? ' *' : ''}</Label>
          <Input
            id="${name}"
            type="${inputType}"
            value={formData.${name}}
            onChange={(e) => setFormData(prev => ({ ...prev, ${name}: e.target.value }))}
            placeholder="请输入${label}"
            ${required ? 'required' : ''}
          />
        </div>`
    }
  }).join('\n\n')

  const initialFormData = fields.map(field => {
    const defaultValue = field.type === 'boolean' ? 'false' : 
                        field.type === 'number' ? '0' : "''"
    return `    ${field.name}: ${defaultValue},`
  }).join('\n')

  return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface ${componentName}FormData {
${fields.map(field => `  ${field.name}: ${field.type === 'number' ? 'number' : field.type === 'boolean' ? 'boolean' : 'string'}`).join('\n')}
}

interface ${componentName}FormProps {
  initialData?: Partial<${componentName}FormData>
  onSubmit: (data: ${componentName}FormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ${componentName}Form({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ${componentName}FormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<${componentName}FormData>({
${initialFormData}
    ...initialData,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(formData)
      
      toast({
        title: '提交成功',
        description: '${componentName} 信息已保存',
      })
    } catch (error) {
      toast({
        title: '提交失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>${componentName} 表单</CardTitle>
        <CardDescription>
          请填写${componentName}的相关信息
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
${formFields}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '提交中...' : '提交'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                取消
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// 使用示例:
/*
function ExampleUsage() {
  const handleSubmit = async (data: ${componentName}FormData) => {
    console.log('提交的数据:', data)
    
    // 发送到 API
    const response = await fetch('/api/${componentName.toLowerCase()}s', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('提交失败')
    }
  }

  return (
    <${componentName}Form
      onSubmit={handleSubmit}
      onCancel={() => console.log('取消')}
    />
  )
}
*/`
}

// 生成数据表格组件 - 可直接复制粘贴使用
export function generateReadyToUseTable(componentName: string, fields: ComponentField[]): string {
  const tableHeaders = fields.map(field => 
    `        <TableHead>${field.label}</TableHead>`
  ).join('\n')
  
  const tableCells = fields.map(field => {
    if (field.type === 'boolean') {
      return `          <TableCell>
            <Badge variant={item.${field.name} ? 'default' : 'secondary'}>
              {item.${field.name} ? '是' : '否'}
            </Badge>
          </TableCell>`
    }
    
    if (field.type === 'date') {
      return `          <TableCell>
            {new Date(item.${field.name}).toLocaleDateString('zh-CN')}
          </TableCell>`
    }
    
    return `          <TableCell>{item.${field.name}}</TableCell>`
  }).join('\n')

  return `'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ${componentName}Item {
  id: string
${fields.map(field => `  ${field.name}: ${field.type === 'number' ? 'number' : field.type === 'boolean' ? 'boolean' : 'string'}`).join('\n')}
  createdAt: string
  updatedAt: string
}

interface ${componentName}TableProps {
  data?: ${componentName}Item[]
  onAdd?: () => void
  onEdit?: (item: ${componentName}Item) => void
  onDelete?: (id: string) => void
  onView?: (item: ${componentName}Item) => void
  isLoading?: boolean
}

export function ${componentName}Table({ 
  data = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  isLoading = false 
}: ${componentName}TableProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<${componentName}Item[]>(data)

  useEffect(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    setFilteredData(filtered)
  }, [data, searchTerm])

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      try {
        await onDelete?.(id)
        toast({
          title: '删除成功',
          description: '记录已删除',
        })
      } catch (error) {
        toast({
          title: '删除失败',
          description: '请稍后重试',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>${componentName} 列表</CardTitle>
            <CardDescription>
              管理所有的${componentName}记录
            </CardDescription>
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              新增
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* 搜索栏 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索${componentName}..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* 数据表格 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
${tableHeaders}
                <TableHead>创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={${fields.length + 2}} className="text-center py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={${fields.length + 2}} className="text-center py-8">
                    {searchTerm ? '没有找到匹配的记录' : '暂无数据'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
${tableCells}
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              查看
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              编辑
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页信息 */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              共 {filteredData.length} 条记录
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 使用示例:
/*
function ExampleUsage() {
  const [items, setItems] = useState<${componentName}Item[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = () => {
    console.log('新增${componentName}')
  }

  const handleEdit = (item: ${componentName}Item) => {
    console.log('编辑${componentName}:', item)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await fetch(\`/api/${componentName.toLowerCase()}s/\${id}\`, { method: 'DELETE' })
      setItems(prev => prev.filter(item => item.id !== id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <${componentName}Table
      data={items}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  )
}
*/`
}

// 生成自定义 Hook - 可直接复制粘贴使用
export function generateReadyToUseHook(componentName: string): string {
  const hookName = `use${componentName}s`
  const itemName = `${componentName}Item`
  const apiEndpoint = componentName.toLowerCase() + 's'

  return `'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ${itemName} {
  id: string
  [key: string]: any
}

interface ${hookName}Return {
  ${apiEndpoint}: ${itemName}[]
  isLoading: boolean
  error: string | null
  create${componentName}: (data: Omit<${itemName}, 'id' | 'createdAt' | 'updatedAt'>) => Promise<${itemName}>
  update${componentName}: (id: string, data: Partial<${itemName}>) => Promise<${itemName}>
  delete${componentName}: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function ${hookName}(): ${hookName}Return {
  const { toast } = useToast()
  const [${apiEndpoint}, set${componentName}s] = useState<${itemName}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取列表
  const fetch${componentName}s = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/${apiEndpoint}')
      if (!response.ok) throw new Error('获取失败')
      
      const data = await response.json()
      set${componentName}s(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取失败'
      setError(errorMessage)
      toast({
        title: '获取${componentName}列表失败',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // 创建
  const create${componentName} = useCallback(async (data: Omit<${itemName}, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/${apiEndpoint}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('创建失败')
    
    const new${componentName} = await response.json()
    set${componentName}s(prev => [new${componentName}, ...prev])
    
    toast({
      title: '创建成功',
      description: '${componentName}已创建',
    })
    
    return new${componentName}
  }, [toast])

  // 更新
  const update${componentName} = useCallback(async (id: string, data: Partial<${itemName}>) => {
    const response = await fetch(\`/api/${apiEndpoint}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('更新失败')
    
    const updated${componentName} = await response.json()
    set${componentName}s(prev => 
      prev.map(item => item.id === id ? updated${componentName} : item)
    )
    
    toast({
      title: '更新成功',
      description: '${componentName}已更新',
    })
    
    return updated${componentName}
  }, [toast])

  // 删除
  const delete${componentName} = useCallback(async (id: string) => {
    const response = await fetch(\`/api/${apiEndpoint}/\${id}\`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('删除失败')
    
    set${componentName}s(prev => prev.filter(item => item.id !== id))
    
    toast({
      title: '删除成功',
      description: '${componentName}已删除',
    })
  }, [toast])

  // 刷新
  const refresh = useCallback(() => fetch${componentName}s(), [fetch${componentName}s])

  useEffect(() => {
    fetch${componentName}s()
  }, [fetch${componentName}s])

  return {
    ${apiEndpoint},
    isLoading,
    error,
    create${componentName},
    update${componentName},
    delete${componentName},
    refresh,
  }
}

// 使用示例:
/*
function ${componentName}Page() {
  const {
    ${apiEndpoint},
    isLoading,
    create${componentName},
    update${componentName},
    delete${componentName}
  } = ${hookName}()

  const handleCreate = async (data: any) => {
    try {
      await create${componentName}(data)
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  return (
    <div>
      {/* 使用 ${apiEndpoint} 数据 */}
    </div>
  )
}
*/`
}

// 生成 API 路由模板 - 可直接复制粘贴使用
export function generateReadyToUseAPIRoute(componentName: string): string {
  const modelName = componentName.toLowerCase()
  const pluralName = modelName + 's'

  return `import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// 数据验证 Schema
const ${modelName}Schema = z.object({
  // 在这里定义你的字段验证规则
  // name: z.string().min(1, '名称不能为空'),
  // email: z.string().email('邮箱格式不正确'),
  // age: z.number().min(0, '年龄不能为负数'),
})

// GET /api/${pluralName} - 获取列表
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const ${pluralName} = await db.${modelName}.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(${pluralName})
  } catch (error) {
    console.error('获取${componentName}列表失败:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

// POST /api/${pluralName} - 创建新记录
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // 验证数据
    const validatedData = ${modelName}Schema.parse(body)
    
    const ${modelName} = await db.${modelName}.create({
      data: {
        ...validatedData,
        // userId: session.user.id, // 如果需要关联用户
      }
    })

    return NextResponse.json(${modelName}, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('创建${componentName}失败:', error)
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

// 使用说明:
/*
1. 将此文件保存为: app/api/${pluralName}/route.ts

2. 更新 ${modelName}Schema 验证规则，例如:
   const ${modelName}Schema = z.object({
     name: z.string().min(1, '名称不能为空'),
     email: z.string().email('邮箱格式不正确'),
     description: z.string().optional(),
   })

3. 确保 Prisma Schema 中有对应的模型:
   model ${componentName} {
     id        String   @id @default(cuid())
     name      String
     email     String   @unique
     description String?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     @@map("${pluralName}")
   }

4. 如果需要单个记录的操作，创建 app/api/${pluralName}/[id]/route.ts
*/`
}

// 生成单个记录 API 路由
export function generateReadyToUseSingleAPIRoute(componentName: string): string {
  const modelName = componentName.toLowerCase()
  const pluralName = modelName + 's'

  return `import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// 数据验证 Schema
const ${modelName}UpdateSchema = z.object({
  // 在这里定义你的字段验证规则
  // name: z.string().min(1, '名称不能为空').optional(),
  // email: z.string().email('邮箱格式不正确').optional(),
})

// GET /api/${pluralName}/[id] - 获取单个记录
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const ${modelName} = await db.${modelName}.findUnique({
      where: { id: params.id }
    })

    if (!${modelName}) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    return NextResponse.json(${modelName})
  } catch (error) {
    console.error('获取${componentName}失败:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

// PUT /api/${pluralName}/[id] - 更新记录
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // 验证数据
    const validatedData = ${modelName}UpdateSchema.parse(body)
    
    const ${modelName} = await db.${modelName}.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(${modelName})
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('更新${componentName}失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

// DELETE /api/${pluralName}/[id] - 删除记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    await db.${modelName}.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除${componentName}失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}

// 使用说明:
/*
1. 将此文件保存为: app/api/${pluralName}/[id]/route.ts

2. 更新 ${modelName}UpdateSchema 验证规则

3. 这个路由处理单个记录的 GET、PUT、DELETE 操作

4. 配合 app/api/${pluralName}/route.ts 使用，提供完整的 CRUD 功能
*/`
}
