'use client'

import { useFormDesignerStore } from '@/store/form-designer-store'
import { FieldPalette } from '@/components/form-designer/field-palette'
import { FormPreview } from '@/components/form-designer/form-preview'
import { FieldEditor } from '@/components/form-designer/field-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function NewFormPage() {
  const {
    fields,
    selectedField,
    addField,
    updateField,
    deleteField,
    selectField,
    reorderFields,
  } = useFormDesignerStore()

  const [formName, setFormName] = useState('未命名表单')
  const [formDescription, setFormDescription] = useState('')
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: '保存成功',
      description: '表单已保存',
    })
  }

  const handleDelete = () => {
    if (selectedField) {
      deleteField(selectedField.id)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 顶部工具栏 */}
      <div className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="font-semibold border-none shadow-none focus-visible:ring-0 h-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            预览
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      {/* 主编辑区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧字段面板 */}
        <div className="w-64 border-r bg-card p-4 overflow-auto">
          <FieldPalette onAddField={addField} />
        </div>

        {/* 中间表单预览 */}
        <div className="flex-1 p-8 overflow-auto bg-gray-50">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 space-y-2">
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="表单描述（可选）"
                className="bg-white"
              />
            </div>
            <FormPreview
              fields={fields}
              selectedField={selectedField}
              onSelectField={selectField}
              onReorderFields={reorderFields}
            />
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-80 border-l bg-card p-4 overflow-auto">
          <FieldEditor
            field={selectedField}
            onUpdate={updateField}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}

