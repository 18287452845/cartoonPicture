'use client'

import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, X } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
    }
  }, [onCapture])

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 顶部工具栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="关闭相机"
        >
          <X size={24} />
        </button>
        <button
          onClick={switchCamera}
          className="text-white text-sm bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
        >
          切换摄像头
        </button>
      </div>

      {/* 摄像头预览 */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode,
            width: 1920,
            height: 1080,
          }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 底部拍照按钮 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center p-8 bg-gradient-to-t from-black/50 to-transparent">
        <button
          onClick={capture}
          className="w-20 h-20 rounded-full border-4 border-white bg-white/30 hover:bg-white/50 transition-all flex items-center justify-center"
          aria-label="拍照"
        >
          <Camera size={32} className="text-white" />
        </button>
      </div>
    </div>
  )
}
