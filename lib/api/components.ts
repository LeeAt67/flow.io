// API 调用函数 - 组件管理

// 临时类型定义，直到数据库迁移完成
export type ComponentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type ComponentVisibility = 'PRIVATE' | 'PUBLIC' | 'TEAM'
export type ComponentFramework = 'REACT' | 'VUE' | 'ANGULAR'

export interface MyComponent {
  id: string
  name: string
  description: string
  category: string
  framework: ComponentFramework
  status: ComponentStatus
  visibility: ComponentVisibility
  version: string
  downloads: number
  likes: number
  views: number
  tags: string[]
  createdAt: string
  updatedAt: string
  code: string
  preview?: string
  documentation?: string
  userId: string
  author?: {
    id: string
    name: string
    avatar?: string
  }
}

const API_BASE = '/api/components'

// 组件查询参数
export interface ComponentsQuery {
  search?: string
  status?: ComponentStatus | 'all'
  visibility?: ComponentVisibility | 'all'
  category?: string
  sortBy?: 'updatedAt' | 'name' | 'downloads' | 'likes'
  page?: number
  limit?: number
}

// 组件创建/更新数据
export interface ComponentData {
  name: string
  description: string
  category: string
  framework: 'React' | 'Vue' | 'Angular'
  visibility: ComponentVisibility
  tags: string[]
  code: string
  documentation?: string
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ComponentsResponse {
  components: MyComponent[]
  total: number
  page: number
  limit: number
}

// 获取组件列表
export async function getComponents(query: ComponentsQuery = {}): Promise<ApiResponse<ComponentsResponse>> {
  try {
    const params = new URLSearchParams()
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const response = await fetch(`${API_BASE}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('获取组件列表失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取组件列表失败' 
    }
  }
}

// 获取单个组件
export async function getComponent(id: string): Promise<ApiResponse<MyComponent>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('获取组件详情失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取组件详情失败' 
    }
  }
}

// 创建组件
export async function createComponent(componentData: ComponentData): Promise<ApiResponse<MyComponent>> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(componentData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '组件创建成功' }
  } catch (error) {
    console.error('创建组件失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '创建组件失败' 
    }
  }
}

// 更新组件
export async function updateComponent(id: string, componentData: Partial<ComponentData>): Promise<ApiResponse<MyComponent>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(componentData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '组件更新成功' }
  } catch (error) {
    console.error('更新组件失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新组件失败' 
    }
  }
}

// 删除组件
export async function deleteComponent(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true, message: '组件删除成功' }
  } catch (error) {
    console.error('删除组件失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '删除组件失败' 
    }
  }
}

// 批量操作
export async function batchUpdateComponents(
  ids: string[], 
  updates: { status?: ComponentStatus; visibility?: ComponentVisibility }
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/batch`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids, updates }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true, message: '批量更新成功' }
  } catch (error) {
    console.error('批量更新失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '批量更新失败' 
    }
  }
}

// 批量删除
export async function batchDeleteComponents(ids: string[]): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/batch`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true, message: '批量删除成功' }
  } catch (error) {
    console.error('批量删除失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '批量删除失败' 
    }
  }
}

// 发布组件
export async function publishComponent(id: string): Promise<ApiResponse<MyComponent>> {
  try {
    const response = await fetch(`${API_BASE}/${id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '组件发布成功' }
  } catch (error) {
    console.error('发布组件失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '发布组件失败' 
    }
  }
}

// 归档组件
export async function archiveComponent(id: string): Promise<ApiResponse<MyComponent>> {
  try {
    const response = await fetch(`${API_BASE}/${id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '组件归档成功' }
  } catch (error) {
    console.error('归档组件失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '归档组件失败' 
    }
  }
}

// 获取组件统计
export async function getComponentStats(): Promise<ApiResponse<{
  total: number
  published: number
  draft: number
  archived: number
  totalDownloads: number
}>> {
  try {
    const response = await fetch(`${API_BASE}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取统计数据失败' 
    }
  }
}
