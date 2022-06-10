import { getCSSVariable } from "../main.js";

export default (context, dots, connections) => {
    return new Promise((res, rej) => {
        context.fillStyle = getCSSVariable("--background-color");
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // debugger;

        // console.log(Sequencer.getCurrentData());

        for (let dot of dots) {
            context.fillStyle = dot.c;
            context.beginPath();
            context.arc((dot.x), dot.y, dot.r, 0, 2 * Math.PI);
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
    // console.log(curr.x, curr.y, 100, dest.x, dest.y, 100);
    const gradient = context.createRadialGradient(curr.x, curr.y, 100, dest.x, dest.y, 100);
    gradient.addColorStop(0, curr.c);
    gradient.addColorStop(1, dest.c);

    return gradient;
}