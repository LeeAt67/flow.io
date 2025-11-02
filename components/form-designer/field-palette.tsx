'use client'

import {
  Type,
  Hash,
  AtSign,
  Lock,
  List,
  CheckSquare,
  Circle,
  Calendar,
  FileUp,
  AlignLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FieldType } from './form-field-types'

const fieldTypes = [
  { type: 'text' as FieldType, label: '文本框', icon: Type },
  { type: 'textarea' as FieldType, label: '多行文本', icon: AlignLeft },
  { type: 'number' as FieldType, label: '数字', icon: Hash },
  { type: 'email' as FieldType, label: '邮箱', icon: AtSign },
  { type: 'password' as FieldType, label: '密码', icon: Lock },
  { type: 'select' as FieldType, label: '下拉选择', icon: List },
  { type: 'checkbox' as FieldType, label: '复选框', icon: CheckSquare },
  { type: 'radio' as FieldType, label: '单选框', icon: Circle },
  { type: 'date' as FieldType, label: '日期', icon: Calendar },
  { type: 'file' as FieldType, label: '文件上传', icon: FileUp },
]

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void
}

export function FieldPalette({ onAddField }: FieldPaletteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">字段类型</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map((field) => {
          const Icon = field.icon
          return (
            <Button
              key={field.type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onAddField(field.type)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {field.label}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

