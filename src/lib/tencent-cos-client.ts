/**
 * 腾讯云 COS 客户端
 */

import COS from 'cos-nodejs-sdk-v5'

let cosClient: COS | null = null

function getCOSClient(): COS {
  if (!cosClient) {
    const secretId = process.env.TENCENT_COS_SECRET_ID!
    const secretKey = process.env.TENCENT_COS_SECRET_KEY!
    const region = process.env.TENCENT_COS_REGION || 'ap-guangzhou'
    const bucket = process.env.TENCENT_COS_BUCKET!
    
    if (!secretId || !secretKey || !bucket) {
      throw new Error('腾讯云 COS 配置不完整，请检查环境变量')
    }
    
    cosClient = new COS({
      SecretId: secretId,
      SecretKey: secretKey,
    })
  }
  
  return cosClient
}

export async function uploadToTencentCOS(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getCOSClient()
  const bucket = process.env.TENCENT_COS_BUCKET!
  const region = process.env.TENCENT_COS_REGION || 'ap-guangzhou'
  const domain = process.env.TENCENT_COS_DOMAIN || `https://${bucket}.cos.${region}.myqcloud.com`
  
  return new Promise((resolve, reject) => {
    client.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      },
      (err, data) => {
        if (err) {
          console.error('腾讯云 COS 上传失败:', err)
          reject(new Error(`腾讯云 COS 上传失败: ${err.message}`))
          return
        }
        
        // 返回公开访问 URL
        const publicUrl = domain.endsWith('/') 
          ? `${domain}${key}` 
          : `${domain}/${key}`
        console.log('上传到腾讯云 COS 成功，URL:', publicUrl)
        resolve(publicUrl)
      }
    )
  })
}

export function generateUniqueKey(prefix: string, extension: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomStr}.${extension}`
}

