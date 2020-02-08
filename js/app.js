class App {
    constructor() {
        this.frame = 0;

        this.flame = new Flame();
        this.wind = new Vector2D(-1, -3);

        this.eye = new Eye(
            new Vector2D(innerWidth / 2, innerHeight / 2),
            new Vector2D(64, 0),
        );
    }

    update = mouse => {
        if (mouse) {
            this.flame.isBurning = true;
            this.eye.isShut = false;

            if (!this.flame.pos) this.flame.pos = mouse;
            else {
                if (!this.flame.pos.equals(mouse)) {
                    this.flame.pos = this.flame.pos.lerp(mouse, 0.1);
                }
            }
        } else {
            this.flame.isBurning = false;
            this.eye.isShut = true;
        }

        this.flame.update(this);
        this.eye.update(this);

        this.frame++;
    }
}