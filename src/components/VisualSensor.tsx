'use client'

import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { X, Aperture } from 'lucide-react'

interface VisualSensorProps {
  onCapture: (imageSrc: string) => void
  onClose: () => void
}

export default function VisualSensor({ onCapture, onClose }: VisualSensorProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isScanning, setIsScanning] = useState(true)

  const capture = useCallback(() => {
    setIsScanning(false)
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      // Flash effect
      const flash = document.createElement('div')
      flash.className = 'fixed inset-0 bg-white z-[100] animate-out fade-out duration-500'
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 500)
      
      onCapture(imageSrc)
    }
  }, [onCapture])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Corners */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-cyan-500/80 rounded-tl-xl" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-cyan-500/80 rounded-tr-xl" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-cyan-500/80 rounded-bl-xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-cyan-500/80 rounded-br-xl" />
        
        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-cyan-500/30 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        </div>

        {/* Status Text */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-cyan-400 font-mono text-xs tracking-[0.3em] bg-black/50 px-4 py-1">
          视觉传感器已激活
        </div>
        
        {/* Data Overlay */}
        <div className="absolute bottom-10 left-10 text-cyan-600 font-mono text-[10px] space-y-1">
          <div>感光度: 自动</div>
          <div>曝光: +0.0</div>
          <div>白平衡: 5600K</div>
        </div>
      </div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-30 w-10 h-10 border border-cyan-500/50 bg-black/50 text-cyan-400 flex items-center justify-center hover:bg-cyan-900/50"
      >
        <X size={20} />
      </button>

      {/* Webcam Feed */}
      <div className="relative w-full h-full">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{ facingMode: 'user' }}
        />
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>

      {/* Capture Button */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={capture}
          className="group relative w-20 h-20 rounded-full border-2 border-cyan-500/50 flex items-center justify-center bg-black/50 hover:bg-cyan-900/20 transition-all"
        >
          <div className="w-16 h-16 rounded-full border border-cyan-400 group-hover:scale-90 transition-transform duration-200 flex items-center justify-center">
            <Aperture className="text-cyan-400 w-8 h-8 animate-spin-slow" />
          </div>
        </button>
      </div>
    </div>
  )
}

