import React from 'react';
import { Key, ScaleType, GrooveStyle, KEYS } from '@/lib/audio';

interface ControlPanelProps {
    bpm: number;
    setBpm: (bpm: number) => void;
    keySelected: Key;
    setKeySelected: (key: Key) => void;
    scale: ScaleType;
    setScale: (scale: ScaleType) => void;
    style: GrooveStyle;
    setStyle: (style: GrooveStyle) => void;
}

const SCALES: ScaleType[] = ['Major', 'Natural Minor', 'Minor Pentatonic'];
const STYLES: GrooveStyle[] = ['8-Beat', '16-Beat'];

export function ControlPanel({
    bpm, setBpm, keySelected, setKeySelected, scale, setScale, style, setStyle
}: ControlPanelProps) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Settings</h2>

            <div className="space-y-4">
                {/* BPM Control */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-slate-300">Tempo (BPM)</label>
                        <span className="text-sm font-bold text-blue-400">{bpm}</span>
                    </div>
                    <input
                        type="range"
                        min="40"
                        max="240"
                        value={bpm}
                        onChange={(e) => setBpm(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* Key Control */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-slate-300">Root Key</label>
                    <select
                        value={keySelected}
                        onChange={(e) => setKeySelected(e.target.value as Key)}
                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        {KEYS.map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                </div>

                {/* Scale Control */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-slate-300">Scale</label>
                    <select
                        value={scale}
                        onChange={(e) => setScale(e.target.value as ScaleType)}
                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        {SCALES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Style Control */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-slate-300">Groove Style</label>
                    <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value as GrooveStyle)}
                        className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                        {STYLES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
