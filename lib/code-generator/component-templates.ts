import { DataField } from '@/types'

// 生成表单组件
export function generateFormComponent(modelName: string, fields: DataField[]): string {
  const modelNameLower = modelName.toLowerCase()
  
  const formFields = fields.map(field => {
    const fieldName = field.name
    const isRequired = field.required
    const fieldType = field.type
    
    if (fieldType === 'boolean') {
      return `        <div className="flex items-center space-x-2">
          <Checkbox
            id="${fieldName}"
            checked={formData.${fieldName}}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, ${fieldName}: checked }))
            }
          />
          <Label htmlFor="${fieldName}">${field.label || fieldName}</Label>
        </div>`
    }
    
    if (fieldType === 'date') {
      return `        <div className="space-y-2">
          <Label htmlFor="${fieldName}">${field.label || fieldName}${isRequired ? ' *' : ''}</Label>
          <Input
            id="${fieldName}"
            type="date"
            value={formData.${fieldName}}
            onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.value }))}
            required={${isRequired}}
          />
        </div>`
    }
    
    if (field.options && field.options.length > 0) {
      const options = field.options.map(opt => `            <SelectItem value="${opt}">${opt}</SelectItem>`).join('\n')
      return `        <div className="space-y-2">
          <Label htmlFor="${fieldName}">${field.label || fieldName}${isRequired ? ' *' : ''}</Label>
          <Select value={formData.${fieldName}} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, ${fieldName}: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="请选择${field.label || fieldName}" />
            </SelectTrigger>
            <SelectContent>
${options}
            </SelectContent>
          </Select>
        </div>`
    }
    
    const inputType = fieldType === 'number' ? 'number' : 
                     fieldType === 'String' && fieldName.includes('email') ? 'email' :
                     fieldType === 'String' && fieldName.includes('password') ? 'password' : 'text'
    
    return `        <div className="space-y-2">
          <Label htmlFor="${fieldName}">${field.label || fieldName}${isRequired ? ' *' : ''}</Label>
          <Input
            id="${fieldName}"
            type="${inputType}"
            value={formData.${fieldName}}
            onChange={(e) => setFormData(prev => ({ ...prev, ${fieldName}: e.target.value }))}
            placeholder="请输入${field.label || fieldName}"
            required={${isRequired}}
          />
        </div>`
  }).join('\n\n')

  const initialFormData = fields.map(field => {
    const defaultValue = field.type === 'Boolean' ? 'false' : 
                        field.type === 'Int' || field.type === 'Float' ? '0' : "''"
    return `    ${field.name}: ${defaultValue},`
  }).join('\n')

  const zodValidation = fields.map(field => {
    let zodType = 'z.string()'
    if (field.type === 'Int') zodType = 'z.number().int()'
    if (field.type === 'Float') zodType = 'z.number()'
    if (field.type === 'Boolean') zodType = 'z.boolean()'
    if (field.type === 'DateTime') zodType = 'z.string().datetime()'
    
    if (!field.required) {
      zodType += '.optional()'
    }
    
    return `  ${field.name}: ${zodType},`
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
import { z } from 'zod'

// 数据验证 Schema
const ${modelNameLower}Schema = z.object({
${zodValidation}
})

type ${modelName}FormData = z.infer<typeof ${modelNameLower}Schema>

interface ${modelName}FormProps {
  initialData?: Partial<${modelName}FormData>
  onSubmit: (data: ${modelName}FormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function ${modelName}Form({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ${modelName}FormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<${modelName}FormData>({
${initialFormData}
    ...initialData,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 验证表单数据
      const validatedData = ${modelNameLower}Schema.parse(formData)
      
      // 提交数据
      await onSubmit(validatedData)
      
      toast({
        title: '提交成功',
        description: '${modelName} 信息已保存',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: '表单验证失败',
          description: error.errors[0]?.message || '请检查输入信息',
          variant: 'destructive',
        })
      } else {
        toast({
          title: '提交失败',
          description: '请稍后重试',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>${modelName} 表单</CardTitle>
        <CardDescription>
          请填写${modelName}的相关信息
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
  const handleSubmit = async (data: ${modelName}FormData) => {
    // 处理表单提交
    console.log('提交的数据:', data)
    
    // 发送到 API
    const response = await fetch('/api/${modelNameLower}s', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('提交失败')
    }
  }

  return (
    <${modelName}Form
      onSubmit={handleSubmit}
      onCancel={() => console.log('取消')}
    />
  )
}
*/`
}

// 生成数据表格组件
export function generateTableComponent(modelName: string, fields: DataField[]): string {
  const modelNameLower = modelName.toLowerCase()
  const modelNamePlural = `${modelNameLower}s`
  
  const tableHeaders = fields.map(field => 
    `        <TableHead>${field.label || field.name}</TableHead>`
  ).join('\n')
  
  const tableCells = fields.map(field => {
    if (field.type === 'Boolean') {
      return `          <TableCell>
            <Badge variant={item.${field.name} ? 'default' : 'secondary'}>
              {item.${field.name} ? '是' : '否'}
            </Badge>
          </TableCell>`
    }
    
    if (field.type === 'DateTime') {
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

interface ${modelName}Item {
  id: string
${fields.map(field => `  ${field.name}: ${field.type === 'Int' || field.type === 'Float' ? 'number' : field.type === 'Boolean' ? 'boolean' : field.type === 'DateTime' ? 'string' : 'string'}`).join('\n')}
  createdAt: string
  updatedAt: string
}

interface ${modelName}TableProps {
  data?: ${modelName}Item[]
  onAdd?: () => void
  onEdit?: (item: ${modelName}Item) => void
  onDelete?: (id: string) => void
  onView?: (item: ${modelName}Item) => void
  isLoading?: boolean
}

export function ${modelName}Table({ 
  data = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  isLoading = false 
}: ${modelName}TableProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<${modelName}Item[]>(data)

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
            <CardTitle>${modelName} 列表</CardTitle>
            <CardDescription>
              管理所有的${modelName}记录
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
              placeholder="搜索${modelName}..."
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
  const [${modelNamePlural}, set${modelName}s] = useState<${modelName}Item[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = () => {
    // 打开新增对话框或跳转到新增页面
    console.log('新增${modelName}')
  }

  const handleEdit = (item: ${modelName}Item) => {
    // 打开编辑对话框或跳转到编辑页面
    console.log('编辑${modelName}:', item)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      await fetch(\`/api/${modelNamePlural}/\${id}\`, { method: 'DELETE' })
      set${modelName}s(prev => prev.filter(item => item.id !== id))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <${modelName}Table
      data={${modelNamePlural}}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  )
}
*/`
}

// 生成完整的 CRUD 页面组件
export function generateCRUDPageComponent(modelName: string, fields: DataField[]): string {
  const modelNameLower = modelName.toLowerCase()
  const modelNamePlural = `${modelNameLower}s`

  return `'use client'

import { useState, useEffect } from 'react'
import { ${modelName}Form } from './${modelName}Form'
import { ${modelName}Table } from './${modelName}Table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface ${modelName}Item {
  id: string
${fields.map(field => `  ${field.name}: ${field.type === 'Int' || field.type === 'Float' ? 'number' : field.type === 'Boolean' ? 'boolean' : field.type === 'DateTime' ? 'string' : 'string'}`).join('\n')}
  createdAt: string
  updatedAt: string
}

export default function ${modelName}ManagementPage() {
  const { toast } = useToast()
  const [${modelNamePlural}, set${modelName}s] = useState<${modelName}Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<${modelName}Item | null>(null)

  // 加载数据
  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/${modelNamePlural}')
      if (response.ok) {
        const data = await response.json()
        set${modelName}s(data)
      }
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载${modelName}列表',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 新增
  const handleAdd = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  // 编辑
  const handleEdit = (item: ${modelName}Item) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  // 删除
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(\`/api/${modelNamePlural}/\${id}\`, {
        method: 'DELETE',
      })

      if (response.ok) {
        set${modelName}s(prev => prev.filter(item => item.id !== id))
        toast({
          title: '删除成功',
          description: '${modelName}已删除',
        })
      } else {
        throw new Error('删除失败')
      }
    } catch (error) {
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    }
  }

  // 提交表单
  const handleSubmit = async (data: any) => {
    try {
      const url = editingItem ? \`/api/${modelNamePlural}/\${editingItem.id}\` : '/api/${modelNamePlural}'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        
        if (editingItem) {
          // 更新现有项
          set${modelName}s(prev => 
            prev.map(item => item.id === editingItem.id ? result : item)
          )
        } else {
          // 添加新项
          set${modelName}s(prev => [result, ...prev])
        }

        setIsDialogOpen(false)
        toast({
          title: editingItem ? '更新成功' : '创建成功',
          description: \`${modelName}已\${editingItem ? '更新' : '创建'}\`,
        })
      } else {
        throw new Error('提交失败')
      }
    } catch (error) {
      throw error // 让表单组件处理错误
    }
  }

  return (
    <div className="container mx-auto py-8">
      <${modelName}Table
        data={${modelNamePlural}}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? '编辑${modelName}' : '新增${modelName}'}
            </DialogTitle>
          </DialogHeader>
          <${modelName}Form
            initialData={editingItem || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// API 路由示例 (app/api/${modelNamePlural}/route.ts):
/*
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const ${modelNamePlural} = await db.${modelNameLower}.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(${modelNamePlural})
  } catch (error) {
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const ${modelNameLower} = await db.${modelNameLower}.create({ data })
    return NextResponse.json(${modelNameLower})
  } catch (error) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}
*/`
}

// 生成 Hooks 组件
export function generateCustomHook(modelName: string): string {
  const modelNameLower = modelName.toLowerCase()
  const modelNamePlural = `${modelNameLower}s`

  return `'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ${modelName}Item {
  id: string
  [key: string]: any
}

interface Use${modelName}sReturn {
  ${modelNamePlural}: ${modelName}Item[]
  isLoading: boolean
  error: string | null
  create${modelName}: (data: Omit<${modelName}Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<${modelName}Item>
  update${modelName}: (id: string, data: Partial<${modelName}Item>) => Promise<${modelName}Item>
  delete${modelName}: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function use${modelName}s(): Use${modelName}sReturn {
  const { toast } = useToast()
  const [${modelNamePlural}, set${modelName}s] = useState<${modelName}Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取列表
  const fetch${modelName}s = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/${modelNamePlural}')
      if (!response.ok) throw new Error('获取失败')
      
      const data = await response.json()
      set${modelName}s(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取失败'
      setError(errorMessage)
      toast({
        title: '获取${modelName}列表失败',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // 创建
  const create${modelName} = useCallback(async (data: Omit<${modelName}Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/${modelNamePlural}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('创建失败')
    
    const new${modelName} = await response.json()
    set${modelName}s(prev => [new${modelName}, ...prev])
    
    toast({
      title: '创建成功',
      description: '${modelName}已创建',
    })
    
    return new${modelName}
  }, [toast])

  // 更新
  const update${modelName} = useCallback(async (id: string, data: Partial<${modelName}Item>) => {
    const response = await fetch(\`/api/${modelNamePlural}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error('更新失败')
    
    const updated${modelName} = await response.json()
    set${modelName}s(prev => 
      prev.map(item => item.id === id ? updated${modelName} : item)
    )
    
    toast({
      title: '更新成功',
      description: '${modelName}已更新',
    })
    
    return updated${modelName}
  }, [toast])

  // 删除
  const delete${modelName} = useCallback(async (id: string) => {
    const response = await fetch(\`/api/${modelNamePlural}/\${id}\`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('删除失败')
    
    set${modelName}s(prev => prev.filter(item => item.id !== id))
    
    toast({
      title: '删除成功',
      description: '${modelName}已删除',
    })
  }, [toast])

  // 刷新
  const refresh = useCallback(() => fetch${modelName}s(), [fetch${modelName}s])

  useEffect(() => {
    fetch${modelName}s()
  }, [fetch${modelName}s])

  return {
    ${modelNamePlural},
    isLoading,
    error,
    create${modelName},
    update${modelName},
    delete${modelName},
    refresh,
  }
}

// 使用示例:
/*
function ${modelName}Page() {
  const {
    ${modelNamePlural},
    isLoading,
    create${modelName},
    update${modelName},
    delete${modelName}
  } = use${modelName}s()

  const handleCreate = async (data: any) => {
    try {
      await create${modelName}(data)
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  return (
    <div>
      {/* 使用 ${modelNamePlural} 数据 */}
    </div>
  )
}
*/`
}
