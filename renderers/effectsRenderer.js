class EffectsRenderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.lavaSparks = [];
        this.snowParticles = [];
        this.hailstormActive = false;
        this.hailstormEndTime = 0;
        this.acidRainParticles = [];
        this.acidRainActive = false;
        this.acidRainEndTime = 0;
    }

    createLavaSpark(gridX, gridY) {
        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2);

        this.lavaSparks.push({
            x: screenX + (Math.random() - 0.5) * 20,
            y: screenY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 5 - 3,
            life: 1.0,
            size: Math.random() * 3 + 2
        });
    }

    updateLavaSparks() {
        for (let i = this.lavaSparks.length - 1; i >= 0; i--) {
            const spark = this.lavaSparks[i];
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += 0.3;
            spark.life -= 0.02;

            if (spark.life <= 0) {
                this.lavaSparks.splice(i, 1);
            }
        }
    }

    drawLavaSparks(cameraX, cameraY) {
        this.ctx.save();

        this.lavaSparks.forEach(spark => {
            this.ctx.globalAlpha = spark.life;
            this.ctx.fillStyle = `rgb(255, ${Math.floor(100 + spark.life * 100)}, 0)`;
            this.ctx.beginPath();
            this.ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

startHailstorm() {
        this.hailstormActive = true;
        this.hailstormEndTime = Date.now() + 10000;

        for (let i = 0; i < 200; i++) {
            this.createSnowParticle();
        }
    }

    createSnowParticle() {
        this.snowParticles.push({
            x: Math.random() * this.width,
            y: Math.random() * -500,
            vx: (Math.random() - 0.5) * 1,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.5
        });
    }

    updateSnowParticles() {
        if (!this.hailstormActive) return;

        if (Date.now() > this.hailstormEndTime) {
            this.hailstormActive = false;
            this.snowParticles = [];
            return;
        }

        for (let i = this.snowParticles.length - 1; i >= 0; i--) {
            const snow = this.snowParticles[i];
            snow.x += snow.vx;
            snow.y += snow.vy;

            if (snow.y > this.height) {
                snow.y = -10;
                snow.x = Math.random() * this.width;
            }
        }

        if (this.snowParticles.length < 200 && Math.random() < 0.3) {
            this.createSnowParticle();
        }
    }

    drawSnowParticles() {
        if (!this.hailstormActive) return;

        this.ctx.save();

        this.snowParticles.forEach(snow => {
            this.ctx.globalAlpha = snow.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#e0f0ff';
            this.ctx.beginPath();
            this.ctx.arc(snow.x - snow.size * 0.3, snow.y - snow.size * 0.3, snow.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

    startAcidRain() {
        this.acidRainActive = true;
        this.acidRainEndTime = Date.now() + 10000;

        for (let i = 0; i < 150; i++) {
            this.createAcidRainDrop();
        }
    }

    createAcidRainDrop() {
        this.acidRainParticles.push({
            x: Math.random() * this.width,
            y: Math.random() * -500,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 4 + 3,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.6 + 0.4
        });
    }

    updateAcidRainParticles() {
        if (!this.acidRainActive) return;

        if (Date.now() > this.acidRainEndTime) {
            this.acidRainActive = false;
            this.acidRainParticles = [];
            return;
        }

        for (let i = this.acidRainParticles.length - 1; i >= 0; i--) {
            const drop = this.acidRainParticles[i];
            drop.x += drop.vx;
            drop.y += drop.vy;

            if (drop.y > this.height) {
                drop.y = -10;
                drop.x = Math.random() * this.width;
            }
        }

        if (this.acidRainParticles.length < 150 && Math.random() < 0.3) {
            this.createAcidRainDrop();
        }
    }

    drawAcidRainParticles() {
        if (!this.acidRainActive) return;

        this.ctx.save();

        this.acidRainParticles.forEach(drop => {
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.strokeStyle = '#88ff88';
            this.ctx.lineWidth = drop.size;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x + drop.vx * 3, drop.y + drop.vy * 3);
            this.ctx.stroke();
        });

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }
}