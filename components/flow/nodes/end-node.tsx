import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'

export function EndNode({ data }: { data: any }) {
  return (
    <div className="rounded-lg border-2 border-red-500 bg-white p-4 shadow-md min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
          <Square className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-red-500" />
    </div>
  )
}

