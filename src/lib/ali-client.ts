import type { AliImageGenerationRequest, AliImageGenerationResponse } from '@/types'

const ALI_API_URL = process.env.ALI_API_URL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation'
const ALI_API_KEY = process.env.ALI_API_KEY!
const ALI_MODEL = process.env.ALI_MODEL || 'wanx-style-repaint-v1'

export async function generateCartoonImage(imageUrl: string): Promise<string> {
  const requestBody: AliImageGenerationRequest = {
    model: ALI_MODEL,
    input: {
      image_url: imageUrl,
      style_index: 0, // 卡通风格索引，可以根据需要调整
    },
    parameters: {
      style: '<auto>', // 自动选择风格
    },
  }

  try {
    const response = await fetch(ALI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALI_API_KEY}`,
        'X-DashScope-Async': 'enable', // 异步调用
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`阿里云 API 调用失败: ${response.status} - ${errorText}`)
    }

    const data: AliImageGenerationResponse = await response.json()

    // 处理异步任务
    if (response.headers.get('X-DashScope-Async') === 'enable') {
      // 如果是异步任务，需要轮询获取结果
      const taskId = data.output?.results?.[0]?.url || data.request_id
      if (!taskId) {
        throw new Error('无法获取任务 ID')
      }
      
      // 简化处理：这里假设同步返回，实际项目中需要实现轮询逻辑
      return await pollTaskResult(taskId)
    }

    // 同步返回结果
    const resultUrl = data.output?.results?.[0]?.url
    if (!resultUrl) {
      throw new Error(`生成失败: ${data.message || '未知错误'}`)
    }

    return resultUrl
  } catch (error) {
    console.error('阿里云 API 调用错误:', error)
    throw error
  }
}

async function pollTaskResult(taskId: string, maxAttempts = 30, interval = 2000): Promise<string> {
  const taskUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(taskUrl, {
        headers: {
          'Authorization': `Bearer ${ALI_API_KEY}`,
        },
      })

      if (response.ok) {
        const data: AliImageGenerationResponse = await response.json()
        
        // 检查任务状态
        if (data.output?.results?.[0]?.url) {
          return data.output.results[0].url
        }
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, interval))
    } catch (error) {
      console.error(`轮询任务状态失败 (尝试 ${attempt + 1}/${maxAttempts}):`, error)
    }
  }

  throw new Error('任务超时：无法获取生成结果')
}

export async function fetchAndConvertToBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`下载图片失败: ${response.status}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
