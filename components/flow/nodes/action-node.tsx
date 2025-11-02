import { Handle, Position } from '@xyflow/react'
import { Zap } from 'lucide-react'

export function ActionNode({ data }: { data: any }) {
  return (
    <div className="rounded-lg border-2 border-blue-500 bg-white p-4 shadow-md min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  )
}

