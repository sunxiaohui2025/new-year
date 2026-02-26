import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Trophy, Gift, Crown, Play, Square, RotateCcw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLotteryStore } from './store';

export default function App() {
  const navigate = useNavigate();
  const { employees, prizes, isLoaded } = useLotteryStore();
  
  const [winners, setWinners] = useState<Record<string, string[]>>({});
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Wait for store to load
  if (!isLoaded) {
    return <div className="min-h-screen bg-red-900 flex items-center justify-center text-yellow-500 text-2xl">加载中...</div>;
  }

  const currentPrize = prizes[currentPrizeIndex];
  const allWinners = Object.values(winners).flat();
  const availableEmployees = employees.filter(emp => !allWinners.includes(emp));

  const isAllDrawn = currentPrizeIndex >= prizes.length;

  const startDraw = () => {
    if (isAllDrawn || availableEmployees.length < currentPrize.count) {
      if (availableEmployees.length < currentPrize.count) {
        alert(`剩余人数不足！需要 ${currentPrize.count} 人，仅剩 ${availableEmployees.length} 人。`);
      }
      return;
    }
    
    setIsDrawing(true);
    
    // Play background music
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    intervalRef.current = window.setInterval(() => {
      const shuffled = [...availableEmployees].sort(() => 0.5 - Math.random());
      setCurrentDisplay(shuffled.slice(0, currentPrize.count));
    }, 50);
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Pause music
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Final selection
    const finalWinners = [...availableEmployees].sort(() => 0.5 - Math.random()).slice(0, currentPrize.count);
    setCurrentDisplay(finalWinners);
    
    setWinners(prev => ({
      ...prev,
      [currentPrize.id]: finalWinners
    }));

    // Trigger confetti
    triggerConfetti();
  };

  const nextPrize = () => {
    if (currentPrizeIndex < prizes.length) {
      setCurrentPrizeIndex(prev => prev + 1);
      setCurrentDisplay([]);
    }
  };

  const reset = () => {
    if (window.confirm('确定要重置所有抽奖记录吗？')) {
      setWinners({});
      setCurrentPrizeIndex(0);
      setCurrentDisplay([]);
      setIsDrawing(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ffd700', '#ff8c00']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ffd700', '#ff8c00']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-screen bg-red-900 text-white font-sans overflow-hidden relative selection:bg-yellow-500 selection:text-red-900">
      {/* Audio Element for BGM */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chinese-new-year-14251.mp3" 
        loop 
      />

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-600 rounded-full blur-[150px]"
        />
      </div>

      {/* Admin Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="absolute top-6 right-6 z-50 p-3 bg-red-950/50 hover:bg-red-800 backdrop-blur-md rounded-full border border-red-500/30 text-yellow-500 transition-all hover:scale-110 shadow-lg"
        title="后台管理"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-8 h-screen">
        
        {/* Main Draw Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-widest mb-4" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              2026 新春年会抽奖
            </h1>
            <p className="text-xl text-yellow-200/80 tracking-widest">
              龙腾虎跃 · 喜迎新春
            </p>
          </motion.div>

          {!isAllDrawn ? (
            <div className="w-full max-w-4xl flex flex-col items-center">
              <div className="mb-8 flex items-center gap-4 bg-red-950/50 px-8 py-4 rounded-full border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.3)] backdrop-blur-sm">
                {currentPrizeIndex === 0 && <Gift className="w-8 h-8 text-yellow-400" />}
                {currentPrizeIndex === 1 && <Trophy className="w-8 h-8 text-yellow-400" />}
                {currentPrizeIndex === 2 && <Crown className="w-8 h-8 text-yellow-400" />}
                <h2 className="text-3xl font-bold text-yellow-400 tracking-wider">
                  正在抽取：{currentPrize.name} ({currentPrize.count}名)
                </h2>
              </div>

              {/* Display Board */}
              <div className="w-full min-h-[300px] bg-red-800/40 backdrop-blur-md border-2 border-yellow-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)] flex items-center justify-center relative overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl"></div>

                <div className="flex flex-wrap justify-center gap-6">
                    {currentDisplay.length > 0 ? (
                      currentDisplay.map((name, idx) => (
                        <motion.div
                          key={isDrawing ? `slot-${idx}` : `winner-${name}`}
                          initial={isDrawing ? false : { scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className={`bg-gradient-to-br from-yellow-400 to-yellow-600 text-red-950 font-bold rounded-xl shadow-2xl border-2 border-yellow-200 flex items-center justify-center ${
                            currentPrize.count > 5 
                              ? 'text-2xl md:text-3xl py-3 px-6' 
                              : 'text-4xl md:text-5xl py-4 px-8'
                          }`}
                        >
                          {name}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-red-300/50 text-3xl font-light tracking-widest">
                        等待开奖...
                      </div>
                    )}
                </div>
              </div>

              {/* Controls */}
              <div className="mt-12 flex gap-6">
                {!isDrawing && !winners[currentPrize.id] ? (
                  <button
                    onClick={startDraw}
                    className="group relative px-12 py-4 bg-gradient-to-b from-yellow-400 to-yellow-600 text-red-950 font-bold text-2xl rounded-full shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <Play className="w-8 h-8 fill-current" />
                    开始抽奖
                  </button>
                ) : isDrawing ? (
                  <button
                    onClick={stopDraw}
                    className="group relative px-12 py-4 bg-gradient-to-b from-red-500 to-red-700 text-white font-bold text-2xl rounded-full shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-red-400"
                  >
                    <Square className="w-8 h-8 fill-current" />
                    停！
                  </button>
                ) : (
                  <button
                    onClick={nextPrize}
                    className="group relative px-12 py-4 bg-gradient-to-b from-yellow-400 to-yellow-600 text-red-950 font-bold text-2xl rounded-full shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    进入下一轮
                  </button>
                )}
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-6xl font-bold text-yellow-400 mb-8 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                抽奖圆满结束！
              </h2>
              <p className="text-2xl text-red-200 mb-12">恭喜所有中奖的幸运儿，祝大家新年快乐！</p>
              <button
                onClick={reset}
                className="px-8 py-3 bg-red-950 text-yellow-400 border border-yellow-500/50 rounded-full hover:bg-red-900 transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                重新开始
              </button>
            </motion.div>
          )}
        </div>

        {/* Sidebar: Winner History */}
        <div className="w-full lg:w-96 bg-red-950/60 backdrop-blur-xl border-l border-red-500/20 p-6 flex flex-col shadow-2xl rounded-3xl lg:rounded-none lg:rounded-l-3xl">
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3 border-b border-red-800 pb-4">
            <Crown className="w-6 h-6" />
            中奖名单
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {[...prizes].reverse().map((prize) => {
              const prizeWinners = winners[prize.id];
              if (!prizeWinners) return null;

              return (
                <motion.div 
                  key={prize.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-red-900/40 rounded-2xl p-4 border border-red-500/20"
                >
                  <div className="text-yellow-500 font-bold mb-3 text-lg">{prize.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {prizeWinners.map((winner, idx) => (
                      <span 
                        key={idx}
                        className="bg-red-800 text-yellow-100 px-3 py-1 rounded-lg text-sm border border-red-700/50"
                      >
                        {winner}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            
            {Object.keys(winners).length === 0 && (
              <div className="text-red-400/50 text-center py-10 italic">
                虚位以待...
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-red-800 text-red-300/60 text-sm flex justify-between">
            <span>总人数: {employees.length}</span>
            <span>剩余: {availableEmployees.length}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
