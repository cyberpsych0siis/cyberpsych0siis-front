const dots = [];

const CONNECTED_RADIUS = 450;

let c, context;

let circle = true;

function circleOn() {
    circle = true;
}

function circleOff() {
    circle = false;
}

window.onload = () => {
    c = document.getElementById("bganim");
    context = c.getContext("2d");

    c.height = window.innerHeight;
    c.width = window.innerWidth;
    context.imageSmoothingEnabled = false;

    window.addEventListener("resize", (e) => {
        c.height = window.innerHeight;
        c.width = window.innerWidth;
    });

    for (let i = 0; i < 20; i++) {
        dots.push(generateDot(i));
    }

    requestAnimationFrame(draw);
    console.log(dots);
}

function generateDot(i, x = null, y = null) {
    return {
        index: i,
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
            return Math.abs(Math.sin(this.seed + ts / 1000) * this.r);
        },
        xMode: ["sin", "cos"][parseInt(Math.random() * 2)],
        yMode: ["sin", "cos"][parseInt(Math.random() * 2)],
        xSinMod: (Math.random() * 100) + 1000,
        ySinMod: (Math.random() * 100) + 1000,
        getX: function (ts, circled = false) {
            return circled
                ? (window.innerWidth / 2) + Math.sin((ts / 4000) + this.index/(20 - 10) * 4) * CONNECTED_RADIUS
                : (Math[this.xMode](this.seed + ts / this.xSinMod) * this.r) + ((this.x / 100) * window.innerWidth);
        },
        getY: function (ts, circled = false) {
            const wigglePos = (Math[this.yMode](this.seed + ts / this.ySinMod) * this.r) + ((this.y / 100) * window.innerHeight);
            return circled
                ? (window.innerHeight / 2) +Math.cos((ts / 4000) + this.index/(20 - 10) * 4) * CONNECTED_RADIUS
                : wigglePos 
                ;
        },
        getColor: function (ts) {
            const alpha = (this.getRadius(ts) / this.r);
            return circle ? 
            "blue"
            :"rgb(" + (alpha * 255) + ",0,0)";
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
        drawDots(ts);
    }
    // drawFPS(ts);

    requestAnimationFrame(draw);
}

function drawDots(ts) {
    for (let dot of dots) {
        context.fillStyle = dot.getColor(ts);
        context.beginPath();
        context.arc(dot.getX(ts, circle), dot.getY(ts, circle), dot.getRadius(ts), 0, 2 * Math.PI);
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
                context.strokeStyle = circle ? destination.getColor(ts) : createGradientForConnection(ts, currentDot, destination);
                context.beginPath();
                context.moveTo(currentDot.getX(ts, circle), currentDot.getY(ts, circle));
                context.lineTo(destination.getX(ts, circle), destination.getY(ts, circle));
                context.lineWidth = circle ? 5 : 1;
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

function drawPathWithCircle() {  

    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;
    const radius = 500;

    context.fillStyle = 'green';
    let moved = false;
    context.beginPath();
    for (let i = 0; i < 20; i++) {
        // for (let i = 0; i < 10; i++) {
        // console.log((Math.sin(i / 10)) + "/" + Math.sin(i / 10));
        // if (!moved) {
            // moved = true;

            // context.moveTo(Math.sin(i/20), Math.sin(i/20));
        // } else {
            // context.lineTo(Math.sin(i/20), Math.sin(i/20));
        // }
        // context.fillRect(middleX + , middleY + Math.cos(i/(20 - 10) * 4) * radius, 10, 10);
    }
    context.stroke();
}