class UnitRenderer {
    constructor(ctx, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    drawUnit(unit, cameraX, cameraY, color, isSelected) {
        const screenX = (unit.x - unit.y) * (this.tileWidth / 2);
        const screenY = (unit.x + unit.y) * (this.tileHeight / 2);

        this.ctx.save();

        if (isSelected) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY - 10, 12, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        if (unit.isGuardian) {
            this.drawGuardian(screenX, screenY, unit);
        } else if (color === '#ff0000') {
            this.drawSentinel(screenX, screenY, unit);
        } else {
            this.drawPlayerUnit(screenX, screenY, unit);
        }

        this.drawHealthBar(screenX, screenY - 10, unit.health, unit.maxHealth, unit.isGuardian ? 40 : 20);

        if (unit.moved || unit.attacked) {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY - 10, 10, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawSentinel(screenX, screenY, sentinel) {
        const baseY = screenY - 5;

        this.ctx.save();

        const leftX = screenX - 8;
        const rightX = screenX + 8;
        const topY = baseY - 20;
        const midY = baseY - 10;
        const botY = baseY + 5;

        if (sentinel.type === 'tank') {
            this.ctx.fillStyle = '#1a2a3a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, topY);
            this.ctx.lineTo(rightX + 4, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(leftX - 4, midY - 5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#2a3a4a';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = '#0a1a2a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX - 4, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(screenX - 6, botY);
            this.ctx.lineTo(leftX - 6, midY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#2a3a4a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, midY + 5);
            this.ctx.lineTo(rightX + 4, midY - 5);
            this.ctx.lineTo(rightX + 6, midY);
            this.ctx.lineTo(screenX + 6, botY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#ff3333';
            this.ctx.beginPath();
            this.ctx.arc(screenX - 3, midY - 3, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(screenX + 3, midY - 3, 3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#1a1a2a';
            this.ctx.fillRect(leftX - 4, botY, 4, 8);
            this.ctx.fillRect(rightX, botY, 4, 8);
            this.ctx.fillRect(screenX - 2, botY, 4, 8);
        } else if (sentinel.type === 'ranger') {
            this.ctx.fillStyle = '#2a4a3a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, topY);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(leftX, midY - 5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#3a5a4a';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#1a3a2a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(screenX - 4, botY);
            this.ctx.lineTo(leftX - 4, midY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#3a5a4a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, midY + 5);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(rightX + 4, midY);
            this.ctx.lineTo(screenX + 4, botY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#ff3333';
            this.ctx.beginPath();
            this.ctx.arc(screenX - 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(screenX + 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#4a6a5a';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(rightX + 4, midY - 2);
            this.ctx.lineTo(rightX + 12, midY - 8);
            this.ctx.stroke();
            this.ctx.fillStyle = '#5a7a6a';
            this.ctx.beginPath();
            this.ctx.arc(rightX + 12, midY - 8, 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#1a2a1a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX - 2, botY);
            this.ctx.lineTo(leftX + 2, botY);
            this.ctx.lineTo(leftX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(rightX - 2, botY);
            this.ctx.lineTo(rightX + 2, botY);
            this.ctx.lineTo(rightX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (sentinel.type === 'hacker') {
            this.ctx.fillStyle = '#3a2a4a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, topY);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(leftX, midY - 5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#4a3a5a';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#2a1a3a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(screenX - 4, botY);
            this.ctx.lineTo(leftX - 4, midY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#4a3a5a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, midY + 5);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(rightX + 4, midY);
            this.ctx.lineTo(screenX + 4, botY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#aa33ff';
            this.ctx.beginPath();
            this.ctx.arc(screenX - 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(screenX + 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#5a4a6a';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(rightX + 4, midY);
            this.ctx.lineTo(rightX + 10, midY - 4);
            this.ctx.stroke();
            this.ctx.fillStyle = '#6a5a7a';
            this.ctx.fillRect(rightX + 8, midY - 8, 4, 6);

            this.ctx.fillStyle = '#1a1a2a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX - 2, botY);
            this.ctx.lineTo(leftX + 2, botY);
            this.ctx.lineTo(leftX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(rightX - 2, botY);
            this.ctx.lineTo(rightX + 2, botY);
            this.ctx.lineTo(rightX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.ctx.fillStyle = '#2a3a4a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, topY);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(leftX, midY - 5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#4a5a6a';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            this.ctx.fillStyle = '#1a2a3a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX, midY - 5);
            this.ctx.lineTo(screenX, midY + 5);
            this.ctx.lineTo(screenX - 4, botY);
            this.ctx.lineTo(leftX - 4, midY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#3a4a5a';
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, midY + 5);
            this.ctx.lineTo(rightX, midY - 5);
            this.ctx.lineTo(rightX + 4, midY);
            this.ctx.lineTo(screenX + 4, botY);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = '#ff3333';
            this.ctx.beginPath();
            this.ctx.arc(screenX - 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(screenX + 2, midY - 3, 2.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#1a1a2a';
            this.ctx.beginPath();
            this.ctx.moveTo(leftX - 2, botY);
            this.ctx.lineTo(leftX + 2, botY);
            this.ctx.lineTo(leftX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(rightX - 2, botY);
            this.ctx.lineTo(rightX + 2, botY);
            this.ctx.lineTo(rightX, botY + 10);
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    drawGuardian(screenX, screenY, guardian) {
        const baseY = screenY - 10;

        this.ctx.save();

        const size = 16;
        const leftX = screenX - size;
        const rightX = screenX + size;
        const topY = baseY - 35;
        const midY = baseY - 15;
        const botY = baseY + 10;

        let color1, color2, color3;

        if (guardian.phase === 1) {
            color1 = '#1a1a3a';
            color2 = '#2a2a4a';
            color3 = '#ff3333';
        } else if (guardian.phase === 2) {
            color1 = '#3a1a1a';
            color2 = '#4a2a2a';
            color3 = '#ff6633';
        } else {
            color1 = '#1a0a0a';
            color2 = '#3a1a1a';
            color3 = '#ff0000';
        }

        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, topY);
        this.ctx.lineTo(rightX + 6, midY - 8);
        this.ctx.lineTo(screenX, midY + 8);
        this.ctx.lineTo(leftX - 6, midY - 8);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.fillStyle = color2;
        this.ctx.beginPath();
        this.ctx.moveTo(leftX - 6, midY - 8);
        this.ctx.lineTo(screenX, midY + 8);
        this.ctx.lineTo(screenX - 8, botY);
        this.ctx.lineTo(leftX - 8, midY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color2;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, midY + 8);
        this.ctx.lineTo(rightX + 6, midY - 8);
        this.ctx.lineTo(rightX + 8, midY);
        this.ctx.lineTo(screenX + 8, botY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color3;
        this.ctx.beginPath();
        this.ctx.arc(screenX - 4, midY - 5, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(screenX + 4, midY - 5, 4, 0, Math.PI * 2);
        this.ctx.fill();

        if (guardian.phase >= 2) {
            this.ctx.strokeStyle = color3;
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const x1 = screenX + Math.cos(angle) * 12;
                const y1 = midY + Math.sin(angle) * 12;
                const x2 = screenX + Math.cos(angle) * 18;
                const y2 = midY + Math.sin(angle) * 18;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }

        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(leftX - 6, botY, 6, 12);
        this.ctx.fillRect(rightX, botY, 6, 12);
        this.ctx.fillRect(screenX - 3, botY, 6, 12);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(guardian.name.toUpperCase(), screenX, topY - 8);
        this.ctx.fillText(`P${guardian.phase}`, screenX, topY - 18);

        this.ctx.restore();
    }

    drawPlayerUnit(screenX, screenY, unit) {
        const baseY = screenY;

        this.ctx.save();

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

        this.ctx.fillStyle = '#8b5a3c';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, chestTop);
        this.ctx.lineTo(rightX + 3, chestTop + 3);
        this.ctx.lineTo(rightX + 1, chestBot);
        this.ctx.lineTo(screenX, chestBot + 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#6a4a2c';
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

        this.ctx.fillStyle = '#c97861';
        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 1, chestBot);
        this.ctx.lineTo(rightX + 3, chestBot + 2);
        this.ctx.lineTo(rightX + 2, legBot);
        this.ctx.lineTo(rightX, legBot - 2);
        this.ctx.closePath();
        this.ctx.fill();

        switch(unit.type) {
            case 'assault':
                this.ctx.fillStyle = '#5a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(rightX + 3, chestTop + 4);
                this.ctx.lineTo(rightX + 8, chestTop);
                this.ctx.lineTo(rightX + 10, chestTop + 6);
                this.ctx.lineTo(rightX + 5, chestTop + 10);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.strokeStyle = '#8a4a4a';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                break;

            case 'ranger':
                this.ctx.fillStyle = '#3a5a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(rightX + 1, chestTop + 2);
                this.ctx.lineTo(rightX + 10, chestTop - 4);
                this.ctx.lineTo(rightX + 12, chestTop + 2);
                this.ctx.lineTo(rightX + 3, chestTop + 8);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.fillStyle = '#5a7a5a';
                this.ctx.beginPath();
                this.ctx.arc(rightX + 11, chestTop - 2, 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'tank':
                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 8, chestTop + 1);
                this.ctx.lineTo(screenX + 8, chestTop - 1);
                this.ctx.lineTo(screenX + 10, chestBot + 2);
                this.ctx.lineTo(screenX - 10, chestBot);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.fillRect(screenX - 6, chestBot - 2, 3, 6);
                this.ctx.fillRect(screenX + 3, chestBot - 2, 3, 6);
                break;

            case 'hacker':
                this.ctx.fillStyle = '#5a3a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(rightX + 2, chestTop + 3);
                this.ctx.lineTo(rightX + 9, chestTop - 2);
                this.ctx.lineTo(rightX + 10, chestBot - 2);
                this.ctx.lineTo(rightX + 3, chestBot + 2);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.fillStyle = '#7a5a8a';
                this.ctx.beginPath();
                this.ctx.arc(rightX + 9, chestTop - 4, 1.5, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }

        this.ctx.restore();
    }

    drawDefenseNode(node, cameraX, cameraY) {
        const screenX = (node.x - node.y) * (this.tileWidth / 2);
        const screenY = (node.x + node.y) * (this.tileHeight / 2);

        this.ctx.save();

        const size = 24;
        this.ctx.fillStyle = node.hacked ? '#555555' : '#ff0000';
        this.ctx.fillRect(screenX - size / 2, screenY - size / 2 - 10, size, size);

        this.ctx.strokeStyle = node.hacked ? '#333333' : '#ffff00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(screenX - size / 2, screenY - size / 2 - 10, size, size);

        if (!node.hacked) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('N' + node.id, screenX, screenY - 2);

            this.drawHealthBar(screenX, screenY - 10, node.health, node.maxHealth, 30);
        } else {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = 'bold 10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('HACKED', screenX, screenY - 2);
        }

        this.ctx.restore();
    }


    drawGuardian(screenX, screenY, guardian) {
        const baseY = screenY - 10;

        this.ctx.save();

        const size = 16;
        const leftX = screenX - size;
        const rightX = screenX + size;
        const topY = baseY - 35;
        const midY = baseY - 15;
        const botY = baseY + 10;

        let color1, color2, color3;

        if (guardian.phase === 1) {
            color1 = '#1a1a3a';
            color2 = '#2a2a4a';
            color3 = '#ff3333';
        } else if (guardian.phase === 2) {
            color1 = '#3a1a1a';
            color2 = '#4a2a2a';
            color3 = '#ff6633';
        } else {
            color1 = '#1a0a0a';
            color2 = '#3a1a1a';
            color3 = '#ff0000';
        }

        this.ctx.fillStyle = color1;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, topY);
        this.ctx.lineTo(rightX + 6, midY - 8);
        this.ctx.lineTo(screenX, midY + 8);
        this.ctx.lineTo(leftX - 6, midY - 8);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = color2;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.fillStyle = color2;
        this.ctx.beginPath();
        this.ctx.moveTo(leftX - 6, midY - 8);
        this.ctx.lineTo(screenX, midY + 8);
        this.ctx.lineTo(screenX - 8, botY);
        this.ctx.lineTo(leftX - 8, midY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color2;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, midY + 8);
        this.ctx.lineTo(rightX + 6, midY - 8);
        this.ctx.lineTo(rightX + 8, midY);
        this.ctx.lineTo(screenX + 8, botY);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = color3;
        this.ctx.beginPath();
        this.ctx.arc(screenX - 4, midY - 5, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(screenX + 4, midY - 5, 4, 0, Math.PI * 2);
        this.ctx.fill();

        if (guardian.phase >= 2) {
            this.ctx.strokeStyle = color3;
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const x1 = screenX + Math.cos(angle) * 12;
                const y1 = midY + Math.sin(angle) * 12;
                const x2 = screenX + Math.cos(angle) * 18;
                const y2 = midY + Math.sin(angle) * 18;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            }
        }

        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(leftX - 6, botY, 6, 12);
        this.ctx.fillRect(rightX, botY, 6, 12);
        this.ctx.fillRect(screenX - 3, botY, 6, 12);

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(guardian.name.toUpperCase(), screenX, topY - 8);
        this.ctx.fillText(`P${guardian.phase}`, screenX, topY - 18);

        this.ctx.restore();
    }

    drawBuilder(builder, cameraX, cameraY) {
        const screenX = (builder.currentX - builder.currentY) * (this.tileWidth / 2);
        const screenY = (builder.currentX + builder.currentY) * (this.tileHeight / 2);

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

        this.ctx.fillStyle = '#d4a03a';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, chestTop);
        this.ctx.lineTo(rightX + 3, chestTop + 3);
        this.ctx.lineTo(rightX + 1, chestBot);
        this.ctx.lineTo(screenX, chestBot + 3);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#b8862a';
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
        this.ctx.lineTo(rightX + 12, chestTop - 2);
        this.ctx.lineTo(rightX + 13, chestTop + 2);
        this.ctx.lineTo(rightX + 4, chestTop + 8);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#7a6a5a';
        this.ctx.fillRect(rightX + 10, chestTop - 6, 4, 5);

        this.ctx.restore();
    }

    drawBuilderCount(screenX, screenY, count) {
        this.ctx.save();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY - 32, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(count.toString(), screenX, screenY - 32);

        this.ctx.restore();
    }

    drawHealthBar(x, y, health, maxHealth, width) {
        const barHeight = 4;
        const percent = health / maxHealth;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(x - width / 2, y - 25, width, barHeight);

        let color = '#00ff00';
        if (percent < 0.3) color = '#ff0000';
        else if (percent < 0.6) color = '#ffaa00';

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - width / 2, y - 25, width * percent, barHeight);
    }
}