import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      flows: {
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  })

  if (!project || project.userId !== session.user.id) {
    redirect('/dashboard')
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || '暂无描述'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            编辑项目
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.id}/flows/new`}>
              <Plus className="mr-2 h-4 w-4" />
              新建流程
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">流程列表</h2>
        {project.flows.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <h3 className="mb-2 text-lg font-semibold">还没有流程</h3>
              <p className="mb-4 text-sm text-muted-foreground">创建您的第一个流程</p>
              <Button asChild>
                <Link href={`/dashboard/projects/${project.id}/flows/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建流程
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {project.flows.map((flow) => (
              <Card key={flow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{flow.name}</CardTitle>
                  <CardDescription>{flow.description || '暂无描述'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      更新时间: {formatDateTime(flow.updatedAt)}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/editor/${flow.id}`}>打开编辑器</Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

