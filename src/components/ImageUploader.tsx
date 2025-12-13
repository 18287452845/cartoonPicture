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
        className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-5 text-white shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_60%)]" />
        </div>
        <div className="relative flex items-center justify-center gap-3">
          <Upload size={26} className="text-indigo-200" />
          <span className="text-lg font-semibold tracking-wide">上传图片</span>
        </div>
      </button>
    </div>
  )
}
