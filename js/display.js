class Display {
    constructor() {
        this.frame = 0;

        this.resize = () => {
            this.canvas.width = innerWidth;
            this.canvas.height = innerHeight;
            this.cx.imageSmoothingEnabled = false;
        }

        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', this.resize);
        document.body.appendChild(this.canvas);
    }

    drawEqTriangle(ctx, particle, size) {
        var h = size * (Math.sqrt(3) / 2);

        ctx.save();
        ctx.translate(particle.pos.x, particle.pos.y);
        ctx.rotate(((this.frame * particle.direction + particle.angle) % 360) * Math.PI / 180);

        ctx.beginPath();

        ctx.moveTo(0, -h / 2);
        ctx.lineTo(-size / 2, h / 2);
        ctx.lineTo(size / 2, h / 2);
        ctx.lineTo(0, -h / 2);

        ctx.fill();

        ctx.closePath();
        ctx.restore();

    }

    update = app => {
        this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //eye
        this.cx.fillStyle = '#fff';
        this.cx.beginPath();
        this.cx.ellipse(app.eye.pos.x, app.eye.pos.y, app.eye.size.x, app.eye.size.y, Math.PI, 0, 2 * Math.PI);
        this.cx.fill();

        if (app.flame.pos) {
            this.cx.globalCompositeOperation = 'source-atop';

            this.cx.fillStyle = '#021';
            this.cx.beginPath();
            this.cx.arc(
                app.eye.pos.x + (app.flame.pos.x * app.eye.size.x / app.eye.pos.x - app.eye.size.x) / 2,
                app.eye.pos.y + (app.flame.pos.y * app.eye.size.y / app.eye.pos.y - app.eye.size.y) / 2,
                24, 0, 2 * Math.PI
            );
            this.cx.fill();

            this.cx.globalCompositeOperation = "source-over";
        }

        //flame
        if (app.flame.pos) {
            this.cx.fillStyle = '#f8f';
            app.flame.particles.forEach(particle => {
                var xOffset = Math.floor(Math.random() * particle.glitchFactor) - particle.glitchFactor / 2;
                var yOffset = Math.floor(Math.random() * particle.glitchFactor) - particle.glitchFactor / 2;

                this.cx.translate(xOffset, yOffset);
                this.drawEqTriangle(this.cx, particle, particle.size * particle.flameSize);
                this.cx.translate(-xOffset, -yOffset);
            });

            this.cx.globalCompositeOperation = 'source-atop';

            var gradient = this.cx.createRadialGradient(0, 0, 0, 0, 0, app.flame.particleMaxSize);
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, "#0ff");

            this.cx.fillStyle = gradient;
            app.flame.particles.forEach(particle => {
                var xOffset = Math.floor(Math.random() * particle.glitchFactor) - particle.glitchFactor / 2;
                var yOffset = Math.floor(Math.random() * particle.glitchFactor) - particle.glitchFactor / 2;

                this.cx.translate(xOffset, yOffset);
                this.drawEqTriangle(this.cx, particle, particle.size);
                this.cx.translate(-xOffset, -yOffset);
            });

            this.cx.globalCompositeOperation = "source-over";
        }

        //scanlines
        this.cx.globalAlpha = 0.5;
        for (let i = 0; i < this.canvas.height / 4; i++) {
            this.cx.strokeStyle = '#000';
            this.cx.beginPath();
            this.cx.moveTo(0, i * 4);
            this.cx.lineTo(this.canvas.width, i * 4);
            this.cx.stroke();
            this.cx.closePath();

            var xSize = Math.floor(Math.random() * 16) + 16;
            if (!Math.floor(Math.random() * 16)) {
                var xPos = Math.floor(Math.random() * this.canvas.width);
                this.cx.strokeStyle = '#fff';
                this.cx.beginPath();
                this.cx.moveTo(xPos, i * 4);
                this.cx.lineTo(xPos + xSize, i * 4);
                this.cx.stroke();
                this.cx.closePath();
            }
        }
        this.cx.globalAlpha = 1;

        this.frame++;
    }
}