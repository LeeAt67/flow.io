'use client'

import { useFlowStore } from '@/store/flow-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function NodeInspector() {
  const { selectedNode, updateNode, deleteNode, setSelectedNode } = useFlowStore()

  if (!selectedNode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">属性面板</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">选择一个节点以查看和编辑其属性</p>
        </CardContent>
      </Card>
    )
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(selectedNode.id, { label: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(selectedNode.id, { description: e.target.value })
  }

  const handleDelete = () => {
    deleteNode(selectedNode.id)
    setSelectedNode(null)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">属性面板</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">节点类型</p>
          <p className="text-sm text-muted-foreground capitalize">{selectedNode.type}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">节点名称</Label>
          <Input
            id="label"
            value={selectedNode.data.label || ''}
            onChange={handleLabelChange}
            placeholder="输入节点名称"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Input
            id="description"
            value={selectedNode.data.description || ''}
            onChange={handleDescriptionChange}
            placeholder="输入节点描述"
          />
        </div>

        <div className="space-y-2">
          <Label>位置</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">X: {Math.round(selectedNode.position.x)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Y: {Math.round(selectedNode.position.y)}</p>
            </div>
          </div>
        </div>

        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除节点
        </Button>
      </CardContent>
    </Card>
  )
}

