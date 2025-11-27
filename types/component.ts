// 组件相关类型定义 - 与Prisma枚举匹配

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
  user?: {
    id: string
    name: string | null
    image: string | null
  }
  author?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface ComponentCreateInput {
  name: string
  description: string
  category: string
  framework: ComponentFramework
  visibility: ComponentVisibility
  tags: string[]
  code: string
  documentation?: string
}

export interface ComponentUpdateInput {
  name?: string
  description?: string
  category?: string
  framework?: ComponentFramework
  visibility?: ComponentVisibility
  tags?: string[]
  code?: string
  documentation?: string
  status?: ComponentStatus
}

export interface ComponentQuery {
  search?: string
  status?: ComponentStatus | 'all'
  visibility?: ComponentVisibility | 'all'
  category?: string
  framework?: ComponentFramework
  sortBy?: 'updatedAt' | 'name' | 'downloads' | 'likes' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ComponentStats {
  total: number
  published: number
  draft: number
  archived: number
  totalDownloads: number
  totalLikes: number
  totalViews: number
}

export interface BatchOperation {
  ids: string[]
  updates?: {
    status?: ComponentStatus
    visibility?: ComponentVisibility
  }
}
