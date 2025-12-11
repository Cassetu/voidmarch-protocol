class CreatureRenderer {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.animationOffset = 0;
    }

    updateAnimation() {
        this.animationOffset += 0.05;
    }

    drawCreatures(ecosystem, cameraX, cameraY) {
        this.drawAshworms(ecosystem.creatures.ashworms, cameraX, cameraY);
        this.drawMagmaBeetles(ecosystem.creatures.magmabeetles, cameraX, cameraY);
        this.drawEmberbirds(ecosystem.creatures.emberbirds, cameraX, cameraY);
    }

    drawAshworms(ashworms, cameraX, cameraY) {
        const game = window.game;
        const planet = game.currentPlanet;
        const elevationHeight = 8;

        ashworms.forEach(worm => {
            const tile = planet.tiles[worm.y][worm.x];
            const yOffset = -(tile.elevation || 0) * elevationHeight;

            const screenX = (worm.x - worm.y) * (this.tileWidth / 2);
            const screenY = (worm.x + worm.y) * (this.tileHeight / 2) + yOffset;

            const wobble = Math.sin(this.animationOffset + worm.x + worm.y) * 2;

            this.ctx.save();
            this.ctx.globalAlpha = 0.7;
            this.ctx.strokeStyle = '#8a6a4a';
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.moveTo(screenX - 4, screenY + wobble);
            this.ctx.lineTo(screenX, screenY + wobble + 2);
            this.ctx.lineTo(screenX + 4, screenY + wobble);
            this.ctx.stroke();

            this.ctx.fillStyle = '#aa8a6a';
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY + wobble, 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawMagmaBeetles(beetles, cameraX, cameraY) {
        const game = window.game;
        const planet = game.currentPlanet;
        const elevationHeight = 8;

        beetles.forEach(beetle => {
            const tile = planet.tiles[beetle.y][beetle.x];
            const yOffset = -(tile.elevation || 0) * elevationHeight;

            const screenX = (beetle.x - beetle.y) * (this.tileWidth / 2);
            const screenY = (beetle.x + beetle.y) * (this.tileHeight / 2) + yOffset;

            const pulse = Math.sin(this.animationOffset * 2 + beetle.x) * 0.5 + 0.5;

            this.ctx.save();
            this.ctx.globalAlpha = 0.8;

            const gradient = this.ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 6);
            gradient.addColorStop(0, `rgba(255, ${100 + pulse * 50}, 0, 1)`);
            gradient.addColorStop(1, 'rgba(139, 0, 0, 0.8)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(screenX, screenY, 5, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#ff4400';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX - 6, screenY - 2);
            this.ctx.lineTo(screenX - 8, screenY - 4);
            this.ctx.moveTo(screenX + 6, screenY - 2);
            this.ctx.lineTo(screenX + 8, screenY - 4);
            this.ctx.stroke();

            this.ctx.restore();
        });
    }

    drawEmberbirds(birds, cameraX, cameraY) {
        const game = window.game;
        const planet = game.currentPlanet;
        const elevationHeight = 8;

        birds.forEach(bird => {
            const tile = planet.tiles[bird.y][bird.x];
            const yOffset = -(tile.elevation || 0) * elevationHeight;

            const screenX = (bird.x - bird.y) * (this.tileWidth / 2);
            const screenY = (bird.x + bird.y) * (this.tileHeight / 2) + yOffset;

            const flap = Math.sin(this.animationOffset * 4 + bird.x) * 3;
            const hover = Math.sin(this.animationOffset + bird.y) * 4;

            this.ctx.save();
            this.ctx.globalAlpha = 0.9;

            const gradient = this.ctx.createLinearGradient(screenX - 8, screenY, screenX + 8, screenY);
            gradient.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0.3)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(screenX - 6, screenY + hover + flap, 4, 2, -0.3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.ellipse(screenX + 6, screenY + hover - flap, 4, 2, 0.3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ff8800';
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY + hover, 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ffcc00';
            this.ctx.beginPath();
            this.ctx.arc(screenX + 1, screenY + hover - 1, 1, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawTileEnrichments(tile, screenX, screenY) {
        this.ctx.save();

        if (tile.enriched === 'ashworm') {
            this.ctx.fillStyle = 'rgba(100, 80, 60, 0.3)';
            this.ctx.beginPath();
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2;
                const x = screenX + Math.cos(angle) * 8;
                const y = screenY + Math.sin(angle) * 4;
                this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            }
            this.ctx.fill();
        }

        if (tile.hasGeothermal && tile.resourceAmount > 0) {
            const pulse = Math.sin(this.animationOffset * 2) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(255, 100, 0, ${pulse * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = `rgba(255, 150, 0, ${pulse * 0.6})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if (tile.volcanicGarden) {
            this.ctx.fillStyle = 'rgba(100, 200, 100, 0.4)';
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + this.animationOffset * 0.5;
                const x = screenX + Math.cos(angle) * 6;
                const y = screenY + Math.sin(angle) * 3;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        this.ctx.restore();
    }
}