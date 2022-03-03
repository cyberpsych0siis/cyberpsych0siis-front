const dots = [];

let c, context;

window.onload = () => {
    c = document.getElementById("bganim");
    context = c.getContext("2d");

    c.height = window.innerHeight;
    c.width = window.innerWidth;
    context.imageSmoothingEnabled = false;
    // console.log(context);
    // context.fillStyle = "green";
    // context.fillRect(0, 0, c.clientWidth, c.clientHeight);

    window.addEventListener("resize", (e) => {
        c.height = window.innerHeight;
        c.width = window.innerWidth;
    });

    for (let i = 0; i < 20; i++) {
        dots.push(generateDot());
    }

    requestAnimationFrame(draw);
    console.log(dots);
}

function generateDot(x = null, y = null) {
    return {
        x: x != null ? x : parseInt(
            (Math.random() * 100)
        ),
        y: y != null ? y : parseInt(
            (Math.random() * 100)
        ),
        r: parseInt(
            (Math.random() * 10) + 2
        ),
        getRadius: function (ts) {
            // if (ts < 10000) return (ts / 1000) * this.r;

            // return this.r;
            return Math.abs(Math.sin(this.seed + ts / 1000) * this.r);
        },
        xMode: ["sin", "cos"][parseInt(Math.random() * 2)],
        yMode: ["sin", "cos"][parseInt(Math.random() * 2)],
        xSinMod: (Math.random() * 100) + 1000,
        ySinMod: (Math.random() * 100) + 1000,
        getX: function (ts) {
            return (Math[this.xMode](this.seed + ts / this.xSinMod) * this.r) + ((this.x / 100) * window.innerWidth);
        },
        getY: function (ts) {
            return (Math[this.yMode](this.seed + ts / this.ySinMod) * this.r) + ((this.y / 100) * window.innerHeight);
            // return this.y;
        },
        getColor: function (ts) {
            const alpha = (this.getRadius(ts) / this.r);
            // console.log(alpha);
            // debugger;
            // return "rgba(255,0,0," + alpha + ")";
            return "rgb(" + (alpha * 255) + ",0,0)";
        },
        seed: genSeed(),
        connections: []
    }
}

function genSeed() {
    return parseInt(Math.random() * 90);
}

let lastRun = 0;
let frameCount = 0;

let dotsOnScreen = 0;
let lastDotDrawn = 0;

function draw(ts) {
    const fraction = 1000 / 60;
    if (ts > lastRun + fraction) {
        lastRun = ts;
        frameCount++;

        clear();
        logic(ts);
        // if (ts > 1000) {
        connectDots(ts);
        // } */
        // drawDots(ts);
    }
    // drawFPS(ts);

    requestAnimationFrame(draw);
}

function drawDots(ts) {
    for (let dot of dots) {
        context.fillStyle = dot.getColor(ts);
        context.beginPath();
        context.arc(dot.getX(ts), dot.getY(ts), dot.getRadius(ts), 0, 2 * Math.PI);
        context.fill();
    }
}

function connectDots(ts) {
    for (let currentDot of dots) {
        let filteredDots = dots.filter(e => {
            return e !== currentDot;
        }).sort((a, b) => {
            if (a.getRadius(ts) < b.getRadius(ts)) return 1;
            if (a.getRadius(ts) > b.getRadius(ts)) return 0;
        });

        for (let f of filteredDots) {
            f.connections = [];
        }

        for (const destination of filteredDots) {
            if (destination.connections.indexOf(currentDot) == -1) {
                context.strokeStyle = createGradientForConnection(ts, currentDot, destination);
                context.beginPath();
                context.moveTo(currentDot.getX(ts), currentDot.getY(ts));
                context.lineTo(destination.getX(ts), destination.getY(ts));
                context.lineWidth = 1;
                context.stroke();
                destination.connections.push(dots.indexOf(currentDot));
            }

        }
    }
}

function drawFPS(ts) {
    const delta = (lastRun - ts) / 1000;
    context.fillStyle = getCSSVariable("--foreground-color");
    context.font = "24px VT323";
    context.fillText("Frames: " + (1 / delta), 50, 50);
}

function logic(ts) {
/*     for (let d of dots) {
        let rad = d.getRadius(ts) * 100;
        if (d.y < 0 /* && (rad > 0 && rad < 10) *) {
            //object is off screen
            let dotIndex = dots.indexOf(d);
            dots.splice(dotIndex, 1);
            console.log(dots);
            // break;
        } else {
            d.y -= 0.1;
        }

    } */
}

function spawnNewRandomDot() {
    const y = 110;
    const x = parseInt(Math.random() * 100);
    dots.push(generateDot(x, y));
}

function createGradientForConnection(ts, curr, dest) {
    // createRadialGradient(x,y,r,x1,y1,r1) 
    const gradient = context.createRadialGradient(curr.getX(ts), curr.getY(ts), 1, dest.getX(ts), dest.getY(ts), 1);
    gradient.addColorStop(0, curr.getColor(ts));
    gradient.addColorStop(1, dest.getColor(ts));

    return gradient;
}

function clear() {
    // console.log(context);
    context.fillStyle = getCSSVariable("--background-color");
    context.fillRect(0, 0, c.clientWidth, c.clientHeight);
}

function getCSSVariable(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim();
}