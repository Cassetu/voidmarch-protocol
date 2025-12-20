class TerrainRenderer {
    constructor(ctx, tileWidth, tileHeight, colorMap) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.colorMap = colorMap;
        this.noiseCanvas = this.generateNoiseTexture();
        this.floatingTime = 0;
    }

    generateNoiseTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(64, 64);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const noise = Math.random() * 40 - 20;
            imageData.data[i] = noise;
            imageData.data[i + 1] = noise;
            imageData.data[i + 2] = noise;
            imageData.data[i + 3] = 30;
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    applyNoiseTexture(x, y, width, height) {
        const pattern = this.ctx.createPattern(this.noiseCanvas, 'repeat');
        this.ctx.fillStyle = pattern;
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1.0;
    }

    drawTile(gridX, gridY, tile, cameraX, cameraY) {
        if (gridX === 0 && gridY === 0) {
            console.log('Drawing tile 0,0 at screen:', (gridX - gridY) * (this.tileWidth / 2), (gridX + gridY) * (this.tileHeight / 2));
        }
        const game = window.game;
        const zoom = game.renderer.zoom;

        const elevationHeight = 8;
        let yOffset = -(tile.elevation || 0) * elevationHeight;

        if (tile.isFloating) {
            const floatAmplitude = 6;
            const floatSpeed = 0.8;
            const phase = (gridX * 0.3 + gridY * 0.5);
            const floatOffset = Math.sin(this.floatingTime * floatSpeed + phase) * floatAmplitude;
            yOffset += floatOffset - 20;
        }

        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2) + yOffset;

        const points = [
            [screenX, screenY - this.tileHeight / 2],
            [screenX + this.tileWidth / 2, screenY],
            [screenX, screenY + this.tileHeight / 2],
            [screenX - this.tileWidth / 2, screenY]
        ];

        const baseColor = this.colorMap[tile.type];

        const gradient = this.ctx.createLinearGradient(
            screenX, screenY - this.tileHeight / 2,
            screenX, screenY + this.tileHeight / 2
        );
        gradient.addColorStop(0, this.lightenColor(baseColor, 0.15));
        gradient.addColorStop(1, this.darkenColor(baseColor, 0.15));

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(p => this.ctx.lineTo(p[0], p[1]));
        this.ctx.fill();

        if (zoom > 0.6) {
            this.applyNoiseTexture(screenX, screenY, this.tileWidth, this.tileHeight);
        }

        if (zoom > 0.5) {
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
        }

        this.drawTileBorders(tile, screenX, screenY, points);

        if (zoom > 0.7) {
            this.drawEdgeHighlight(screenX, screenY, points);
        }

        if (zoom > 0.6) {
            this.drawShadow(screenX, screenY, tile.elevation || 0, elevationHeight);
        }
    }

    drawShadow(screenX, screenY, elevation, elevationHeight) {
        if (elevation === 0) return;

        const shadowOffset = elevation * elevationHeight;
        const shadowAlpha = Math.min(0.4, elevation * 0.12);

        this.ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        this.ctx.beginPath();
        this.ctx.ellipse(
            screenX,
            screenY + shadowOffset + this.tileHeight / 2,
            this.tileWidth / 2.5,
            this.tileHeight / 4,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
    }

    drawCliffFace(gridX, gridY, tile, planet) {
        if (tile.isFloating) {
            return;
        }

        const elevationHeight = 8;
        const currentElevation = tile.elevation || 0;

        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2) - currentElevation * elevationHeight;

        const checkRight = gridX + 1;
        const checkBottom = gridY + 1;

        if (checkRight < planet.width) {
            const rightTile = planet.tiles[gridY][checkRight];
            const rightElevation = rightTile.elevation || 0;
            const heightDiff = currentElevation - rightElevation;

            if (heightDiff > 0) {
                this.drawRightCliff(screenX, screenY, heightDiff, elevationHeight, tile);
            }
        }

        if (checkBottom < planet.height) {
            const bottomTile = planet.tiles[checkBottom][gridX];
            const bottomElevation = bottomTile.elevation || 0;
            const heightDiff = currentElevation - bottomElevation;

            if (heightDiff > 0) {
                this.drawBottomCliff(screenX, screenY, heightDiff, elevationHeight, tile);
            }
        }
    }

    drawRightCliff(screenX, screenY, heightDiff, elevationHeight, tile) {
        const cliffHeight = heightDiff * elevationHeight;
        const baseColor = this.colorMap[tile.type];
        const darkColor = this.darkenColor(baseColor, 0.35);
        const darkerColor = this.darkenColor(baseColor, 0.5);

        const gradient = this.ctx.createLinearGradient(
            screenX + this.tileWidth / 2, screenY,
            screenX + this.tileWidth / 2, screenY + cliffHeight
        );
        gradient.addColorStop(0, darkColor);
        gradient.addColorStop(1, darkerColor);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX + this.tileWidth / 2, screenY);
        this.ctx.lineTo(screenX + this.tileWidth / 2, screenY + cliffHeight);
        this.ctx.lineTo(screenX, screenY + this.tileHeight / 2 + cliffHeight);
        this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(baseColor, 0.6);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        if (heightDiff > 1) {
            for (let i = 1; i < heightDiff; i++) {
                const y = screenY + i * elevationHeight;
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + this.tileWidth / 2, y);
                this.ctx.lineTo(screenX, y + this.tileHeight / 2);
                this.ctx.stroke();
            }
        }
    }

    drawBottomCliff(screenX, screenY, heightDiff, elevationHeight, tile) {
        const cliffHeight = heightDiff * elevationHeight;
        const baseColor = this.colorMap[tile.type];
        const darkerColor = this.darkenColor(baseColor, 0.5);
        const darkestColor = this.darkenColor(baseColor, 0.65);

        const gradient = this.ctx.createLinearGradient(
            screenX, screenY + this.tileHeight / 2,
            screenX, screenY + this.tileHeight / 2 + cliffHeight
        );
        gradient.addColorStop(0, darkerColor);
        gradient.addColorStop(1, darkestColor);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY + this.tileHeight / 2);
        this.ctx.lineTo(screenX, screenY + this.tileHeight / 2 + cliffHeight);
        this.ctx.lineTo(screenX - this.tileWidth / 2, screenY + cliffHeight);
        this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(baseColor, 0.75);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        if (heightDiff > 1) {
            for (let i = 1; i < heightDiff; i++) {
                const y = screenY + this.tileHeight / 2 + i * elevationHeight;
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, y);
                this.ctx.lineTo(screenX - this.tileWidth / 2, y - this.tileHeight / 2);
                this.ctx.stroke();
            }
        }
    }

    drawEdgeHighlight(screenX, screenY, points) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        this.ctx.lineTo(points[3][0], points[3][1]);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        this.ctx.lineTo(points[1][0], points[1][1]);
        this.ctx.stroke();
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

    drawLavaGlow(gridX, gridY, tile, cameraX, cameraY) {
        if (tile.type !== 'lava') return;

        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2);

        const time = Math.floor(Date.now() / 1000) * 0.3;
        const pulse = Math.sin(time * 2) * 0.15 + 0.5;

        const gradient = this.ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, 60 * pulse
        );
        gradient.addColorStop(0, `rgba(255, 100, 0, ${0.15 * pulse})`);
        gradient.addColorStop(0.5, `rgba(255, 68, 0, ${0.08 * pulse})`);
        gradient.addColorStop(1, 'rgba(255, 68, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(screenX - 60, screenY - 60, 120, 120);
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
            const pulse = (Math.sin(this.floatingTime * 1.5) + 1) / 2;
            const glowAlpha = 0.3 + pulse * 0.2;

            this.ctx.save();
            const gradient = this.ctx.createRadialGradient(
                screenX, screenY + 35, 0,
                screenX, screenY + 35, 40
            );
            gradient.addColorStop(0, `rgba(150, 200, 255, ${glowAlpha})`);
            gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(screenX - 40, screenY, 80, 60);
            this.ctx.restore();

            this.ctx.save();
            this.ctx.strokeStyle = 'rgba(200, 220, 255, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([4, 4]);
            this.ctx.stroke();
            this.ctx.restore();
            return;
        }

        this.ctx.stroke();
    }

    getFloatingOffset(tile) {
        if (!tile.isFloating) return 0;

        const floatAmplitude = 6;
        const floatSpeed = 0.8;
        const phase = 0;
        return Math.sin(this.floatingTime * floatSpeed + phase) * floatAmplitude - 20;
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