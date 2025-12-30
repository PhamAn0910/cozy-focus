import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element with a rain sound URL (using a free ambient sound)
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="glass-panel px-5 py-3 flex items-center gap-4"
    >
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Ambience
        </span>
        <span className="text-sm font-medium text-foreground">Rain Sounds</span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm hover:shadow transition-shadow"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-primary" />
        ) : (
          <Play className="w-4 h-4 text-primary ml-0.5" />
        )}
      </motion.button>

      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <Slider
          value={[volume]}
          onValueChange={(v) => setVolume(v[0])}
          max={100}
          step={1}
          className="w-20"
        />
      </div>
    </motion.div>
  );
}
