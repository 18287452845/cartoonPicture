/**
 * 七牛云存储客户端
 */

import * as qiniu from 'qiniu'

let qiniuConfig: qiniu.conf.Config | null = null
let mac: qiniu.auth.digest.Mac | null = null

function getQiniuConfig(): { config: qiniu.conf.Config; mac: qiniu.auth.digest.Mac } {
  if (!qiniuConfig || !mac) {
    const accessKey = process.env.QINIU_ACCESS_KEY!
    const secretKey = process.env.QINIU_SECRET_KEY!
    const bucket = process.env.QINIU_BUCKET!
    const domain = process.env.QINIU_DOMAIN!
    
    if (!accessKey || !secretKey || !bucket || !domain) {
      throw new Error('七牛云配置不完整，请检查环境变量')
    }
    
    mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    qiniuConfig = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z0, // 华东
    })
  }
  
  return { config: qiniuConfig, mac: mac }
}

export async function uploadToQiniu(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const { config, mac } = getQiniuConfig()
  const bucket = process.env.QINIU_BUCKET!
  const domain = process.env.QINIU_DOMAIN!.replace(/\/$/, '')
  
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
  })
  const uploadToken = putPolicy.uploadToken(mac)
  
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  
  return new Promise((resolve, reject) => {
    formUploader.put(uploadToken, key, buffer, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        console.error('七牛云上传失败:', respErr)
        reject(new Error(`七牛云上传失败: ${respErr.message}`))
        return
      }
      
      if (respInfo.statusCode === 200) {
        const publicUrl = `${domain}/${key}`
        console.log('上传到七牛云成功，URL:', publicUrl)
        resolve(publicUrl)
      } else {
        console.error('七牛云上传失败:', respInfo.statusCode, respBody)
        reject(new Error(`七牛云上传失败: HTTP ${respInfo.statusCode}`))
      }
    })
  })
}

export function generateUniqueKey(prefix: string, extension: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomStr}.${extension}`
}

