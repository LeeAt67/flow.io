export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'

export interface FormField {
  id: string
  type: FieldType
  label: string
  name: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: { label: string; value: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormConfig {
  id: string
  name: string
  description?: string
  fields: FormField[]
}

