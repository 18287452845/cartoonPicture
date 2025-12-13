'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import CyberHeader from '@/components/CyberHeader'
import DataUploadPanel from '@/components/DataUploadPanel'
import AnalysisPanel from '@/components/AnalysisPanel'
import RenderOutputPanel from '@/components/RenderOutputPanel'

const VisualSensor = dynamic(() => import('@/components/VisualSensor'), {
  ssr: false,
})

type Step = 'input' | 'analysis' | 'output'

export default function HomePage() {
  const [step, setStep] = useState<Step>('input')
  const [sourceImage, setSourceImage] = useState<string>('')
  const [resultImage, setResultImage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSensor, setShowSensor] = useState(false)
  
  const handleSourceReady = (imageSrc: string) => {
    setSourceImage(imageSrc)
    setShowSensor(false)
    setStep('analysis')
  }

  const handleProcessData = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: sourceImage }),
      })

      if (!response.ok) throw new Error('System Malfunction')
      
      const data = await response.json()
      if (data.success && data.imageUrl) {
        setResultImage(data.imageUrl)
        setStep('output')
      }
    } catch (error) {
      console.error(error)
      alert('NEURAL BRIDGE DISCONNECTED')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#02040a]">
      <CyberHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Main Content Area */}
        <div className="w-full max-w-7xl relative z-10">
          {step === 'input' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <DataUploadPanel 
                onUpload={handleSourceReady}
                onCameraRequest={() => setShowSensor(true)}
                onError={(err) => alert(err)}
              />
            </div>
          )}

          {step === 'analysis' && (
            <div className="animate-in slide-in-from-right duration-500">
              <AnalysisPanel
                imageSrc={sourceImage}
                onGenerate={handleProcessData}
                onCancel={() => setStep('input')}
                isGenerating={isProcessing}
              />
            </div>
          )}

          {step === 'output' && (
            <div className="animate-in zoom-in duration-700">
              <RenderOutputPanel
                originalImage={sourceImage}
                resultImage={resultImage}
                onReset={() => {
                  setSourceImage('')
                  setResultImage('')
                  setStep('input')
                }}
              />
            </div>
          )}
        </div>

        {/* Decorative Grid Floor */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
      </div>

      {showSensor && (
        <VisualSensor 
          onCapture={handleSourceReady}
          onClose={() => setShowSensor(false)}
        />
      )}
    </main>
  )
}
