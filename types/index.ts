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
}

// 项目类型
export interface Project {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: Date
  updatedAt: Date
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
export interface ComponentTemplate {
  id: string
  name: string
  category: string
  description?: string
  icon?: string
  props: Record<string, ComponentProp>
  template: string
  isPublic: boolean
}

export interface ComponentProp {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required?: boolean
  default?: any
  description?: string
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

