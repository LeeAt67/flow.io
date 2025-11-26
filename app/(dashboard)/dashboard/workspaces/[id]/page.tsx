'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter,
  Grid,
  List,
  Star,
  Eye,
  Download,
  Edit,
  Trash2,
  Copy,
  Share,
  Settings,
  Users,
  Code,
  Palette
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { CodeEditor } from '@/components/code-editor/code-editor'
import { CodePreview } from '@/components/code-editor/code-preview'

interface ComponentData {
  id: string
  name: string
  description?: string
  category: string
  tags: string[]
  framework: 'react' | 'vue' | 'html'
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'workspace'
  usageCount: number
  likes: number
  createdAt: string
  updatedAt: string
  previewImage?: string
  code: string
}

export default function WorkspaceDetailPage() {
  const params = useParams()
  const workspaceId = params.id as string
  const [components, setComponents] = useState<ComponentData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null)
  const [isDesigning, setIsDesigning] = useState(false)
  const { toast } = useToast()

  // 模拟数据
  useEffect(() => {
    const mockComponents: ComponentData[] = [
      {
        id: '1',
        name: 'CustomButton',
        description: '可定制的按钮组件，支持多种样式和状态',
        category: 'UI Components',
        tags: ['button', 'interactive', 'form'],
        framework: 'react',
        status: 'published',
        visibility: 'workspace',
        usageCount: 25,
        likes: 12,
        createdAt: '2024-11-20',
        updatedAt: '2024-11-25',
        code: `import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

export function CustomButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}`
      },
      {
        id: '2',
        name: 'DataCard',
        description: '数据展示卡片，支持图表和统计信息',
        category: 'Data Display',
        tags: ['card', 'data', 'statistics'],
        framework: 'react',
        status: 'draft',
        visibility: 'private',
        usageCount: 8,
        likes: 5,
        createdAt: '2024-11-22',
        updatedAt: '2024-11-26',
        code: `import React from 'react'

interface DataCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
}

export function DataCard({ title, value, change, icon }: DataCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn(
              "text-sm",
              change > 0 ? "text-green-600" : "text-red-600"
            )}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}`
      }
    ]
    setComponents(mockComponents)
  }, [])

  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))]
  
  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleCreateComponent = () => {
    setIsDesigning(true)
    setSelectedComponent(null)
    toast({
      title: '开始设计组件',
      description: '进入组件设计模式',
    })
  }

  const handleEditComponent = (component: ComponentData) => {
    setSelectedComponent(component)
    setIsDesigning(true)
  }

  const handleSaveComponent = (code: string) => {
    if (selectedComponent) {
      // 更新现有组件
      setComponents(prev => 
        prev.map(comp => 
          comp.id === selectedComponent.id 
            ? { ...comp, code, updatedAt: new Date().toISOString().split('T')[0] }
            : comp
        )
      )
      toast({
        title: '组件已更新',
        description: `${selectedComponent.name} 已保存到工作区`,
      })
    } else {
      // 创建新组件
      const newComponent: ComponentData = {
        id: Date.now().toString(),
        name: 'NewComponent',
        description: '新创建的组件',
        category: 'UI Components',
        tags: ['custom'],
        framework: 'react',
        status: 'draft',
        visibility: 'workspace',
        usageCount: 0,
        likes: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        code
      }
      setComponents(prev => [newComponent, ...prev])
      toast({
        title: '组件已创建',
        description: '新组件已保存到工作区',
      })
    }
    setIsDesigning(false)
    setSelectedComponent(null)
  }

  const ComponentCard = ({ component }: { component: ComponentData }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{component.name}</CardTitle>
              <Badge variant={component.status === 'published' ? 'default' : 'secondary'}>
                {component.status === 'published' ? '已发布' : 
                 component.status === 'draft' ? '草稿' : '已归档'}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {component.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            {component.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {component.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{component.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {component.usageCount}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {component.likes}
              </span>
            </div>
            <span>{component.updatedAt}</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleEditComponent(component)}
            >
              <Edit className="mr-1 h-3 w-3" />
              编辑
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isDesigning) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedComponent ? `编辑 ${selectedComponent.name}` : '创建新组件'}
            </h1>
            <p className="text-muted-foreground">
              使用代码编辑器和预览功能设计你的组件
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDesigning(false)}>
              取消
            </Button>
            <Button onClick={() => handleSaveComponent(selectedComponent?.code || '')}>
              保存到工作区
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 h-[800px]">
          {/* 左侧代码编辑器 */}
          <CodeEditor
            initialCode={selectedComponent?.code || `import React from 'react'

export function MyComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">我的组件</h2>
      <p className="text-gray-600">开始设计你的组件...</p>
    </div>
  )
}`}
            language="typescript"
            fileName={selectedComponent?.name + '.tsx' || 'MyComponent.tsx'}
            onCodeChange={(code) => {
              if (selectedComponent) {
                setSelectedComponent({ ...selectedComponent, code })
              }
            }}
          />

          {/* 右侧预览区域 */}
          <CodePreview
            code={selectedComponent?.code || ''}
            language="typescript"
            fileName={selectedComponent?.name + '.tsx' || 'MyComponent.tsx'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">我的个人工作区</h1>
          <p className="text-muted-foreground">
            管理和设计你的组件库
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            设置
          </Button>
          <Button onClick={handleCreateComponent}>
            <Plus className="mr-2 h-4 w-4" />
            创建组件
          </Button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索组件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? '全部分类' : category}
            </option>
          ))}
        </select>

        <div className="flex border rounded-md">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 组件列表 */}
      {filteredComponents.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
        }>
          {filteredComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Palette className="mb-4 h-16 w-16" />
              <p>还没有组件</p>
              <p className="text-sm mb-4">创建你的第一个组件开始设计</p>
              <Button onClick={handleCreateComponent}>
                <Plus className="mr-2 h-4 w-4" />
                创建组件
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
