'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Database } from 'lucide-react'

interface DataField {
  id: string
  name: string
  type: string
  required: boolean
  unique: boolean
  defaultValue?: string
  description?: string
}

const FIELD_TYPES = [
  'String',
  'Int',
  'Float',
  'Boolean',
  'DateTime',
  'Json',
  'Bytes',
]

export function DataModelDesigner() {
  const [fields, setFields] = useState<DataField[]>([])
  const [editingField, setEditingField] = useState<DataField | null>(null)

  const addField = () => {
    const newField: DataField = {
      id: `field-${Date.now()}`,
      name: 'newField',
      type: 'String',
      required: false,
      unique: false,
    }
    setFields([...fields, newField])
    setEditingField(newField)
  }

  const updateField = (id: string, updates: Partial<DataField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
    if (editingField?.id === id) {
      setEditingField({ ...editingField, ...updates })
    }
  }

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
    if (editingField?.id === id) {
      setEditingField(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 字段列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>字段列表</CardTitle>
              <CardDescription>定义数据模型的字段</CardDescription>
            </div>
            <Button size="sm" onClick={addField}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              点击上方按钮添加字段
            </p>
          ) : (
            fields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  editingField?.id === field.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setEditingField(field)}
              >
                <div className="flex-1">
                  <div className="font-medium">{field.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {field.type}
                    {field.required && ' • 必填'}
                    {field.unique && ' • 唯一'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteField(field.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 字段编辑器 */}
      <Card>
        <CardHeader>
          <CardTitle>字段属性</CardTitle>
          <CardDescription>
            {editingField ? '编辑字段属性' : '选择一个字段进行编辑'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editingField ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">字段名</Label>
                <Input
                  id="fieldName"
                  value={editingField.name}
                  onChange={(e) => updateField(editingField.id, { name: e.target.value })}
                  placeholder="fieldName"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldType">类型</Label>
                <select
                  id="fieldType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingField.type}
                  onChange={(e) => updateField(editingField.id, { type: e.target.value })}
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={editingField.description || ''}
                  onChange={(e) => updateField(editingField.id, { description: e.target.value })}
                  placeholder="字段描述"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultValue">默认值</Label>
                <Input
                  id="defaultValue"
                  value={editingField.defaultValue || ''}
                  onChange={(e) => updateField(editingField.id, { defaultValue: e.target.value })}
                  placeholder="默认值"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="required">必填</Label>
                <Switch
                  id="required"
                  checked={editingField.required}
                  onCheckedChange={(checked) => updateField(editingField.id, { required: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="unique">唯一</Label>
                <Switch
                  id="unique"
                  checked={editingField.unique}
                  onCheckedChange={(checked) => updateField(editingField.id, { unique: checked })}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Database className="mb-4 h-12 w-12" />
              <p className="text-sm">选择或创建一个字段</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

