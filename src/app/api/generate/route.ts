import { NextRequest, NextResponse } from 'next/server'
import { generateCartoonImage, fetchAndConvertToBuffer } from '@/lib/ali-client'
import { uploadToR2, generateUniqueKey } from '@/lib/r2-client'
import type { GenerateResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: '未提供图片 URL' } as GenerateResponse,
        { status: 400 }
      )
    }

    // 调用阿里云 API 生成卡通图片
    console.log('调用阿里云 API 生成卡通图片...')
    const generatedImageUrl = await generateCartoonImage(imageUrl)

    // 将生成的图片从阿里云下载并转存到 R2
    console.log('下载生成的图片...')
    const imageBuffer = await fetchAndConvertToBuffer(generatedImageUrl)
    
    // 上传到 R2
    const key = generateUniqueKey('cartoons', 'png')
    console.log('上传到 R2...')
    const finalUrl = await uploadToR2(imageBuffer, key, 'image/png')

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
