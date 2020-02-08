class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.plus = other => new Vector2D(this.x + other.x, this.y + other.y);
        this.times = factor => new Vector2D(this.x * factor, this.y * factor);
        this.equals = other => this.x === other.x && this.y === other.y;
        this.floor = () => new Vector2D(Math.floor(this.x), Math.floor(this.y));
        this.lerp = (other, amt) => new Vector2D((1 - amt) * this.x + amt * other.x, (1 - amt) * this.y + amt * other.y);
    }
}

class Eye {
    constructor(pos, size) {
        this.frame = 0;
        this.pos = pos;
        this.size = size;
        this.isShut = true;
    }

    update = app => {
        if (this.isShut && this.size.y > 0) this.size = this.size.lerp(new Vector2D(this.size.x, 0), 0.4);
        if (!this.isShut && this.size.y < this.size.x) this.size = this.size.lerp(new Vector2D(this.size.x, this.size.x), 0.4);

        this.frame++;
    }
}

class Particle {
    constructor(pos, size, direction, glitchFactor) {
        this.frame = 0;
        this.pos = pos;
        this.size = size;
        this.direction = direction;
        this.glitchFactor = glitchFactor;
        this.flameSize = Math.floor(Math.random()) + 2;
        this.angle = Math.floor(Math.random() * 360);
    }

    update = app => {
        this.size--;
        this.pos = this.pos.plus(app.wind);

        this.frame++;
    }
}

class Flame {
    constructor() {
        this.frame = 0;
        this.pos = null;
        this.particles = [];
        this.isBurning = false;

        this.volability = 1;
        this.spread = 32;
        this.glitchFactor = 8;

        this.particleMaxSize = 64;
        this.particleMinSize = 16;
    }

    update = app => {
        if (this.isBurning && !Math.floor(Math.random() * this.volability)) {
            this.particles.push(new Particle(
                this.pos.plus(new Vector2D(
                    Math.floor(Math.random() * this.spread) - this.spread / 2,
                    Math.floor(Math.random() * this.spread) - this.spread / 2
                )),
                Math.floor(Math.random() * (this.particleMaxSize - this.particleMinSize)) + this.particleMinSize,
                Math.floor(Math.random() * 2) ? 1 : -1,
                this.glitchFactor
            ));
        }

        this.particles.forEach(particle => particle.update(app));
        this.particles = this.particles.filter(particle => particle.size > 0);

        this.frame++;
    }
}