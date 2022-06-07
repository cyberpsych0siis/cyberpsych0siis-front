import { Dot } from './dot.js';
import TechnoPlayer from './technoplayer.js';

window.addEventListener("load", () => {
    const canvas = document.querySelector("#bganim");
    const context = canvas.getContext("2d");

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

    if (window.Worker) {
        const worker = new Worker("assets/js/workers/worker.js");

        const callback = (ts) => {
            //const fraction = 1000 / 60;
            //frameCount++;
            //if (ts > (lastRun + fraction)) {
                setCSS(ts);
                worker.postMessage({
                    action: "processConnections",
                    dots: dots.map(e => { return e.serialize(ts, window.innerWidth, window.innerHeight); })
                });
            //}
        }

        worker.onmessage = (e) => {
            //render result
            renderResult(context, e.data.dots, e.data.conn).then(e => {
                requestAnimationFrame(callback);
            });
        }

        const { createApp } = Vue

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
/**
 * 
 * @param {CanvasContext2D} context 
 * @param {*} dots 
 */
const renderResult = (context, dots, connections) => {
    return new Promise((res, rej) => {
        context.fillStyle = getCSSVariable("--background-color");
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (let dot of dots) {
            context.fillStyle = dot.c;
            context.beginPath();
            context.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
            context.fill();
        }

        for (const c of connections) {
            const from = dots[c.from];
            const to = dots[c.to];

            context.strokeStyle = createGradientForConnection(context, from, to);
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.lineWidth = 1;
            context.stroke();
        }
        res();
    });
}

const createGradientForConnection = (context, curr, dest) => {
    // createRadialGradient(x,y,r,x1,y1,r1) 
    const gradient = context.createRadialGradient(curr.x, curr.y, 100, dest.x, dest.y, 100);
    gradient.addColorStop(0, curr.c);
    gradient.addColorStop(1, dest.c);

    return gradient;
}

function setCSS(ts) {
    document.querySelectorAll(".hue-rotate").forEach(e => {
        e.style.webkitFilter = "hue-rotate(" + (ts / 100) % 360 + "deg)";
    });

    document.querySelectorAll(".blurfx").forEach(e => {
        e.style.webkitFilter += "blur(" + (ts % 500) / 100 + "px)";
    });
}

function getCSSVariable(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim();
}

