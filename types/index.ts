import { Node, Edge } from '@xyflow/react'

// 流程节点类型
export interface FlowNode extends Node {
  type: NodeType
  data: NodeData
}

export type NodeType =
  | 'start'
  | 'end'
  | 'action'
  | 'condition'
  | 'form'
  | 'api'
  | 'database'
  | 'component'

export interface NodeData {
  label: string
  description?: string
  config?: Record<string, any>
  // 添加索引签名以兼容 Record<string, unknown>
  [key: string]: unknown
}

// 工作区类型
export interface Workspace {
  id: string
  name: string
  description?: string
  type: 'personal' | 'team'
  ownerId: string
  members?: WorkspaceMember[]
  settings: WorkspaceSettings
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceMember {
  id: string
  userId: string
  workspaceId: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  joinedAt: Date
}

export interface WorkspaceSettings {
  isPublic: boolean
  allowInvites: boolean
  defaultComponentVisibility: 'public' | 'private'
  theme: 'light' | 'dark' | 'auto'
}

// 流程类型
export interface Flow {
  id: string
  name: string
  description?: string
  projectId: string
  nodes: FlowNode[]
  edges: Edge[]
  viewport?: {
    x: number
    y: number
    zoom: number
  }
  createdAt: Date
  updatedAt: Date
}

// 组件类型
export interface Component {
  id: string
  name: string
  description?: string
  category: string
  tags: string[]
  workspaceId: string
  creatorId: string
  
  // 组件内容
  code: string
  styles?: string
  props: ComponentProp[]
  
  // 预览和配置
  previewImage?: string
  framework: 'react' | 'vue' | 'html'
  
  // 版本和状态
  version: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'workspace'
  
  // 统计信息
  usageCount: number
  likes: number
  
  createdAt: Date
  updatedAt: Date
}

export interface ComponentProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function'
  required?: boolean
  default?: any
  description?: string
  options?: string[] // 用于枚举类型
}

export interface ComponentVersion {
  id: string
  componentId: string
  version: string
  code: string
  styles?: string
  changelog?: string
  createdAt: Date
  createdBy: string
}

// 数据模型类型
export interface DataModel {
  id: string
  name: string
  description?: string
  fields: DataField[]
  projectId: string
}

export interface DataField {
  name: string
  type: FieldType
  required: boolean
  unique?: boolean
  default?: any
  description?: string
  label?: string
  options?: string[]
}

export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'array'
  | 'object'
  | 'reference'

