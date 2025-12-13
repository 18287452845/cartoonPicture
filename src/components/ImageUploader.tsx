'use client'

import { useRef, ChangeEvent } from 'react'
import { Upload } from 'lucide-react'
import { validateImageFile, fileToBase64 } from '@/lib/utils'

interface ImageUploaderProps {
  onUpload: (imageSrc: string) => void
  onError: (error: string) => void
}

export default function ImageUploader({ onUpload, onError }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      onError(validation.error!)
      return
    }

    try {
      const base64 = await fileToBase64(file)
      onUpload(base64)
    } catch (error) {
      onError('读取文件失败')
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        <Upload size={24} />
        <span className="text-lg font-medium">上传图片</span>
      </button>
    </div>
  )
}
