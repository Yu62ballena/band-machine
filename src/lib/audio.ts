import * as Tone from 'tone';

export type ScaleType = 'Major' | 'Natural Minor' | 'Minor Pentatonic';
export type GrooveStyle = '8-Beat' | '16-Beat';

export const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Key = typeof KEYS[number];

type ChordDef = { interval: number, quality: 'M7' | 'm7' | '7' | 'm' | 'M' | 'sus4' };

const progressions: Record<ScaleType, ChordDef[]> = {
  'Major': [
    { interval: 0, quality: 'M7' }, // I
    { interval: 7, quality: '7' },  // V
    { interval: 9, quality: 'm7' }, // vi
    { interval: 5, quality: 'M7' }, // IV
    { interval: 0, quality: 'M7' }, // I
    { interval: 7, quality: '7' },  // V
    { interval: 9, quality: 'm7' }, // vi
    { interval: 5, quality: 'M7' }, // IV
    { interval: 2, quality: 'm7' }, // ii
    { interval: 7, quality: '7' },  // V
    { interval: 0, quality: 'M7' }, // I
    { interval: 9, quality: 'm7' }, // vi
    { interval: 5, quality: 'M7' }, // IV
    { interval: 7, quality: '7' },  // V
    { interval: 0, quality: 'M7' }, // I
    { interval: 0, quality: 'M7' }, // I
  ],
  'Natural Minor': [
    { interval: 0, quality: 'm7' }, // i
    { interval: 8, quality: 'M7' }, // VI
    { interval: 10, quality: '7' }, // VII
    { interval: 3, quality: 'M7' }, // III
    { interval: 0, quality: 'm7' }, // i
    { interval: 8, quality: 'M7' }, // VI
    { interval: 10, quality: '7' }, // VII
    { interval: 3, quality: 'M7' }, // III
    { interval: 5, quality: 'm7' }, // iv
    { interval: 0, quality: 'm7' }, // i
    { interval: 8, quality: 'M7' }, // VI
    { interval: 10, quality: '7' }, // VII
    { interval: 5, quality: 'm7' }, // iv
    { interval: 10, quality: '7' }, // VII
    { interval: 0, quality: 'm7' }, // i
    { interval: 0, quality: 'm7' }, // i
  ],
  'Minor Pentatonic': [
    { interval: 0, quality: 'm7' }, // i
    { interval: 3, quality: 'M' },  // III
    { interval: 5, quality: 'm7' }, // iv
    { interval: 7, quality: 'm7' }, // v
    { interval: 0, quality: 'm7' },
    { interval: 3, quality: 'M' },
    { interval: 5, quality: 'm7' },
    { interval: 7, quality: 'm7' },
    { interval: 10, quality: 'M' }, // VII
    { interval: 7, quality: 'm7' }, // v
    { interval: 0, quality: 'm7' },
    { interval: 0, quality: 'm7' },
    { interval: 5, quality: 'm7' },
    { interval: 7, quality: 'm7' },
    { interval: 0, quality: 'm7' },
    { interval: 0, quality: 'm7' },
  ]
};

function getChordNotes(rootNoteIndex: number, chordDef: ChordDef, octave: number = 4): string[] {
    const rootIndex = (rootNoteIndex + chordDef.interval) % 12;
    const rootOctave = octave + Math.floor((rootNoteIndex + chordDef.interval) / 12);

    const notes: string[] = [];
    const getNote = (semitones: number) => {
        const i = (rootIndex + semitones) % 12;
        const o = rootOctave + Math.floor((rootIndex + semitones) / 12);
        return `${KEYS[i]}${o}`;
    };

    notes.push(getNote(0)); // Root

    switch (chordDef.quality) {
        case 'M':
            notes.push(getNote(4));
            notes.push(getNote(7));
            break;
        case 'm':
            notes.push(getNote(3));
            notes.push(getNote(7));
            break;
        case 'M7':
            notes.push(getNote(4));
            notes.push(getNote(7));
            notes.push(getNote(11));
            break;
        case 'm7':
            notes.push(getNote(3));
            notes.push(getNote(7));
            notes.push(getNote(10));
            break;
        case '7':
            notes.push(getNote(4));
            notes.push(getNote(7));
            notes.push(getNote(10));
            break;
        case 'sus4':
            notes.push(getNote(5));
            notes.push(getNote(7));
            break;
    }

    return notes;
}

export class AudioEngine {
    private isPlaying = false;
    private rootKey: Key = 'C';
    private scale: ScaleType = 'Major';
    private style: GrooveStyle = '8-Beat';

    private kick!: Tone.MembraneSynth;
    private snare!: Tone.NoiseSynth;
    private hihat!: Tone.MetalSynth;
    private bass!: Tone.MonoSynth;
    private chordSynth!: Tone.PolySynth;

    private transportEventId: number | null = null;

    constructor() {}

    async startContext() {
        await Tone.start();
    }

    async init(startContext: boolean = true) {
        if (startContext) {
            await Tone.start();
        }

        if (this.kick) return; // already initialized

        this.kick = new Tone.MembraneSynth().toDestination();
        this.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
        }).toDestination();
        this.hihat = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        this.hihat.volume.value = -10;

        this.bass = new Tone.MonoSynth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 },
            filter: { Q: 1, type: "lowpass", rolloff: -24 },
            filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.1, baseFrequency: 100, octaves: 2 }
        }).toDestination();
        this.bass.volume.value = -5;

        this.chordSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 1 }
        }).toDestination();
        this.chordSynth.volume.value = -15;

        Tone.Transport.timeSignature = [4, 4];
    }

    updateSettings(bpm: number, key: Key, scale: ScaleType, style: GrooveStyle) {
        Tone.Transport.bpm.value = bpm;
        this.rootKey = key;
        this.scale = scale;
        this.style = style;

        if (this.isPlaying) {
            this.stop();
            this.play();
        }
    }

    private setupSequences() {
        if (this.transportEventId !== null) {
            Tone.Transport.clear(this.transportEventId);
        }

        const rootIndex = KEYS.indexOf(this.rootKey);
        const progression = progressions[this.scale];

        let ticks = 0;

        this.transportEventId = Tone.Transport.scheduleRepeat((time) => {
            const bar = Math.floor(ticks / 16) % 16;
            const step = ticks % 16;
            const sixteenth = ticks % 4;

            const currentChordDef = progression[bar];

            // Chords
            if (step === 0) {
                const chordNotes = getChordNotes(rootIndex, currentChordDef, 4);
                this.chordSynth.triggerAttackRelease(chordNotes, "1m", time);
            }

            // Bass
            const bassRootIndex = (rootIndex + currentChordDef.interval) % 12;
            const bassRootOctave = 2 + Math.floor((rootIndex + currentChordDef.interval) / 12);
            const bassNote = `${KEYS[bassRootIndex]}${bassRootOctave}`;
            const bassFifthIndex = (bassRootIndex + 7) % 12;
            const bassFifthOctave = 2 + Math.floor((rootIndex + currentChordDef.interval + 7) / 12);
            const bassFifth = `${KEYS[bassFifthIndex]}${bassFifthOctave}`;

            if (this.style === '8-Beat') {
                if (sixteenth === 0 || sixteenth === 2) {
                    this.bass.triggerAttackRelease(bassNote, "8n", time);
                }
            } else if (this.style === '16-Beat') {
                const pattern = {
                    0: bassNote,
                    3: bassNote,
                    6: bassNote,
                    8: bassNote,
                    10: bassFifth,
                    13: bassNote,
                    14: bassFifth
                };
                if (step in pattern) {
                    this.bass.triggerAttackRelease(pattern[step as keyof typeof pattern], "16n", time);
                }
            }

            // Drums
            if (this.style === '8-Beat') {
                if (step === 0 || step === 8) {
                    this.kick.triggerAttackRelease("C1", "8n", time);
                }
                if (step === 4 || step === 12) {
                    this.snare.triggerAttackRelease("8n", time);
                }
                if (sixteenth === 0 || sixteenth === 2) {
                    this.hihat.triggerAttackRelease("16n", time);
                }
            } else if (this.style === '16-Beat') {
                if ([0, 3, 8, 11].includes(step)) {
                    this.kick.triggerAttackRelease("C1", "8n", time);
                }
                if ([4, 12].includes(step)) {
                    this.snare.volume.value = 0;
                    this.snare.triggerAttackRelease("8n", time);
                } else if ([7, 15].includes(step)) {
                    this.snare.volume.value = -15;
                    this.snare.triggerAttackRelease("16n", time);
                }
                if (![4, 12].includes(step)) {
                    this.hihat.triggerAttackRelease("16n", time);
                }
            }

            ticks++;
        }, "16n");
    }

    play() {
        if (!this.isPlaying) {
            this.setupSequences();
            Tone.Transport.start();
            this.isPlaying = true;
        }
    }

    stop() {
        if (this.isPlaying) {
            Tone.Transport.stop();
            if (this.transportEventId !== null) {
                Tone.Transport.clear(this.transportEventId);
            }
            this.isPlaying = false;
            this.chordSynth.releaseAll();
        }
    }
}

export const audioEngine = new AudioEngine();
