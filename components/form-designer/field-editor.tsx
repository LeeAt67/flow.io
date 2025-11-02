'use client'

import { useState } from 'react'
import { FormField } from './form-field-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface FieldEditorProps {
  field: FormField | null
  onUpdate: (field: FormField) => void
  onDelete: () => void
}

export function FieldEditor({ field, onUpdate, onDelete }: FieldEditorProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    field?.options || []
  )

  if (!field) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">字段编辑器</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">选择一个字段进行编辑</p>
        </CardContent>
      </Card>
    )
  }

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate({ ...field, [key]: value })
  }

  const handleAddOption = () => {
    const newOptions = [...options, { label: '选项', value: `option-${options.length + 1}` }]
    setOptions(newOptions)
    handleChange('options', newOptions)
  }

  const handleUpdateOption = (index: number, key: 'label' | 'value', value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [key]: value }
    setOptions(newOptions)
    handleChange('options', newOptions)
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    handleChange('options', newOptions)
  }

  const showOptions = field.type === 'select' || field.type === 'radio' || field.type === 'checkbox'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">字段编辑器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>字段类型</Label>
          <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">标签</Label>
          <Input
            id="label"
            value={field.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="字段标签"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">字段名</Label>
          <Input
            id="name"
            value={field.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="fieldName"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeholder">占位符</Label>
          <Input
            id="placeholder"
            value={field.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            placeholder="请输入..."
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="required">必填</Label>
          <Switch
            id="required"
            checked={field.required || false}
            onCheckedChange={(checked) => handleChange('required', checked)}
          />
        </div>

        {showOptions && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>选项</Label>
              <Button size="sm" variant="outline" onClick={handleAddOption}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="标签"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                  />
                  <Input
                    placeholder="值"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button variant="destructive" className="w-full" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除字段
        </Button>
      </CardContent>
    </Card>
  )
}

