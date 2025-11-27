'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname()
  
  // 检查当前路径是否匹配
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start",
          isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  )
}
