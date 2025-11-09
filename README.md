# Flow.io

企业级 ToB Web 低代码实现平台

## ✨ 功能特性

- 🎨 **可视化流程编辑器** - 基于 ReactFlow 的强大流程编辑器，支持拖拽式节点连接
- 📝 **表单设计器** - 可视化表单设计，支持多种字段类型和验证规则
- 🗄️ **数据模型设计** - 灵活的数据建模工具，可视化数据库结构设计
- 🔧 **组件库管理** - 可复用的组件模板系统
- 🚀 **代码生成器** - 一键生成生产级代码（Prisma Schema、TypeScript、Next.js 页面等）
- 👥 **多用户系统** - 完整的用户认证和项目管理
- 🔐 **权限管理** - 基于角色的访问控制

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15 (App Router) + React 19
- **语言**: TypeScript 5
- **可视化编辑**: ReactFlow 12
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **图标**: Lucide React

### 后端
- **API**: Next.js API Routes + Server Actions
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js v5 (Auth.js)

### 开发工具
- **包管理**: pnpm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript

## 📦 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- pnpm 8+

### 安装步骤

1. **克隆项目**

```bash
git clone <your-repo-url>
cd flow.io
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

复制 `.env.example` 到 `.env.local` 并填写配置：

```env
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/flowio?schema=public"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# 应用配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Flow.io"
```

4. **初始化数据库**

```bash
# 生成 Prisma Client
pnpm db:generate

# 推送数据库 schema
pnpm db:push

# 或者使用 migration
pnpm db:migrate
```

5. **启动开发服务器**

```bash
pnpm dev
```

6. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📂 项目结构

```
flow.io/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证相关页面
│   │   ├── login/           # 登录页面
│   │   └── register/        # 注册页面
│   ├── (dashboard)/         # 主应用页面（需认证）
│   │   ├── dashboard/       # 仪表板
│   │   │   ├── projects/    # 项目管理
│   │   │   ├── forms/       # 表单设计器
│   │   │   ├── data-models/ # 数据模型
│   │   │   └── code-generator/ # 代码生成器
│   │   └── layout.tsx       # Dashboard 布局
│   ├── editor/              # 流程编辑器页面
│   ├── api/                 # API 路由
│   │   ├── auth/            # 认证 API
│   │   ├── flows/           # 流程 API
│   │   ├── projects/        # 项目 API
│   │   └── data-models/     # 数据模型 API
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/               # 共享组件
│   ├── ui/                  # shadcn/ui 组件
│   ├── flow/                # ReactFlow 相关组件
│   │   ├── nodes/           # 流程节点组件
│   │   ├── flow-editor.tsx  # 流程编辑器
│   │   ├── node-palette.tsx # 节点面板
│   │   └── node-inspector.tsx # 属性面板
│   ├── form-designer/       # 表单设计器组件
│   └── data-model/          # 数据模型组件
├── lib/                     # 工具函数和配置
│   ├── auth.ts              # NextAuth 配置
│   ├── db.ts                # Prisma 客户端
│   ├── utils.ts             # 工具函数
│   └── code-generator/      # 代码生成器
│       ├── templates.ts     # 代码模板
│       └── generator.ts     # 生成器逻辑
├── store/                   # Zustand 状态管理
│   ├── flow-store.ts        # 流程编辑器状态
│   └── form-designer-store.ts # 表单设计器状态
├── types/                   # TypeScript 类型定义
│   ├── index.ts             # 公共类型
│   └── next-auth.d.ts       # NextAuth 类型扩展
├── actions/                 # Server Actions
│   ├── auth.ts              # 认证相关
│   ├── project.ts           # 项目相关
│   └── flow.ts              # 流程相关
├── prisma/                  # Prisma 配置
│   └── schema.prisma        # 数据库 Schema
├── middleware.ts            # Next.js 中间件（路由保护）
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎯 核心功能使用指南

### 1. 项目管理

- 创建项目：Dashboard -> 新建项目
- 管理项目：查看、编辑、删除项目

### 2. 流程编辑器

- 创建流程：项目详情 -> 新建流程
- 编辑流程：
  - 从左侧节点面板拖拽节点到画布
  - 连接节点创建流程
  - 点击节点编辑属性
  - 保存流程

支持的节点类型：
- 开始节点
- 结束节点
- 动作节点
- 条件节点
- 表单节点
- 数据库节点

### 3. 表单设计器

- 创建表单：Dashboard -> 表单设计器 -> 新建表单
- 设计表单：
  - 从左侧选择字段类型
  - 在中间预览表单
  - 在右侧编辑字段属性
  - 保存表单

支持的字段类型：
- 文本框
- 多行文本
- 数字
- 邮箱
- 密码
- 下拉选择
- 复选框
- 单选框
- 日期
- 文件上传

### 4. 数据模型设计

- 创建模型：Dashboard -> 数据模型 -> 新建数据模型
- 设计模型：
  - 定义模型名称和描述
  - 添加字段
  - 设置字段类型和属性
  - 保存模型

### 5. 代码生成

- 选择数据模型
- 点击生成代码
- 预览生成的文件
- 下载代码文件

生成的代码包括：
- Prisma Schema
- TypeScript 接口
- Next.js 页面组件
- Server Actions
- API 路由

## 🔧 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库相关
pnpm db:generate    # 生成 Prisma Client
pnpm db:push        # 推送 schema 到数据库
pnpm db:migrate     # 创建 migration
pnpm db:studio      # 打开 Prisma Studio
```

## 📝 开发计划

- [x] 项目初始化
- [x] 认证系统
- [x] 基础编辑器框架
- [x] 节点拖拽与连接
- [x] 表单设计器
- [x] 数据模型设计
- [x] 代码生成器
- [ ] 部署与导出功能
- [ ] 组件库管理
- [ ] 协作功能
- [ ] 版本控制
- [ ] 预览和测试
- [ ] 性能优化

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

MIT License

## 📧 联系方式


---

**Flow.io** - 让低代码开发更简单 🚀

