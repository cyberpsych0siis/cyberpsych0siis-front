import { Dot } from './models/dot.js';
import TechnoPlayer from './components/technoplayer.js';
import MouseHandler from './handler/mouseHandler.js';
import renderGlResult from './renderer/renderGlResult.js';
import renderResult from './renderer/render2dResult.js';

function typerEffect(ch, elem) {
    return new Promise((res, rej) => {
        elem.dataset.text += ch;
        elem.innerText += ch;
        setTimeout(res, 100);
    });
}

window.addEventListener("load", () => {
    const METHOD = "2d";

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

    (async function() {
        const title_ = document.querySelector("#pagetitle");
        const ptitle = new URL(location.href).hostname;

        for (const c of ptitle) {
            await typerEffect(c, title_);
            console.log("--- tick ---");
        }
    })();

    if (window.Worker) {
        MouseHandler(dots);

        const mapper = new Worker("assets/js/workers/worker.js");

        const callback = (ts) => {
            setCSS(ts);
            setTimeout(() => {

                mapper.postMessage({
                    action: "processConnections",
                    dots: dots.map(e => { return e.serialize(ts, window.innerWidth, window.innerHeight); })
                });
            }, 10);
        }

        mapper.onmessage = (e) => {
            //render result
            if (METHOD == "2d") {


                renderResult(context, e.data.dots, e.data.conn).then(e => {
                    requestAnimationFrame(callback);
                });
            } else if (METHOD == "webgl") {
                if (context === null) {
                    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                    return;
                } else {
                    renderGlResult(context, e.data.dots, e.data.conn).then(e => {
                        requestAnimationFrame(callback);
                    });
                }
            }
        }

        const { createApp } = Vue;

        createApp(TechnoPlayer).mount('#app')

        requestAnimationFrame(callback);
    } else {
        console.error("Workers are not supported");
        const fallbackCallback = (ts) => {
            const d = dots.map(e => {
                return e.serialize(0, window.innerWidth, window.innerHeight);
            });

            renderResult(context, d);

            requestAnimationFrame(fallbackCallback);
        }

        requestAnimationFrame(fallbackCallback);
    }
});

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