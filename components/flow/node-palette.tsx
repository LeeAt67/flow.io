'use client'

import { Play, Square, Zap, GitBranch, FileText, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFlowStore } from '@/store/flow-store'

const nodeTemplates = [
  { type: 'start', label: '开始', icon: Play, color: 'text-green-500', description: '流程开始节点' },
  { type: 'end', label: '结束', icon: Square, color: 'text-red-500', description: '流程结束节点' },
  { type: 'action', label: '动作', icon: Zap, color: 'text-blue-500', description: '执行操作' },
  { type: 'condition', label: '条件', icon: GitBranch, color: 'text-yellow-500', description: '条件分支' },
  { type: 'form', label: '表单', icon: FileText, color: 'text-purple-500', description: '表单输入' },
  { type: 'database', label: '数据库', icon: Database, color: 'text-cyan-500', description: '数据库操作' },
]

export function NodePalette() {
  const { addNode, nodes } = useFlowStore()

  const handleAddNode = (type: string, label: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label, description: '' },
    }
    addNode(newNode)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">节点面板</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {nodeTemplates.map((template) => {
          const Icon = template.icon
          return (
            <Button
              key={template.type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddNode(template.type, template.label)}
            >
              <Icon className={`mr-2 h-4 w-4 ${template.color}`} />
              <div className="text-left">
                <div className="font-medium">{template.label}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            </Button>
          )
        })}
        <div className="pt-4 text-xs text-muted-foreground">
          <p>总节点数: {nodes.length}</p>
        </div>
      </CardContent>
    </Card>
  )
}

