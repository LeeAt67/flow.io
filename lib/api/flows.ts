// API 调用函数 - 流程管理

export interface Flow {
  id: string
  name: string
  description?: string
  projectId: string
  nodes: any[]
  edges: any[]
  viewport?: any
  createdAt: string
  updatedAt: string
  project?: {
    id: string
    name: string
  }
}

// 流程创建/更新数据
export interface FlowData {
  name: string
  description?: string
  projectId: string
  nodes?: any[]
  edges?: any[]
  viewport?: any
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

const API_BASE = '/api/flows'

// 获取流程列表
export async function getFlows(projectId?: string): Promise<ApiResponse<Flow[]>> {
  try {
    const params = new URLSearchParams()
    if (projectId) {
      params.append('projectId', projectId)
    }

    const url = projectId ? `${API_BASE}?${params}` : API_BASE
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('获取流程列表失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取流程列表失败' 
    }
  }
}

// 获取单个流程
export async function getFlow(id: string): Promise<ApiResponse<Flow>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('获取流程详情失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取流程详情失败' 
    }
  }
}

// 创建流程
export async function createFlow(flowData: FlowData): Promise<ApiResponse<Flow>> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flowData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '流程创建成功' }
  } catch (error) {
    console.error('创建流程失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '创建流程失败' 
    }
  }
}

// 更新流程
export async function updateFlow(id: string, flowData: Partial<FlowData>): Promise<ApiResponse<Flow>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flowData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '流程更新成功' }
  } catch (error) {
    console.error('更新流程失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新流程失败' 
    }
  }
}

// 保存流程设计（仅保存节点和连线）
export async function saveFlowDesign(
  id: string, 
  nodes: any[], 
  edges: any[], 
  viewport?: any
): Promise<ApiResponse<Flow>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodes, edges, viewport }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '流程保存成功' }
  } catch (error) {
    console.error('保存流程失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '保存流程失败' 
    }
  }
}

// 删除流程
export async function deleteFlow(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return { success: true, message: '流程删除成功' }
  } catch (error) {
    console.error('删除流程失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '删除流程失败' 
    }
  }
}
