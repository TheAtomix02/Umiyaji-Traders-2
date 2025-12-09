import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioPlayer = () => {
    const [isMuted, setIsMuted] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const ambientOscRef = useRef<any>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            // Master Gain
            const gain = audioContextRef.current.createGain();
            gain.connect(audioContextRef.current.destination);
            gain.gain.value = 0; // Start silent
            gainNodeRef.current = gain;

            // Ambient Drone (Brown Noise approximation via buffer or simple oscillators)
            // Low bloom drone
            const osc1 = audioContextRef.current.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.value = 50; // Deep bass

            const osc2 = audioContextRef.current.createOscillator();
            osc2.type = 'triangle';
            osc2.frequency.value = 52; // Binaural beat interference

            const droneGain = audioContextRef.current.createGain();
            droneGain.gain.value = 0.05; // Very subtle

            osc1.connect(droneGain);
            osc2.connect(droneGain);
            droneGain.connect(gain);

            osc1.start();
            osc2.start();

            ambientOscRef.current = { osc1, osc2 };
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const toggleMute = () => {
        if (isMuted) {
            initAudio();
            // Fade in
            gainNodeRef.current?.gain.setTargetAtTime(0.3, audioContextRef.current!.currentTime, 2);
            setIsMuted(false);
        } else {
            // Fade out
            gainNodeRef.current?.gain.setTargetAtTime(0, audioContextRef.current!.currentTime, 0.5);
            setTimeout(() => {
                setIsMuted(true);
            }, 500);
        }
    };

    // Click Sound Effect
    useEffect(() => {
        if (isMuted) return;

        const playClick = () => {
            if (audioContextRef.current && !isMuted) {
                const osc = audioContextRef.current.createOscillator();
                const gain = audioContextRef.current.createGain();

                osc.connect(gain);
                gain.connect(audioContextRef.current.destination);

                // High frequency elegant blip
                osc.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioContextRef.current.currentTime + 0.05);

                gain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.05);

                osc.start();
                osc.stop(audioContextRef.current.currentTime + 0.05);
            }
        };

        window.addEventListener('click', playClick);
        return () => window.removeEventListener('click', playClick);
    }, [isMuted]);

    return (
        <button
            onClick={toggleMute}
            className="fixed bottom-8 left-8 z-50 text-white/50 hover:text-white transition-colors"
        >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
    );
};
