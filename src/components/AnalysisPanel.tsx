'use client'

import Image from 'next/image'
import { X, Cpu, Check, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

interface AnalysisPanelProps {
  imageSrc: string
  onGenerate: () => void
  onCancel: () => void
  isGenerating: boolean
}

export default function AnalysisPanel({
  imageSrc,
  onGenerate,
  onCancel,
  isGenerating,
}: AnalysisPanelProps) {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const initLogs = [
      '> Subject detected',
      '> Resolution: High',
      '> Neural engine: READY',
      '> Awaiting confirmation...'
    ]
    
    let i = 0
    const timer = setInterval(() => {
      if (i < initLogs.length) {
        setLogs(prev => [...prev, initLogs[i]])
        i++
      } else {
        clearInterval(timer)
      }
    }, 300)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isGenerating) {
      setLogs([])
      const processingLogs = [
        '> Uploading to secure storage...',
        '> Initializing neural bridge...',
        '> Processing visual data...',
        '> Applying style transfer...',
        '> Refining details...',
        '> Optimizing output...'
      ]
      let i = 0
      const timer = setInterval(() => {
        if (i < processingLogs.length) {
          setLogs(prev => [...prev, processingLogs[i]])
          i++
        }
      }, 800)
      return () => clearInterval(timer)
    }
  }, [isGenerating])

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
      {/* Image View */}
      <div className="relative border border-cyan-900/50 bg-[#02040a] p-1">
        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500" />
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-red-500/20 hover:border-red-500 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="relative aspect-video w-full overflow-hidden bg-black/50">
          <Image
            src={imageSrc}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized
          />
          {/* Overlay Grid (CSS version) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)',
                 backgroundSize: '20px 20px' 
               }} 
          />
        </div>
      </div>

      {/* Analysis Log */}
      <div className="flex flex-col gap-6">
        <div className="border border-cyan-900/50 bg-[#02040a]/80 p-6 flex-1 flex flex-col">
          <h3 className="font-orbitron text-cyan-400 tracking-widest mb-4 pb-2 border-b border-cyan-900/50">
            ANALYSIS LOG
          </h3>
          
          <div className="font-mono text-xs space-y-2 text-cyan-100/70 flex-1 overflow-y-auto min-h-[200px]">
            {logs.map((log, i) => (
              <div key={i} className="typewriter border-l-2 border-cyan-500/20 pl-2">
                {log}
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="group relative h-16 border border-cyan-500/50 bg-cyan-950/30 overflow-hidden disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center gap-3">
              <Activity className="animate-spin text-cyan-400" />
              <span className="font-orbitron tracking-widest text-cyan-400 animate-pulse">
                PROCESSING_DATA...
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full hover:bg-cyan-500/10 transition-colors">
              <span className="font-orbitron tracking-widest text-cyan-300 group-hover:text-cyan-100">
                INITIATE_SEQUENCE
              </span>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
