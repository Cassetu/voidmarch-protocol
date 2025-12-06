class OverlayRenderer {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    drawSettlementClaim(settlement, cameraX, cameraY) {
        this.ctx.save();

        const radius = settlement.claimRadius;
        const hue = (settlement.id * 137.5) % 360;

        const claimTiles = new Set();
        const game = window.game;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const tileX = settlement.x + dx;
                const tileY = settlement.y + dy;

                const controller = game.player.getControllingSettlement(tileX, tileY);
                if (controller && controller.id === settlement.id) {
                    claimTiles.add(`${tileX},${tileY}`);
                }
            }
        }

        claimTiles.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            const screenX = (x - y) * (this.tileWidth / 2);
            const screenY = (x + y) * (this.tileHeight / 2);

            this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.15)`;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
            this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
            this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
            this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
            this.ctx.closePath();
            this.ctx.fill();
        });

        this.ctx.strokeStyle = `hsla(${hue}, 90%, 70%, 0.9)`;
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';

        claimTiles.forEach(key => {
            const [tileX, tileY] = key.split(',').map(Number);
            const screenX = (tileX - tileY) * (this.tileWidth / 2);
            const screenY = (tileX + tileY) * (this.tileHeight / 2);

            const top = `${tileX},${tileY - 1}`;
            const right = `${tileX + 1},${tileY}`;
            const bottom = `${tileX},${tileY + 1}`;
            const left = `${tileX - 1},${tileY}`;

            this.ctx.beginPath();

            if (!claimTiles.has(top)) {
                this.ctx.moveTo(screenX - this.tileWidth / 2, screenY);
                this.ctx.lineTo(screenX, screenY - this.tileHeight / 2);
            }
            if (!claimTiles.has(right)) {
                this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
            }
            if (!claimTiles.has(bottom)) {
                this.ctx.moveTo(screenX + this.tileWidth / 2, screenY);
                this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
            }
            if (!claimTiles.has(left)) {
                this.ctx.moveTo(screenX, screenY + this.tileHeight / 2);
                this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
            }

            this.ctx.stroke();
        });

        this.ctx.restore();
    }

    drawMovementRange(unit, cameraX, cameraY) {
        if (!unit || unit.moved) return;

        const unitX = unit.x;
        const unitY = unit.y;
        const range = unit.moveRange;

        this.ctx.save();
        this.ctx.globalAlpha = 0.3;

        for (let dy = -range; dy <= range; dy++) {
            for (let dx = -range; dx <= range; dx++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance <= range && distance > 0) {
                    const tileX = unitX + dx;
                    const tileY = unitY + dy;

                    const screenX = (tileX - tileY) * (this.tileWidth / 2);
                    const screenY = (tileX + tileY) * (this.tileHeight / 2);

                    this.ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                    this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
                    this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
                    this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

    drawAttackRange(unit, cameraX, cameraY) {
        if (!unit) return;

        const unitX = unit.x;
        const unitY = unit.y;
        const range = unit.range;

        this.ctx.save();
        this.ctx.globalAlpha = 0.4;

        for (let dy = -range; dy <= range; dy++) {
            for (let dx = -range; dx <= range; dx++) {
                const distance = Math.abs(dx) + Math.abs(dy);
                if (distance <= range && distance > 0) {
                    const tileX = unitX + dx;
                    const tileY = unitY + dy;

                    const screenX = (tileX - tileY) * (this.tileWidth / 2);
                    const screenY = (tileX + tileY) * (this.tileHeight / 2);

                    this.ctx.fillStyle = 'rgba(255, 50, 50, 0.5)';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                    this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
                    this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
                    this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

    drawSentinelMovementRanges(sentinels, cameraX, cameraY) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.25;

        sentinels.forEach(sentinel => {
            const range = sentinel.moveRange;

            for (let dy = -range; dy <= range; dy++) {
                for (let dx = -range; dx <= range; dx++) {
                    const distance = Math.abs(dx) + Math.abs(dy);
                    if (distance <= range && distance > 0) {
                        const tileX = sentinel.x + dx;
                        const tileY = sentinel.y + dy;

                        const screenX = (tileX - tileY) * (this.tileWidth / 2);
                        const screenY = (tileX + tileY) * (this.tileHeight / 2);

                        this.ctx.fillStyle = 'rgba(138, 43, 226, 0.4)';
                        this.ctx.beginPath();
                        this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                        this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
                        this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
                        this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
                        this.ctx.closePath();
                        this.ctx.fill();

                        this.ctx.strokeStyle = 'rgba(148, 0, 211, 0.6)';
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        });

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

    drawSentinelAttackRanges(sentinels, cameraX, cameraY) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;

        sentinels.forEach(sentinel => {
            const range = sentinel.range;

            for (let dy = -range; dy <= range; dy++) {
                for (let dx = -range; dx <= range; dx++) {
                    const distance = Math.abs(dx) + Math.abs(dy);
                    if (distance <= range && distance > 0) {
                        const tileX = sentinel.x + dx;
                        const tileY = sentinel.y + dy;

                        const screenX = (tileX - tileY) * (this.tileWidth / 2);
                        const screenY = (tileX + tileY) * (this.tileHeight / 2);

                        this.ctx.fillStyle = 'rgba(255, 140, 0, 0.4)';
                        this.ctx.beginPath();
                        this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                        this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
                        this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
                        this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
                        this.ctx.closePath();
                        this.ctx.fill();

                        this.ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        });

        this.ctx.globalAlpha = 1;
        this.ctx.restore();
    }

    drawBuildingQueue(buildingQueue) {
        buildingQueue.forEach(queuedBuilding => {
            const screenX = (queuedBuilding.x - queuedBuilding.y) * (this.tileWidth / 2);
            const screenY = (queuedBuilding.x + queuedBuilding.y) * (this.tileHeight / 2);

            if (queuedBuilding.hasEnemy) {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.font = 'bold 20px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('!', screenX, screenY - 40);
            }
        });
    }
}