import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Code2, 
  Database, 
  Workflow, 
  Star,
  Play,
  ChevronRight,
  Globe,
  Monitor
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Apple风格导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/20 dark:bg-black/80 dark:border-gray-800/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 text-black dark:text-white">
                <Workflow className="h-5 w-5" />
                <span className="text-lg font-medium">Flow.io</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm">
              <Link href="/features" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">功能</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">价格</Link>
              <Link href="/docs" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">文档</Link>
              <Link href="/support" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">支持</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                登录
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-full transition-colors">
                免费试用
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Apple风格主内容 */}
      <main>
        {/* Hero Section - Apple风格 */}
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                <Star className="h-4 w-4" />
                全新发布
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-black dark:text-white mb-6 leading-none">
              企业级
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                低代码平台
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              通过直观的可视化界面，让任何人都能轻松构建企业级应用。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105">
                免费开始使用
              </Link>
              <Link href="/demo" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-lg font-medium transition-colors">
                <Play className="h-5 w-5" />
                观看演示
              </Link>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              支持所有主流浏览器 · 无需安装 · 即即使用
            </div>
          </div>
        </section>
        
        {/* 产品展示区域 */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
                为企业而生
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                从流程设计到代码部署，一站式解决方案
              </p>
            </div>
            
            {/* 产品特性展示 */}
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                  <Workflow className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-semibold text-black dark:text-white mb-4">
                  可视化流程编辑
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  拖拽式节点连接，直观的流程设计。支持多种节点类型，让复杂的业务逻辑变得简单明了。
                </p>
                <Link href="/features/workflow" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  了解更多
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500">
                    [流程编辑器预览图]
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div className="md:order-2">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6">
                  <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-semibold text-black dark:text-white mb-4">
                  智能数据建模
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  可视化数据表设计，自动生成 Prisma Schema。支持复杂关联关系，让数据建模变得简单高效。
                </p>
                <Link href="/features/database" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  了解更多
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="md:order-1 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-2xl flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500">
                    [数据建模工具预览图]
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-6">
                  <Code2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-semibold text-black dark:text-white mb-4">
                  一键代码生成
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  基于最佳实践的代码模板，生成生产级 Next.js + TypeScript 应用。无需手写代码，即可拥有专业的Web应用。
                </p>
                <Link href="/features/codegen" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  了解更多
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500">
                    [代码生成器预览图]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Apple风格技术栈 */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
              现代化技术栈
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
              采用最新的技术栈，保证项目的可维护性和扩展性
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Monitor className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">前端</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Next.js 15 · React 19 · TypeScript · Tailwind CSS
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Database className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">后端</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  PostgreSQL · Prisma ORM · NextAuth.js · API Routes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">部署</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vercel · Docker · CI/CD · 云原生架构
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Apple风格Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-black dark:text-white mb-4">
              <Workflow className="h-6 w-6" />
              <span className="text-xl font-medium">Flow.io</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              专为企业打造的低代码平台，让复杂的业务流程变得简单易懂。
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-medium text-black dark:text-white mb-3">产品</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/features" className="hover:text-black dark:hover:text-white transition-colors">功能特性</Link></li>
                <li><Link href="/pricing" className="hover:text-black dark:hover:text-white transition-colors">价格方案</Link></li>
                <li><Link href="/enterprise" className="hover:text-black dark:hover:text-white transition-colors">企业版</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-black dark:text-white mb-3">开发者</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/docs" className="hover:text-black dark:hover:text-white transition-colors">开发文档</Link></li>
                <li><Link href="/api" className="hover:text-black dark:hover:text-white transition-colors">API 参考</Link></li>
                <li><Link href="/github" className="hover:text-black dark:hover:text-white transition-colors">GitHub</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-black dark:text-white mb-3">支持</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/help" className="hover:text-black dark:hover:text-white transition-colors">帮助中心</Link></li>
                <li><Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">联系我们</Link></li>
                <li><Link href="/status" className="hover:text-black dark:hover:text-white transition-colors">系统状态</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-black dark:text-white mb-3">公司</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">关于我们</Link></li>
                <li><Link href="/blog" className="hover:text-black dark:hover:text-white transition-colors">博客</Link></li>
                <li><Link href="/careers" className="hover:text-black dark:hover:text-white transition-colors">招聘</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Flow.io. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">服务条款</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
