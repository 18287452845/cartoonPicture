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
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] items-start">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.30),transparent_55%)]" />
            <div className="absolute -inset-24 bg-[radial-gradient(circle_at_bottom,rgba(236,72,153,0.18),transparent_60%)]" />
          </div>

          <Image
            src={imageSrc}
            alt="预览图片"
            width={1600}
            height={1200}
            className="relative w-full h-auto"
            unoptimized
          />

          <button
            onClick={onCancel}
            disabled={isGenerating}
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55 disabled:opacity-50"
            aria-label="取消"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold tracking-wide text-white">确认并生成</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            这张照片将被转换为卡通风格。大屏展示建议选择清晰正脸、光线充足的照片。
          </p>

          <div className="mt-7 grid gap-4">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-5 text-white shadow-2xl shadow-fuchsia-500/20 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.30),transparent_55%)]" />
              </div>
              <div className="relative flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <div className="h-6 w-6 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                    <span className="text-lg font-semibold tracking-wide">生成中…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={26} className="text-white" />
                    <span className="text-lg font-semibold tracking-wide">生成卡通风格</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={onCancel}
              disabled={isGenerating}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-5 text-white/90 shadow-lg shadow-black/20 backdrop-blur-md transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              重新选择
            </button>
          </div>

          <div className="mt-7 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/70">
            <div className="flex items-start justify-between gap-4">
              <span>预计耗时</span>
              <span className="font-medium text-white">10–30 秒</span>
            </div>
            <div className="mt-2 flex items-start justify-between gap-4">
              <span>输出尺寸</span>
              <span className="font-medium text-white">高清大图</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
