import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export default async function FormsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">表单设计器</h1>
          <p className="text-muted-foreground">设计和管理您的表单</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="mr-2 h-4 w-4" />
            新建表单
          </Link>
        </Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">开始设计表单</h3>
          <p className="mb-4 text-sm text-muted-foreground">创建自定义表单用于数据收集</p>
          <Button asChild>
            <Link href="/dashboard/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              新建表单
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

