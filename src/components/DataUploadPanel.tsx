'use client'

import { useRef, ChangeEvent, useState } from 'react'
import { Upload } from 'lucide-react'
import { validateImageFile, fileToBase64 } from '@/lib/utils'

interface DataUploadPanelProps {
  onUpload: (imageSrc: string) => void
  onCameraRequest: () => void
  onError: (error: string) => void
}

export default function DataUploadPanel({ onUpload, onCameraRequest, onError }: DataUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload')

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const processFile = async (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      onError(validation.error!)
      return
    }

    try {
      const base64 = await fileToBase64(file)
      onUpload(base64)
    } catch (error) {
      onError('数据读取错误')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-8 py-2 font-orbitron tracking-wider border ${
            activeTab === 'upload' 
              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
              : 'border-cyan-900/50 text-cyan-700 hover:border-cyan-700'
          } transition-all`}
        >
          数据上传
        </button>
        <button
          onClick={onCameraRequest}
          className="px-8 py-2 font-orbitron tracking-wider border border-cyan-900/50 text-cyan-700 hover:border-cyan-400 hover:text-cyan-300 transition-all"
        >
          视觉传感器
        </button>
      </div>

      {/* Upload Box */}
      <div className="relative p-1">
        {/* Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

        <div 
          className={`
            dashed-box aspect-[16/9] flex flex-col items-center justify-center
            transition-all duration-300 bg-[#02040a]/80
            ${isDragging ? 'bg-cyan-950/20' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-8 p-6 rounded-full border border-cyan-500/20 bg-cyan-950/10">
            <Upload size={48} className="text-cyan-400" />
          </div>
          
          <h3 className="font-orbitron text-xl text-white tracking-widest mb-2">
            上传源素材
          </h3>
          <p className="text-cyan-600 text-xs font-mono mb-8">
            支持格式: JPG, PNG, WEBP
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cyber-button group"
          >
            <span className="relative z-10">选择数据文件</span>
            <div className="absolute inset-0 bg-cyan-400/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>
      </div>
    </div>
  )
}

