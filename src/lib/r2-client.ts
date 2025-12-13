import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME!

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await r2Client.send(command)

  // 返回公开访问 URL
  // 确保 R2_PUBLIC_URL 末尾没有斜杠，key 前面有斜杠
  const publicUrlBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || ''
  const publicUrl = `${publicUrlBase}/${key}`
  
  console.log('上传成功，生成的公开 URL:', publicUrl)
  return publicUrl
}

export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME!

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
  return url
}

/**
 * 验证 URL 是否可访问
 */
export async function verifyUrlAccessibility(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn('URL 验证失败:', error)
    return false
  }
}

/**
 * 获取可用的图片 URL（优先使用公开 URL，如果不可用则使用预签名 URL）
 */
export async function getAccessibleImageUrl(key: string): Promise<string> {
  const publicUrlBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, '') || ''
  const publicUrl = `${publicUrlBase}/${key}`
  
  // 尝试验证公开 URL 是否可访问
  const isAccessible = await verifyUrlAccessibility(publicUrl)
  
  if (isAccessible) {
    console.log('使用公开 URL:', publicUrl)
    return publicUrl
  }
  
  // 如果公开 URL 不可用，使用预签名 URL
  console.log('公开 URL 不可用，使用预签名 URL')
  const presignedUrl = await getPresignedDownloadUrl(key)
  return presignedUrl
}

export function generateUniqueKey(prefix: string, extension: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomStr}.${extension}`
}
