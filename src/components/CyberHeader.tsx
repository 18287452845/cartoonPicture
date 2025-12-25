export default function CyberHeader() {
  return (
    <header className="border-b border-cyan-900/50 bg-[#02040a]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto max-w-[1920px] px-6 h-20 flex items-center justify-between">
        {/* LOGO Area */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-400 flex items-center justify-center bg-cyan-950/30">
            <span className="font-orbitron text-2xl text-cyan-400 font-bold">T</span>
          </div>
          <div>
            <h1 className="font-orbitron text-2xl font-bold tracking-wider text-white">
              TOONIFY <span className="text-cyan-400">PRIME</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-cyan-700 tracking-[0.2em] font-mono">
              视觉处理单元 V2.0
            </div>
          </div>
        </div>

        {/* Status Area */}
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-2 text-[10px] text-cyan-600 tracking-widest mb-1">
            系统状态
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            <span className="font-orbitron text-sm text-green-500 tracking-widest">在线</span>
          </div>
        </div>
      </div>
      
      {/* 刻度尺装饰 */}
      <div className="h-1 w-full bg-cyan-950/30 relative overflow-hidden flex justify-between px-2">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-[1px] h-full bg-cyan-900/50" />
        ))}
      </div>
    </header>
  )
}

