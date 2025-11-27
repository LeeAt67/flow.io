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
  Minimize2,
  Palette,
  Type,
  Wand2,
  Search,
  Replace,
  ZoomIn,
  ZoomOut,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CodeEditorProps {
  initialCode: string
  language: string
  fileName: string
  onCodeChange?: (code: string) => void
  showPreview?: boolean
  onTogglePreview?: () => void
  enableAI?: boolean
  onAIAssist?: (code: string) => void
  showRightPanel?: boolean
  onToggleRightPanel?: () => void
}

export function CodeEditor({ 
  initialCode, 
  language, 
  fileName, 
  onCodeChange,
  showPreview = true,
  onTogglePreview,
  enableAI = true,
  onAIAssist,
  showRightPanel = true,
  onToggleRightPanel
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [isModified, setIsModified] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState<'vs-dark' | 'light' | 'vs'>('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [showSettings, setShowSettings] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [showFind, setShowFind] = useState(false)
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

  const handleFormat = async () => {
    setIsFormatting(true)
    try {
      // 模拟代码格式化
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 简单的格式化逻辑（实际项目中应该使用 Prettier 等工具）
      const formatted = code
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .replace(/;\s*\n/g, ';\n')
        .replace(/\{\s*\n/g, '{\n  ')
        .replace(/\n\s*\}/g, '\n}')
      
      setCode(formatted)
      onCodeChange?.(formatted)
      
      toast({
        title: '格式化完成',
        description: '代码已自动格式化',
      })
    } catch (error) {
      toast({
        title: '格式化失败',
        description: '代码格式化时出现错误',
        variant: 'destructive'
      })
    } finally {
      setIsFormatting(false)
    }
  }

  const handleAIAssist = () => {
    if (onAIAssist) {
      onAIAssist(code)
      toast({
        title: 'AI 助手',
        description: '正在分析代码并提供建议...',
      })
    }
  }

  const handleThemeChange = (newTheme: 'vs-dark' | 'light' | 'vs') => {
    setTheme(newTheme)
    localStorage.setItem('code-editor-theme', newTheme)
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta))
    setFontSize(newSize)
    localStorage.setItem('code-editor-font-size', newSize.toString())
  }

  // 加载保存的设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('code-editor-theme') as 'vs-dark' | 'light' | 'vs'
    const savedFontSize = localStorage.getItem('code-editor-font-size')
    
    if (savedTheme) setTheme(savedTheme)
    if (savedFontSize) setFontSize(parseInt(savedFontSize))
  }, [])

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
    <Card className={`h-full border-0 shadow-none flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 border shadow-lg' : ''}`}>
      <CardHeader className="pb-1 px-4 py-2 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{fileName}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {getLanguageDisplayName(language)}
            </span>
            {isModified && (
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* 代码格式化 */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleFormat}
              disabled={isFormatting}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Wand2 className={`h-4 w-4 ${isFormatting ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* 保存 */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSave}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Save className="h-4 w-4" />
            </Button>
            
            {/* 设置 */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            {/* 切换右侧面板 */}
            {onToggleRightPanel && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onToggleRightPanel}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                title={showRightPanel ? '隐藏右侧面板' : '显示右侧面板'}
              >
                {showRightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              </Button>
            )}
            
            {/* 全屏 */}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* 设置面板 */}
      {showSettings && (
        <div className="px-4 py-2 border-b bg-muted/50">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>主题:</span>
              <select 
                value={theme} 
                onChange={(e) => handleThemeChange(e.target.value as any)}
                className="px-2 py-1 rounded border text-xs"
              >
                <option value="vs-dark">深色</option>
                <option value="light">浅色</option>
                <option value="vs">经典</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>字体: {fontSize}px</span>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'flex-1'}`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme={theme}
            options={{
              minimap: { enabled: true },
              fontSize: fontSize,
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
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showConstructors: true,
                showFields: true,
                showVariables: true,
                showClasses: true,
                showStructs: true,
                showInterfaces: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true
              },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              },
              parameterHints: {
                enabled: true
              },
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div className="text-muted-foreground">加载编辑器中...</div>
                </div>
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
