/**
 * 统一存储接口
 * 支持多种存储后端：R2、阿里云OSS、七牛云、腾讯云COS
 */

import { uploadToR2, generateUniqueKey as generateR2Key } from './r2-client'
import { uploadToAliOSS, generateUniqueKey as generateAliKey } from './ali-oss-client'
import { uploadToQiniu, generateUniqueKey as generateQiniuKey } from './qiniu-client'
import { uploadToTencentCOS, generateUniqueKey as generateTencentKey } from './tencent-cos-client'

export type StorageProvider = 'r2' | 'alioss' | 'qiniu' | 'tencent'

/**
 * 获取当前配置的存储提供商
 */
export function getStorageProvider(): StorageProvider {
  const provider = (process.env.STORAGE_PROVIDER || 'r2').toLowerCase() as StorageProvider
  const validProviders: StorageProvider[] = ['r2', 'alioss', 'qiniu', 'tencent']
  
  if (validProviders.includes(provider)) {
    return provider
  }
  
  console.warn(`无效的存储提供商: ${provider}，使用默认值: r2`)
  return 'r2'
}

/**
 * 上传文件到配置的存储服务
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const provider = getStorageProvider()
  console.log(`使用存储提供商: ${provider}`)
  
  switch (provider) {
    case 'r2':
      return await uploadToR2(buffer, key, contentType)
    case 'alioss':
      return await uploadToAliOSS(buffer, key, contentType)
    case 'qiniu':
      return await uploadToQiniu(buffer, key, contentType)
    case 'tencent':
      return await uploadToTencentCOS(buffer, key, contentType)
    default:
      throw new Error(`不支持的存储提供商: ${provider}`)
  }
}

/**
 * 生成唯一文件名
 */
export function generateUniqueKey(prefix: string, extension: string): string {
  const provider = getStorageProvider()
  
  // 所有提供商使用相同的生成逻辑
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  return `${prefix}/${timestamp}-${randomStr}.${extension}`
}

