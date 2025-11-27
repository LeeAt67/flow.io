// 统一的API客户端 - Flow.io

// 导出所有API模块
export * from './components'
export type { Project, ProjectData } from './projects'
export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from './projects'
export type { Flow as FlowType, FlowData } from './flows'
export {
  getFlows,
  getFlow,
  createFlow,
  updateFlow,
  saveFlowDesign,
  deleteFlow,
} from './flows'
export type { 
  DataModel as DataModelType, 
  DataModelField, 
  DataModelData 
} from './data-models'
export {
  getDataModels,
  getDataModel,
  createDataModel,
  updateDataModel,
  deleteDataModel,
  FIELD_TYPES,
  createDefaultField,
  validateField,
  validateDataModel,
} from './data-models'

// 统一的API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// API基础配置
export const API_CONFIG = {
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// 通用API请求函数
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL = API_CONFIG.baseURL, headers = API_CONFIG.headers) {
    this.baseURL = baseURL
    this.defaultHeaders = headers
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      }

      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error(`API请求失败 [${options.method || 'GET'}] ${endpoint}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      }
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`
      }
    }

    return this.request<T>(url, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient()

// 便捷的API调用方法
export const api = {
  // 组件相关
  components: {
    list: (query?: any) => apiClient.get('/components', query),
    get: (id: string) => apiClient.get(`/components/${id}`),
    create: (data: any) => apiClient.post('/components', data),
    update: (id: string, data: any) => apiClient.put(`/components/${id}`, data),
    delete: (id: string) => apiClient.delete(`/components/${id}`),
    batchUpdate: (ids: string[], updates: any) => 
      apiClient.put('/components/batch', { ids, updates }),
    batchDelete: async (ids: string[]) => {
      const response = await fetch('/api/components/batch', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, error: errorData.error || 'Delete failed' }
      }
      const data = await response.json()
      return { success: true, data }
    },
    stats: () => apiClient.get('/components/stats'),
  },

  // 项目相关
  projects: {
    list: () => apiClient.get('/projects'),
    get: (id: string) => apiClient.get(`/projects/${id}`),
    create: (data: any) => apiClient.post('/projects', data),
    update: (id: string, data: any) => apiClient.put(`/projects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/projects/${id}`),
  },

  // 流程相关
  flows: {
    list: (projectId?: string) => apiClient.get('/flows', projectId ? { projectId } : undefined),
    get: (id: string) => apiClient.get(`/flows/${id}`),
    create: (data: any) => apiClient.post('/flows', data),
    update: (id: string, data: any) => apiClient.put(`/flows/${id}`, data),
    delete: (id: string) => apiClient.delete(`/flows/${id}`),
    saveDesign: (id: string, nodes: any[], edges: any[], viewport?: any) =>
      apiClient.put(`/flows/${id}`, { nodes, edges, viewport }),
  },

  // 数据模型相关
  dataModels: {
    list: (projectId?: string) => apiClient.get('/data-models', projectId ? { projectId } : undefined),
    get: (id: string) => apiClient.get(`/data-models/${id}`),
    create: (data: any) => apiClient.post('/data-models', data),
    update: (id: string, data: any) => apiClient.put(`/data-models/${id}`, data),
    delete: (id: string) => apiClient.delete(`/data-models/${id}`),
  },
}

// 错误处理工具
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 请求拦截器（可用于添加认证token等）
export function setAuthToken(token: string) {
  apiClient['defaultHeaders'] = {
    ...apiClient['defaultHeaders'],
    'Authorization': `Bearer ${token}`,
  }
}

// 清除认证token
export function clearAuthToken() {
  const { Authorization, ...headers } = apiClient['defaultHeaders']
  apiClient['defaultHeaders'] = headers
}

// 响应拦截器（可用于统一错误处理）
export function handleApiError(error: ApiResponse<any>) {
  if (!error.success && error.error) {
    // 可以在这里添加全局错误处理逻辑
    // 比如显示toast通知、重定向到登录页等
    console.error('API错误:', error.error)
  }
  return error
}

// 批量请求工具
export async function batchRequest<T>(
  requests: Array<() => Promise<ApiResponse<T>>>
): Promise<ApiResponse<T>[]> {
  try {
    const results = await Promise.allSettled(requests.map(req => req()))
    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: 'Request failed' }
    )
  } catch (error) {
    console.error('批量请求失败:', error)
    return requests.map(() => ({ 
      success: false, 
      error: error instanceof Error ? error.message : '批量请求失败' 
    }))
  }
}

// 请求重试工具
export async function retryRequest<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T> = { success: false, error: '未知错误' }
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await requestFn()
      if (result.success) {
        return result
      }
      lastError = result
    } catch (error) {
      lastError = {
        success: false,
        error: error instanceof Error ? error.message : '请求失败'
      }
    }
    
    if (i < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  return lastError
}
