'use client'

import { Sparkles, X } from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewProps {
  imageSrc: string
  onGenerate: () => void
  onCancel: () => void
  isGenerating: boolean
}

export default function ImagePreview({
  imageSrc,
  onGenerate,
  onCancel,
  isGenerating,
}: ImagePreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 预览图片 */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={imageSrc}
          alt="预览图片"
          width={800}
          height={600}
          className="w-full h-auto"
          unoptimized
        />
        <button
          onClick={onCancel}
          disabled={isGenerating}
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
          aria-label="取消"
        >
          <X size={20} />
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={isGenerating}
          className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          重新选择
        </button>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-medium">生成中...</span>
            </>
          ) : (
            <>
              <Sparkles size={24} />
              <span className="text-lg font-medium">生成卡通风格</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
