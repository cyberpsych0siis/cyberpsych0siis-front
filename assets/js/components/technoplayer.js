// my-component.js
export default {
    data() {
        return {
            channels: [],
            sequencer: null,
            bpm: 120,
            selection: {
                bassdrum: [
                    "sample.wav",
                    "sample1.wav",
                    "sample2.wav",
                    "sample3.wav"
                ]
            }
        }
    },
    methods: {
        setSample(r) {
            console.log(r)
        },
        toggleStep(row, step) {
            // this.channels[row].steps[step].selected = 
            console.log(row, step);
        },
        addChannel() {
            this.channels.push({
                sample: this.selection.bassdrum[0],
                steps: new Array(16).fill(false)
            });
        },
        getStep(row, step) {
            return this.channels[row].steps[step];
        },
        removeChannel(index) {
            this.channels = this.channels.filter((e, i) => {
                return i != index;
            });
        },
        log(data) {
            console.log(data);
        },
        play() {
            /*             this.sequencer.postMessage({
                            "action": "play",
                            "data": JSON.stringify(this.channels)
                        }); */
            if (this.sequencer === null) {
                this.sequencer = new Sequencer();
            }
            this.sequencer.play(this.channels);
            // this.sequencer.togglePlay();
        },
        setBpm() {
            this.sequencer.setBpm(this.bpm);
        }
    }
}

class Sequencer {

    constructor() {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx = new AudioContext();

        // const oscillator = audioCtx.createOscillator();

        // const gain = audioCtx.createGain();
        // gain.value = 0.4;
        // oscillator.connect(gain);
        // gain.connect(audioCtx.destination);

        this.audioCtx = audioCtx;
        // oscillator.start();
    }
    setBpm(bpm) {
        this.bpm = bpm;
    }

    async play(data) {
        this.patterns = [];
        for (let d of data) {
            let file = await fetch("assets/samples/" + d.sample);
            console.log(file);
            const aBuffer = await this.audioCtx.decodeAudioData(await file.arrayBuffer());

            console.log(aBuffer);
            this.patterns.push(new SRow(this.audioCtx, aBuffer, d, this));
        }
        this.togglePlay();
    }


    togglePlay() {
        this.patterns.forEach(e => {
            console.log(e);
            e.connectTo(this.audioCtx.destination);
            e.play();
        });
        this.audioCtx.resume();
    }
}

class SRow {
    constructor(ctx, sample, steps, seq) {
        this.sample = ctx.createBufferSource();
        this.sample.buffer = sample;

        this.pattern = steps;
        this.parentSequencer = seq;

        console.log(this);
    }

    getPattern(step) {
        return this.pattern[step];
    }

    play() {
        this.sample.start();
    }
    connectTo(dest) {
        this.sample.connect(dest);
    }
}