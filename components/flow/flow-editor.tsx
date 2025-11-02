'use client'

import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useFlowStore } from '@/store/flow-store'
import { StartNode } from './nodes/start-node'
import { EndNode } from './nodes/end-node'
import { ActionNode } from './nodes/action-node'
import { ConditionNode } from './nodes/condition-node'
import { FormNode } from './nodes/form-node'
import { DatabaseNode } from './nodes/database-node'
import { Button } from '@/components/ui/button'
import { Save, Undo, Redo, ZoomIn, ZoomOut } from 'lucide-react'

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  condition: ConditionNode,
  form: FormNode,
  database: DatabaseNode,
}

interface FlowEditorProps {
  onSave?: () => void
}

export function FlowEditor({ onSave }: FlowEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode } = useFlowStore()

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="space-x-2">
          <Button size="sm" variant="outline" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

