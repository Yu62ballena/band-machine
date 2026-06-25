"use client";

import { useAudioEngine } from '@/hooks/useAudioEngine';
import { ControlPanel } from '@/components/ControlPanel';
import { PlaybackControls } from '@/components/PlaybackControls';

export default function Home() {
  const {
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
    setStyle
  } = useAudioEngine();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Reverse Backing Machine
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Your personal practice companion. Select your key, scale, and groove, and start jamming instantly.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left Column: Controls */}
          <div>
            <ControlPanel
              bpm={bpm}
              setBpm={setBpm}
              keySelected={key}
              setKeySelected={setKey}
              scale={scale}
              setScale={setScale}
              style={style}
              setStyle={setStyle}
            />
          </div>

          {/* Right Column: Playback & Status */}
          <div className="space-y-6">
            <PlaybackControls
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              stop={stop}
              isLoaded={isLoaded}
            />

            {/* Status Panel */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-2 font-semibold">Current Setup</h3>
              <div className="text-2xl font-bold text-white mb-1">
                {key} {scale}
              </div>
              <div className="text-blue-400 font-medium">
                {bpm} BPM &bull; {style}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isLoaded ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                  <span className="text-sm text-slate-400">{isLoaded ? 'Engine Ready' : 'Loading Audio Engine...'}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-slate-500">
                <p>Note: Click Play to start the sequence. The 16-bar loop will run automatically.</p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
