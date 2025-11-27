'use client'

import { useState, useMemo } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { 
  Library, 
  Search, 
  Filter, 
  Download, 
  Heart, 
  Star, 
  Eye,
  Copy,
  Code,
  Palette,
  Layout,
  MousePointer,
  Database,
  Zap,
  Shield,
  Globe,
  Upload,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  X,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

// export const metadata: Metadata = {
//   title: '组件库 - Flow.io',
//   description: '浏览和使用预制的UI组件，快速构建你的应用',
// }

// 模拟组件数据
const componentCategories = [
  { id: 'all', name: '全部', count: 156 },
  { id: 'basic', name: '基础组件', count: 45 },
  { id: 'form', name: '表单组件', count: 32 },
  { id: 'layout', name: '布局组件', count: 28 },
  { id: 'navigation', name: '导航组件', count: 18 },
  { id: 'data', name: '数据展示', count: 25 },
  { id: 'feedback', name: '反馈组件', count: 8 },
]

const featuredComponents = [
  {
    id: '1',
    name: 'DataTable',
    description: '功能强大的数据表格组件，支持排序、筛选、分页等功能',
    category: 'data',
    framework: 'React',
    downloads: 1240,
    likes: 89,
    views: 3420,
    tags: ['表格', '数据', '分页', '排序'],
    preview: '/api/placeholder/300/200',
    author: 'Flow.io Team',
    version: '1.2.0',
    lastUpdate: '2天前'
  },
  {
    id: '2',
    name: 'FormBuilder',
    description: '可视化表单构建器，支持拖拽创建复杂表单',
    category: 'form',
    framework: 'React',
    downloads: 856,
    likes: 67,
    views: 2180,
    tags: ['表单', '构建器', '拖拽', '验证'],
    preview: '/api/placeholder/300/200',
    author: 'Community',
    version: '2.1.3',
    lastUpdate: '1周前'
  },
  {
    id: '3',
    name: 'Dashboard Layout',
    description: '现代化的仪表板布局模板，响应式设计',
    category: 'layout',
    framework: 'React',
    downloads: 2340,
    likes: 156,
    views: 5670,
    tags: ['布局', '仪表板', '响应式', '导航'],
    preview: '/api/placeholder/300/200',
    author: 'Design System',
    version: '3.0.1',
    lastUpdate: '3天前'
  },
  {
    id: '4',
    name: 'Chart Components',
    description: '丰富的图表组件集合，基于D3.js构建',
    category: 'data',
    framework: 'React',
    downloads: 1890,
    likes: 134,
    views: 4230,
    tags: ['图表', '数据可视化', 'D3', '统计'],
    preview: '/api/placeholder/300/200',
    author: 'Data Team',
    version: '1.8.2',
    lastUpdate: '5天前'
  },
  {
    id: '5',
    name: 'Navigation Menu',
    description: '多级导航菜单组件，支持图标和徽章',
    category: 'navigation',
    framework: 'React',
    downloads: 1120,
    likes: 78,
    views: 2890,
    tags: ['导航', '菜单', '多级', '图标'],
    preview: '/api/placeholder/300/200',
    author: 'UI Team',
    version: '1.5.0',
    lastUpdate: '1周前'
  },
  {
    id: '6',
    name: 'Modal System',
    description: '灵活的模态框系统，支持多种样式和动画',
    category: 'feedback',
    framework: 'React',
    downloads: 967,
    likes: 92,
    views: 2156,
    tags: ['模态框', '弹窗', '动画', '反馈'],
    preview: '/api/placeholder/300/200',
    author: 'Flow.io Team',
    version: '2.3.1',
    lastUpdate: '4天前'
  }
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'basic': return <Palette className="h-4 w-4" />
    case 'form': return <MousePointer className="h-4 w-4" />
    case 'layout': return <Layout className="h-4 w-4" />
    case 'navigation': return <Globe className="h-4 w-4" />
    case 'data': return <Database className="h-4 w-4" />
    case 'feedback': return <Zap className="h-4 w-4" />
    default: return <Library className="h-4 w-4" />
  }
}

export default function ComponentLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('downloads')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>(['1', '3'])
  const [selectedComponent, setSelectedComponent] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  // 筛选和排序逻辑
  const filteredComponents = useMemo(() => {
    let filtered = featuredComponents.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads
        case 'likes':
          return b.likes - a.likes
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  const toggleFavorite = (componentId: string) => {
    setFavorites(prev => 
      prev.includes(componentId) 
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    )
    toast({
      title: favorites.includes(componentId) ? '已取消收藏' : '已添加收藏',
      description: '组件收藏状态已更新',
    })
  }

  const copyComponentCode = (component: any) => {
    const code = `// ${component.name} 组件代码\nimport React from 'react'\n\nexport function ${component.name}() {\n  return (\n    <div>\n      {/* ${component.description} */}\n      <h1>${component.name}</h1>\n    </div>\n  )\n}`
    
    navigator.clipboard.writeText(code)
    toast({
      title: '代码已复制',
      description: '组件代码已复制到剪贴板',
    })
  }

  const downloadComponent = (component: any) => {
    toast({
      title: '开始下载',
      description: `正在下载 ${component.name} 组件...`,
    })
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* 页面头部 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Library className="h-8 w-8 text-blue-600" />
            组件库
          </h1>
          <p className="text-muted-foreground mt-1">
            发现和使用高质量的UI组件，加速你的开发流程
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            上传组件
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            批量下载
          </Button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索组件..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">下载量</SelectItem>
            <SelectItem value="likes">点赞数</SelectItem>
            <SelectItem value="name">名称</SelectItem>
            <SelectItem value="recent">最新</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 border rounded-md">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {componentCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setSelectedCategory(category.id)}
          >
            {getCategoryIcon(category.id)}
            {category.name}
            <Badge variant="secondary" className="ml-1">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* 搜索结果提示 */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
          <span>搜索 "{searchTerm}" 找到 {filteredComponents.length} 个组件</span>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* 主要内容 */}
      <Tabs defaultValue="featured" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="featured">精选组件</TabsTrigger>
          <TabsTrigger value="popular">热门组件</TabsTrigger>
          <TabsTrigger value="recent">最新组件</TabsTrigger>
          <TabsTrigger value="my-library">我的收藏</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="flex-1 overflow-y-auto">
          {/* 组件网格/列表 */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredComponents.map((component) => (
              <Card key={component.id} className={`group hover:shadow-lg transition-all duration-200 ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <CardHeader className={`pb-3 ${
                  viewMode === 'list' ? 'flex-shrink-0 w-48' : ''
                }`}>
                  {/* 组件预览 */}
                  <div className={`bg-gray-100 rounded-lg mb-3 overflow-hidden ${
                    viewMode === 'list' ? 'aspect-square w-32 h-32' : 'aspect-video'
                  }`}>
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <Code className={`text-blue-400 ${
                        viewMode === 'list' ? 'h-8 w-8' : 'h-12 w-12'
                      }`} />
                    </div>
                  </div>
                  
                  {viewMode === 'grid' && (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {component.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {component.description}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`transition-opacity ${
                          favorites.includes(component.id) 
                            ? 'opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50' 
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => toggleFavorite(component.id)}
                      >
                        <Heart className={`h-4 w-4 ${
                          favorites.includes(component.id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                    </div>
                  )}
                </CardHeader>

                {viewMode === 'list' && (
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {component.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1 mt-1">
                          {component.description}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`transition-opacity ${
                          favorites.includes(component.id) 
                            ? 'opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50' 
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => toggleFavorite(component.id)}
                      >
                        <Heart className={`h-4 w-4 ${
                          favorites.includes(component.id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                    </div>
                    
                    {/* 列表模式的简化信息 */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {component.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {component.likes}
                      </span>
                      <span>v{component.version}</span>
                      <span>{component.lastUpdate}</span>
                    </div>
                    
                    {/* 列表模式的操作按钮 */}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => downloadComponent(component)}>
                        <Download className="mr-2 h-3 w-3" />
                        使用
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedComponent(component)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        预览
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyComponentCode(component)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <CardContent className="space-y-4">
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1">
                    {component.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {component.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{component.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {component.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {component.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {component.views}
                      </span>
                    </div>
                  </div>

                  {/* 作者和版本信息 */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {component.author}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        v{component.version}
                      </Badge>
                      <span>{component.lastUpdate}</span>
                    </div>
                  </div>

                  {/* 操作按钮 - 只在网格模式显示 */}
                  {viewMode === 'grid' && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => downloadComponent(component)}>
                        <Download className="mr-2 h-3 w-3" />
                        使用
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedComponent(component)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        预览
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyComponentCode(component)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Library className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">热门组件</h3>
              <p className="text-muted-foreground">展示下载量最高的组件</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Library className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">最新组件</h3>
              <p className="text-muted-foreground">展示最近更新的组件</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-library" className="flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">我的收藏</h3>
                <p className="text-muted-foreground">还没有收藏任何组件</p>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {featuredComponents
                .filter(component => favorites.includes(component.id))
                .map((component) => (
                  <Card key={component.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                          <Code className="h-12 w-12 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {component.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {component.description}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => toggleFavorite(component.id)}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => downloadComponent(component)}>
                          <Download className="mr-2 h-3 w-3" />
                          使用
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedComponent(component)
                            setShowPreview(true)
                          }}
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          预览
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 组件预览对话框 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {selectedComponent?.name} - 组件预览
            </DialogTitle>
          </DialogHeader>
          
          {selectedComponent && (
            <div className="space-y-6">
              {/* 组件信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">组件信息</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>名称:</strong> {selectedComponent.name}</p>
                    <p><strong>描述:</strong> {selectedComponent.description}</p>
                    <p><strong>版本:</strong> v{selectedComponent.version}</p>
                    <p><strong>作者:</strong> {selectedComponent.author}</p>
                    <p><strong>更新时间:</strong> {selectedComponent.lastUpdate}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">使用统计</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>下载量: {selectedComponent.downloads}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>点赞数: {selectedComponent.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>浏览量: {selectedComponent.views}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 标签 */}
              <div>
                <h3 className="font-semibold mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedComponent.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* 预览区域 */}
              <div>
                <h3 className="font-semibold mb-2">组件预览</h3>
                <div className="border rounded-lg p-8 bg-gray-50 min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <Code className="mx-auto h-16 w-16 text-blue-400 mb-4" />
                    <p className="text-muted-foreground">组件预览区域</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedComponent.name} 组件将在这里显示</p>
                  </div>
                </div>
              </div>
              
              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold mb-2">代码示例</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`// ${selectedComponent.name} 使用示例
import React from 'react'
import { ${selectedComponent.name} } from '@/components/ui/${selectedComponent.name.toLowerCase()}'

export function Example() {
  return (
    <div>
      <${selectedComponent.name} 
        // 组件属性
      />
    </div>
  )
}`}</pre>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => downloadComponent(selectedComponent)}>
                  <Download className="mr-2 h-4 w-4" />
                  下载组件
                </Button>
                <Button variant="outline" onClick={() => copyComponentCode(selectedComponent)}>
                  <Copy className="mr-2 h-4 w-4" />
                  复制代码
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toggleFavorite(selectedComponent.id)}
                >
                  <Heart className={`mr-2 h-4 w-4 ${
                    favorites.includes(selectedComponent.id) ? 'fill-current text-red-500' : ''
                  }`} />
                  {favorites.includes(selectedComponent.id) ? '取消收藏' : '收藏'}
                </Button>
                <Button variant="outline" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    查看文档
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
