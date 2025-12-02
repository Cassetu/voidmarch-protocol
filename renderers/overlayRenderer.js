class OverlayRenderer {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    drawSettlementClaim(settlement, cameraX, cameraY) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;

        const radius = settlement.claimRadius;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const tileX = settlement.x + dx;
                const tileY = settlement.y + dy;

                const screenX = (tileX - tileY) * (this.tileWidth / 2);
                const screenY = (tileX + tileY) * (this.tileHeight / 2);

                this.ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - this.tileHeight / 2);
                this.ctx.lineTo(screenX + this.tileWidth / 2, screenY);
                this.ctx.lineTo(screenX, screenY + this.tileHeight / 2);
                this.ctx.lineTo(screenX - this.tileWidth / 2, screenY);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = 'rgba(150, 255, 150, 0.5)';
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
            }
        }

        this.ctx.globalAlpha = 1;
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