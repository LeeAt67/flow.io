'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, LogOut, Settings } from 'lucide-react'
import { UserSettingsModal } from './user-settings-modal'
// import { signOut } from 'next-auth/react'

interface UserProfileSectionProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
  const [showSettings, setShowSettings] = useState(false)

  const handleSignOut = () => {
    // 使用window.location进行重定向到登出
    window.location.href = '/api/auth/signout'
  }

  return (
    <>
      <div className="border-t p-4 space-y-3">
        {/* 用户信息卡片 */}
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            {user.image ? (
              <img src={user.image} alt="头像" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* 设置按钮 */}
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          设置
        </Button>

        {/* 退出登录按钮 */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </Button>
      </div>

      {/* 设置模态框 */}
      <UserSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
      />
    </>
  )
}
