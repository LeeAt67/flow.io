import { Handle, Position } from '@xyflow/react'
import { Database } from 'lucide-react'

export function DatabaseNode({ data }: { data: any }) {
  return (
    <div className="rounded-lg border-2 border-cyan-500 bg-white p-4 shadow-md min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-white">
          <Database className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-cyan-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-500" />
    </div>
  )
}

