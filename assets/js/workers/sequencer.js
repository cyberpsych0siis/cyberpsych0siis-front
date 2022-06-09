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