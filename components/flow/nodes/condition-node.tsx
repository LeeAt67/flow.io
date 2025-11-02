import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'

export function ConditionNode({ data }: { data: any }) {
  return (
    <div className="rounded-lg border-2 border-yellow-500 bg-white p-4 shadow-md min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
          <GitBranch className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-yellow-500" />
      <Handle type="source" position={Position.Bottom} id="true" className="!bg-green-500 !-bottom-2 !left-1/4" />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-500 !-bottom-2 !left-3/4" />
    </div>
  )
}

