/**
 * 阿里云 OSS 客户端
 */

import OSS from 'ali-oss'

let ossClient: any | null = null

function getOSSClient(): any {
  if (!ossClient) {
    const region = process.env.ALI_OSS_REGION || 'oss-cn-hangzhou'
    const accessKeyId = process.env.ALI_OSS_ACCESS_KEY_ID!
    const accessKeySecret = process.env.ALI_OSS_ACCESS_KEY_SECRET!
    const bucket = process.env.ALI_OSS_BUCKET!
    
    if (!accessKeyId || !accessKeySecret || !bucket) {
      throw new Error('阿里云 OSS 配置不完整，请检查环境变量')
    }
    
    ossClient = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
    })
  }
  
  return ossClient
}

export async function uploadToAliOSS(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getOSSClient()
  
  try {
    const result = await client.put(key, buffer, {
      mime: contentType,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
      },
    })
    
    // 返回公开访问 URL
    const publicUrl = result.url
    console.log('上传到阿里云 OSS 成功，URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('阿里云 OSS 上传失败:', error)
    throw new Error(`阿里云 OSS 上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

export function generateUniqueKey(prefix: string, extension: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomStr}.${extension}`
}

