class BackgroundRenderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.mountainLayers = this.generateMountains();
        this.skyGradient = this.createSkyGradient();
    }

    generateMountains() {
        const layers = [];

        for (let layer = 0; layer < 3; layer++) {
            const points = [];
            const segments = 20 + layer * 10;
            const heightVariance = 100 + layer * 50;
            const baseHeight = 200 - layer * 40;

            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * (this.width + 400) - 200;
                const noise = Math.sin(i * 0.3 + layer) * Math.cos(i * 0.15) * heightVariance;
                const y = this.height - baseHeight + noise;
                points.push({ x, y });
            }

            layers.push({
                points,
                color: `rgba(${30 + layer * 20}, ${20 + layer * 15}, ${40 + layer * 20}, ${0.6 - layer * 0.15})`,
                parallaxSpeed: 0.05 + layer * 0.03
            });
        }

        return layers;
    }

    createSkyGradient() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0f1e');
        gradient.addColorStop(0.5, '#1a1f2e');
        gradient.addColorStop(1, '#2a1f1e');
        return gradient;
    }

    draw(cameraX, cameraY, zoom) {
        this.ctx.fillStyle = this.skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.mountainLayers.forEach(layer => {
            const offsetX = cameraX * layer.parallaxSpeed * zoom;

            this.ctx.fillStyle = layer.color;
            this.ctx.beginPath();
            this.ctx.moveTo(-200 - offsetX, this.height);

            layer.points.forEach(point => {
                this.ctx.lineTo(point.x - offsetX, point.y);
            });

            this.ctx.lineTo(this.width + 200 - offsetX, this.height);
            this.ctx.closePath();
            this.ctx.fill();
        });

        this.drawStars(cameraX, cameraY, zoom);
    }

    drawStars(cameraX, cameraY, zoom) {
        const starCount = 100;
        const seed = 12345;

        for (let i = 0; i < starCount; i++) {
            const x = ((seed + i * 1234) % this.width);
            const y = ((seed + i * 5678) % (this.height * 0.6));
            const offsetX = cameraX * 0.02 * zoom;
            const offsetY = cameraY * 0.02 * zoom;
            const twinkle = Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.4})`;
            this.ctx.fillRect(x - offsetX, y - offsetY, 2, 2);
        }
    }
}