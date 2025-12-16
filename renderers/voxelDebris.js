class VoxelDebrisSystem {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.particles = [];
    }

    createDebris(worldX, worldY, color, count = 8) {
        const baseColors = this.extractColorPalette(color);

        for (let i = 0; i < count; i++) {
            const voxelColor = baseColors[Math.floor(Math.random() * baseColors.length)];

            this.particles.push({
                worldX: worldX,
                worldY: worldY,
                offsetX: (Math.random() - 0.5) * 10,
                offsetY: (Math.random() - 0.5) * 10,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: (Math.random() - 0.5) * 4 - 2,
                velocityZ: Math.random() * 3 + 2,
                z: 0,
                gravity: 0.15,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 3 + 2,
                color: voxelColor,
                life: 1.0,
                fadeSpeed: 0.01 + Math.random() * 0.01,
                bounced: false
            });
        }
    }

    extractColorPalette(baseColor) {
        const colors = [baseColor];
        colors.push(this.darkenColor(baseColor, 0.2));
        colors.push(this.lightenColor(baseColor, 0.2));
        colors.push(this.darkenColor(baseColor, 0.4));
        return colors;
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.velocityY += p.gravity;

            p.offsetX += p.velocityX;
            p.offsetY += p.velocityY;
            p.z += p.velocityZ;
            p.velocityZ -= p.gravity;

            p.rotation += p.rotationSpeed;

            if (p.z <= 0 && !p.bounced) {
                p.z = 0;
                p.velocityZ *= -0.4;
                p.velocityX *= 0.6;
                p.velocityY *= 0.6;
                p.bounced = true;
            }

            if (p.bounced) {
                p.life -= p.fadeSpeed;
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(cameraX, cameraY) {
        this.particles.forEach(p => {
            const screenX = (p.worldX - p.worldY) * (this.tileWidth / 2) + p.offsetX;
            const screenY = (p.worldX + p.worldY) * (this.tileHeight / 2) + p.offsetY - p.z;

            this.ctx.save();
            this.ctx.translate(screenX, screenY);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.life;

            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            const lightColor = this.lightenColor(p.color, 0.3);
            this.ctx.fillStyle = lightColor;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size / 2, p.size / 2);

            const darkColor = this.darkenColor(p.color, 0.3);
            this.ctx.fillStyle = darkColor;
            this.ctx.fillRect(0, 0, p.size / 2, p.size / 2);

            this.ctx.restore();
        });
    }

    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.floor(amount * 255));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.floor(amount * 255));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.floor(amount * 255));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(amount * 255));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(amount * 255));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(amount * 255));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}