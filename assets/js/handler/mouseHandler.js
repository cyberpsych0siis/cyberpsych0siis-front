export default (dots) => {

    let movement = true;
    let isMouseDown = false;
    const touchMap = new Map();

    const getDot = (x, y, radius, ts) => {
        const filtered = dots.filter((e) => {
            const [dotX, dotY] = [e.getX(ts, window.innerWidth), e.getY(ts, window.innerHeight)];

            return (x - radius < dotX && x + radius > dotX) && (y - radius < dotY && y + radius > dotY)
        });


        return filtered;
    }

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
}