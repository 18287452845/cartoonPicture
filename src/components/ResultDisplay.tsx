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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* 结果图片 */}
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
        <Image
          src={imageUrl}
          alt="卡通风格图片"
          width={800}
          height={600}
          className="w-full h-auto"
          unoptimized
        />
      </div>

      {/* 二维码区域 */}
      <div className="bg-white rounded-lg p-6 shadow-lg text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">扫码下载</h3>
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <QRCodeSVG value={imageUrl} size={200} level="H" />
          </div>
        </div>
        <p className="text-sm text-gray-600">使用手机扫描二维码即可保存图片</p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <Download size={24} />
          <span className="text-lg font-medium">下载图片</span>
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <RotateCcw size={24} />
          <span className="text-lg font-medium">再来一张</span>
        </button>
      </div>
    </div>
  )
}
