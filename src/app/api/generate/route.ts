import { NextRequest, NextResponse } from 'next/server'
import { generateCartoonImage, fetchAndConvertToBuffer } from '@/lib/ali-client'
import { uploadFile, generateUniqueKey } from '@/lib/storage'
import { base64ToBuffer, getFileExtensionFromBase64, getContentTypeFromExtension } from '@/lib/utils'
import type { GenerateResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: '未提供图片数据' } as GenerateResponse,
        { status: 400 }
      )
    }

    console.log('收到生成请求，图片格式: base64')

    // 先尝试使用 base64 直接调用阿里云 API
    let generatedImageUrl: string
    try {
      console.log('尝试使用 base64 直接调用阿里云 API')
      generatedImageUrl = await generateCartoonImage(image)
    } catch (error) {
      // 如果 base64 失败，临时上传到 R2 获取 URL 后重试
      console.warn('Base64 调用失败，尝试上传到 R2 后使用 URL:', error)
      
      // 将 base64 转换为 Buffer 并上传到 R2
      const buffer = base64ToBuffer(image)
      const extension = getFileExtensionFromBase64(image)
      const contentType = getContentTypeFromExtension(extension)
      const tempKey = generateUniqueKey('temp', extension)
      
      console.log('临时上传图片到存储服务获取 URL...')
      const publicUrl = await uploadFile(buffer, tempKey, contentType)
      console.log('公开 URL 已生成:', publicUrl)
      
      // 使用公开 URL（预签名 URL 可能无法被阿里云访问）
      // 即使本地验证失败，也尝试使用，因为阿里云服务器可能可以访问
      try {
        const urlCheck = await fetch(publicUrl, { 
          method: 'HEAD', 
          signal: AbortSignal.timeout(5000) 
        })
        if (urlCheck.ok) {
          console.log('公开 URL 验证通过')
        } else {
          console.warn(`公开 URL 验证返回 HTTP ${urlCheck.status}，但继续尝试`)
        }
      } catch (error) {
        console.warn('公开 URL 验证失败，但继续尝试（阿里云服务器可能可以访问）:', error)
      }
      
      // 使用公开 URL 重试
      generatedImageUrl = await generateCartoonImage(publicUrl)
    }

    // 将生成的图片从阿里云下载并转存到 R2
    console.log('下载生成的图片...')
    const imageBuffer = await fetchAndConvertToBuffer(generatedImageUrl)
    
    // 上传到配置的存储服务
    const cartoonKey = generateUniqueKey('cartoons', 'png')
    console.log('上传生成的图片到存储服务...')
    const finalUrl = await uploadFile(imageBuffer, cartoonKey, 'image/png')

    return NextResponse.json({
      success: true,
      imageUrl: finalUrl,
    } as GenerateResponse)
  } catch (error) {
    console.error('生成卡通图片失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '生成失败',
      } as GenerateResponse,
      { status: 500 }
    )
  }
}

export const maxDuration = 60 // 设置最大执行时间为 60 秒（适用于 Vercel）
