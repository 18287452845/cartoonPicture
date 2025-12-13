export function base64ToBuffer(base64: string): Buffer {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}

export function getFileExtensionFromBase64(base64: string): string {
  const match = base64.match(/^data:image\/(\w+);base64,/)
  return match ? match[1] : 'png'
}

export function getContentTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  }
  return mimeTypes[extension.toLowerCase()] || 'image/png'
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的文件类型。请上传 JPG、PNG、WEBP 或 GIF 格式的图片。',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: '文件过大。最大支持 10MB。',
    }
  }

  return { valid: true }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
