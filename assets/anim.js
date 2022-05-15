let dots = [];

const CONNECTED_RADIUS = 450;

let c, context;

let circle = false;

let selectedIndex = -1;

function circleOn() {
    circle = true;
}

function circleOff() {
    circle = false;
}

window.onload = () => {
    c = document.getElementById("bganim");
    context = c.getContext("2d");

    // context.globalCompositeOperation = "overlay";
    // context.imageSmoothingEnabled = true;

    // context.globalAlpha = 0.1;

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

    hljs.highlightAll();

    requestAnimationFrame(loop);
    console.log(dots);
}

function generateDot(i, x = null, y = null) {
    return {
        selected: false,
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
            return (Math[this.xMode](this.seed + ts / this.xSinMod) * this.r) + ((this.x / 100) * window.innerWidth);
            /* circled
                ? (window.innerWidth / 2) + Math.sin((ts / 4000) + this.index/(20 - 10) * 4) * CONNECTED_RADIUS
                :  */
        },
        getY: function (ts, circled = false) {
            const wigglePos = (Math[this.yMode](this.seed + ts / this.ySinMod) * this.r) + ((this.y / 100) * window.innerHeight);
            return wigglePos;
            /* return circled
                ? (window.innerHeight / 2) +Math.cos((ts / 4000) + this.index/(20 - 10) * 4) * CONNECTED_RADIUS
                : wigglePos 
                ; */
        },
        getColor: function (ts) {
            const alpha = (this.getRadius(ts) / this.r);
            return this.selected ?
                "blue"
                : "rgb(" + (alpha * 255) + ",0,0)";
        },
        seed: genSeed(),
        connections: [],

        velocityX: 0,
        velocityY: 0,
    }
}

function genSeed() {
    return parseInt(Math.random() * 90);
}

let lastRun = 0;
let frameCount = 0;

let dotsOnScreen = 0;
let lastDotDrawn = 0;

let fps = 0;

function loop(ts) {
    const fraction = 1000 / 60;
    frameCount++;
    // console.log(frameCount);
    if (ts > (lastRun + fraction)) {
        lastRun = ts;

        clear();
        logic(ts);
        if (ts % 1000 > 0) {
            // frameCount = 0;
        }
        // fps = frameCount;
        // }
        drawDots(ts);
        connectDots(ts);
    }

    // drawFPS(ts);

    requestAnimationFrame(loop);
}

function drawDots(ts) {
    // c.style.webkitFilter = "hue-rotate(" + (ts/100)%360 + "deg)"

    document.querySelectorAll(".hue-rotate").forEach(e => {
        e.style.webkitFilter = "hue-rotate(" + (ts / 100) % 360 + "deg)";
    });

    document.querySelectorAll(".blurfx").forEach(e => {
        e.style.webkitFilter += "blur(" + (ts % 500) / 100 + "px)";
    });

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
        })/* .sort((a, b) => {
            if (a.getRadius(ts) < b.getRadius(ts)) return 1;
            if (a.getRadius(ts) > b.getRadius(ts)) return 0;
        }); */

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
    for (let d of dots) {
        // if (d.velocityX != 0 && d.velocityY != 0) {
        d.x -= d.velocityX;
        d.y -= d.velocityY;

        d.velocityX = d.velocityX - (d.velocityX / 2);
        d.velocityY = d.velocityY - (d.velocityY / 2);
        // }
    }
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

//cyberpsych0si.is extension
function getDot(x, y, radius, ts) {
    const filtered = dots.filter((e) => {
        // console.log(e.getX(ts));
        return (x - radius < e.getX(ts) && x + radius > e.getX(ts)) && (y - radius < e.getY(ts) && y + radius > e.getY(ts))
    });

    // console.log(filtered);

    return filtered;
}

/* window.onclick = (e) => {
    dots.forEach(e => e.selected = false);

    selectedIndex = -1;
    
    // console.log(e.clientX / window.innerWidth, e.clientY / window.innerHeight)
    getDot(e.clientX, e.clientY, 10, e.timeStamp).forEach(e => {
        selectedIndex = dots.indexOf(e);
        console.log(selectedIndex);
        e.selected = true
        return;
    })
} */

let movement = false;
let isMouseDown = false;
const touchMap = new Map();

window.onmousedown = (e) => {
    if (movement) {
        isMouseDown = true;
        const dot = getDot(e.clientX, e.clientY, 15, e.timeStamp);
        dot.forEach(e => {
            e.selected = true;
        });

        touchMap.set(0, dot);
        // console.log(touchMap);
    }
}

window.onmousemove = (f) => {
    if (movement && isMouseDown) {

        const dot = touchMap.get(0);
        // console.log(dot);        
        for (let d of dot) {
            d.velocityXBuffer = d.x;
            d.velocityYBuffer = d.y;
            d.x = (f.clientX / window.innerWidth) * 100;
            d.y = (f.clientY / window.innerHeight) * 100;
        }
    }

}

window.onmouseup = (e) => {
    if (movement) {
        touchMap.get(0).forEach(e => {
            e.selected = false;
            e.velocityX = e.x - e.velocityXBuffer;
            e.velocityY = e.y - e.velocityYBuffer
            e.visualTimestamp = e.timeStamp;
        });

        touchMap.delete(0);
        isMouseDown = false;
    }
}

window.ontouchstart = (e) => {
    if (movement) {

        for (let i = 0; i < e.changedTouches.length; i++) {
            const j = e.changedTouches[i];
            // console.log(j);
            const dot = getDot(j.clientX, j.clientY, 15, e.timeStamp);
            dot.forEach(e => {
                e.selected = true;
            });
            if (dot) {
                touchMap.set(j.identifier, dot);
            }
        }
    }
}

window.ontouchmove = (f) => {
    if (movement) {
        for (let e of f.changedTouches) {
            // console.log(e);
            const dot = touchMap.get(e.identifier);
            for (let d of dot) {
                d.x = (e.clientX / window.innerWidth) * 100;
                d.y = (e.clientY / window.innerHeight) * 100;
            }
        }
    }
}

window.ontouchend = (e) => {
    if (movement) {

        for (let i = 0; i < e.changedTouches.length; i++) {
            const j = e.changedTouches[i];
            touchMap.get(j.identifier).forEach(s => {
                s.selected = false;
                s.visualTimestamp = e.timeStamp;
            })
            touchMap.delete(j.identifier);
        }
    }

    // console.log(touchMap);
}

function hideOverlay() {
    document.querySelectorAll(".content").forEach(e => {
        e.classList.add("hide");
    })

    let f = document.querySelector(".card");
    f.classList.add("hide");

    document.body.style.overflow = "hidden";
    movement = true;
}

async function loadShape(name) {

    let f = await fetch("assets/dots/" + name + ".json");
    console.log(f.ok);
    // if (f.ok) {
    let jResp = await f.json();
    console.log(jResp);
    dots = [];

    const widthCell = window.innerWidth / (jResp.width + 2);
    const heightCell = window.innerHeight / (jResp.height + 2);
    let n = 0;
    for (let c of jResp.data) {
        const newDot = generateDot(n, 1 + c.x * widthCell, 1 + c.y * heightCell)
        console.log(newDot, n);
        dots.push(newDot);
        n++;
    }
    // }
}