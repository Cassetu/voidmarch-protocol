class EnvironmentalRenderer {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    drawEnvironmentalObject(obj, cameraX, cameraY) {
        const game = window.game;
        const planet = game.currentPlanet;
        const tile = planet.tiles[obj.y][obj.x];
        const elevationHeight = 8;
        const yOffset = -(tile.elevation || 0) * elevationHeight;

        const screenX = (obj.x - obj.y) * (this.tileWidth / 2);
        const screenY = (obj.x + obj.y) * (this.tileHeight / 2) + yOffset;

        this.ctx.save();

        const baseHeight = 20;

        this.ctx.fillStyle = this.darkenColor(obj.color, 0.3);
        this.ctx.beginPath();
        this.ctx.ellipse(screenX, screenY + 5, 12, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        if (obj.type === 'lavarock') {
            this.drawLavaRock(screenX, screenY, baseHeight, obj);
        } else if (obj.type === 'magmacrystal') {
            this.drawMagmaCrystal(screenX, screenY, baseHeight, obj);
        } else if (obj.type === 'ashpile') {
            this.drawAshPile(screenX, screenY, baseHeight, obj);
        } else if (obj.type === 'obsidian') {
            this.drawObsidian(screenX, screenY, baseHeight, obj);
        }

        if (obj.health < obj.maxHealth) {
            const healthPercent = obj.health / obj.maxHealth;
            const barWidth = 32;
            const barHeight = 4;
            const barX = screenX - barWidth / 2;
            const barY = screenY - baseHeight - 25;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);

            let healthColor = '#00ff00';
            if (healthPercent < 0.3) healthColor = '#ff0000';
            else if (healthPercent < 0.6) healthColor = '#ffaa00';

            this.ctx.fillStyle = healthColor;
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }

        this.ctx.restore();
    }

    drawLavaRock(x, y, height, obj) {
        this.ctx.fillStyle = obj.color;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 12, y - height / 2);
        this.ctx.lineTo(x + 8, y);
        this.ctx.lineTo(x - 8, y);
        this.ctx.lineTo(x - 12, y - height / 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.lightenColor(obj.color, 0.2);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 12, y - height / 2);
        this.ctx.lineTo(x, y - height / 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(obj.color, 0.4);
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 12, y - height / 2);
        this.ctx.lineTo(x + 8, y);
        this.ctx.lineTo(x - 8, y);
        this.ctx.lineTo(x - 12, y - height / 2);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.fillStyle = this.darkenColor(obj.color, 0.5);
        this.ctx.beginPath();
        this.ctx.arc(x - 3, y - height / 2 + 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + 4, y - height / 3, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMagmaCrystal(x, y, height, obj) {
        this.ctx.fillStyle = obj.color;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height - 5);
        this.ctx.lineTo(x + 10, y - height + 5);
        this.ctx.lineTo(x + 5, y);
        this.ctx.lineTo(x, y - 5);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.lightenColor(obj.color, 0.3);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height - 5);
        this.ctx.lineTo(x + 10, y - height + 5);
        this.ctx.lineTo(x, y - height / 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = obj.color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height - 5);
        this.ctx.lineTo(x - 10, y - height + 5);
        this.ctx.lineTo(x - 5, y);
        this.ctx.lineTo(x, y - 5);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.darkenColor(obj.color, 0.2);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height - 5);
        this.ctx.lineTo(x - 10, y - height + 5);
        this.ctx.lineTo(x, y - height / 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(obj.color, 0.4);
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height - 5);
        this.ctx.lineTo(x + 10, y - height + 5);
        this.ctx.lineTo(x + 5, y);
        this.ctx.lineTo(x, y - 5);
        this.ctx.lineTo(x - 5, y);
        this.ctx.lineTo(x - 10, y - height + 5);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x - 2, y - height, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + 3, y - height + 3, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawAshPile(x, y, height, obj) {
        this.ctx.fillStyle = obj.color;

        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 5, 15, 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = this.lightenColor(obj.color, 0.2);
        this.ctx.beginPath();
        this.ctx.ellipse(x - 3, y - 10, 12, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = this.lightenColor(obj.color, 0.3);
        this.ctx.beginPath();
        this.ctx.ellipse(x + 3, y - 8, 10, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(obj.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - 5, 15, 8, 0, 0, Math.PI);
        this.ctx.stroke();

        this.ctx.fillStyle = this.darkenColor(obj.color, 0.2);
        const positions = [
            {x: x - 6, y: y - 6},
            {x: x + 4, y: y - 7},
            {x: x - 2, y: y - 9},
            {x: x + 8, y: y - 5},
            {x: x - 9, y: y - 4}
        ];
        positions.forEach(pos => {
            this.ctx.fillRect(pos.x, pos.y, 2, 2);
        });
    }

    drawObsidian(x, y, height, obj) {
        this.ctx.fillStyle = obj.color;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 14, y - height / 2 + 3);
        this.ctx.lineTo(x + 10, y);
        this.ctx.lineTo(x - 10, y);
        this.ctx.lineTo(x - 14, y - height / 2 + 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.lightenColor(obj.color, 0.15);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 14, y - height / 2 + 3);
        this.ctx.lineTo(x, y - height / 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = this.darkenColor(obj.color, 0.1);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x - 14, y - height / 2 + 3);
        this.ctx.lineTo(x, y - height / 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = this.darkenColor(obj.color, 0.3);
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x + 14, y - height / 2 + 3);
        this.ctx.lineTo(x + 10, y);
        this.ctx.lineTo(x - 10, y);
        this.ctx.lineTo(x - 14, y - height / 2 + 3);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.strokeStyle = this.lightenColor(obj.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height);
        this.ctx.lineTo(x, y - height / 3);
        this.ctx.stroke();

        this.ctx.fillStyle = '#4a4a6a';
        this.ctx.beginPath();
        this.ctx.arc(x + 4, y - height / 2, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - height / 2 + 5, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawDestroyer(destroyer, cameraX, cameraY) {
        const game = window.game;
        const planet = game.currentPlanet;
        const x = destroyer.currentX;
        const y = destroyer.currentY;
        const tile = planet.tiles[y][x];
        const elevationHeight = 8;
        const yOffset = -(tile.elevation || 0) * elevationHeight;

        const screenX = (x - y) * (this.tileWidth / 2);
        const screenY = (x + y) * (this.tileHeight / 2) + yOffset;

        this.ctx.save();

        const baseY = screenY;
        const leftX = screenX - 6;
        const rightX = screenX + 6;
        const headY = baseY - 20;
        const chestTop = baseY - 12;
        const chestBot = baseY + 3;
        const legBot = baseY + 12;

        this.ctx.fillStyle = '#c97861';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, headY);
        this.ctx.lineTo(rightX + 2, headY + 4);
        this.ctx.lineTo(screenX + 2, headY + 10);
        this.ctx.lineTo(leftX - 2, headY + 4);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = '#a86a4a';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.fillStyle = '#3a3a3a';
        this.ctx.fillRect(screenX - 4, headY + 2, 8, 3);

        this.ctx.fillStyle = '#8a5a3a';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, chestTop);
        this.ctx.lineTo(rightX + 3, chestTop + 3);
        this.ctx.lineTo(rightX + 1, chestBot);
        this.ctx.lineTo(screenX, chestBot + 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#6a4a2a';
        this.ctx.beginPath();
        this.ctx.moveTo(leftX, chestTop + 3);
        this.ctx.lineTo(screenX, chestTop);
        this.ctx.lineTo(screenX, chestBot + 3);
        this.ctx.lineTo(leftX - 3, chestBot);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#c97861';
        this.ctx.beginPath();
        this.ctx.moveTo(leftX - 3, chestBot);
        this.ctx.lineTo(leftX - 1, chestBot + 2);
        this.ctx.lineTo(leftX - 2, legBot);
        this.ctx.lineTo(leftX - 4, legBot - 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 1, chestBot);
        this.ctx.lineTo(rightX + 3, chestBot + 2);
        this.ctx.lineTo(rightX + 2, legBot);
        this.ctx.lineTo(rightX, legBot - 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#5a4a3a';
        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 3, chestTop + 4);
        this.ctx.lineTo(rightX + 10, chestTop + 2);
        this.ctx.lineTo(rightX + 11, chestTop + 6);
        this.ctx.lineTo(rightX + 4, chestTop + 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = '#7a6a5a';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 10, chestTop + 1);
        this.ctx.lineTo(rightX + 10, chestTop + 7);
        this.ctx.stroke();

        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 8, chestTop - 1);
        this.ctx.lineTo(rightX + 13, chestTop - 3);
        this.ctx.lineTo(rightX + 14, chestTop + 1);
        this.ctx.lineTo(rightX + 9, chestTop + 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = '#6a6a6a';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        if (destroyer.arrived) {
            const swingAngle = Math.sin(Date.now() / 200) * 0.3;

            this.ctx.save();
            this.ctx.translate(rightX + 10, chestTop + 4);
            this.ctx.rotate(swingAngle);

            this.ctx.fillStyle = '#4a4a4a';
            this.ctx.beginPath();
            this.ctx.moveTo(-4, -6);
            this.ctx.lineTo(4, -8);
            this.ctx.lineTo(5, -4);
            this.ctx.lineTo(-3, -2);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.restore();
        }

        this.ctx.restore();
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