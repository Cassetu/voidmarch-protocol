class Input {
    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.mouseJustPressed = false;

        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            this.mouseDown = true;
            this.mouseJustPressed = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                return;
            }
            this.keys[e.key] = true;
        });
    }

    update() {
        this.mouseJustPressed = false;
    }
}