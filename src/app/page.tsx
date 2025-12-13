'use client'

import { useState } from 'react'
import { Camera, Upload as UploadIcon } from 'lucide-react'
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
      // Step 1: 上传原始图片到 R2
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

      // Step 2: 调用生成 API
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            📸 照片转卡通
          </h1>
          <p className="text-lg text-gray-600">
            上传照片或拍照，一键生成卡通风格
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 输入阶段 */}
        {step === 'input' && (
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={() => setShowCamera(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Camera size={24} />
              <span className="text-lg font-medium">拍照</span>
            </button>
            <ImageUploader onUpload={handleUpload} onError={setError} />
          </div>
        )}

        {/* 预览阶段 */}
        {step === 'preview' && (
          <ImagePreview
            imageSrc={capturedImage}
            onGenerate={handleGenerate}
            onCancel={handleCancel}
            isGenerating={isGenerating}
          />
        )}

        {/* 结果阶段 */}
        {step === 'result' && <ResultDisplay imageUrl={resultImage} onReset={handleReset} />}
      </div>

      {/* 相机模态框 */}
      {showCamera && (
        <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />
      )}
    </main>
  )
}
