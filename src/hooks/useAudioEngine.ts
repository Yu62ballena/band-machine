import { useState, useEffect, useCallback } from 'react';
import { audioEngine, Key, ScaleType, GrooveStyle } from '@/lib/audio';

export function useAudioEngine() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [bpm, setBpm] = useState(120);
    const [key, setKey] = useState<Key>('C');
    const [scale, setScale] = useState<ScaleType>('Major');
    const [style, setStyle] = useState<GrooveStyle>('8-Beat');

    useEffect(() => {
        // Initialize synths, but don't start the audio context yet
        const initAudio = async () => {
            await audioEngine.init(false); // Add a flag to init to skip Tone.start()
            setIsLoaded(true);
        };
        initAudio();

        return () => {
            audioEngine.stop();
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            audioEngine.updateSettings(bpm, key, scale, style);
        }
    }, [bpm, key, scale, style, isLoaded]);

    const togglePlay = useCallback(async () => {
        if (!isLoaded) return;

        if (isPlaying) {
            audioEngine.stop();
        } else {
            await audioEngine.startContext(); // Call Tone.start() on user interaction
            audioEngine.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, isLoaded]);

    const stop = useCallback(() => {
        if (!isLoaded) return;
        audioEngine.stop();
        setIsPlaying(false);
    }, [isLoaded]);

    return {
        isLoaded,
        isPlaying,
        togglePlay,
        stop,
        bpm,
        setBpm,
        key,
        setKey,
        scale,
        setScale,
        style,
        setStyle,
    };
}
