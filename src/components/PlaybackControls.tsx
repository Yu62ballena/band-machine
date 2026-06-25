import React from 'react';
import { Play, Square } from 'lucide-react';

interface PlaybackControlsProps {
    isPlaying: boolean;
    togglePlay: () => void;
    stop: () => void;
    isLoaded: boolean;
}

export function PlaybackControls({ isPlaying, togglePlay, stop, isLoaded }: PlaybackControlsProps) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex justify-center space-x-6">
            <button
                onClick={togglePlay}
                disabled={!isLoaded}
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${
                    !isLoaded
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : isPlaying
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.5)]'
                }`}
                title={isPlaying ? "Pause" : "Play / Loop"}
            >
                {isPlaying ? <Square size={24} className="fill-current" /> : <Play size={28} className="ml-1 fill-current" />}
            </button>

            <button
                onClick={stop}
                disabled={!isLoaded || !isPlaying}
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${
                    !isLoaded || !isPlaying
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                }`}
                title="Stop & Reset"
            >
                <Square size={24} className="fill-current" />
            </button>
        </div>
    );
}
