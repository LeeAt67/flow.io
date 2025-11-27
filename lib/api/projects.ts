// API 调用函数 - 项目管理

export interface Project {
  id: string
  name: string
  description?: string
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
  flows?: Flow[]
  dataModels?: DataModel[]
  _count?: {
    flows: number
    dataModels: number
  }
}

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
}

export interface DataModel {
  id: string
  name: string
  description?: string
  projectId: string
  fields: any[]
  createdAt: string
  updatedAt: string
}

// 项目创建/更新数据
export interface ProjectData {
  name: string
  description?: string
  isPublic?: boolean
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

const API_BASE = '/api/projects'

// 获取项目列表
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  try {
    const response = await fetch(API_BASE, {
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
    console.error('获取项目列表失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取项目列表失败' 
    }
  }
}

// 获取单个项目
export async function getProject(id: string): Promise<ApiResponse<Project>> {
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
    console.error('获取项目详情失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取项目详情失败' 
    }
  }
}

// 创建项目
export async function createProject(projectData: ProjectData): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '项目创建成功' }
  } catch (error) {
    console.error('创建项目失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '创建项目失败' 
    }
  }
}

// 更新项目
export async function updateProject(id: string, projectData: Partial<ProjectData>): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '项目更新成功' }
  } catch (error) {
    console.error('更新项目失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新项目失败' 
    }
  }
}

// 删除项目
export async function deleteProject(id: string): Promise<ApiResponse<void>> {
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

    return { success: true, message: '项目删除成功' }
  } catch (error) {
    console.error('删除项目失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '删除项目失败' 
    }
  }
}
