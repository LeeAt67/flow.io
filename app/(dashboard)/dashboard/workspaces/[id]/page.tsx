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
import { AIAssistant } from '@/components/ai/ai-assistant'

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
  const [showRightPanel, setShowRightPanel] = useState(true)
  const { toast } = useToast()

  // 控制body滚动
  useEffect(() => {
    if (isDesigning) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
    
    // 清理函数
    return () => {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [isDesigning])

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
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 组件头部 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{component.name}</h3>
                <Badge 
                  variant={component.status === 'published' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {component.status === 'published' ? '已发布' : 
                   component.status === 'draft' ? '草稿' : '已归档'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {component.description || '暂无描述'}
              </p>
            </div>
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            {component.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500">
                +{component.tags.length - 2}
              </span>
            )}
          </div>

          {/* 统计和操作 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {component.usageCount}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {component.likes}
              </span>
              <span>{component.updatedAt}</span>
            </div>
            
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => handleEditComponent(component)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isDesigning) {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-white">
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {selectedComponent ? selectedComponent.name : '新组件'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {selectedComponent ? '编辑组件代码和样式' : '创建你的第一个组件'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsDesigning(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                取消
              </Button>
              <Button 
                size="sm"
                onClick={() => handleSaveComponent(selectedComponent?.code || '')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                保存组件
              </Button>
            </div>
          </div>
        </div>

        <div className={`flex-1 grid gap-3 p-4 transition-all duration-300 overflow-hidden ${showRightPanel ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* 代码编辑器 */}
          <div className="h-full rounded-lg border border-gray-200 overflow-hidden shadow-sm">
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
            onAIAssist={(code) => {
              // AI助手回调处理
              console.log('AI助手分析代码:', code)
            }}
            showRightPanel={showRightPanel}
            onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
            />
          </div>

          {/* 预览、AI助手和分析 */}
          {showRightPanel && (
            <div className="h-full rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <CodePreview
                code={selectedComponent?.code || ''}
                language="typescript"
                fileName={selectedComponent?.name + '.tsx' || 'MyComponent.tsx'}
                aiAssistant={
                  <AIAssistant
                    code={selectedComponent?.code || ''}
                    language="typescript"
                    fileName={selectedComponent?.name + '.tsx' || 'MyComponent.tsx'}
                    onCodeSuggestion={(suggestion) => {
                      if (selectedComponent) {
                        const newCode = selectedComponent.code + '\n\n' + suggestion
                        setSelectedComponent({ ...selectedComponent, code: newCode })
                      }
                    }}
                  />
                }
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 头部区域 */}
      <div className="bg-white border-b border-gray-100 px-6 py-6 -mx-6 -mt-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">我的工作区</h1>
            <p className="text-gray-600 mt-2">
              设计和管理你的组件库
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings className="mr-2 h-4 w-4" />
              设置
            </Button>
            <Button 
              onClick={handleCreateComponent}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              创建组件
            </Button>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <select
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '全部分类' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className={`rounded-none ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'hover:bg-gray-50'}`}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className={`rounded-none border-l ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'hover:bg-gray-50'}`}
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
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Palette className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有组件</h3>
            <p className="text-gray-600 mb-6">
              创建你的第一个组件，开始构建专属的组件库
            </p>
            <Button 
              onClick={handleCreateComponent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Plus className="mr-2 h-4 w-4" />
              创建第一个组件
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
