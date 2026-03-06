import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';

const START_DATE = new Date('2026-03-06T00:00:00+09:00').getTime();
const END_DATE = new Date('2026-04-22T23:00:00+09:00').getTime();
const TOTAL_MS = END_DATE - START_DATE;

export default function App() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let animationFrameId: number;
    
    const update = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(update);
    };
    
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Calculate progress
  const elapsedMs = now - START_DATE;
  let progress = (elapsedMs / TOTAL_MS) * 100;
  
  // Clamp progress between 0 and 100
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  // Format percentage to 5 decimal places
  const formattedProgress = progress.toFixed(5);
  const [integerPart, decimalPart] = formattedProgress.split('.');

  // Calculate remaining time
  const remainMs = Math.max(0, END_DATE - now);
  const days = Math.floor(remainMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainMs / 1000 / 60) % 60);
  const seconds = Math.floor((remainMs / 1000) % 60);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 flex flex-col items-center justify-center p-6 font-sans selection:bg-emerald-500/30">
      <div className="w-full max-w-3xl flex flex-col gap-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>중요한 일정</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            2026년 4월 22일 23:00
          </h1>
          <p className="text-zinc-400 max-w-md">
            3월 6일 기준으로 4월 22일 23시까지의 진행률을 실시간으로 추적합니다.
          </p>
        </motion.div>

        {/* Main Progress Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-sm"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col items-center gap-8">
            {/* Percentage */}
            <div className="flex items-baseline justify-center font-mono tracking-tighter">
              <span className="text-7xl md:text-9xl font-light text-white">
                {integerPart}
              </span>
              <span className="text-4xl md:text-6xl font-light text-zinc-500">
                .{decimalPart}
              </span>
              <span className="text-3xl md:text-5xl font-light text-zinc-600 ml-2">
                %
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xl flex flex-col gap-3">
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  layout
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-zinc-500 uppercase tracking-wider">
                <span>3월 6일</span>
                <span>4월 22일 23시</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard label="일" value={days.toString().padStart(2, '0')} />
          <StatCard label="시간" value={hours.toString().padStart(2, '0')} />
          <StatCard label="분" value={minutes.toString().padStart(2, '0')} />
          <StatCard label="초" value={seconds.toString().padStart(2, '0')} />
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
      <span className="text-3xl font-mono font-light text-white mb-2">{value}</span>
      <span className="text-xs font-medium text-zinc-500 tracking-widest">{label}</span>
    </div>
  );
}
