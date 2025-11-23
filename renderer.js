class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.tileWidth = 64;
        this.tileHeight = 32;
        this.zoom = 1;
        this.lavaSparks = [];
        this.snowParticles = [];
        this.hailstormActive = false;
        this.hailstormEndTime = 0;
        this.colorMap = {
            grass: '#3d4f5c',
            rock: '#4a5a6a',
            ash: '#5a6a7a',
            darksoil: '#2a3a4a',
            lava: '#ff4500',
            water: '#3a5a7a',
            forest: '#3a5a3a',
            nebula: '#4a3a6a',
            void: '#1a2a3a',
            stars: '#5a6a7a',
            floating: '#6a7a9a',
            ice: '#a0d0ff',
            frozen: '#80b0e0',
            tundra: '#c0e0ff',
            sand: '#c2b280',
            dunes: '#d0b070',
            oasis: '#60a060',
            island: '#70b070',
            reef: '#40a0a0',
            deepwater: '#2060a0',
            jungle: '#208040',
            swamp: '#406050',
            canopy: '#308030'
        };
        this.buildingColors = {
            settlement: '#6a7a8a',
            farm: '#5a7a4a',
            warehouse: '#6a6a5a',
            barracks: '#7a5a5a',
            temple: '#7a6a5a',
            forge: '#6a5a4a',
            market: '#6a7a6a',
            castle: '#5a6a7a',
            library: '#5a5a7a',
            university: '#5a6a7a',
            observatory: '#6a6a7a'
        };
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

    generateTile(x, y) {
        let terrain = 'grass';
        let height = Math.random();

        if (this.type === 'volcanic') {
            if (height > 0.7) terrain = 'lava';
            else if (height > 0.5) terrain = 'rock';
            else if (height > 0.3) terrain = 'ash';
            else terrain = 'darksoil';
        } else if (this.type === 'ecosystem') {
            if (height > 0.6) terrain = 'forest';
            else if (height > 0.4) terrain = 'grass';
            else terrain = 'water';
        } else if (this.type === 'galaxy') {
            if (height > 0.7) terrain = 'void';
            else if (height > 0.5) terrain = 'nebula';
            else terrain = 'stars';
        }

        const details = [];
        if (terrain === 'rock' || terrain === 'ash') {
            for (let i = 0; i < 3; i++) {
                details.push({
                    x: (Math.random() - 0.5) * 20,
                    y: (Math.random() - 0.5) * 10
                });
            }
        } else if (terrain === 'lava') {
            for (let i = 0; i < 5; i++) {
                details.push({
                    x: (Math.random() - 0.5) * 25,
                    y: (Math.random() - 0.5) * 12,
                    brightness: Math.random(),
                    size: 2 + Math.random() * 2
                });
            }
        } else if (terrain === 'darksoil') {
            for (let i = 0; i < 4; i++) {
                details.push({
                    x: (Math.random() - 0.5) * 22,
                    y: (Math.random() - 0.5) * 11
                });
            }
        }

        return {
            type: terrain,
            resourceAmount: Math.random() * 50,
            fertility: Math.random(),
            contamination: 0,
            building: null,
            hasGeothermal: false,
            isFloating: false,
            yields: this.calculateYields(terrain),
            details: details
        };
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
            if (tile.details) {
                tile.details.forEach(detail => {
                    const px = screenX + detail.x;
                    const py = screenY + detail.y;
                    this.ctx.fillStyle = this.darkenColor(this.colorMap[tile.type], 0.4);
                    this.ctx.fillRect(px, py, 2, 2);
                });
            }
        }

        if (tile.type === 'lava') {
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

        if (tile.type === 'water') {
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

        if (tile.type === 'sand') {
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

        if (tile.type === 'darksoil') {
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

    drawBuildingFrame(screenX, screenY, building) {
        const size = 16;

        this.ctx.strokeStyle = '#8a8a8a';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);

        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY - size);
        this.ctx.lineTo(screenX + size, screenY);
        this.ctx.lineTo(screenX, screenY + size);
        this.ctx.lineTo(screenX - size, screenY);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        const progress = building.buildProgress;
        const greenValue = Math.floor((progress / 100) * 255);
        const grayValue = 150 - Math.floor((progress / 100) * 50);

        this.ctx.strokeStyle = `rgb(${grayValue}, ${greenValue}, ${grayValue})`;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY - 8, 14, 0, Math.PI * 2);
        this.ctx.stroke();

        const circumference = 2 * Math.PI * 14;
        const drawLength = (progress / 100) * circumference;

        this.ctx.strokeStyle = `rgb(0, 200, 0)`;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (progress / 100) * Math.PI * 2;
        this.ctx.arc(screenX, screenY - 8, 14, startAngle, endAngle);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${Math.floor(progress)}%`, screenX, screenY - 8);

        this.ctx.restore();
    }

    drawBuilding(building, cameraX, cameraY) {
        const screenX = (building.x - building.y) * (this.tileWidth / 2);
        const screenY = (building.x + building.y) * (this.tileHeight / 2);

        this.ctx.save();

        if (building.isFrame) {
            this.drawBuildingFrame(screenX, screenY, building);
        } else {
            switch(building.type) {
                case 'settlement':
                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 12, screenY - 14);
                this.ctx.lineTo(screenX + 12, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 12, screenY - 14);
                this.ctx.lineTo(screenX - 12, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b7355';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 12, screenY - 14);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 12, screenY - 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#654321';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX - 10, screenY - 3);
                this.ctx.lineTo(screenX - 10, screenY - 18);
                this.ctx.lineTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 10, screenY - 18);
                this.ctx.lineTo(screenX + 10, screenY - 3);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a2a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 4, screenY);
                this.ctx.lineTo(screenX - 7, screenY - 1.5);
                this.ctx.lineTo(screenX - 7, screenY + 4);
                this.ctx.lineTo(screenX - 4, screenY + 5.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a6a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 4, screenY - 8);
                this.ctx.lineTo(screenX + 7, screenY - 9.5);
                this.ctx.lineTo(screenX + 7, screenY - 5.5);
                this.ctx.lineTo(screenX + 4, screenY - 4);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'farm':
                this.ctx.fillStyle = '#6a4a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 14, screenY - 10);
                this.ctx.lineTo(screenX + 14, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a6a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 14, screenY - 10);
                this.ctx.lineTo(screenX - 14, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a7a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 14, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 14, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a3a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 6, screenY + 2);
                this.ctx.lineTo(screenX - 9, screenY + 0.5);
                this.ctx.lineTo(screenX - 9, screenY + 4.5);
                this.ctx.lineTo(screenX - 6, screenY + 6);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a7c59';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 8, screenY + 8);
                this.ctx.lineTo(screenX - 6, screenY + 7);
                this.ctx.lineTo(screenX - 4, screenY + 8);
                this.ctx.lineTo(screenX - 6, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 4, screenY + 8);
                this.ctx.lineTo(screenX + 6, screenY + 7);
                this.ctx.lineTo(screenX + 8, screenY + 8);
                this.ctx.lineTo(screenX + 6, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'warehouse':
                this.ctx.fillStyle = '#4a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.lineTo(screenX + 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX - 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 2);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#3a3a2a';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 8, screenY - 2);
                this.ctx.lineTo(screenX + 11, screenY - 3.5);
                this.ctx.lineTo(screenX + 11, screenY + 0.5);
                this.ctx.lineTo(screenX + 8, screenY + 2);
                this.ctx.closePath();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 8, screenY - 2);
                this.ctx.lineTo(screenX - 11, screenY - 3.5);
                this.ctx.lineTo(screenX - 11, screenY + 0.5);
                this.ctx.lineTo(screenX - 8, screenY + 2);
                this.ctx.closePath();
                this.ctx.stroke();
                break;

            case 'barracks':
                this.ctx.fillStyle = '#5a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX + 14, screenY - 15);
                this.ctx.lineTo(screenX + 14, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 14, screenY - 15);
                this.ctx.lineTo(screenX - 14, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 14, screenY - 15);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 14, screenY - 15);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a2a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 10, screenY - 28);
                this.ctx.lineTo(screenX - 7, screenY - 29.5);
                this.ctx.lineTo(screenX - 7, screenY - 20);
                this.ctx.lineTo(screenX - 10, screenY - 18.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a1a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 4, screenY - 2);
                this.ctx.lineTo(screenX - 6, screenY - 3);
                this.ctx.lineTo(screenX - 6, screenY + 3);
                this.ctx.lineTo(screenX - 4, screenY + 4);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a6a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 6, screenY - 8);
                this.ctx.lineTo(screenX + 9, screenY - 9.5);
                this.ctx.lineTo(screenX + 9, screenY - 5.5);
                this.ctx.lineTo(screenX + 6, screenY - 4);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'temple':
                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 16, screenY - 12);
                this.ctx.lineTo(screenX + 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 16, screenY - 12);
                this.ctx.lineTo(screenX - 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a8a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 16, screenY - 12);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 16, screenY - 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX - 14, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.lineTo(screenX + 14, screenY + 2);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#e0d0b0';
                for(let i = -10; i <= 10; i += 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY);
                    this.ctx.lineTo(screenX + i - 1, screenY - 0.5);
                    this.ctx.lineTo(screenX + i - 1, screenY + 9);
                    this.ctx.lineTo(screenX + i, screenY + 9.5);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                break;

            case 'forge':
                this.ctx.fillStyle = '#3a2a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 14, screenY - 11);
                this.ctx.lineTo(screenX + 14, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 14, screenY - 11);
                this.ctx.lineTo(screenX - 14, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 14, screenY - 11);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 14, screenY - 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a1a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 6, screenY - 24);
                this.ctx.lineTo(screenX - 3, screenY - 25.5);
                this.ctx.lineTo(screenX - 3, screenY - 18);
                this.ctx.lineTo(screenX - 6, screenY - 16.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ff6a00';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 4, screenY + 2);
                this.ctx.lineTo(screenX - 6, screenY + 1);
                this.ctx.lineTo(screenX - 6, screenY + 7);
                this.ctx.lineTo(screenX - 4, screenY + 8);
                this.ctx.lineTo(screenX + 4, screenY + 4);
                this.ctx.lineTo(screenX + 4, screenY + 2);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 8, screenY);
                this.ctx.lineTo(screenX + 10, screenY - 1);
                this.ctx.lineTo(screenX + 10, screenY + 1);
                this.ctx.lineTo(screenX + 8, screenY + 2);
                this.ctx.lineTo(screenX + 6, screenY + 1);
                this.ctx.lineTo(screenX + 6, screenY - 1);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'market':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 16, screenY - 9);
                this.ctx.lineTo(screenX + 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 16, screenY - 9);
                this.ctx.lineTo(screenX - 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#d0a080';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 18, screenY - 12);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 18, screenY - 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#b08060';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 12, screenY - 10);
                this.ctx.lineTo(screenX - 14, screenY - 11);
                this.ctx.lineTo(screenX - 12, screenY - 8);
                this.ctx.lineTo(screenX - 10, screenY - 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a6a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 12, screenY + 8);
                this.ctx.lineTo(screenX - 10, screenY + 7);
                this.ctx.lineTo(screenX - 10, screenY + 10);
                this.ctx.lineTo(screenX - 12, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 4, screenY + 8);
                this.ctx.lineTo(screenX + 6, screenY + 7);
                this.ctx.lineTo(screenX + 6, screenY + 10);
                this.ctx.lineTo(screenX + 4, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'castle':
                this.ctx.fillStyle = '#4a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX + 18, screenY - 17);
                this.ctx.lineTo(screenX + 18, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX - 18, screenY - 17);
                this.ctx.lineTo(screenX - 18, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX - 18, screenY - 17);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 18, screenY - 17);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 20, screenY - 32);
                this.ctx.lineTo(screenX - 17, screenY - 33.5);
                this.ctx.lineTo(screenX - 17, screenY - 26);
                this.ctx.lineTo(screenX - 20, screenY - 24.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 3, screenY - 32);
                this.ctx.lineTo(screenX, screenY - 33.5);
                this.ctx.lineTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX - 3, screenY - 24.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 14, screenY - 32);
                this.ctx.lineTo(screenX + 17, screenY - 33.5);
                this.ctx.lineTo(screenX + 17, screenY - 26);
                this.ctx.lineTo(screenX + 14, screenY - 24.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 5, screenY - 2);
                this.ctx.lineTo(screenX - 8, screenY - 3.5);
                this.ctx.lineTo(screenX - 8, screenY + 4);
                this.ctx.lineTo(screenX - 5, screenY + 5.5);
                this.ctx.lineTo(screenX + 5, screenY + 1);
                this.ctx.lineTo(screenX + 5, screenY - 4);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'library':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX + 15, screenY - 15);
                this.ctx.lineTo(screenX + 15, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 15, screenY - 15);
                this.ctx.lineTo(screenX - 15, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 15, screenY - 15);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 15, screenY - 15);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a6a8a';
                for(let i = -10; i <= 10; i += 5) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY - 2);
                    this.ctx.lineTo(screenX + i - 1, screenY - 2.5);
                    this.ctx.lineTo(screenX + i - 1, screenY + 5);
                    this.ctx.lineTo(screenX + i, screenY + 5.5);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                break;

            case 'university':
                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 16, screenY - 16);
                this.ctx.lineTo(screenX + 16, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 16, screenY - 16);
                this.ctx.lineTo(screenX - 16, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a8a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 16, screenY - 16);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 16, screenY - 16);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 8, screenY - 28);
                this.ctx.lineTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 8, screenY - 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 8, screenY - 28);
                this.ctx.lineTo(screenX - 6, screenY - 26.5);
                this.ctx.lineTo(screenX, screenY - 29);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a7a9a';
                for(let i = -12; i <= 12; i += 6) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY - 4);
                    this.ctx.lineTo(screenX + i - 1, screenY - 4.5);
                    this.ctx.lineTo(screenX + i - 1, screenY + 5);
                    this.ctx.lineTo(screenX + i, screenY + 5.5);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                break;

            case 'observatory':
                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 12, screenY - 10);
                this.ctx.lineTo(screenX + 12, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a6a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 12, screenY - 10);
                this.ctx.lineTo(screenX - 12, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 10, screenY - 20);
                this.ctx.bezierCurveTo(screenX - 10, screenY - 26, screenX + 10, screenY - 26, screenX + 10, screenY - 20);
                this.ctx.lineTo(screenX, screenY - 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY - 20, 10, 3, 0, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 6, screenY - 22);
                this.ctx.lineTo(screenX + 9, screenY - 23.5);
                this.ctx.lineTo(screenX + 9, screenY - 21.5);
                this.ctx.lineTo(screenX + 6, screenY - 20);
                this.ctx.lineTo(screenX + 4, screenY - 21);
                this.ctx.lineTo(screenX + 4, screenY - 23);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'spaceship':
                this.ctx.fillStyle = '#5a6a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX + 15, screenY - 10);
                this.ctx.lineTo(screenX + 10, screenY + 10);
                this.ctx.lineTo(screenX - 10, screenY + 10);
                this.ctx.lineTo(screenX - 15, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a8a9a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX - 15, screenY - 10);
                this.ctx.lineTo(screenX - 10, screenY);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.arc(screenX - 5, screenY - 5, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(screenX + 5, screenY - 5, 4, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#ff6600';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 8, screenY + 10);
                this.ctx.lineTo(screenX - 6, screenY + 15);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 8, screenY + 10);
                this.ctx.lineTo(screenX + 6, screenY + 15);
                this.ctx.stroke();
                break;

            case 'ruins':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 8, screenY - 4);
                this.ctx.lineTo(screenX + 8, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX - 8, screenY - 4);
                this.ctx.lineTo(screenX - 8, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.fillRect(screenX - 3, screenY - 2, 6, 8);
                this.ctx.fillRect(screenX - 6, screenY + 2, 4, 4);
                this.ctx.fillRect(screenX + 2, screenY + 4, 4, 3);
                break;

            case 'defense_node':
                break;

            default:
                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.fillRect(screenX - 12, screenY - 8, 24, 16);
            }

            if (building.health < building.maxHealth && building.type !== 'ruins') {
                this.drawHealthBar(screenX, screenY + 15, building.health, building.maxHealth, 30);
            }

            this.ctx.restore();
        }
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
}