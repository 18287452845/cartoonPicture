'use client'

import { useMemo, useState } from 'react'
import { Camera, CheckCircle2, Sparkles, Upload } from 'lucide-react'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'
import ResultDisplay from '@/components/ResultDisplay'

const CameraCapture = dynamic(() => import('@/components/CameraCapture'), {
  ssr: false,
})

type Step = 'input' | 'preview' | 'result'

export default function HomePage() {
  const [step, setStep] = useState<Step>('input')
  const [capturedImage, setCapturedImage] = useState<string>('')
  const [resultImage, setResultImage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [error, setError] = useState<string>('')

  const stepItems = useMemo(
    () =>
      [
        { key: 'input' as const, label: '拍照 / 上传', icon: Camera },
        { key: 'preview' as const, label: '预览确认', icon: Upload },
        { key: 'result' as const, label: '扫码下载', icon: Sparkles },
      ],
    []
  )

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc)
    setShowCamera(false)
    setStep('preview')
    setError('')
  }

  const handleUpload = (imageSrc: string) => {
    setCapturedImage(imageSrc)
    setStep('preview')
    setError('')
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError('')

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage }),
      })

      if (!uploadResponse.ok) {
        throw new Error('上传图片失败')
      }

      const uploadData = await uploadResponse.json()
      if (!uploadData.success || !uploadData.url) {
        throw new Error(uploadData.error || '上传失败')
      }

      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.url }),
      })

      if (!generateResponse.ok) {
        throw new Error('生成卡通图片失败')
      }

      const generateData = await generateResponse.json()
      if (!generateData.success || !generateData.imageUrl) {
        throw new Error(generateData.error || '生成失败')
      }

      setResultImage(generateData.imageUrl)
      setStep('result')
    } catch (error) {
      console.error('生成失败:', error)
      setError(error instanceof Error ? error.message : '生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setCapturedImage('')
    setResultImage('')
    setStep('input')
    setError('')
  }

  const handleCancel = () => {
    setCapturedImage('')
    setStep('input')
    setError('')
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.35),transparent_58%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.22),transparent_60%)] opacity-90 animate-[aurora_20s_ease_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20 mask-radial-fade" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/70" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
              Gemini3Pro · 科技感大屏版
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-fuchsia-200 drop-shadow-[0_0_30px_rgba(99,102,241,0.25)] sm:text-6xl lg:text-7xl">
              照片转卡通
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              上传照片或现场拍照，一键生成高质感卡通形象。专为大屏展示优化：更大字号、更强对比、更清晰层级。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {stepItems.map((item) => {
              const Icon = item.icon
              const active = item.key === step
              const done =
                (step === 'preview' && item.key === 'input') ||
                (step === 'result' && (item.key === 'input' || item.key === 'preview'))

              return (
                <div
                  key={item.key}
                  className={
                    active
                      ? 'flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white shadow-lg shadow-indigo-500/10 backdrop-blur-md'
                      : done
                        ? 'flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur-md'
                        : 'flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-md'
                  }
                >
                  {done ? (
                    <CheckCircle2 size={18} className="text-emerald-300" />
                  ) : (
                    <Icon size={18} className={active ? 'text-white' : 'text-white/70'} />
                  )}
                  <span className="whitespace-nowrap font-medium tracking-wide">{item.label}</span>
                </div>
              )
            })}
          </div>
        </header>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-100 shadow-lg shadow-red-500/10 backdrop-blur-md">
            {error}
          </div>
        )}

        <section className="mt-10">
          {step === 'input' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold tracking-wide text-white">开始创作</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  选择拍照或上传图片。建议使用清晰、光线充足的照片以获得更好的效果。
                </p>

                <button
                  onClick={() => setShowCamera(true)}
                  className="group relative mt-7 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-5 text-white shadow-2xl shadow-fuchsia-500/20 transition hover:brightness-110"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_55%)]" />
                  </div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Camera size={26} />
                    <span className="text-lg font-semibold tracking-wide">现场拍照</span>
                  </div>
                </button>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-medium tracking-[0.3em] text-white/40">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <ImageUploader onUpload={handleUpload} onError={setError} />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold tracking-wide text-white">大屏展示建议</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300 shadow-[0_0_14px_rgba(165,180,252,0.55)]" />
                    使用横屏 16:9 展示，建议浏览器全屏。
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-300 shadow-[0_0_14px_rgba(240,171,252,0.55)]" />
                    拍照时尽量保持人物居中，避免强烈背光。
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.55)]" />
                    输出后可扫码下载，便于快速分享。
                  </li>
                </ul>

                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <div className="text-sm font-medium tracking-wide text-white/80">实时状态</div>
                      <div className="mt-2 text-3xl font-semibold text-white">Ready</div>
                      <div className="mt-1 text-sm text-white/60">等待输入图片</div>
                    </div>
                    <div className="grid h-24 w-24 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_50px_rgba(99,102,241,0.18)]">
                      <Sparkles size={34} className="text-indigo-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <ImagePreview
              imageSrc={capturedImage}
              onGenerate={handleGenerate}
              onCancel={handleCancel}
              isGenerating={isGenerating}
            />
          )}

          {step === 'result' && <ResultDisplay imageUrl={resultImage} onReset={handleReset} />}
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>Photo Toon · Powered by AI</span>
          <span>建议使用 Chrome / Edge 最新版以获得最佳大屏效果</span>
        </footer>
      </div>

      {showCamera && (
        <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
      )}
    </main>
  )
}
