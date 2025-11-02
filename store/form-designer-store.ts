import { create } from 'zustand'
import { FormField, FieldType } from '@/components/form-designer/form-field-types'

interface FormDesignerState {
  fields: FormField[]
  selectedField: FormField | null
  addField: (type: FieldType) => void
  updateField: (field: FormField) => void
  deleteField: (id: string) => void
  selectField: (field: FormField | null) => void
  reorderFields: (fromIndex: number, toIndex: number) => void
  setFields: (fields: FormField[]) => void
  reset: () => void
}

export const useFormDesignerStore = create<FormDesignerState>((set, get) => ({
  fields: [],
  selectedField: null,

  addField: (type) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `新${getFieldTypeName(type)}`,
      name: `field_${Date.now()}`,
      placeholder: '请输入',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox'
        ? [
            { label: '选项1', value: 'option1' },
            { label: '选项2', value: 'option2' },
          ]
        : undefined,
    }
    set({ fields: [...get().fields, newField], selectedField: newField })
  },

  updateField: (field) => {
    set({
      fields: get().fields.map((f) => (f.id === field.id ? field : f)),
      selectedField: field,
    })
  },

  deleteField: (id) => {
    set({
      fields: get().fields.filter((f) => f.id !== id),
      selectedField: null,
    })
  },

  selectField: (field) => set({ selectedField: field }),

  reorderFields: (fromIndex, toIndex) => {
    const newFields = [...get().fields]
    const [removed] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, removed)
    set({ fields: newFields })
  },

  setFields: (fields) => set({ fields }),

  reset: () => set({ fields: [], selectedField: null }),
}))

function getFieldTypeName(type: FieldType): string {
  const names: Record<FieldType, string> = {
    text: '文本框',
    textarea: '多行文本',
    number: '数字',
    email: '邮箱',
    password: '密码',
    select: '下拉选择',
    checkbox: '复选框',
    radio: '单选框',
    date: '日期',
    file: '文件上传',
  }
  return names[type] || '字段'
}

