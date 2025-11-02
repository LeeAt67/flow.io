import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Database, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default async function DataModelsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const projects = await db.project.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      dataModels: true,
    },
  })

  const allDataModels = projects.flatMap((p) =>
    p.dataModels.map((dm) => ({
      ...dm,
      projectName: p.name,
    }))
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">数据模型</h1>
          <p className="text-muted-foreground">设计应用的数据库结构</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/data-models/new">
            <Plus className="mr-2 h-4 w-4" />
            新建数据模型
          </Link>
        </Button>
      </div>

      {allDataModels.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">还没有数据模型</h3>
            <p className="mb-4 text-sm text-muted-foreground">创建数据模型来定义应用的数据结构</p>
            <Button asChild>
              <Link href="/dashboard/data-models/new">
                <Plus className="mr-2 h-4 w-4" />
                新建数据模型
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allDataModels.map((model) => {
            const fields = Array.isArray(model.fields) ? model.fields : []
            return (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {model.name}
                  </CardTitle>
                  <CardDescription>{model.description || '暂无描述'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      项目: {model.projectName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      字段数: {fields.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      更新时间: {formatDateTime(model.updatedAt)}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/dashboard/data-models/${model.id}`}>编辑</Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

