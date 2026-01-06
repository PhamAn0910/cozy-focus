import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioContextRefs {
  ctx: AudioContext;
  oscillator: OscillatorNode;
  pulseOscillator: OscillatorNode;
  gainNode: GainNode;
}

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioContextRef = useRef<AudioContextRefs | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        const { oscillator, pulseOscillator, ctx } = audioContextRef.current;
        try {
          oscillator.stop();
          pulseOscillator.stop();
          ctx.close();
        } catch (e) {
          // Already stopped
        }
        audioContextRef.current = null;
      }
    };
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    if (audioContextRef.current) {
      audioContextRef.current.gainNode.gain.value = volume / 100;
    }
  }, [volume]);

  const startGamma40Hz = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // 1. Create the "Carrier Tone" (440Hz - A4 note, pleasant to hear)
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;

    // 2. Create the main gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume / 100;

    // 3. Create the "40Hz Pulse" (The Gamma effect)
    const pulseOscillator = ctx.createOscillator();
    pulseOscillator.type = 'sine'; // Sine wave for smooth modulation (MIT-style)
    pulseOscillator.frequency.value = 40; // The Magic 40Hz frequency

    // 4. Create a gain node to handle the pulsing amplitude
    const pulseGain = ctx.createGain();
    pulseGain.gain.value = 0.3; // Reduced depth for smooth, fatigue-free listening

    // 5. Connect: Pulse controls the Volume of the Carrier
    pulseOscillator.connect(pulseGain);
    pulseGain.connect(gainNode.gain);

    // 6. Connect to speakers
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 7. Start everything
    oscillator.start();
    pulseOscillator.start();

    audioContextRef.current = { ctx, oscillator, pulseOscillator, gainNode };
  };

  const stopGamma40Hz = () => {
    if (audioContextRef.current) {
      const { oscillator, pulseOscillator, ctx } = audioContextRef.current;
      try {
        oscillator.stop();
        pulseOscillator.stop();
        ctx.close();
      } catch (e) {
        // Already stopped
      }
      audioContextRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopGamma40Hz();
    } else {
      startGamma40Hz();
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
          Focus Primer
        </span>
        <span className="text-sm font-medium text-foreground">40Hz Gamma</span>
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
