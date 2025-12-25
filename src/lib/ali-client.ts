import type { AliImageGenerationRequest, AliImageGenerationResponse } from '@/types'

const ALI_API_URL = process.env.ALI_API_URL || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation'
const ALI_API_KEY = process.env.ALI_API_KEY!
const ALI_MODEL = process.env.ALI_MODEL || 'wanx-style-repaint-v1'

/**
 * 将图片 URL 转换为 base64 编码
 */
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    console.log('下载图片并转换为 base64...')
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`下载图片失败: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    
    // 根据 Content-Type 确定图片格式
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const dataUrl = `data:${contentType};base64,${base64}`
    
    console.log('图片已转换为 base64，大小:', base64.length, 'bytes')
    return dataUrl
  } catch (error) {
    console.error('转换图片为 base64 失败:', error)
    throw error
  }
}

export async function generateCartoonImage(imageInput: string, styleIndex: number = 0): Promise<string> {
  // 支持两种输入格式：URL 或 base64 data URL
  // 根据阿里云文档，支持：
  // 1. 公网可访问的 HTTP/HTTPS 地址
  // 2. Base64编码字符串，格式：data:{MIME_type};base64,{base64_data}
  console.log('准备调用阿里云 API，图片输入类型:', imageInput.startsWith('data:') ? 'base64' : 'URL')
  
  // 验证输入格式
  if (!imageInput) {
    throw new Error('未提供图片输入')
  }

  let finalImageInput: string = imageInput

  // 如果是 base64 data URL，直接使用（格式：data:image/...;base64,...）
  if (imageInput.startsWith('data:')) {
    console.log('检测到 base64 格式，直接使用')
    // 验证格式是否正确
    const base64Match = imageInput.match(/^data:image\/(\w+);base64,(.+)$/s) // 使用 s 标志支持多行
    if (!base64Match) {
      throw new Error('Base64 格式错误，应为 data:image/{type};base64,{data} 格式')
    }
    console.log('Base64 格式验证通过，MIME 类型:', base64Match[1])
    
    // 清理 base64 字符串（去除可能的换行符和空格）
    const base64Data = base64Match[2].replace(/\s/g, '')
    finalImageInput = `data:image/${base64Match[1]};base64,${base64Data}`
    console.log('Base64 数据已清理，原始长度:', base64Match[2].length, '清理后长度:', base64Data.length)
  } else if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    // 如果是 URL，验证是否可访问
    console.log('检测到 URL 格式，图片 URL:', imageInput.substring(0, 100))
    
    // 验证 URL 是否可以从公网访问（仅用于调试，不阻止请求）
    // 即使本地验证失败，也继续尝试，因为阿里云服务器可能可以访问
    try {
      const urlCheck = await fetch(imageInput, { 
        method: 'HEAD', 
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AliCloud/1.0)',
        }
      })
      if (urlCheck.ok) {
        console.log('URL 验证通过，可以从公网访问')
      } else {
        console.warn(`URL 验证返回 HTTP ${urlCheck.status}，但继续尝试（阿里云服务器可能可以访问）`)
      }
    } catch (error) {
      console.warn('URL 验证失败，但继续尝试（可能是网络问题，阿里云服务器可能可以访问）:', error)
    }
  } else {
    throw new Error(`无效的图片输入格式: 必须是 URL (http/https) 或 base64 data URL (data:image/...;base64,...)`)
  }

  const requestBody: AliImageGenerationRequest = {
    model: ALI_MODEL,
    input: {
      image_url: finalImageInput,
      style_index: styleIndex,
    },
    parameters: {
      style: '<auto>', // 自动选择风格
    },
  }

  // 记录请求体（隐藏 base64 内容以避免日志过长）
  const isBase64 = finalImageInput.startsWith('data:')
  const mimeMatch = finalImageInput.match(/^data:image\/(\w+);base64,/)
  
  console.log('请求体信息:', {
    model: requestBody.model,
    input: {
      image_url: isBase64 
        ? `[base64 data URL, ${finalImageInput.length} chars, MIME: ${mimeMatch?.[1] || 'unknown'}, prefix: ${finalImageInput.substring(0, 50)}...]` 
        : finalImageInput,
      style_index: requestBody.input.style_index,
    },
    parameters: requestBody.parameters,
  })
  
  // 验证 base64 格式
  if (isBase64) {
    if (!mimeMatch) {
      throw new Error('Base64 格式错误：缺少 MIME 类型')
    }
    const base64Data = finalImageInput.substring(mimeMatch[0].length)
    if (!base64Data || base64Data.length === 0) {
      throw new Error('Base64 数据为空')
    }
    console.log(`Base64 数据长度: ${base64Data.length} 字符`)
    console.log(`Base64 数据前20字符: ${base64Data.substring(0, 20)}`)
  }

  try {
    // 记录实际发送的 JSON（截断 base64 部分）
    const requestBodyForLog = isBase64 
      ? {
          ...requestBody,
          input: {
            ...requestBody.input,
            image_url: `${finalImageInput.substring(0, 50)}...[truncated]`,
          }
        }
      : requestBody
    console.log('实际发送的请求体（截断）:', JSON.stringify(requestBodyForLog, null, 2))
    
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
    
    console.log('阿里云 API 响应:', JSON.stringify(data, null, 2))

    // 根据文档，异步任务返回格式：
    // {
    //   "output": {
    //     "task_status": "PENDING",
    //     "task_id": "xxx"
    //   },
    //   "request_id": "xxx"
    // }
    
    // 检查是否有 task_id（异步任务）
    const taskId = (data.output as any)?.task_id
    if (taskId) {
      console.log('检测到异步任务，任务 ID:', taskId)
      return await pollTaskResult(taskId)
    }

    // 检查是否直接返回了结果（同步任务或已完成）
    if (data.output?.results?.[0]?.url) {
      console.log('直接返回结果 URL:', data.output.results[0].url)
      return data.output.results[0].url
    }

    // 如果没有结果，抛出错误
    throw new Error(`生成失败: ${data.message || data.code || '未知错误'}`)
  } catch (error) {
    console.error('阿里云 API 调用错误:', error)
    throw error
  }
}

async function pollTaskResult(taskId: string, maxAttempts = 30, interval = 2000): Promise<string> {
  const taskUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`
  
  console.log(`开始轮询任务，最多尝试 ${maxAttempts} 次，间隔 ${interval}ms`)
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(taskUrl, {
        headers: {
          'Authorization': `Bearer ${ALI_API_KEY}`,
        },
      })

      if (response.ok) {
        const data: any = await response.json()
        const taskStatus = data.output?.task_status
        
        console.log(`轮询尝试 ${attempt + 1}/${maxAttempts}, 任务状态: ${taskStatus}`)
        
        // 检查任务状态
        if (taskStatus === 'SUCCEEDED') {
          // 任务成功，获取结果 URL
          if (data.output?.results?.[0]?.url) {
            console.log('任务完成，获取到结果 URL:', data.output.results[0].url)
            return data.output.results[0].url
          } else {
            throw new Error('任务成功但未返回结果 URL')
          }
        } else if (taskStatus === 'FAILED') {
          // 任务失败
          const errorMessage = data.output?.error_message || '任务失败'
          throw new Error(`任务失败: ${errorMessage}`)
        } else if (taskStatus === 'PENDING' || taskStatus === 'RUNNING') {
          // 任务进行中，继续等待
          console.log(`任务进行中，等待 ${interval}ms 后重试...`)
        } else {
          console.warn(`未知任务状态: ${taskStatus}`)
        }
      } else {
        const errorText = await response.text()
        console.warn(`轮询请求失败 (尝试 ${attempt + 1}/${maxAttempts}):`, response.status, errorText)
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, interval))
    } catch (error) {
      console.error(`轮询任务状态失败 (尝试 ${attempt + 1}/${maxAttempts}):`, error)
      // 如果是最后一次尝试，抛出错误
      if (attempt === maxAttempts - 1) {
        throw error
      }
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
