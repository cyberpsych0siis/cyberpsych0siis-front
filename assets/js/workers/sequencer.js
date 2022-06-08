let seq = null;

addEventListener("message", (e) => {
    console.log(e);

    console.log(AudioContext);
    
/*     switch(e.action) {
        case "play":
            seq = new Sequencer(JSON.parse(e.data));
            break;
    } */
});

function audioLoop() {
    //loop 44100 times a second
}

/* class Sequencer {
    constructor(data) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioCtx = new AudioContext();

        const oscillator = audioCtx.createOscillator();

        const gain = audioCtx.createGain();
        oscillator.connect(gain);
        gain.gain = 0.4;
        gain.connect(audioCtx.destination);
        oscillator.connect(audioCtx.destination);
        audioCtx.resume();
    }
} */