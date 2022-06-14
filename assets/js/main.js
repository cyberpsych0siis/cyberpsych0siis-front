import { Dot } from './models/dot.js';
import TechnoPlayer, { getCurrentData } from './components/technoplayer.js';
import MouseHandler from './handler/mouseHandler.js';
import renderGlResult from './renderer/renderGlResult.js';
import renderResult from './renderer/render2dResult.js';
import { generateLines } from './workers/worker.js';

function typerEffect(ch, elem) {
    return new Promise((res, rej) => {
        elem.dataset.text += ch;
        elem.innerText += ch;
        setTimeout(res, 50);
    });
}

window.addEventListener("load", () => {

    document.querySelectorAll(".no-js").forEach((v) => {
        console.log(v);
        v.classList.remove("no-js");
    });

    let params = new URLSearchParams(location.search);
    console.log(params.get("usegl"));
    const METHOD = params.get("usegl") != null ? "webgl" : "2d";

    const canvas = document.querySelector("#bganim");
    let context = null;

    if (METHOD == "webgl") {
        context = canvas.getContext("webgl2");
    } else {
        context = canvas.getContext("2d");
    }

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context.imageSmoothingEnabled = true;

    let frameCount = 0;
    let lastRun = 0;

    window.addEventListener("resize", (e) => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });

    const dots = new Array();
    for (let i = 0; i < 20; i++) {
        const y = parseInt(Math.random() * 100);
        const x = parseInt(Math.random() * 100);
        dots.push(new Dot(i, x, y));
    }

    (async function () {
        const title_ = document.querySelector("#pagetitle");
        //const ptitle = new URL(location.href).hostname;
        const ptitle = "./rillo5000";

        for (const c of ptitle) {
            await typerEffect(c, title_);
        }

        unhideAnimation();
    })();

    animLoop(context, dots);

    MouseHandler(dots);

    const { createApp } = Vue;

    const playerApp = createApp(TechnoPlayer);

    // playerApp.use(store());

    playerApp.mount('#playerapp');

    hljs.highlightAll()
});

function unhideAnimation() {
    document.querySelector("#bganim").classList.remove("opacity-hide");
}

function setCSS(ts) {
    document.querySelectorAll(".hue-rotate").forEach(e => {
        e.style.webkitFilter = "hue-rotate(" + (ts / 100) % 360 + "deg)";
    });

    document.querySelectorAll(".blurfx").forEach(e => {
        e.style.webkitFilter += "blur(" + (ts % 500) / 100 + "px)";
    });
}

export function getCSSVariable(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim();
}

function animLoop(context, dots) {
    //const mapper = new Worker("assets/js/workers/worker.js");

    let lastRun = 0;

    console.log(context);

    //render result
    const callbackLocal = async (ts) => {

        const delta = ts - lastRun;
        if (delta > parseInt(minimalRedrawTime())) {
            if (context instanceof CanvasRenderingContext2D) {
                let dotsSerial = dots.map(e => { return e.serialize(ts, window.innerWidth, window.innerHeight); })
                let lines = generateLines(dotsSerial);

                await renderResult(context, dotsSerial, lines);
            } else if (context instanceof WebGL2RenderingContext) {
                let dotsSerial = dots.map(e => { return e.serialize(ts, 100, 100); })
                let lines = generateLines(dotsSerial);

                await renderGlResult(context, dotsSerial, lines);
            }

            lastRun = ts;
        }
        requestAnimationFrame(callbackLocal);
    }

    requestAnimationFrame(callbackLocal);
}
function minimalRedrawTime() {
    const targetFPS = 30;
    return (1000 / 60) * (60 / targetFPS) - (1000 / 60) * 0.5;
}