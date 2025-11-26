import OpenAI from 'openai'

// OpenAI 客户端配置
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// AI 服务接口
export interface AIFlowRequest {
  description: string
  businessType?: string
  complexity?: 'simple' | 'medium' | 'complex'
}

export interface AIFormRequest {
  purpose: string
  dataType?: string
  fields?: string[]
}

export interface AICodeOptimizationRequest {
  code: string
  language: string
  context?: string
}

// AI 流程生成
export async function generateFlowWithAI(request: AIFlowRequest) {
  try {
    const prompt = `
作为一个业务流程专家，请根据以下需求生成一个业务流程图的节点和连接数据：

需求描述: ${request.description}
业务类型: ${request.businessType || '通用'}
复杂度: ${request.complexity || 'medium'}

请返回符合 ReactFlow 格式的 JSON 数据，包含 nodes 和 edges 数组。
节点类型包括：start, end, action, condition, form, database

返回格式示例：
{
  "nodes": [
    {
      "id": "1",
      "type": "start",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "开始" }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}

请确保流程逻辑合理，节点位置布局美观。
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "你是一个专业的业务流程设计专家，擅长将业务需求转换为可视化流程图。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI 生成失败')
    }

    // 解析 JSON 响应
    const flowData = JSON.parse(content)
    return {
      success: true,
      data: flowData,
      usage: completion.usage
    }
  } catch (error) {
    console.error('AI 流程生成失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// AI 表单生成
export async function generateFormWithAI(request: AIFormRequest) {
  try {
    const prompt = `
作为一个表单设计专家，请根据以下需求生成表单字段配置：

表单用途: ${request.purpose}
数据类型: ${request.dataType || '通用'}
预设字段: ${request.fields?.join(', ') || '无'}

请返回表单字段的 JSON 配置数组，每个字段包含：
- id: 唯一标识
- type: 字段类型 (text, email, number, select, checkbox, radio, textarea, date)
- label: 显示标签
- name: 字段名称
- required: 是否必填
- validation: 验证规则
- options: 选项（适用于 select, radio, checkbox）

返回格式示例：
{
  "fields": [
    {
      "id": "field-1",
      "type": "text",
      "label": "姓名",
      "name": "name",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    }
  ]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "你是一个专业的表单设计专家，擅长根据业务需求设计合理的表单结构。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI 生成失败')
    }

    const formData = JSON.parse(content)
    return {
      success: true,
      data: formData,
      usage: completion.usage
    }
  } catch (error) {
    console.error('AI 表单生成失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// AI 代码优化
export async function optimizeCodeWithAI(request: AICodeOptimizationRequest) {
  try {
    const prompt = `
作为一个代码优化专家，请分析以下代码并提供优化建议：

编程语言: ${request.language}
代码内容:
\`\`\`${request.language}
${request.code}
\`\`\`

上下文: ${request.context || '无'}

请提供：
1. 代码质量评分 (1-10)
2. 具体的优化建议
3. 优化后的代码示例
4. 性能改进点
5. 安全性建议

返回 JSON 格式：
{
  "score": 8,
  "suggestions": ["建议1", "建议2"],
  "optimizedCode": "优化后的代码",
  "performance": ["性能改进点1"],
  "security": ["安全建议1"]
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "你是一个资深的代码审查专家，擅长代码优化和最佳实践指导。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI 分析失败')
    }

    const analysisData = JSON.parse(content)
    return {
      success: true,
      data: analysisData,
      usage: completion.usage
    }
  } catch (error) {
    console.error('AI 代码优化失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// AI 聊天助手
export async function chatWithAI(message: string, context?: string) {
  try {
    const systemPrompt = `
你是 Flow.io 低代码平台的智能助手，专门帮助用户：
1. 设计业务流程
2. 创建表单
3. 数据建模
4. 代码生成
5. 解决技术问题

请用专业但友好的语气回答用户问题，提供实用的建议。
${context ? `当前上下文: ${context}` : ''}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI 回复失败')
    }

    return {
      success: true,
      message: content,
      usage: completion.usage
    }
  } catch (error) {
    console.error('AI 聊天失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

export default openai
