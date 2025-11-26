'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  Download, 
  RotateCcw, 
  Save, 
  Eye, 
  EyeOff,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CodeEditorProps {
  initialCode: string
  language: string
  fileName: string
  onCodeChange?: (code: string) => void
  showPreview?: boolean
  onTogglePreview?: () => void
}

export function CodeEditor({ 
  initialCode, 
  language, 
  fileName, 
  onCodeChange,
  showPreview = true,
  onTogglePreview
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [isModified, setIsModified] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setCode(initialCode)
    setIsModified(false)
  }, [initialCode])

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    setIsModified(newCode !== initialCode)
    onCodeChange?.(newCode)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast({
      title: '复制成功！',
      description: '代码已复制到剪贴板',
    })
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: '下载成功',
      description: `已下载 ${fileName}`,
    })
  }

  const handleReset = () => {
    setCode(initialCode)
    setIsModified(false)
    toast({
      title: '已重置',
      description: '代码已恢复到初始状态',
    })
  }

  const handleSave = () => {
    // 这里可以实现保存到本地存储或服务器
    localStorage.setItem(`code-editor-${fileName}`, code)
    setIsModified(false)
    toast({
      title: '保存成功',
      description: '代码已保存到本地',
    })
  }

  const getLanguageDisplayName = (lang: string) => {
    const langMap: Record<string, string> = {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      tsx: 'TSX',
      jsx: 'JSX',
      json: 'JSON',
      css: 'CSS',
      html: 'HTML',
      markdown: 'Markdown'
    }
    return langMap[lang] || lang.toUpperCase()
  }

  return (
    <Card className={`h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{fileName}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {getLanguageDisplayName(language)}
            </Badge>
            {isModified && (
              <Badge variant="destructive" className="text-xs">
                已修改
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            {isModified && (
              <Button size="sm" variant="ghost" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            {onTogglePreview && (
              <Button size="sm" variant="ghost" onClick={onTogglePreview}>
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'}`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              folding: true,
              lineNumbersMinChars: 4,
              glyphMargin: false,
              contextmenu: true,
              mouseWheelZoom: true,
              smoothScrolling: true,
              cursorBlinking: 'blink',
              cursorSmoothCaretAnimation: 'on',
              renderLineHighlight: 'line',
              selectOnLineNumbers: true,
              bracketPairColorization: {
                enabled: true
              }
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">加载编辑器中...</div>
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
