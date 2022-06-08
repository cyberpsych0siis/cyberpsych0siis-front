export class Dot {
    selected = false;

    velocityX = 0;
    velocityY = 0;

    constructor(i, x, y) {
        this.index = i;
        this.x = x != null ? x : parseInt((Math.random() * 100));
        this.y = y != null ? y : parseInt((Math.random() * 100));
        this.r = parseInt((Math.random() * 10) + 2);

        this.xMode = ["sin", "cos"][parseInt(Math.random() * 2)];
        this.yMode = ["sin", "cos"][parseInt(Math.random() * 2)];
        this.xSinMod = (Math.random() * 100) + 1000;
        this.ySinMod = (Math.random() * 100) + 1000;

        this.seed = parseInt(Math.random() * 90);
    }

    getAsMatrix() {
        return [this.x, this.y, this.r];
    }

    getRadius(ts) {
        return Math.abs(Math.sin(this.seed + ts / 1000) * this.r);
    }

    getX(ts, w = 1) {
        return (Math[this.xMode](this.seed + ts / this.xSinMod) * this.r) + ((this.x / 100) * w);
    }

    getY(ts, h = 1) {
        return (Math[this.yMode](this.seed + ts / this.ySinMod) * this.r) + ((this.y / 100) * h);
    }

    getColor(ts) {
        const alpha = (this.getRadius(ts) / this.r);
        return this.selected ?
            "blue"
            : "rgb(" + parseInt(alpha * 255) + ",0,0)";
    }

    serialize(ts, w, h) {
        return {
            r: this.getRadius(ts),
            x: this.getX(ts, w),
            y: this.getY(ts, h),
            c: this.getColor(ts)
        }
    }
}