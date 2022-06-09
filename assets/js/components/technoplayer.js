// my-component.js
export default {
    data() {
        return {
            channels: [],
            sequencer: null,
            bpm: 120,
            playing: false,
            selection: {
                bassdrum: [
                    "kicks/sample1.wav",
                    "kicks/sample2.wav",
                    "kicks/sample3.wav"
                ],
                snares: [
                    "snares/snare1.wav"
                ],
                chat: [
                    "c_hats/chat1.wav",
                    "c_hats/chat2.wav",
                    "c_hats/chat3.wav"
                ],
                ohat: [
                    "o_hat/ohat1.wav",
                    "o_hat/ohat2.wav",
                    "o_hat/ohat3.wav"
                ],
                synth: [
                    "synth/syn1.wav",
                    "synth/syn2.wav",
                    "synth/syn3.wav",
                    "synth/syn4.wav"
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
        togglePlay() {
            if (this.playing) {
                this.pause();
            } else {
                this.play();
            }
        },
        play() {
            this.playing = true;
            if (this.sequencer === null) {
                var AudioContext = window.AudioContext || window.webkitAudioContext;
                var audioCtx = new AudioContext();
                this.audioCtx = audioCtx;
                this.sequencer = new Sequencer(audioCtx);
            }
            this.audioCtx.resume();
            this.sequencer.play(this.channels);
        },
        pause() {
            this.playing = false;
            this.sequencer.stop();
        },
        setBpm() {
            this.sequencer.setBpm(this.bpm);
        }
    }
}

class Sequencer extends EventTarget {

    sequencerFrameId = -1;
    bpm = 120;

    currentTick = 0;

    constructor(audioCtx) {
        super();

        this.analyser = audioCtx.createAnalyser();

        this.analyser.connect(audioCtx.destination);

        this.audioCtx = audioCtx;
        // oscillator.start();
    }
    setBpm(bpm) {
        this.bpm = bpm;
    }

    getCurrentData() {
        let array = new Uint8Array(1);

        this.analyser.getByteTimeDomainData(array);
        return array;
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
        this.startSequencer();
    }
    stop() {
        clearInterval(this.sequencerFrameId);
        this.dispatchEvent(new Event("stop"))
        this.currentTick = 0;
    }

    tick() {
        this.patterns.forEach((e) => {
            //console.log("tick", this.currentTick);
            if (e.getStep(this.currentTick)) {
                e.playSample();
            }
        })
        this.currentTick++;
    }

    startSequencer() {
        let start = -1;
        let flankeOld = false;

        const loop = (ts = Date.now()) => {
            if (start  == -1) {
                start = ts;
            }

            const delta = ts - start;
            const sixteenth = 30000 / this.bpm;

            const flanke = (delta % sixteenth) / sixteenth > 0.5;

            if (flankeOld !== flanke) {
                this.dispatchEvent(new Event("tick", this.getCurrentData()));
/*                 console.log(this.getCurrentData()); */
                this.tick(this.getCurrentData());
                flankeOld = flanke;
            }
            /* this.sequencerFrameId = setTimeout(loop, 10); */
        }

        this.sequencerFrameId = setInterval(loop, 1);
    }
}

class SRow {
    currentStep = 0;
    constructor(ctx, sample, steps, seq) {
        /* this.sample = ctx.createBufferSource(); */
        this.sample = sample;

        this.ctx = ctx;

        this.pattern = steps;
        this.parentSequencer = seq;
        console.log(this);
    }

    playLoop() {
            console.log(this.pattern.steps[this.currentStep % this.pattern.steps.length]);
            if (this.pattern.steps[this.currentStep % this.pattern.steps.length]) {
                this.playSample();
            }
            this.currentStep++;
        
    }

    getStep(step) {
        return this.pattern.steps[step % this.pattern.steps.length];
    }

    playSample() {
        const sample = this.ctx.createBufferSource();
        sample.buffer = this.sample;
        sample.connect(this.parentSequencer.analyser);
        sample.start();
    }
    /* stop() {
        this.parentSequencer.removeEventListener("tick", this.playLoop.bind(this))
    } */
    connectTo(dest) {
        this.sample.connect(dest);
    }
}