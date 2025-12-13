'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Download, RefreshCw } from 'lucide-react'

interface RenderOutputPanelProps {
  originalImage: string
  resultImage: string
  onReset: () => void
}

export default function RenderOutputPanel({
  originalImage,
  resultImage,
  onReset,
}: RenderOutputPanelProps) {
  
  const handleDownload = async () => {
    try {
      // Use the proxy API to bypass CORS
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(resultImage)}`
      const response = await fetch(proxyUrl)
      
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `TOONIFY_PRIME_${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed', error)
      // Fallback: Try opening in new tab if proxy fails
      window.open(resultImage, '_blank')
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Source */}
        <div className="relative border border-cyan-900/30 bg-[#02040a]">
          <div className="absolute top-0 left-0 px-3 py-1 bg-cyan-950/50 text-[10px] text-cyan-600 font-mono tracking-widest border-b border-r border-cyan-900/30 z-10">
            INPUT_SOURCE_01
          </div>
          <div className="relative aspect-[4/3] w-full grayscale opacity-60">
            <Image
              src={originalImage}
              alt="Original"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Scanline Overlay (CSS version) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay scanline-overlay" />
          </div>
        </div>

        {/* Render Output */}
        <div className="relative border border-cyan-500/50 bg-[#02040a] shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 animate-pulse z-20" />
          <div className="absolute top-0 left-0 px-3 py-1 bg-cyan-900/50 text-[10px] text-cyan-300 font-mono tracking-widest border-b border-r border-cyan-500/30 z-10">
            RENDER_OUTPUT_FINAL
          </div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={resultImage}
              alt="Result"
              fill
              className="object-cover"
              unoptimized
            />
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="border border-cyan-900/50 bg-[#02040a]/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* QR Code */}
        <div className="flex items-center gap-4 border border-cyan-900/30 p-2 bg-black/40">
          <div className="bg-white p-1">
            <QRCodeSVG value={resultImage} size={64} />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-xs text-white tracking-wider">MOBILE LINK</span>
            <span className="font-mono text-[10px] text-cyan-600">SECURE_TRANSFER_PROTOCOL</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none px-6 py-3 font-orbitron text-sm text-cyan-600 hover:text-white border border-transparent hover:border-cyan-700 transition-all uppercase tracking-wider"
          >
            RESET SYSTEM
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 md:flex-none relative group px-8 py-3 bg-cyan-950/30 border border-cyan-500/50 text-cyan-300 font-orbitron text-sm tracking-wider uppercase hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} />
            DOWNLOAD ASSET
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
