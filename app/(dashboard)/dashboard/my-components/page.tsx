'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Search, 
  Download, 
  Upload,
  Edit, 
  Trash2,
  Eye,
  Copy,
  Plus,
  Globe,
  Lock,
  Users,
  Star,
  MoreHorizontal,
  Package,
  Share2,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { api, MyComponent, ComponentData } from '@/lib/api'

// 组件状态映射
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-800'
    case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
    case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return '已发布'
    case 'DRAFT': return '草稿'
    case 'ARCHIVED': return '已归档'
    default: return '未知'
  }
}

const getVisibilityIcon = (visibility: string) => {
  switch (visibility) {
    case 'PUBLIC': return <Globe className="h-4 w-4" />
    case 'PRIVATE': return <Lock className="h-4 w-4" />
    case 'TEAM': return <Users className="h-4 w-4" />
    default: return <Lock className="h-4 w-4" />
  }
}

const getVisibilityText = (visibility: string) => {
  switch (visibility) {
    case 'PUBLIC': return '公开'
    case 'PRIVATE': return '私有'
    case 'TEAM': return '团队'
    default: return '私有'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

export default function MyComponentsPage() {
  const [components, setComponents] = useState<MyComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<MyComponent | null>(null)
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [newComponent, setNewComponent] = useState<ComponentData>({
    name: '',
    description: '',
    category: 'basic',
    framework: 'React',
    visibility: 'PRIVATE',
    tags: [],
    code: '',
    documentation: ''
  })
  const { toast } = useToast()

  // 加载组件列表
  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    setLoading(true)
    const result = await api.components.list()
    
    if (result.success) {
      setComponents((result.data as any)?.components || [])
    } else {
      toast({
        title: '加载失败',
        description: result.error || '无法加载组件列表',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  // 筛选和排序逻辑
  const filteredComponents = useMemo(() => {
    let filtered = components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === 'all' || component.status === selectedStatus
      const matchesVisibility = selectedVisibility === 'all' || component.visibility === selectedVisibility
      return matchesSearch && matchesStatus && matchesVisibility
    })

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'downloads':
          return b.downloads - a.downloads
        case 'likes':
          return b.likes - a.likes
        default:
          return 0
      }
    })

    return filtered
  }, [components, searchTerm, selectedStatus, selectedVisibility, sortBy])

  const handleUpload = async () => {
    if (!newComponent.name || !newComponent.code) {
      toast({
        title: '请填写必要信息',
        description: '组件名称和代码不能为空',
        variant: 'destructive',
      })
      return
    }

    const result = await api.components.create(newComponent)
    if (result.success) {
      toast({
        title: '组件上传成功',
        description: `${newComponent.name} 已保存为草稿`,
      })
      setShowUploadDialog(false)
      setNewComponent({
        name: '',
        description: '',
        category: 'basic',
        framework: 'React',
        visibility: 'PRIVATE',
        tags: [],
        code: '',
        documentation: ''
      })
      loadComponents() // 重新加载列表
    } else {
      toast({
        title: '上传失败',
        description: result.error || '无法上传组件',
        variant: 'destructive',
      })
    }
  }

  const handlePublish = async (component: MyComponent) => {
    const result = await api.components.update(component.id, { status: 'PUBLISHED' })
    if (result.success) {
      toast({
        title: '组件已发布',
        description: `${component.name} 现在可以被其他用户使用`,
      })
      loadComponents()
    } else {
      toast({
        title: '发布失败',
        description: result.error || '无法发布组件',
        variant: 'destructive',
      })
    }
  }

  const handleArchive = async (component: MyComponent) => {
    const result = await api.components.update(component.id, { status: 'ARCHIVED' })
    if (result.success) {
      toast({
        title: '组件已归档',
        description: `${component.name} 已移至归档`,
      })
      loadComponents()
    } else {
      toast({
        title: '归档失败',
        description: result.error || '无法归档组件',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (component: MyComponent) => {
    if (!confirm(`确定要删除组件 "${component.name}" 吗？`)) {
      return
    }

    const result = await api.components.delete(component.id)
    if (result.success) {
      toast({
        title: '组件已删除',
        description: `${component.name} 已永久删除`,
        variant: 'destructive',
      })
      loadComponents()
    } else {
      toast({
        title: '删除失败',
        description: result.error || '无法删除组件',
        variant: 'destructive',
      })
    }
  }

  const copyComponentCode = (component: MyComponent) => {
    navigator.clipboard.writeText(component.code)
    toast({
      title: '代码已复制',
      description: '组件代码已复制到剪贴板',
    })
  }

  const handlePreview = (component: MyComponent) => {
    setSelectedComponent(component)
    // 这里可以打开预览对话框
  }

  const toggleComponentSelection = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    )
  }

  const selectAllComponents = () => {
    setSelectedComponents(filteredComponents.map(c => c.id))
  }

  const clearSelection = () => {
    setSelectedComponents([])
  }

  const handleBatchPublish = async () => {
    const result = await api.components.batchUpdate(selectedComponents, { status: 'PUBLISHED' })
    if (result.success) {
      toast({
        title: '批量发布成功',
        description: `已发布 ${selectedComponents.length} 个组件`,
      })
      clearSelection()
      loadComponents()
    } else {
      toast({
        title: '批量发布失败',
        description: result.error || '无法批量发布组件',
        variant: 'destructive',
      })
    }
  }

  const handleBatchArchive = async () => {
    const result = await api.components.batchUpdate(selectedComponents, { status: 'ARCHIVED' })
    if (result.success) {
      toast({
        title: '批量归档成功',
        description: `已归档 ${selectedComponents.length} 个组件`,
      })
      clearSelection()
      loadComponents()
    } else {
      toast({
        title: '批量归档失败',
        description: result.error || '无法批量归档组件',
        variant: 'destructive',
      })
    }
  }

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除 ${selectedComponents.length} 个组件吗？`)) {
      return
    }

    const result = await api.components.batchDelete(selectedComponents)
    if (result.success) {
      toast({
        title: '批量删除成功',
        description: `已删除 ${selectedComponents.length} 个组件`,
        variant: 'destructive',
      })
      clearSelection()
      loadComponents()
    } else {
      toast({
        title: '批量删除失败',
        description: result.error || '无法批量删除组件',
        variant: 'destructive',
      })
    }
  }

  // 统计数据
  const stats = {
    total: components.length,
    published: components.filter(c => c.status === 'PUBLISHED').length,
    draft: components.filter(c => c.status === 'DRAFT').length,
    totalDownloads: components.reduce((sum, c) => sum + c.downloads, 0)
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* 页面头部 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            我的组件
          </h1>
          <p className="text-muted-foreground mt-1">
            管理你的个人组件库，上传、发布和分享你的组件
          </p>
        </div>
        <div className="flex gap-2">
          {selectedComponents.length > 0 && (
            <>
              <Button variant="outline" onClick={handleBatchPublish}>
                <Globe className="mr-2 h-4 w-4" />
                批量发布 ({selectedComponents.length})
              </Button>
              <Button variant="outline" onClick={handleBatchArchive}>
                <Package className="mr-2 h-4 w-4" />
                批量归档
              </Button>
              <Button variant="destructive" onClick={handleBatchDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
              <Button variant="ghost" onClick={clearSelection}>
                取消选择
              </Button>
            </>
          )}
          {selectedComponents.length === 0 && (
            <>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                批量导出
              </Button>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                上传组件
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.total}</p>
                <p className="text-sm text-muted-foreground">总组件数</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.published}</p>
                <p className="text-sm text-muted-foreground">已发布</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.draft}</p>
                <p className="text-sm text-muted-foreground">草稿</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loading ? '-' : stats.totalDownloads}</p>
                <p className="text-sm text-muted-foreground">总下载量</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedComponents.length === filteredComponents.length && filteredComponents.length > 0}
            onChange={(e) => e.target.checked ? selectAllComponents() : clearSelection()}
            className="rounded"
          />
          <span className="text-sm text-muted-foreground">
            {selectedComponents.length > 0 ? `已选择 ${selectedComponents.length} 个` : '全选'}
          </span>
        </div>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索我的组件..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="PUBLISHED">已发布</SelectItem>
            <SelectItem value="DRAFT">草稿</SelectItem>
            <SelectItem value="ARCHIVED">已归档</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="可见性" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="PUBLIC">公开</SelectItem>
            <SelectItem value="TEAM">团队</SelectItem>
            <SelectItem value="PRIVATE">私有</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">最近更新</SelectItem>
            <SelectItem value="name">名称</SelectItem>
            <SelectItem value="downloads">下载量</SelectItem>
            <SelectItem value="likes">点赞数</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 搜索结果提示 */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
          <span>搜索 "{searchTerm}" 找到 {filteredComponents.length} 个组件</span>
        </div>
      )}

      {/* 组件列表 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? '没有找到匹配的组件' : '还没有组件'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? '试试修改搜索条件' : '上传你的第一个组件开始构建个人组件库'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  上传组件
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedComponents.includes(component.id)}
                      onChange={() => toggleComponentSelection(component.id)}
                      className="mt-1 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {component.name}
                        </CardTitle>
                        <Badge className={getStatusColor(component.status)}>
                          {getStatusText(component.status)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {component.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      {getVisibilityIcon(component.visibility)}
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

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
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{component.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{component.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{component.views}</span>
                    </div>
                  </div>

                  {/* 版本和更新时间 */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>v{component.version}</span>
                    <span>更新于 {formatDate(component.updatedAt)}</span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(component)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      预览
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedComponent(component)
                        setShowEditDialog(true)
                      }}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      编辑
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyComponentCode(component)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {component.status === 'DRAFT' && (
                      <Button 
                        size="sm"
                        onClick={() => handlePublish(component)}
                      >
                        <Globe className="mr-2 h-3 w-3" />
                        发布
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 上传组件对话框 */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              上传新组件
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">组件名称 *</Label>
                  <Input
                    id="name"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                    placeholder="例如: CustomButton"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framework">框架</Label>
                  <Select 
                    value={newComponent.framework} 
                    onValueChange={(value: any) => setNewComponent({ ...newComponent, framework: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Vue">Vue</SelectItem>
                      <SelectItem value="Angular">Angular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                  placeholder="简要描述组件的功能和用途"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Input
                    id="category"
                    value={newComponent.category}
                    onChange={(e) => setNewComponent({ ...newComponent, category: e.target.value })}
                    placeholder="例如: basic, form, data"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">可见性</Label>
                  <Select 
                    value={newComponent.visibility} 
                    onValueChange={(value: any) => setNewComponent({ ...newComponent, visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">私有</SelectItem>
                      <SelectItem value="TEAM">团队</SelectItem>
                      <SelectItem value="PUBLIC">公开</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">标签 (用逗号分隔)</Label>
                <Input
                  id="tags"
                  value={newComponent.tags.join(', ')}
                  onChange={(e) => setNewComponent({ 
                    ...newComponent, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="例如: 按钮, UI, 交互"
                />
              </div>
            </div>

            {/* 代码 */}
            <div className="space-y-2">
              <Label htmlFor="code">组件代码 *</Label>
              <Textarea
                id="code"
                value={newComponent.code}
                onChange={(e) => setNewComponent({ ...newComponent, code: e.target.value })}
                placeholder="粘贴你的组件代码..."
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            {/* 文档 */}
            <div className="space-y-2">
              <Label htmlFor="documentation">文档 (可选)</Label>
              <Textarea
                id="documentation"
                value={newComponent.documentation}
                onChange={(e) => setNewComponent({ ...newComponent, documentation: e.target.value })}
                placeholder="组件使用说明和文档..."
                rows={5}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                上传组件
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
