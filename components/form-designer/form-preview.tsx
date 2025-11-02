'use client'

import { FormField } from './form-field-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'

interface FormPreviewProps {
  fields: FormField[]
  selectedField: FormField | null
  onSelectField: (field: FormField) => void
  onReorderFields: (fromIndex: number, toIndex: number) => void
}

export function FormPreview({
  fields,
  selectedField,
  onSelectField,
  onReorderFields,
}: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const isSelected = selectedField?.id === field.id

    return (
      <div
        key={field.id}
        className={`group rounded-lg border p-4 cursor-pointer transition-colors ${
          isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onClick={() => onSelectField(field)}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-2 cursor-move" />
          <div className="flex-1 space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {renderFieldInput(field)}
          </div>
        </div>
      </div>
    )
  }

  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder={field.placeholder}
            disabled
          />
        )
      case 'select':
        return (
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled
          >
            <option>{field.placeholder || '请选择'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <input type="checkbox" disabled />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <input type="radio" name={field.name} disabled />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
        )
      default:
        return <Input type={field.type} placeholder={field.placeholder} disabled />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>表单预览</CardTitle>
        <CardDescription>点击字段进行编辑</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            从左侧添加字段开始设计表单
          </p>
        ) : (
          <>
            {fields.map((field) => renderField(field))}
            <Button className="w-full" disabled>
              提交
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

