import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'

export function StartNode({ data }: { data: any }) {
  return (
    <div className="rounded-lg border-2 border-green-500 bg-white p-4 shadow-md min-w-[150px]">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
          <Play className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground">{data.description}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  )
}

