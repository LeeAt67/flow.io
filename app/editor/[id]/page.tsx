'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FlowEditor } from '@/components/flow/flow-editor'
import { NodePalette } from '@/components/flow/node-palette'
import { NodeInspector } from '@/components/flow/node-inspector'
import { useFlowStore } from '@/store/flow-store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const flowId = params.id as string
  const { toast } = useToast()
  const { nodes, edges, setNodes, setEdges } = useFlowStore()
  const [isLoading, setIsLoading] = useState(true)
  const [flowInfo, setFlowInfo] = useState<any>(null)

  useEffect(() => {
    // 加载流程数据
    const loadFlow = async () => {
      try {
        const response = await fetch(`/api/flows/${flowId}`)
        if (response.ok) {
          const data = await response.json()
          setFlowInfo(data)
          setNodes(data.nodes || [])
          setEdges(data.edges || [])
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: '加载失败',
          description: '无法加载流程数据',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFlow()
  }, [flowId, setNodes, setEdges, toast])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/flows/${flowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })

      if (response.ok) {
        toast({
          title: '保存成功',
          description: '流程已保存',
        })
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: '无法保存流程',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 顶部工具栏 */}
      <div className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{flowInfo?.name || '流程编辑器'}</h1>
            {flowInfo?.description && (
              <p className="text-xs text-muted-foreground">{flowInfo.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧节点面板 */}
        <div className="w-64 border-r bg-card p-4 overflow-auto">
          <NodePalette />
        </div>

        {/* 中间画布 */}
        <div className="flex-1">
          <FlowEditor onSave={handleSave} />
        </div>

        {/* 右侧属性面板 */}
        <div className="w-80 border-l bg-card p-4 overflow-auto">
          <NodeInspector />
        </div>
      </div>
    </div>
  )
}

