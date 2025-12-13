'use client'

import { Download, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'

interface ResultDisplayProps {
  imageUrl: string
  onReset: () => void
}

export default function ResultDisplay({ imageUrl, onReset }: ResultDisplayProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cartoon-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请稍后重试')
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] items-start">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <Image
            src={imageUrl}
            alt="卡通风格图片"
            width={1600}
            height={1200}
            className="w-full h-auto"
            unoptimized
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold tracking-wide text-white">生成完成</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            扫码即可在手机端保存，或直接在大屏端下载。
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white p-5 shadow-lg shadow-black/30">
            <div className="flex items-center justify-center">
              <QRCodeSVG value={imageUrl} size={240} level="H" />
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <button
              onClick={handleDownload}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-6 py-5 text-white shadow-2xl shadow-emerald-500/20 transition hover:brightness-110"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_55%)]" />
              </div>
              <div className="relative flex items-center justify-center gap-3">
                <Download size={26} />
                <span className="text-lg font-semibold tracking-wide">下载图片</span>
              </div>
            </button>

            <button
              onClick={onReset}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-5 text-white/90 shadow-lg shadow-black/20 backdrop-blur-md transition hover:bg-white/10"
            >
              <span className="inline-flex items-center justify-center gap-3 text-lg font-semibold tracking-wide">
                <RotateCcw size={24} />
                再来一张
              </span>
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/70">
            提示：大屏场景建议使用二维码下载，避免浏览器下载被拦截。
          </div>
        </div>
      </div>
    </div>
  )
}
