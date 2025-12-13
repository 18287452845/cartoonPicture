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
    <div className="fixed inset-0 z-50 flex flex-col bg-black relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.18),transparent_60%)] opacity-80 animate-[aurora_18s_ease_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15 mask-radial-fade" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_3px,transparent_7px)] opacity-[0.08] animate-[scan_8s_linear_infinite]" />
      </div>

      {/* 顶部工具栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-5 py-4 bg-black/25 backdrop-blur-md border-b border-white/10">
        <button
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition hover:bg-white/10"
          aria-label="关闭相机"
        >
          <X size={24} />
        </button>
        <button
          onClick={switchCamera}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium tracking-wide text-white backdrop-blur-md transition hover:bg-white/10"
        >
          切换摄像头
        </button>
      </div>

      {/* 摄像头预览 */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
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
      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center px-8 py-10 bg-black/25 backdrop-blur-md border-t border-white/10">
        <button
          onClick={capture}
          className="group relative grid h-24 w-24 place-items-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(99,102,241,0.35)] transition hover:bg-white/15"
          aria-label="拍照"
        >
          <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),transparent_60%)]" />
          </div>
          <Camera size={34} className="relative text-white" />
        </button>
      </div>
    </div>
  )
}
