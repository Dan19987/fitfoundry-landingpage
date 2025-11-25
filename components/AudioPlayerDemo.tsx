import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Mic, Activity } from 'lucide-react';

interface AudioPlayerDemoProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  intensity?: string;
  voiceName?: string;
  src: string; // Added src prop for real audio file
}

const AudioPlayerDemo: React.FC<AudioPlayerDemoProps> = ({
  title,
  description,
  icon,
  intensity,
  voiceName,
  src,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const current = audio.currentTime;
      const total = audio.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-brand-surface/70 backdrop-blur-md border border-brand-border rounded-2xl p-6 hover:border-brand-orange/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-orange/5">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark shadow-lg shadow-brand-gold/20">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-text">{title}</h3>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-4 relative overflow-hidden">
        {/* Progress Bar Background */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full bg-brand-orange transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold to-orange-400 flex items-center justify-center text-brand-dark hover:scale-110 transition-transform shadow-lg shrink-0"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-brand-text truncate">{title}</p>
            <p className="text-sm text-brand-muted truncate italic">"{description}"</p>
          </div>

          <div className="text-brand-orange animate-pulse">
             {isPlaying ? <Activity size={20} /> : <Volume2 size={20} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs md:text-sm pt-2 border-t border-brand-border/50">
        <div className="flex justify-between items-center text-brand-muted">
          <span>Intensität</span>
          <span className="font-bold text-brand-gold">{intensity || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center text-brand-muted">
          <span>Voice</span>
          <span className="font-bold text-brand-gold">{voiceName || 'System'}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerDemo;