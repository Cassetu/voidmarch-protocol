class TerrainRenderer {
    constructor(ctx, tileWidth, tileHeight, colorMap) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.colorMap = colorMap;
    }

    drawTile(gridX, gridY, tile, cameraX, cameraY) {
        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2);

        const points = [
            [screenX, screenY - this.tileHeight / 2],
            [screenX + this.tileWidth / 2, screenY],
            [screenX, screenY + this.tileHeight / 2],
            [screenX - this.tileWidth / 2, screenY]
        ];

        this.ctx.fillStyle = this.colorMap[tile.type];
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(p => this.ctx.lineTo(p[0], p[1]));
        this.ctx.fill();

        if (tile.type === 'rock' || tile.type === 'ash') {
            this.drawRockDetails(tile, screenX, screenY);
        }

        if (tile.type === 'lava') {
            this.drawLavaDetails(tile, screenX, screenY);
        }

        if (tile.type === 'water') {
            this.drawWaterAnimation(screenX, screenY);
        }

        if (tile.type === 'sand') {
            this.drawSandGrains(gridX, gridY, screenX, screenY);
        }

        if (tile.type === 'darksoil') {
            this.drawDarksoilDetails(tile, screenX, screenY);
        }

        this.drawTileBorders(tile, screenX, screenY, points);
    }

    drawRockDetails(tile, screenX, screenY) {
        if (tile.details) {
            tile.details.forEach(detail => {
                const px = screenX + detail.x;
                const py = screenY + detail.y;
                this.ctx.fillStyle = this.darkenColor(this.colorMap[tile.type], 0.4);
                this.ctx.fillRect(px, py, 2, 2);
            });
        }
    }

    drawLavaDetails(tile, screenX, screenY) {
        if (tile.details) {
            const time = Date.now() / 400;
            tile.details.forEach((detail, i) => {
                const phase = i * 0.7;
                const drift = Math.sin(time * 0.8 + phase) * 2;
                const pulse = (Math.sin(time * 1.5 + phase) + 1) / 2;

                const px = screenX + detail.x + drift;
                const py = screenY + detail.y + Math.cos(time * 0.6 + phase) * 1.5;

                const glow = detail.brightness * 0.5 + pulse * 0.5;
                const green = Math.floor(100 + glow * 155);
                const alpha = 0.4 + glow * 0.4;
                const size = detail.size * (0.9 + pulse * 0.3);

                this.ctx.fillStyle = `rgba(255, ${green}, 0, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(px, py, size, 0, Math.PI * 2);
                this.ctx.fill();
            });
        }
    }

    drawWaterAnimation(screenX, screenY) {
        const time = Date.now() / 1000;
        for (let i = 0; i < 6; i++) {
            const phase = i * 1.2;
            const waveX = Math.sin(time * 0.5 + phase) * 8;
            const waveY = Math.cos(time * 0.4 + phase) * 4;
            const pulse = (Math.sin(time * 0.8 + phase) + 1) / 2;

            const px = screenX + (i - 3) * 6 + waveX;
            const py = screenY + waveY;

            const blue = Math.floor(150 + pulse * 80);
            const green = Math.floor(100 + pulse * 50);
            const alpha = 0.3 + pulse * 0.3;
            const size = 4 + pulse * 2;

            this.ctx.fillStyle = `rgba(${green}, ${blue}, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(px, py, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawSandGrains(gridX, gridY, screenX, screenY) {
        const seed = (gridX * 7 + gridY * 13) % 100;
        for (let i = 0; i < 12; i++) {
            const grainX = screenX + ((seed + i * 17) % 30 - 15);
            const grainY = screenY + ((seed + i * 23) % 14 - 7);
            const brightness = ((seed + i * 11) % 40) - 20;

            const r = Math.min(255, 194 + brightness);
            const g = Math.min(255, 178 + brightness);
            const b = Math.min(255, 128 + brightness);

            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.fillRect(grainX, grainY, 3, 3);
        }
    }

    drawDarksoilDetails(tile, screenX, screenY) {
        if (tile.details) {
            tile.details.forEach(detail => {
                const px = screenX + detail.x;
                const py = screenY + detail.y;
                this.ctx.strokeStyle = this.lightenColor(this.colorMap[tile.type], 0.3);
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(px - 2, py);
                this.ctx.lineTo(px + 2, py - 1);
                this.ctx.stroke();
            });
        }
    }

    drawTileBorders(tile, screenX, screenY, points) {
        this.ctx.strokeStyle = 'rgba(160, 176, 200, 0.15)';
        this.ctx.lineWidth = 1;

        if (tile.hasGeothermal) {
            this.ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
            this.ctx.fill();
        }

        if (tile.isFloating) {
            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(200, 220, 255, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([4, 4]);
            this.ctx.stroke();
            this.ctx.restore();
        }
        this.ctx.stroke();
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