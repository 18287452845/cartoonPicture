import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, generateUniqueKey } from '@/lib/storage'
import { base64ToBuffer, getFileExtensionFromBase64, getContentTypeFromExtension } from '@/lib/utils'
import type { UploadResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: '未提供图片数据' } as UploadResponse,
        { status: 400 }
      )
    }

    // 将 Base64 转换为 Buffer
    const buffer = base64ToBuffer(image)
    const extension = getFileExtensionFromBase64(image)
    const contentType = getContentTypeFromExtension(extension)

    // 生成唯一的文件名
    const key = generateUniqueKey('originals', extension)

    // 上传到配置的存储服务
    const url = await uploadFile(buffer, key, contentType)
    
    console.log('图片上传成功:', { key, url })

    return NextResponse.json({
      success: true,
      url,
      key,
    } as UploadResponse)
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      } as UploadResponse,
      { status: 500 }
    )
  }
}
