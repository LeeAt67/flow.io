// API 调用函数 - 数据模型管理

export interface DataModelField {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  required: boolean
  description?: string
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
}

export interface DataModel {
  id: string
  name: string
  description?: string
  projectId: string
  fields: DataModelField[]
  createdAt: string
  updatedAt: string
  project?: {
    id: string
    name: string
  }
}

// 数据模型创建/更新数据
export interface DataModelData {
  name: string
  description?: string
  projectId: string
  fields?: DataModelField[]
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

const API_BASE = '/api/data-models'

// 获取数据模型列表
export async function getDataModels(projectId?: string): Promise<ApiResponse<DataModel[]>> {
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
    console.error('获取数据模型列表失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取数据模型列表失败' 
    }
  }
}

// 获取单个数据模型
export async function getDataModel(id: string): Promise<ApiResponse<DataModel>> {
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
    console.error('获取数据模型详情失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '获取数据模型详情失败' 
    }
  }
}

// 创建数据模型
export async function createDataModel(dataModelData: DataModelData): Promise<ApiResponse<DataModel>> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataModelData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '数据模型创建成功' }
  } catch (error) {
    console.error('创建数据模型失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '创建数据模型失败' 
    }
  }
}

// 更新数据模型
export async function updateDataModel(id: string, dataModelData: Partial<DataModelData>): Promise<ApiResponse<DataModel>> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataModelData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data, message: '数据模型更新成功' }
  } catch (error) {
    console.error('更新数据模型失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新数据模型失败' 
    }
  }
}

// 删除数据模型
export async function deleteDataModel(id: string): Promise<ApiResponse<void>> {
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

    return { success: true, message: '数据模型删除成功' }
  } catch (error) {
    console.error('删除数据模型失败:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '删除数据模型失败' 
    }
  }
}

// 数据模型字段类型选项
export const FIELD_TYPES = [
  { value: 'string', label: '文本' },
  { value: 'number', label: '数字' },
  { value: 'boolean', label: '布尔值' },
  { value: 'date', label: '日期' },
  { value: 'array', label: '数组' },
  { value: 'object', label: '对象' },
] as const

// 创建默认字段
export function createDefaultField(): DataModelField {
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    type: 'string',
    required: false,
    description: '',
  }
}

// 验证字段配置
export function validateField(field: DataModelField): string[] {
  const errors: string[] = []
  
  if (!field.name.trim()) {
    errors.push('字段名称不能为空')
  }
  
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
    errors.push('字段名称只能包含字母、数字和下划线，且不能以数字开头')
  }
  
  return errors
}

// 验证数据模型
export function validateDataModel(dataModel: Partial<DataModelData>): string[] {
  const errors: string[] = []
  
  if (!dataModel.name?.trim()) {
    errors.push('数据模型名称不能为空')
  }
  
  if (!dataModel.projectId) {
    errors.push('必须选择项目')
  }
  
  if (dataModel.fields) {
    const fieldNames = new Set<string>()
    dataModel.fields.forEach((field, index) => {
      const fieldErrors = validateField(field)
      fieldErrors.forEach(error => {
        errors.push(`字段 ${index + 1}: ${error}`)
      })
      
      if (fieldNames.has(field.name)) {
        errors.push(`字段名称 "${field.name}" 重复`)
      }
      fieldNames.add(field.name)
    })
  }
  
  return errors
}
