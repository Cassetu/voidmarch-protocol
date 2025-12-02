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

    drawBuildingToCanvas(buildingType, canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(centerX, centerY);

        const screenX = 0;
        const screenY = 0;

        switch(buildingType) {
            case 'hut':
                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX + 8, screenY - 8);
                this.ctx.lineTo(screenX + 8, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 6);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX - 8, screenY - 8);
                this.ctx.lineTo(screenX - 8, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 6);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX - 8, screenY - 8);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 8, screenY - 8);
                this.ctx.closePath();
                this.ctx.fill();
                break;

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

            case 'township':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 14, screenY - 17);
                this.ctx.lineTo(screenX + 14, screenY + 3);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 14, screenY - 17);
                this.ctx.lineTo(screenX - 14, screenY + 3);
                this.ctx.lineTo(screenX, screenY + 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 14, screenY - 17);
                this.ctx.lineTo(screenX, screenY - 10);
                this.ctx.lineTo(screenX + 14, screenY - 17);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.fillRect(screenX - 6, screenY - 6, 5, 8);
                this.ctx.fillRect(screenX + 2, screenY - 4, 4, 6);
                this.ctx.fillStyle = '#ffa500';
                this.ctx.fillRect(screenX - 4, screenY, 2, 2);
                break;

            case 'feudaltown':
                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX + 16, screenY - 20);
                this.ctx.lineTo(screenX + 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX - 16, screenY - 20);
                this.ctx.lineTo(screenX - 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a8a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX - 16, screenY - 20);
                this.ctx.lineTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX + 16, screenY - 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(screenX - 4, screenY - 34, 8, 10);
                this.ctx.fillStyle = '#ff0000';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 6, screenY - 34);
                this.ctx.lineTo(screenX + 6, screenY - 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.fillRect(screenX - 8, screenY - 4, 6, 8);
                this.ctx.fillRect(screenX + 3, screenY - 6, 6, 8);
                break;

            case 'citystate':
                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX + 18, screenY - 23);
                this.ctx.lineTo(screenX + 18, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a8a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 18, screenY - 23);
                this.ctx.lineTo(screenX - 18, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#aa9a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 18, screenY - 23);
                this.ctx.lineTo(screenX, screenY - 14);
                this.ctx.lineTo(screenX + 18, screenY - 23);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#b8860b';
                this.ctx.fillRect(screenX - 5, screenY - 40, 10, 12);
                this.ctx.fillStyle = '#daa520';
                this.ctx.fillRect(screenX - 3, screenY - 42, 6, 4);

                for(let i = -14; i <= 14; i += 7) {
                    this.ctx.fillStyle = '#6a5a4a';
                    this.ctx.fillRect(screenX + i - 2, screenY - 8, 4, 10);
                    this.ctx.fillStyle = '#ffa500';
                    this.ctx.fillRect(screenX + i, screenY - 4, 1, 2);
                }
                break;

            case 'factorytown':
                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX + 20, screenY - 25);
                this.ctx.lineTo(screenX + 20, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 15);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 20, screenY - 25);
                this.ctx.lineTo(screenX - 20, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 15);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a7a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 20, screenY - 25);
                this.ctx.lineTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 20, screenY - 25);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.fillRect(screenX - 6, screenY - 44, 4, 12);
                this.ctx.fillRect(screenX + 2, screenY - 42, 4, 10);
                this.ctx.fillRect(screenX - 14, screenY - 40, 4, 8);

                this.ctx.fillStyle = '#808080';
                for(let i = 0; i < 3; i++) {
                    this.ctx.fillRect(screenX - 12 + i * 8, screenY - 12, 4, 8);
                }
                break;

            case 'steamcity':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX + 22, screenY - 27);
                this.ctx.lineTo(screenX + 22, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 17);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 22, screenY - 27);
                this.ctx.lineTo(screenX - 22, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 17);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 22, screenY - 27);
                this.ctx.lineTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 22, screenY - 27);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a4a';
                for(let i = 0; i < 4; i++) {
                    this.ctx.fillRect(screenX - 16 + i * 8, screenY - 48 + i * 2, 4, 14);
                }

                this.ctx.fillStyle = '#cccccc';
                this.ctx.globalAlpha = 0.6;
                for(let i = 0; i < 4; i++) {
                    this.ctx.fillRect(screenX - 16 + i * 8, screenY - 50 + i * 2, 4, 6);
                }
                this.ctx.globalAlpha = 1;
                break;

            case 'metropolis':
                this.ctx.fillStyle = '#7a7a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX + 24, screenY - 30);
                this.ctx.lineTo(screenX + 24, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a8a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX - 24, screenY - 30);
                this.ctx.lineTo(screenX - 24, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9a9a9a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX - 24, screenY - 30);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 24, screenY - 30);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 5; i++) {
                    const h = 16 + Math.random() * 8;
                    this.ctx.fillStyle = '#5a5a5a';
                    this.ctx.fillRect(screenX - 18 + i * 8, screenY - h, 5, h);
                    this.ctx.fillStyle = '#ffff00';
                    for(let j = 0; j < 3; j++) {
                        this.ctx.fillRect(screenX - 17 + i * 8, screenY - h + 4 + j * 4, 1, 1);
                    }
                }
                break;

            case 'powercity':
                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX + 26, screenY - 32);
                this.ctx.lineTo(screenX + 26, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a6a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX - 26, screenY - 32);
                this.ctx.lineTo(screenX - 26, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX - 26, screenY - 32);
                this.ctx.lineTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX + 26, screenY - 32);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 6; i++) {
                    const h = 18 + Math.random() * 10;
                    this.ctx.fillStyle = '#3a4a5a';
                    this.ctx.fillRect(screenX - 22 + i * 8, screenY - h, 5, h);
                    this.ctx.fillStyle = '#00ffff';
                    this.ctx.globalAlpha = 0.8;
                    for(let j = 0; j < 4; j++) {
                        if(Math.random() > 0.5) {
                            this.ctx.fillRect(screenX - 21 + i * 8, screenY - h + 2 + j * 4, 1, 1);
                            this.ctx.fillRect(screenX - 19 + i * 8, screenY - h + 2 + j * 4, 1, 1);
                        }
                    }
                }
                this.ctx.globalAlpha = 1;
                break;

            case 'technopolis':
                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 46);
                this.ctx.lineTo(screenX + 28, screenY - 35);
                this.ctx.lineTo(screenX + 28, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 25);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 46);
                this.ctx.lineTo(screenX - 28, screenY - 35);
                this.ctx.lineTo(screenX - 28, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 25);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 46);
                this.ctx.lineTo(screenX - 28, screenY - 35);
                this.ctx.lineTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 28, screenY - 35);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 7; i++) {
                    const h = 20 + Math.random() * 12;
                    this.ctx.fillStyle = '#1a2a3a';
                    this.ctx.fillRect(screenX - 24 + i * 7, screenY - h, 5, h);

                    this.ctx.strokeStyle = '#00ff00';
                    this.ctx.lineWidth = 1;
                    for(let j = 0; j < 5; j++) {
                        if(Math.random() > 0.3) {
                            this.ctx.strokeRect(screenX - 23 + i * 7, screenY - h + 2 + j * 4, 3, 2);
                        }
                    }
                }

                this.ctx.fillStyle = '#00ffff';
                this.ctx.globalAlpha = 0.4;
                this.ctx.fillRect(screenX - 28, screenY + 10, 56, 2);
                this.ctx.globalAlpha = 1;
                break;

            case 'megacity':
                this.ctx.fillStyle = '#1a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX + 30, screenY - 38);
                this.ctx.lineTo(screenX + 30, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX - 30, screenY - 38);
                this.ctx.lineTo(screenX - 30, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX - 30, screenY - 38);
                this.ctx.lineTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX + 30, screenY - 38);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 8; i++) {
                    const h = 24 + Math.random() * 16;
                    this.ctx.fillStyle = '#0a1a2a';
                    this.ctx.fillRect(screenX - 28 + i * 7, screenY - h, 5, h);

                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.globalAlpha = 0.9;
                    for(let j = 0; j < 6; j++) {
                        if(Math.random() > 0.2) {
                            this.ctx.fillRect(screenX - 27 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            this.ctx.fillRect(screenX - 25 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                        }
                    }
                }
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 52, 6, 0, Math.PI * 2);
                this.ctx.stroke();
                break;

            case 'triworldhub':
                this.ctx.fillStyle = '#1a1a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX + 32, screenY - 41);
                this.ctx.lineTo(screenX + 32, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 31);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX - 32, screenY - 41);
                this.ctx.lineTo(screenX - 32, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 31);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX - 32, screenY - 41);
                this.ctx.lineTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX + 32, screenY - 41);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 9; i++) {
                    const h = 28 + Math.random() * 18;
                    this.ctx.fillStyle = '#0a0a2a';
                    this.ctx.fillRect(screenX - 30 + i * 7, screenY - h, 5, h);

                    const colors = ['#ff00ff', '#00ffff', '#ffff00'];
                    this.ctx.fillStyle = colors[i % 3];
                    this.ctx.globalAlpha = 0.8;
                    for(let j = 0; j < 7; j++) {
                        if(Math.random() > 0.1) {
                            this.ctx.fillRect(screenX - 29 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            this.ctx.fillRect(screenX - 27 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                        }
                    }
                }
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#8800ff';
                this.ctx.beginPath();
                this.ctx.arc(screenX - 12, screenY - 56, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#00ffff';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 58, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(screenX + 12, screenY - 56, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'haven':
                this.ctx.fillStyle = '#0a0a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 58);
                this.ctx.lineTo(screenX + 34, screenY - 44);
                this.ctx.lineTo(screenX + 34, screenY + 20);
                this.ctx.lineTo(screenX, screenY + 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#1a1a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 58);
                this.ctx.lineTo(screenX - 34, screenY - 44);
                this.ctx.lineTo(screenX - 34, screenY + 20);
                this.ctx.lineTo(screenX, screenY + 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 58);
                this.ctx.lineTo(screenX - 34, screenY - 44);
                this.ctx.lineTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX + 34, screenY - 44);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = 0; i < 10; i++) {
                    const h = 32 + Math.random() * 20;
                    this.ctx.fillStyle = '#050510';
                    this.ctx.fillRect(screenX - 32 + i * 7, screenY - h, 5, h);

                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.globalAlpha = 0.9;
                    for(let j = 0; j < 8; j++) {
                        if(Math.random() > 0.05) {
                            this.ctx.fillRect(screenX - 31 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            this.ctx.fillRect(screenX - 29 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                        }
                    }
                }
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 62, 8, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 62, 5, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                for(let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 62);
                    this.ctx.lineTo(screenX + Math.cos(angle) * 12, screenY - 62 + Math.sin(angle) * 12);
                    this.ctx.stroke();
                }
                break;

            case 'farm':
                ctx.fillStyle = '#6a4a2a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 11, screenY - 7);
                ctx.lineTo(screenX + 11, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a6a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX - 11, screenY - 7);
                ctx.lineTo(screenX - 11, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#9a7a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX - 11, screenY - 7);
                ctx.lineTo(screenX, screenY - 3);
                ctx.lineTo(screenX + 11, screenY - 7);
                ctx.closePath();
                ctx.fill();
                break;

            case 'warehouse':
                ctx.fillStyle = '#4a4a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 13, screenY - 8);
                ctx.lineTo(screenX + 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 11);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 13, screenY - 8);
                ctx.lineTo(screenX - 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 11);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 13, screenY - 8);
                ctx.lineTo(screenX, screenY - 2);
                ctx.lineTo(screenX + 13, screenY - 8);
                ctx.closePath();
                ctx.fill();
                break;

            case 'campfire':
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 8, 4, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'tent':
                ctx.fillStyle = '#6d5d45';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX + 12, screenY - 8);
                ctx.lineTo(screenX + 12, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8b7355';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 12, screenY - 8);
                ctx.lineTo(screenX - 12, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#a68a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 12, screenY - 8);
                ctx.lineTo(screenX, screenY - 2);
                ctx.lineTo(screenX + 12, screenY - 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a2a1a';
                ctx.fillRect(screenX - 6, screenY, 4, 6);

                ctx.strokeStyle = '#5a4a3a';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX, screenY + 8);
                ctx.stroke();
                break;

            case 'woodpile':
                ctx.fillStyle = '#654321';
                ctx.fillRect(screenX - 8, screenY - 4, 16, 8);
                ctx.strokeStyle = '#4a3a1a';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX - 8, screenY - 4, 16, 8);
                break;

            case 'granary':
                ctx.fillStyle = '#d2b48c';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX + 15, screenY - 8);
                ctx.lineTo(screenX + 15, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#c19a6b';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 15, screenY - 8);
                ctx.lineTo(screenX - 15, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'quarry':
                ctx.fillStyle = '#696969';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 14, screenY - 6);
                ctx.lineTo(screenX + 14, screenY + 8);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#808080';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX - 14, screenY - 6);
                ctx.lineTo(screenX - 14, screenY + 8);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();
                break;

            case 'monument':
                ctx.fillStyle = '#a0a0a0';
                ctx.fillRect(screenX - 6, screenY - 18, 12, 24);
                ctx.fillStyle = '#c0c0c0';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 22);
                ctx.lineTo(screenX - 8, screenY - 18);
                ctx.lineTo(screenX + 8, screenY - 18);
                ctx.closePath();
                ctx.fill();
                break;

            case 'workshop':
                ctx.fillStyle = '#8b4513';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 13);
                ctx.lineTo(screenX + 12, screenY - 7);
                ctx.lineTo(screenX + 12, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#a0522d';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 13);
                ctx.lineTo(screenX - 12, screenY - 7);
                ctx.lineTo(screenX - 12, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'aqueduct':
                ctx.strokeStyle = '#4682b4';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(screenX - 18, screenY);
                ctx.lineTo(screenX + 18, screenY);
                ctx.stroke();

                for (let i = -15; i <= 15; i += 10) {
                    ctx.fillStyle = '#708090';
                    ctx.fillRect(screenX + i - 2, screenY, 4, 12);
                }
                break;

            case 'watchtower':
                ctx.fillStyle = '#8b7355';
                ctx.fillRect(screenX - 5, screenY - 20, 10, 28);
                ctx.fillStyle = '#654321';
                ctx.fillRect(screenX - 8, screenY - 24, 16, 5);
                break;

            case 'cathedral':
                ctx.fillStyle = '#6a5a8a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 22);
                ctx.lineTo(screenX + 14, screenY - 14);
                ctx.lineTo(screenX + 14, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a9a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 22);
                ctx.lineTo(screenX - 14, screenY - 14);
                ctx.lineTo(screenX - 14, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillRect(screenX - 3, screenY - 28, 6, 10);
                break;

            case 'townhall':
                ctx.fillStyle = '#b8860b';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 20);
                ctx.lineTo(screenX + 15, screenY - 13);
                ctx.lineTo(screenX + 15, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#daa520';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 20);
                ctx.lineTo(screenX - 15, screenY - 13);
                ctx.lineTo(screenX - 15, screenY + 4);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'arena':
                ctx.strokeStyle = '#cd853f';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(screenX, screenY, 20, 12, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#deb887';
                ctx.fill();
                break;

            case 'hospital':
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 13, screenY - 8);
                ctx.lineTo(screenX + 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ff0000';
                ctx.fillRect(screenX - 6, screenY - 4, 12, 3);
                ctx.fillRect(screenX - 1.5, screenY - 8, 3, 12);
                break;

            case 'academy':
                ctx.fillStyle = '#4169e1';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX + 13, screenY - 9);
                ctx.lineTo(screenX + 13, screenY + 4);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6495ed';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 13, screenY - 9);
                ctx.lineTo(screenX - 13, screenY + 4);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();
                break;

            case 'theater':
                ctx.fillStyle = '#8b008b';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 14, screenY - 8);
                ctx.lineTo(screenX + 14, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#9932cc';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 14, screenY - 8);
                ctx.lineTo(screenX - 14, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'mansion':
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 18);
                ctx.lineTo(screenX + 14, screenY - 12);
                ctx.lineTo(screenX + 14, screenY + 3);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffec8b';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 18);
                ctx.lineTo(screenX - 14, screenY - 12);
                ctx.lineTo(screenX - 14, screenY + 3);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();
                break;

            case 'spaceport':
                ctx.fillStyle = '#4a5a6a';
                ctx.fillRect(screenX - 18, screenY - 10, 36, 20);
                ctx.fillStyle = '#6a7a8a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 22);
                ctx.lineTo(screenX - 8, screenY - 10);
                ctx.lineTo(screenX + 8, screenY - 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'laboratory':
                ctx.fillStyle = '#00ced1';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 13, screenY - 8);
                ctx.lineTo(screenX + 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#20b2aa';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 13, screenY - 8);
                ctx.lineTo(screenX - 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'megafactory':
                ctx.fillStyle = '#2f4f4f';
                ctx.fillRect(screenX - 20, screenY - 12, 40, 24);
                ctx.fillStyle = '#708090';
                ctx.fillRect(screenX - 4, screenY - 20, 8, 10);
                ctx.fillRect(screenX + 8, screenY - 18, 6, 8);
                ctx.fillRect(screenX - 14, screenY - 18, 6, 8);
                break;

            case 'observatory':
                ctx.fillStyle = '#4a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 10, screenY - 7);
                ctx.lineTo(screenX + 10, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a6a7a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX - 10, screenY - 7);
                ctx.lineTo(screenX - 10, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 16, 8, 0, Math.PI, true);
                ctx.lineTo(screenX, screenY - 10);
                ctx.closePath();
                ctx.fill();
                break;

            case 'barracks':
                ctx.fillStyle = '#5a3a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX + 11, screenY - 11);
                ctx.lineTo(screenX + 11, screenY + 2);
                ctx.lineTo(screenX, screenY + 7);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX - 11, screenY - 11);
                ctx.lineTo(screenX - 11, screenY + 2);
                ctx.lineTo(screenX, screenY + 7);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX - 11, screenY - 11);
                ctx.lineTo(screenX, screenY - 6);
                ctx.lineTo(screenX + 11, screenY - 11);
                ctx.closePath();
                ctx.fill();
                break;

            case 'temple':
                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX + 13, screenY - 9);
                ctx.lineTo(screenX + 13, screenY + 3);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a7a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 13, screenY - 9);
                ctx.lineTo(screenX - 13, screenY + 3);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#9a8a7a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 13, screenY - 9);
                ctx.lineTo(screenX, screenY - 3);
                ctx.lineTo(screenX + 13, screenY - 9);
                ctx.closePath();
                ctx.fill();
                break;

            case 'forge':
                ctx.fillStyle = '#3a2a2a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 11, screenY - 8);
                ctx.lineTo(screenX + 11, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a3a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 11, screenY - 8);
                ctx.lineTo(screenX - 11, screenY + 3);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 14);
                ctx.lineTo(screenX - 11, screenY - 8);
                ctx.lineTo(screenX, screenY - 3);
                ctx.lineTo(screenX + 11, screenY - 8);
                ctx.closePath();
                ctx.fill();
                break;

            case 'market':
                ctx.fillStyle = '#6a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 13, screenY - 7);
                ctx.lineTo(screenX + 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 12);
                ctx.lineTo(screenX - 13, screenY - 7);
                ctx.lineTo(screenX - 13, screenY + 5);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#d0a080';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 15);
                ctx.lineTo(screenX - 14, screenY - 9);
                ctx.lineTo(screenX, screenY - 3);
                ctx.lineTo(screenX + 14, screenY - 9);
                ctx.closePath();
                ctx.fill();
                break;

            case 'castle':
                ctx.fillStyle = '#4a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 20);
                ctx.lineTo(screenX + 14, screenY - 13);
                ctx.lineTo(screenX + 14, screenY + 2);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 20);
                ctx.lineTo(screenX - 14, screenY - 13);
                ctx.lineTo(screenX - 14, screenY + 2);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a6a7a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 20);
                ctx.lineTo(screenX - 14, screenY - 13);
                ctx.lineTo(screenX, screenY - 6);
                ctx.lineTo(screenX + 14, screenY - 13);
                ctx.closePath();
                ctx.fill();
                break;

            case 'library':
                ctx.fillStyle = '#6a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX + 12, screenY - 11);
                ctx.lineTo(screenX + 12, screenY + 2);
                ctx.lineTo(screenX, screenY + 7);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX - 12, screenY - 11);
                ctx.lineTo(screenX - 12, screenY + 2);
                ctx.lineTo(screenX, screenY + 7);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a7a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 17);
                ctx.lineTo(screenX - 12, screenY - 11);
                ctx.lineTo(screenX, screenY - 6);
                ctx.lineTo(screenX + 12, screenY - 11);
                ctx.closePath();
                ctx.fill();
                break;

            case 'university':
                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 18);
                ctx.lineTo(screenX + 13, screenY - 12);
                ctx.lineTo(screenX + 13, screenY + 2);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a7a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 18);
                ctx.lineTo(screenX - 13, screenY - 12);
                ctx.lineTo(screenX - 13, screenY + 2);
                ctx.lineTo(screenX, screenY + 8);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#9a8a7a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 18);
                ctx.lineTo(screenX - 13, screenY - 12);
                ctx.lineTo(screenX, screenY - 6);
                ctx.lineTo(screenX + 13, screenY - 12);
                ctx.closePath();
                ctx.fill();
                break;

            case 'ironworks':
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX + 16, screenY - 20);
                ctx.lineTo(screenX + 16, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX - 16, screenY - 20);
                ctx.lineTo(screenX - 16, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX - 16, screenY - 20);
                ctx.lineTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 16, screenY - 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(screenX - 5, screenY - 34, 4, 8);
                ctx.fillRect(screenX + 2, screenY - 32, 3, 6);

                ctx.fillStyle = '#ff6600';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(screenX - 4, screenY - 36, 2, 3);
                ctx.fillRect(screenX + 3, screenY - 34, 2, 3);
                ctx.globalAlpha = 1;

                ctx.fillStyle = '#6a4a2a';
                ctx.fillRect(screenX - 12, screenY - 4, 24, 14);

                ctx.fillStyle = '#ff8800';
                ctx.fillRect(screenX - 5, screenY, 10, 6);
                break;

            case 'trainstation':
                ctx.fillStyle = '#5a4a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 24);
                ctx.lineTo(screenX + 18, screenY - 15);
                ctx.lineTo(screenX + 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 17);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 24);
                ctx.lineTo(screenX - 18, screenY - 15);
                ctx.lineTo(screenX - 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 17);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 24);
                ctx.lineTo(screenX - 18, screenY - 15);
                ctx.lineTo(screenX, screenY - 6);
                ctx.lineTo(screenX + 18, screenY - 15);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#3a3a3a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(screenX - 20, screenY + 10);
                ctx.lineTo(screenX + 20, screenY + 10);
                ctx.stroke();

                ctx.fillStyle = '#8a6a4a';
                ctx.fillRect(screenX - 6, screenY - 10, 12, 16);

                ctx.fillStyle = '#4a6a8a';
                ctx.fillRect(screenX - 5, screenY - 8, 4, 5);
                ctx.fillRect(screenX + 1, screenY - 8, 4, 5);
                break;

            case 'coalplant':
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 26);
                ctx.lineTo(screenX + 15, screenY - 18);
                ctx.lineTo(screenX + 15, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 26);
                ctx.lineTo(screenX - 15, screenY - 18);
                ctx.lineTo(screenX - 15, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 26);
                ctx.lineTo(screenX - 15, screenY - 18);
                ctx.lineTo(screenX, screenY - 10);
                ctx.lineTo(screenX + 15, screenY - 18);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(screenX - 4, screenY - 32, 3, 8);
                ctx.fillRect(screenX + 2, screenY - 30, 3, 6);

                ctx.fillStyle = '#888888';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(screenX - 3, screenY - 34, 2, 3);
                ctx.fillRect(screenX + 3, screenY - 32, 2, 3);
                ctx.globalAlpha = 1;

                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(screenX - 10, screenY, 20, 10);

                ctx.fillStyle = '#ff6600';
                ctx.fillRect(screenX - 6, screenY + 2, 3, 5);
                ctx.fillRect(screenX + 3, screenY + 2, 3, 5);
                break;

            case 'steamfactory':
                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.lineTo(screenX + 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX - 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a6a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.closePath();
                ctx.fill();

                for (let i = 0; i < 3; i++) {
                    ctx.fillStyle = '#3a3a3a';
                    ctx.fillRect(screenX - 12 + i * 6, screenY - 36 + i * 2, 3, 10);
                }

                ctx.fillStyle = '#cccccc';
                ctx.globalAlpha = 0.7;
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(screenX - 12 + i * 6, screenY - 38 + i * 2, 3, 5);
                }
                ctx.globalAlpha = 1;

                ctx.fillStyle = '#6a4a2a';
                ctx.fillRect(screenX - 10, screenY - 3, 20, 12);
                break;

            case 'clocktower':
                ctx.fillStyle = '#6a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX + 6, screenY - 33);
                ctx.lineTo(screenX + 6, screenY + 6);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX - 6, screenY - 33);
                ctx.lineTo(screenX - 6, screenY + 6);
                ctx.lineTo(screenX, screenY + 9);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a7a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX - 6, screenY - 33);
                ctx.lineTo(screenX, screenY - 30);
                ctx.lineTo(screenX + 6, screenY - 33);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(screenX - 2, screenY - 42, 4, 8);

                ctx.strokeStyle = '#3a3a3a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(screenX, screenY - 16, 6, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#f0e68c';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 16, 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#2a2a2a';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 16);
                ctx.lineTo(screenX, screenY - 21);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 16);
                ctx.lineTo(screenX + 3, screenY - 16);
                ctx.stroke();
                break;

            case 'gasworks':
                ctx.fillStyle = '#4a4a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX + 15, screenY - 20);
                ctx.lineTo(screenX + 15, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX - 15, screenY - 20);
                ctx.lineTo(screenX - 15, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 28);
                ctx.lineTo(screenX - 15, screenY - 20);
                ctx.lineTo(screenX, screenY - 12);
                ctx.lineTo(screenX + 15, screenY - 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a3a2a';
                ctx.fillRect(screenX - 4, screenY - 34, 3, 8);
                ctx.fillRect(screenX + 2, screenY - 32, 3, 6);

                ctx.fillStyle = '#ffaa44';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(screenX - 3, screenY - 36, 2, 3);
                ctx.fillRect(screenX + 3, screenY - 34, 2, 3);
                ctx.globalAlpha = 1;

                for (let i = 0; i < 3; i++) {
                    ctx.fillStyle = '#6a5a4a';
                    ctx.beginPath();
                    ctx.arc(screenX - 10 + i * 10, screenY + 3, 5, 0, Math.PI);
                    ctx.fill();
                }
                break;

            case 'parliament':
                ctx.fillStyle = '#6a5a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.lineTo(screenX + 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#7a6a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX - 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8a7a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(screenX - 3, screenY - 36, 6, 8);

                ctx.fillStyle = '#b8860b';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 38, 4, 0, Math.PI * 2);
                ctx.fill();

                for (let i = -2; i <= 2; i++) {
                    ctx.fillStyle = '#4a3a2a';
                    ctx.fillRect(screenX + i * 4 - 1, screenY - 3, 2, 12);
                }

                ctx.fillStyle = '#3a2a1a';
                ctx.fillRect(screenX - 5, screenY + 2, 10, 8);
                break;

            case 'gaslamp':
                ctx.fillStyle = '#3a3a3a';
                ctx.fillRect(screenX - 2, screenY - 2, 4, 14);

                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(screenX - 3, screenY + 12, 6, 3);
                ctx.fillRect(screenX - 3, screenY - 5, 6, 3);

                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(screenX - 5, screenY - 10, 10, 5);

                ctx.fillStyle = '#ffdd88';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(screenX, screenY - 7, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.fillStyle = '#ffaa44';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 7, 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'powerplant':
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX + 18, screenY - 24);
                ctx.lineTo(screenX + 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX - 18, screenY - 24);
                ctx.lineTo(screenX - 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX - 18, screenY - 24);
                ctx.lineTo(screenX, screenY - 16);
                ctx.lineTo(screenX + 18, screenY - 24);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(screenX - 5, screenY - 38, 4, 10);
                ctx.fillRect(screenX + 2, screenY - 36, 4, 8);
                ctx.fillRect(screenX - 12, screenY - 34, 4, 6);

                ctx.fillStyle = '#ffaa00';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(screenX - 4, screenY - 40, 2, 3);
                ctx.fillRect(screenX + 3, screenY - 38, 2, 3);
                ctx.fillRect(screenX - 11, screenY - 36, 2, 3);
                ctx.globalAlpha = 1;

                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX - 14, screenY - 5, 28, 14);
                break;

            case 'skyscraper':
                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 42);
                ctx.lineTo(screenX + 8, screenY - 38);
                ctx.lineTo(screenX + 8, screenY + 6);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 42);
                ctx.lineTo(screenX - 8, screenY - 38);
                ctx.lineTo(screenX - 8, screenY + 6);
                ctx.lineTo(screenX, screenY + 10);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a6a7a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 42);
                ctx.lineTo(screenX - 8, screenY - 38);
                ctx.lineTo(screenX, screenY - 34);
                ctx.lineTo(screenX + 8, screenY - 38);
                ctx.closePath();
                ctx.fill();

                for (let floor = 0; floor < 10; floor++) {
                    const y = screenY - 35 + floor * 4;
                    ctx.fillStyle = Math.random() > 0.3 ? '#ffff00' : '#333333';
                    ctx.fillRect(screenX - 6, y, 2, 2);
                    ctx.fillRect(screenX - 2, y, 2, 2);
                    ctx.fillRect(screenX + 2, y, 2, 2);
                    ctx.fillRect(screenX + 6, y, 2, 2);
                }

                ctx.fillStyle = '#ff0000';
                ctx.fillRect(screenX - 1, screenY - 45, 2, 3);
                break;

            case 'subwaystation':
                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.lineTo(screenX + 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#5a5a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX - 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a6a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 30);
                ctx.lineTo(screenX - 16, screenY - 22);
                ctx.lineTo(screenX, screenY - 14);
                ctx.lineTo(screenX + 16, screenY - 22);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a2a';
                ctx.fillRect(screenX - 6, screenY - 5, 12, 16);

                ctx.fillStyle = '#ffaa00';
                ctx.fillRect(screenX - 5, screenY - 3, 10, 2);
                ctx.fillRect(screenX - 5, screenY + 2, 10, 2);
                ctx.fillRect(screenX - 5, screenY + 7, 10, 2);

                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('M', screenX, screenY - 33);
                break;

            case 'datacenter':
                ctx.fillStyle = '#1a1a2a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 35);
                ctx.lineTo(screenX + 20, screenY - 25);
                ctx.lineTo(screenX + 20, screenY + 10);
                ctx.lineTo(screenX, screenY + 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 35);
                ctx.lineTo(screenX - 20, screenY - 25);
                ctx.lineTo(screenX - 20, screenY + 10);
                ctx.lineTo(screenX, screenY + 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a3a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 35);
                ctx.lineTo(screenX - 20, screenY - 25);
                ctx.lineTo(screenX, screenY - 15);
                ctx.lineTo(screenX + 20, screenY - 25);
                ctx.closePath();
                ctx.fill();

                for (let stack = 0; stack < 3; stack++) {
                    for (let row = 0; row < 6; row++) {
                        const x = screenX - 15 + stack * 10;
                        const y = screenY - 12 + row * 4;
                        ctx.fillStyle = Math.random() > 0.2 ? '#0088ff' : '#001144';
                        ctx.fillRect(x, y, 8, 2);
                    }
                }

                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX - 16, screenY - 14, 32, 26);
                break;

            case 'cybercafe':
                ctx.fillStyle = '#2a2a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX + 16, screenY - 24);
                ctx.lineTo(screenX + 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a3a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX - 16, screenY - 24);
                ctx.lineTo(screenX - 16, screenY + 6);
                ctx.lineTo(screenX, screenY + 14);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a4a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 32);
                ctx.lineTo(screenX - 16, screenY - 24);
                ctx.lineTo(screenX, screenY - 16);
                ctx.lineTo(screenX + 16, screenY - 24);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#00ffff';
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        const x = screenX - 10 + i * 7;
                        const y = screenY - 6 + j * 8;
                        ctx.fillRect(x, y, 5, 3);
                    }
                }

                ctx.fillStyle = '#ff00ff';
                ctx.font = 'bold 7px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('CAFE', screenX, screenY - 35);
                break;

            case 'serverbank':
                ctx.fillStyle = '#1a2a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 34);
                ctx.lineTo(screenX + 18, screenY - 26);
                ctx.lineTo(screenX + 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a3a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 34);
                ctx.lineTo(screenX - 18, screenY - 26);
                ctx.lineTo(screenX - 18, screenY + 8);
                ctx.lineTo(screenX, screenY + 16);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 34);
                ctx.lineTo(screenX - 18, screenY - 26);
                ctx.lineTo(screenX, screenY - 18);
                ctx.lineTo(screenX + 18, screenY - 26);
                ctx.closePath();
                ctx.fill();

                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 3; col++) {
                        const x = screenX - 13 + col * 7;
                        const y = screenY - 14 + row * 5;
                        ctx.fillStyle = Math.random() > 0.3 ? '#00ff00' : '#003300';
                        ctx.fillRect(x, y, 5, 3);
                    }
                }
                break;

            case 'fusionreactor':
                ctx.fillStyle = '#2a3a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX + 20, screenY - 27);
                ctx.lineTo(screenX + 20, screenY + 10);
                ctx.lineTo(screenX, screenY + 19);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX - 20, screenY - 27);
                ctx.lineTo(screenX - 20, screenY + 10);
                ctx.lineTo(screenX, screenY + 19);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 36);
                ctx.lineTo(screenX - 20, screenY - 27);
                ctx.lineTo(screenX, screenY - 18);
                ctx.lineTo(screenX + 20, screenY - 27);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#00ffff';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 6, 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#88ffff';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(screenX, screenY - 6, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.strokeStyle = '#00aaff';
                ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY - 6);
                    ctx.lineTo(
                        screenX + Math.cos(angle) * 15,
                        screenY - 6 + Math.sin(angle) * 8
                    );
                    ctx.stroke();
                }
                break;

            case 'orbitalring':
                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 38);
                ctx.lineTo(screenX + 22, screenY - 29);
                ctx.lineTo(screenX + 22, screenY + 12);
                ctx.lineTo(screenX, screenY + 21);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 38);
                ctx.lineTo(screenX - 22, screenY - 29);
                ctx.lineTo(screenX - 22, screenY + 12);
                ctx.lineTo(screenX, screenY + 21);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#6a7a8a';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(screenX, screenY - 8, 20, 12, 0, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = '#8a9aaa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(screenX, screenY - 8, 15, 8, 0, 0, Math.PI * 2);
                ctx.stroke();
                for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = screenX + Math.cos(angle) * 20;
                const y = screenY - 8 + Math.sin(angle) * 12;
                ctx.fillStyle = '#00ffff';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                }
                break;

            case 'quantumlab':
                ctx.fillStyle = '#1a2a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX + 23, screenY - 30);
                ctx.lineTo(screenX + 23, screenY + 13);
                ctx.lineTo(screenX, screenY + 23);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#2a3a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX - 23, screenY - 30);
                ctx.lineTo(screenX - 23, screenY + 13);
                ctx.lineTo(screenX, screenY + 23);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX - 23, screenY - 30);
                ctx.lineTo(screenX, screenY - 20);
                ctx.lineTo(screenX + 23, screenY - 30);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const x = screenX - 15 + i * 10;
                    ctx.strokeRect(x, screenY - 13, 7, 17);
                }
                ctx.fillStyle = '#ff00ff';
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.arc(screenX, screenY - 44, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = '#ffff00';
                ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY - 44);
                    ctx.lineTo(
                        screenX + Math.cos(angle) * 10,
                        screenY - 44 + Math.sin(angle) * 10
                    );
                    ctx.stroke();
                }
                break;
            case 'warpgate':
                ctx.fillStyle = '#2a2a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 43);
                ctx.lineTo(screenX + 25, screenY - 32);
                ctx.lineTo(screenX + 25, screenY + 15);
                ctx.lineTo(screenX, screenY + 26);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#3a3a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 43);
                ctx.lineTo(screenX - 25, screenY - 32);
                ctx.lineTo(screenX - 25, screenY + 15);
                ctx.lineTo(screenX, screenY + 26);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#1a1a3a';
                ctx.fillRect(screenX - 7, screenY - 25, 14, 42);

                ctx.strokeStyle = '#8800ff';
                ctx.lineWidth = 3;
                ctx.strokeRect(screenX - 7, screenY - 25, 14, 42);

                ctx.fillStyle = '#00ffff';
                ctx.globalAlpha = 0.6;
                for (let y = -22; y < 15; y += 5) {
                    ctx.fillRect(screenX - 5, screenY + y, 10, 2);
                }
                ctx.globalAlpha = 1;

                ctx.fillStyle = '#ff00ff';
                ctx.beginPath();
                ctx.arc(screenX - 13, screenY - 28, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(screenX + 13, screenY - 28, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'terraformer':
                ctx.fillStyle = '#2a5a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX + 22, screenY - 29);
                ctx.lineTo(screenX + 22, screenY + 12);
                ctx.lineTo(screenX, screenY + 23);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#3a6a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX - 22, screenY - 29);
                ctx.lineTo(screenX - 22, screenY + 12);
                ctx.lineTo(screenX, screenY + 23);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#4a7a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 40);
                ctx.lineTo(screenX - 22, screenY - 29);
                ctx.lineTo(screenX, screenY - 18);
                ctx.lineTo(screenX + 22, screenY - 29);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(screenX, screenY - 44, 8, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = '#88ff88';
                ctx.globalAlpha = 0.5;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY - 44);
                    ctx.lineTo(
                        screenX + Math.cos(angle) * 16,
                        screenY - 44 + Math.sin(angle) * 10
                    );
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                break;

            case 'colonyship':
                ctx.fillStyle = '#3a4a5a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 42);
                ctx.lineTo(screenX + 24, screenY - 31);
                ctx.lineTo(screenX + 24, screenY + 14);
                ctx.lineTo(screenX, screenY + 25);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#4a5a6a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 42);
                ctx.lineTo(screenX - 24, screenY - 31);
                ctx.lineTo(screenX - 24, screenY + 14);
                ctx.lineTo(screenX, screenY + 25);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a3a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 45);
                ctx.lineTo(screenX - 8, screenY - 42);
                ctx.lineTo(screenX - 7, screenY - 34);
                ctx.lineTo(screenX, screenY - 37);
                ctx.lineTo(screenX + 7, screenY - 34);
                ctx.lineTo(screenX + 8, screenY - 42);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#6a7a8a';
                ctx.fillRect(screenX - 17, screenY - 8, 34, 17);
                ctx.fillRect(screenX - 5, screenY + 9, 10, 13);

                ctx.fillStyle = '#00ffff';
                ctx.fillRect(screenX - 14, screenY - 5, 7, 5);
                ctx.fillRect(screenX + 7, screenY - 5, 7, 5);
                ctx.fillRect(screenX - 3, screenY - 5, 7, 5);
                break;

            case 'dysonswarm':
                ctx.fillStyle = '#1a1a0a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 45);
                ctx.lineTo(screenX + 27, screenY - 34);
                ctx.lineTo(screenX + 27, screenY + 15);
                ctx.lineTo(screenX, screenY + 26);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#2a2a1a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 45);
                ctx.lineTo(screenX - 27, screenY - 34);
                ctx.lineTo(screenX - 27, screenY + 15);
                ctx.lineTo(screenX, screenY + 26);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 50, 10, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ffdd00';
                ctx.beginPath();
                ctx.arc(screenX, screenY - 50, 7, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#ff8800';
                ctx.lineWidth = 2;
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY - 50);
                    ctx.lineTo(
                        screenX + Math.cos(angle) * 23,
                        screenY - 50 + Math.sin(angle) * 13
                    );
                    ctx.stroke();
                }
                break;

            case 'matrixcore':
                ctx.fillStyle = '#0a0a1a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 47);
                ctx.lineTo(screenX + 28, screenY - 36);
                ctx.lineTo(screenX + 28, screenY + 17);
                ctx.lineTo(screenX, screenY + 28);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#1a1a2a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 47);
                ctx.lineTo(screenX - 28, screenY - 36);
                ctx.lineTo(screenX - 28, screenY + 17);
                ctx.lineTo(screenX, screenY + 28);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#2a2a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 47);
                ctx.lineTo(screenX - 28, screenY - 36);
                ctx.lineTo(screenX, screenY - 24);
                ctx.lineTo(screenX + 28, screenY - 36);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#00ff00';
                ctx.globalAlpha = 0.6;
                for (let i = 0; i < 10; i++) {
                    const x = screenX - 25 + (i % 5) * 10;
                    const y = screenY - 17 + Math.floor(i / 5) * 17;
                    ctx.fillRect(x, y, 2, 10);
                }
                ctx.globalAlpha = 1;

                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX - 13, screenY - 7, 26, 20);
                break;

            case 'ascensiongate':
                ctx.fillStyle = '#1a0a2a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 50);
                ctx.lineTo(screenX + 30, screenY - 38);
                ctx.lineTo(screenX + 30, screenY + 18);
                ctx.lineTo(screenX, screenY + 30);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#2a1a3a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 50);
                ctx.lineTo(screenX - 30, screenY - 38);
                ctx.lineTo(screenX - 30, screenY + 18);
                ctx.lineTo(screenX, screenY + 30);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#3a2a4a';
                ctx.beginPath();
                ctx.moveTo(screenX, screenY - 50);
                ctx.lineTo(screenX - 30, screenY - 38);
                ctx.lineTo(screenX, screenY - 26);
                ctx.lineTo(screenX + 30, screenY - 38);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#8800ff';
                ctx.fillRect(screenX - 8, screenY - 8, 16, 34);

                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 3;
                ctx.strokeRect(screenX - 8, screenY - 8, 16, 34);

                ctx.fillStyle = '#ffff00';
                ctx.globalAlpha = 0.8;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = screenX + Math.cos(angle) * 20;
                    const y = screenY + 9 + Math.sin(angle) * 12;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                break;

            default:
                ctx.fillStyle = '#6a7a8a';
                ctx.fillRect(screenX - 10, screenY - 6, 20, 12);
        }

        ctx.restore();
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
                case 'hut':
                    this.ctx.fillStyle = '#5a4a3a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 12);
                    this.ctx.lineTo(screenX + 8, screenY - 8);
                    this.ctx.lineTo(screenX + 8, screenY + 2);
                    this.ctx.lineTo(screenX, screenY + 6);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#6a5a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 12);
                    this.ctx.lineTo(screenX - 8, screenY - 8);
                    this.ctx.lineTo(screenX - 8, screenY + 2);
                    this.ctx.lineTo(screenX, screenY + 6);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#7a6a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 12);
                    this.ctx.lineTo(screenX - 8, screenY - 8);
                    this.ctx.lineTo(screenX, screenY - 4);
                    this.ctx.lineTo(screenX + 8, screenY - 8);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;

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

                case 'township':
                    this.ctx.fillStyle = '#6a5a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 24);
                    this.ctx.lineTo(screenX + 14, screenY - 17);
                    this.ctx.lineTo(screenX + 14, screenY + 3);
                    this.ctx.lineTo(screenX, screenY + 10);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#7a6a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 24);
                    this.ctx.lineTo(screenX - 14, screenY - 17);
                    this.ctx.lineTo(screenX - 14, screenY + 3);
                    this.ctx.lineTo(screenX, screenY + 10);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#8a7a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 24);
                    this.ctx.lineTo(screenX - 14, screenY - 17);
                    this.ctx.lineTo(screenX, screenY - 10);
                    this.ctx.lineTo(screenX + 14, screenY - 17);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#5a4a3a';
                    this.ctx.fillRect(screenX - 6, screenY - 6, 5, 8);
                    this.ctx.fillRect(screenX + 2, screenY - 4, 4, 6);
                    this.ctx.fillStyle = '#ffa500';
                    this.ctx.fillRect(screenX - 4, screenY, 2, 2);
                    break;

                case 'feudaltown':
                    this.ctx.fillStyle = '#7a6a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 28);
                    this.ctx.lineTo(screenX + 16, screenY - 20);
                    this.ctx.lineTo(screenX + 16, screenY + 4);
                    this.ctx.lineTo(screenX, screenY + 12);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#8a7a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 28);
                    this.ctx.lineTo(screenX - 16, screenY - 20);
                    this.ctx.lineTo(screenX - 16, screenY + 4);
                    this.ctx.lineTo(screenX, screenY + 12);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#9a8a7a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 28);
                    this.ctx.lineTo(screenX - 16, screenY - 20);
                    this.ctx.lineTo(screenX, screenY - 12);
                    this.ctx.lineTo(screenX + 16, screenY - 20);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#654321';
                    this.ctx.fillRect(screenX - 4, screenY - 34, 8, 10);
                    this.ctx.fillStyle = '#ff0000';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 36);
                    this.ctx.lineTo(screenX - 6, screenY - 34);
                    this.ctx.lineTo(screenX + 6, screenY - 34);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#5a4a3a';
                    this.ctx.fillRect(screenX - 8, screenY - 4, 6, 8);
                    this.ctx.fillRect(screenX + 3, screenY - 6, 6, 8);
                    break;

                case 'citystate':
                    this.ctx.fillStyle = '#8a7a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 32);
                    this.ctx.lineTo(screenX + 18, screenY - 23);
                    this.ctx.lineTo(screenX + 18, screenY + 5);
                    this.ctx.lineTo(screenX, screenY + 14);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#9a8a7a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 32);
                    this.ctx.lineTo(screenX - 18, screenY - 23);
                    this.ctx.lineTo(screenX - 18, screenY + 5);
                    this.ctx.lineTo(screenX, screenY + 14);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#aa9a8a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 32);
                    this.ctx.lineTo(screenX - 18, screenY - 23);
                    this.ctx.lineTo(screenX, screenY - 14);
                    this.ctx.lineTo(screenX + 18, screenY - 23);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#b8860b';
                    this.ctx.fillRect(screenX - 5, screenY - 40, 10, 12);
                    this.ctx.fillStyle = '#daa520';
                    this.ctx.fillRect(screenX - 3, screenY - 42, 6, 4);

                    for(let i = -14; i <= 14; i += 7) {
                        this.ctx.fillStyle = '#6a5a4a';
                        this.ctx.fillRect(screenX + i - 2, screenY - 8, 4, 10);
                        this.ctx.fillStyle = '#ffa500';
                        this.ctx.fillRect(screenX + i, screenY - 4, 1, 2);
                    }
                    break;

                case 'factorytown':
                    this.ctx.fillStyle = '#5a5a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 34);
                    this.ctx.lineTo(screenX + 20, screenY - 25);
                    this.ctx.lineTo(screenX + 20, screenY + 6);
                    this.ctx.lineTo(screenX, screenY + 15);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#6a6a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 34);
                    this.ctx.lineTo(screenX - 20, screenY - 25);
                    this.ctx.lineTo(screenX - 20, screenY + 6);
                    this.ctx.lineTo(screenX, screenY + 15);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#7a7a7a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 34);
                    this.ctx.lineTo(screenX - 20, screenY - 25);
                    this.ctx.lineTo(screenX, screenY - 16);
                    this.ctx.lineTo(screenX + 20, screenY - 25);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#3a3a3a';
                    this.ctx.fillRect(screenX - 6, screenY - 44, 4, 12);
                    this.ctx.fillRect(screenX + 2, screenY - 42, 4, 10);
                    this.ctx.fillRect(screenX - 14, screenY - 40, 4, 8);

                    this.ctx.fillStyle = '#808080';
                    for(let i = 0; i < 3; i++) {
                        this.ctx.fillRect(screenX - 12 + i * 8, screenY - 12, 4, 8);
                    }
                    break;

                case 'steamcity':
                    this.ctx.fillStyle = '#6a5a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 36);
                    this.ctx.lineTo(screenX + 22, screenY - 27);
                    this.ctx.lineTo(screenX + 22, screenY + 8);
                    this.ctx.lineTo(screenX, screenY + 17);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#7a6a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 36);
                    this.ctx.lineTo(screenX - 22, screenY - 27);
                    this.ctx.lineTo(screenX - 22, screenY + 8);
                    this.ctx.lineTo(screenX, screenY + 17);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#8a7a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 36);
                    this.ctx.lineTo(screenX - 22, screenY - 27);
                    this.ctx.lineTo(screenX, screenY - 18);
                    this.ctx.lineTo(screenX + 22, screenY - 27);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#4a4a4a';
                    for(let i = 0; i < 4; i++) {
                        this.ctx.fillRect(screenX - 16 + i * 8, screenY - 48 + i * 2, 4, 14);
                    }

                    this.ctx.fillStyle = '#cccccc';
                    this.ctx.globalAlpha = 0.6;
                    for(let i = 0; i < 4; i++) {
                        this.ctx.fillRect(screenX - 16 + i * 8, screenY - 50 + i * 2, 4, 6);
                    }
                    this.ctx.globalAlpha = 1;
                    break;

                case 'metropolis':
                    this.ctx.fillStyle = '#7a7a7a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 40);
                    this.ctx.lineTo(screenX + 24, screenY - 30);
                    this.ctx.lineTo(screenX + 24, screenY + 10);
                    this.ctx.lineTo(screenX, screenY + 20);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#8a8a8a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 40);
                    this.ctx.lineTo(screenX - 24, screenY - 30);
                    this.ctx.lineTo(screenX - 24, screenY + 10);
                    this.ctx.lineTo(screenX, screenY + 20);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#9a9a9a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 40);
                    this.ctx.lineTo(screenX - 24, screenY - 30);
                    this.ctx.lineTo(screenX, screenY - 20);
                    this.ctx.lineTo(screenX + 24, screenY - 30);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 5; i++) {
                        const h = 16 + Math.random() * 8;
                        this.ctx.fillStyle = '#5a5a5a';
                        this.ctx.fillRect(screenX - 18 + i * 8, screenY - h, 5, h);
                        this.ctx.fillStyle = '#ffff00';
                        for(let j = 0; j < 3; j++) {
                            this.ctx.fillRect(screenX - 17 + i * 8, screenY - h + 4 + j * 4, 1, 1);
                        }
                    }
                    break;

                case 'powercity':
                    this.ctx.fillStyle = '#4a5a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 42);
                    this.ctx.lineTo(screenX + 26, screenY - 32);
                    this.ctx.lineTo(screenX + 26, screenY + 12);
                    this.ctx.lineTo(screenX, screenY + 22);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#5a6a7a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 42);
                    this.ctx.lineTo(screenX - 26, screenY - 32);
                    this.ctx.lineTo(screenX - 26, screenY + 12);
                    this.ctx.lineTo(screenX, screenY + 22);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#6a7a8a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 42);
                    this.ctx.lineTo(screenX - 26, screenY - 32);
                    this.ctx.lineTo(screenX, screenY - 22);
                    this.ctx.lineTo(screenX + 26, screenY - 32);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 6; i++) {
                        const h = 18 + Math.random() * 10;
                        this.ctx.fillStyle = '#3a4a5a';
                        this.ctx.fillRect(screenX - 22 + i * 8, screenY - h, 5, h);
                        this.ctx.fillStyle = '#00ffff';
                        this.ctx.globalAlpha = 0.8;
                        for(let j = 0; j < 4; j++) {
                            if(Math.random() > 0.5) {
                                this.ctx.fillRect(screenX - 21 + i * 8, screenY - h + 2 + j * 4, 1, 1);
                                this.ctx.fillRect(screenX - 19 + i * 8, screenY - h + 2 + j * 4, 1, 1);
                            }
                        }
                    }
                    this.ctx.globalAlpha = 1;
                    break;

                case 'technopolis':
                    this.ctx.fillStyle = '#2a3a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 46);
                    this.ctx.lineTo(screenX + 28, screenY - 35);
                    this.ctx.lineTo(screenX + 28, screenY + 14);
                    this.ctx.lineTo(screenX, screenY + 25);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#3a4a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 46);
                    this.ctx.lineTo(screenX - 28, screenY - 35);
                    this.ctx.lineTo(screenX - 28, screenY + 14);
                    this.ctx.lineTo(screenX, screenY + 25);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#4a5a6a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 46);
                    this.ctx.lineTo(screenX - 28, screenY - 35);
                    this.ctx.lineTo(screenX, screenY - 24);
                    this.ctx.lineTo(screenX + 28, screenY - 35);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 7; i++) {
                        const h = 20 + Math.random() * 12;
                        this.ctx.fillStyle = '#1a2a3a';
                        this.ctx.fillRect(screenX - 24 + i * 7, screenY - h, 5, h);

                        this.ctx.strokeStyle = '#00ff00';
                        this.ctx.lineWidth = 1;
                        for(let j = 0; j < 5; j++) {
                            if(Math.random() > 0.3) {
                                this.ctx.strokeRect(screenX - 23 + i * 7, screenY - h + 2 + j * 4, 3, 2);
                            }
                        }
                    }

                    this.ctx.fillStyle = '#00ffff';
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.fillRect(screenX - 28, screenY + 10, 56, 2);
                    this.ctx.globalAlpha = 1;
                    break;

                case 'megacity':
                    this.ctx.fillStyle = '#1a2a3a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 50);
                    this.ctx.lineTo(screenX + 30, screenY - 38);
                    this.ctx.lineTo(screenX + 30, screenY + 16);
                    this.ctx.lineTo(screenX, screenY + 28);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#2a3a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 50);
                    this.ctx.lineTo(screenX - 30, screenY - 38);
                    this.ctx.lineTo(screenX - 30, screenY + 16);
                    this.ctx.lineTo(screenX, screenY + 28);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#3a4a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 50);
                    this.ctx.lineTo(screenX - 30, screenY - 38);
                    this.ctx.lineTo(screenX, screenY - 26);
                    this.ctx.lineTo(screenX + 30, screenY - 38);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 8; i++) {
                        const h = 24 + Math.random() * 16;
                        this.ctx.fillStyle = '#0a1a2a';
                        this.ctx.fillRect(screenX - 28 + i * 7, screenY - h, 5, h);

                        this.ctx.fillStyle = '#ffff00';
                        this.ctx.globalAlpha = 0.9;
                        for(let j = 0; j < 6; j++) {
                            if(Math.random() > 0.2) {
                                this.ctx.fillRect(screenX - 27 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                                this.ctx.fillRect(screenX - 25 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            }
                        }
                    }
                    this.ctx.globalAlpha = 1;

                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY - 52, 6, 0, Math.PI * 2);
                    this.ctx.stroke();
                    break;

                case 'triworldhub':
                    this.ctx.fillStyle = '#1a1a3a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 54);
                    this.ctx.lineTo(screenX + 32, screenY - 41);
                    this.ctx.lineTo(screenX + 32, screenY + 18);
                    this.ctx.lineTo(screenX, screenY + 31);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#2a2a4a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 54);
                    this.ctx.lineTo(screenX - 32, screenY - 41);
                    this.ctx.lineTo(screenX - 32, screenY + 18);
                    this.ctx.lineTo(screenX, screenY + 31);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#3a3a5a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 54);
                    this.ctx.lineTo(screenX - 32, screenY - 41);
                    this.ctx.lineTo(screenX, screenY - 28);
                    this.ctx.lineTo(screenX + 32, screenY - 41);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 9; i++) {
                        const h = 28 + Math.random() * 18;
                        this.ctx.fillStyle = '#0a0a2a';
                        this.ctx.fillRect(screenX - 30 + i * 7, screenY - h, 5, h);

                        const colors = ['#ff00ff', '#00ffff', '#ffff00'];
                        this.ctx.fillStyle = colors[i % 3];
                        this.ctx.globalAlpha = 0.8;
                        for(let j = 0; j < 7; j++) {
                            if(Math.random() > 0.1) {
                                this.ctx.fillRect(screenX - 29 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                                this.ctx.fillRect(screenX - 27 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            }
                        }
                    }
                    this.ctx.globalAlpha = 1;

                    this.ctx.fillStyle = '#8800ff';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX - 12, screenY - 56, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#00ffff';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY - 58, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX + 12, screenY - 56, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'haven':
                    this.ctx.fillStyle = '#0a0a1a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 58);
                    this.ctx.lineTo(screenX + 34, screenY - 44);
                    this.ctx.lineTo(screenX + 34, screenY + 20);
                    this.ctx.lineTo(screenX, screenY + 34);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#1a1a2a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 58);
                    this.ctx.lineTo(screenX - 34, screenY - 44);
                    this.ctx.lineTo(screenX - 34, screenY + 20);
                    this.ctx.lineTo(screenX, screenY + 34);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#2a2a3a';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 58);
                    this.ctx.lineTo(screenX - 34, screenY - 44);
                    this.ctx.lineTo(screenX, screenY - 30);
                    this.ctx.lineTo(screenX + 34, screenY - 44);
                    this.ctx.closePath();
                    this.ctx.fill();

                    for(let i = 0; i < 10; i++) {
                        const h = 32 + Math.random() * 20;
                        this.ctx.fillStyle = '#050510';
                        this.ctx.fillRect(screenX - 32 + i * 7, screenY - h, 5, h);

                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.globalAlpha = 0.9;
                        for(let j = 0; j < 8; j++) {
                            if(Math.random() > 0.05) {
                                this.ctx.fillRect(screenX - 31 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                                this.ctx.fillRect(screenX - 29 + i * 7, screenY - h + 2 + j * 4, 1, 1);
                            }
                        }
                    }
                    this.ctx.globalAlpha = 1;

                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY - 62, 8, 0, Math.PI * 2);
                    this.ctx.stroke();

                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX, screenY - 62, 5, 0, Math.PI * 2);
                    this.ctx.fill();

                    this.ctx.strokeStyle = '#00ffff';
                    this.ctx.lineWidth = 2;
                    for(let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(screenX, screenY - 62);
                        this.ctx.lineTo(screenX + Math.cos(angle) * 12, screenY - 62 + Math.sin(angle) * 12);
                        this.ctx.stroke();
                    }
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
                this.ctx.fillStyle = '#555545';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 18, screenY - 10);
                this.ctx.lineTo(screenX + 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#626253';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 18, screenY - 10);
                this.ctx.lineTo(screenX - 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#777767';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 18, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 2);
                this.ctx.lineTo(screenX + 18, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2f2f22';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 6, screenY + 4);
                this.ctx.lineTo(screenX + 12, screenY + 2);
                this.ctx.lineTo(screenX + 12, screenY + 12);
                this.ctx.lineTo(screenX + 6, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 6, screenY + 4);
                this.ctx.lineTo(screenX - 12, screenY + 2);
                this.ctx.lineTo(screenX - 12, screenY + 12);
                this.ctx.lineTo(screenX - 6, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();
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

            case 'campfire':
                this.ctx.fillStyle = '#654321';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY + 5, 8, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#ff6600';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX - 6, screenY + 2);
                this.ctx.lineTo(screenX - 2, screenY + 2);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ffaa00';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 2, screenY + 2);
                this.ctx.lineTo(screenX + 6, screenY + 2);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ff3300';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 6, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'tent':
                this.ctx.fillStyle = '#6d5d45';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 14, screenY - 9);
                this.ctx.lineTo(screenX + 14, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b7355';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 14, screenY - 9);
                this.ctx.lineTo(screenX - 14, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#a68a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 14, screenY - 9);
                this.ctx.lineTo(screenX, screenY);
                this.ctx.lineTo(screenX + 14, screenY - 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a2a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 5, screenY + 3);
                this.ctx.lineTo(screenX - 8, screenY + 1.5);
                this.ctx.lineTo(screenX - 8, screenY + 8);
                this.ctx.lineTo(screenX - 5, screenY + 9.5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#5a4a3a';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX, screenY + 11);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 14, screenY - 9);
                this.ctx.lineTo(screenX + 14, screenY - 9);
                this.ctx.stroke();
                break;

            case 'woodpile':
                this.ctx.fillStyle = '#654321';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 10);
                this.ctx.lineTo(screenX + 10, screenY - 5);
                this.ctx.lineTo(screenX + 10, screenY + 3);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b6914';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 10);
                this.ctx.lineTo(screenX - 10, screenY - 5);
                this.ctx.lineTo(screenX - 10, screenY + 3);
                this.ctx.lineTo(screenX, screenY + 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#4a3a1a';
                this.ctx.lineWidth = 2;
                for (let i = -8; i <= 8; i += 4) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY - 8);
                    this.ctx.lineTo(screenX + i, screenY + 6);
                    this.ctx.stroke();
                }
                break;

            case 'granary':
                this.ctx.fillStyle = '#d2b48c';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.lineTo(screenX + 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#c19a6b';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX - 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#daa520';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 2);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(screenX - 4, screenY, 8, 10);
                break;

            case 'quarry':
                this.ctx.fillStyle = '#696969';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 18, screenY - 8);
                this.ctx.lineTo(screenX + 18, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#808080';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 18, screenY - 8);
                this.ctx.lineTo(screenX - 18, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#a9a9a9';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 18, screenY - 8);
                this.ctx.lineTo(screenX, screenY);
                this.ctx.lineTo(screenX + 18, screenY - 8);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#556b2f';
                this.ctx.fillRect(screenX - 6, screenY + 6, 12, 8);
                break;

            case 'monument':
                this.ctx.fillStyle = '#a0a0a0';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 25);
                this.ctx.lineTo(screenX + 8, screenY - 20);
                this.ctx.lineTo(screenX + 8, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#c0c0c0';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 25);
                this.ctx.lineTo(screenX - 8, screenY - 20);
                this.ctx.lineTo(screenX - 8, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#d3d3d3';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 25);
                this.ctx.lineTo(screenX - 8, screenY - 20);
                this.ctx.lineTo(screenX, screenY - 15);
                this.ctx.lineTo(screenX + 8, screenY - 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#708090';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX - 10, screenY - 25);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 10, screenY - 25);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'workshop':
                this.ctx.fillStyle = '#8b4513';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 14, screenY - 9);
                this.ctx.lineTo(screenX + 14, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#a0522d';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 14, screenY - 9);
                this.ctx.lineTo(screenX - 14, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#cd853f';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 14, screenY - 9);
                this.ctx.lineTo(screenX, screenY - 2);
                this.ctx.lineTo(screenX + 14, screenY - 9);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#696969';
                this.ctx.fillRect(screenX + 4, screenY - 4, 6, 8);
                this.ctx.fillRect(screenX - 10, screenY + 2, 6, 6);
                break;

            case 'aqueduct':
                this.ctx.fillStyle = '#708090';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 20, screenY - 2);
                this.ctx.lineTo(screenX + 20, screenY - 2);
                this.ctx.lineTo(screenX + 20, screenY + 4);
                this.ctx.lineTo(screenX - 20, screenY + 4);
                this.ctx.closePath();
                this.ctx.fill();

                for (let i = -18; i <= 18; i += 12) {
                    this.ctx.fillStyle = '#a9a9a9';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY + 4);
                    this.ctx.lineTo(screenX + i + 4, screenY + 6);
                    this.ctx.lineTo(screenX + i + 4, screenY + 14);
                    this.ctx.lineTo(screenX + i, screenY + 16);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.fillStyle = '#778899';
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY + 4);
                    this.ctx.lineTo(screenX + i - 4, screenY + 6);
                    this.ctx.lineTo(screenX + i - 4, screenY + 14);
                    this.ctx.lineTo(screenX + i, screenY + 16);
                    this.ctx.closePath();
                    this.ctx.fill();
                }

                this.ctx.fillStyle = '#4682b4';
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(screenX - 20, screenY - 4, 40, 4);
                this.ctx.globalAlpha = 1;
                break;

            case 'watchtower':
                this.ctx.fillStyle = '#8b7355';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX + 6, screenY - 25);
                this.ctx.lineTo(screenX + 6, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#a0826d';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX - 6, screenY - 25);
                this.ctx.lineTo(screenX - 6, screenY + 2);
                this.ctx.lineTo(screenX, screenY + 5);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#654321';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 10, screenY - 28);
                this.ctx.lineTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 10, screenY - 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(screenX - 3, screenY - 10, 6, 4);
                break;

            case 'cathedral':
                this.ctx.fillStyle = '#6a5a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX + 16, screenY - 18);
                this.ctx.lineTo(screenX + 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a9a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX - 16, screenY - 18);
                this.ctx.lineTo(screenX - 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7aaa';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 26);
                this.ctx.lineTo(screenX - 16, screenY - 18);
                this.ctx.lineTo(screenX, screenY - 10);
                this.ctx.lineTo(screenX + 16, screenY - 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a3a6a';
                this.ctx.fillRect(screenX - 4, screenY - 36, 8, 12);
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 38, 3, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#4169e1';
                this.ctx.fillRect(screenX - 4, screenY - 8, 8, 10);
                break;

            case 'townhall':
                this.ctx.fillStyle = '#b8860b';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 17, screenY - 16);
                this.ctx.lineTo(screenX + 17, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#daa520';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 17, screenY - 16);
                this.ctx.lineTo(screenX - 17, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX - 17, screenY - 16);
                this.ctx.lineTo(screenX, screenY - 8);
                this.ctx.lineTo(screenX + 17, screenY - 16);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(screenX - 6, screenY - 2, 12, 10);

                this.ctx.fillStyle = '#4682b4';
                this.ctx.fillRect(screenX - 10, screenY - 12, 6, 6);
                this.ctx.fillRect(screenX + 4, screenY - 12, 6, 6);
                break;

            case 'arena':
                this.ctx.fillStyle = '#cd853f';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 14);
                this.ctx.lineTo(screenX + 22, screenY - 6);
                this.ctx.lineTo(screenX + 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#deb887';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 14);
                this.ctx.lineTo(screenX - 22, screenY - 6);
                this.ctx.lineTo(screenX - 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#f5deb3';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY + 4, 18, 10, 0, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#8b6914';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY + 4, 18, 10, 0, 0, Math.PI * 2);
                this.ctx.stroke();
                break;

            case 'hospital':
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX + 15, screenY - 10);
                this.ctx.lineTo(screenX + 15, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#f0f0f0';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX - 15, screenY - 10);
                this.ctx.lineTo(screenX - 15, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(screenX - 8, screenY - 6, 16, 4);
                this.ctx.fillRect(screenX - 2, screenY - 12, 4, 16);

                this.ctx.fillStyle = '#4682b4';
                this.ctx.fillRect(screenX - 10, screenY, 6, 6);
                this.ctx.fillRect(screenX + 4, screenY, 6, 6);
                break;

            case 'academy':
                this.ctx.fillStyle = '#4169e1';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 15, screenY - 11);
                this.ctx.lineTo(screenX + 15, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6495ed';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 15, screenY - 11);
                this.ctx.lineTo(screenX - 15, screenY + 5);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#87ceeb';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX - 15, screenY - 11);
                this.ctx.lineTo(screenX, screenY - 4);
                this.ctx.lineTo(screenX + 15, screenY - 11);
                this.ctx.closePath();
                this.ctx.fill();

                for(let i = -12; i <= 12; i += 6) {
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.fillRect(screenX + i - 2, screenY - 2, 4, 8);
                }
                break;

            case 'theater':
                this.ctx.fillStyle = '#8b008b';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.lineTo(screenX + 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#9932cc';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX - 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ba55d3';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX - 16, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 3);
                this.ctx.lineTo(screenX + 16, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(screenX - 6, screenY - 4, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(screenX + 6, screenY - 4, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'mansion':
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX + 16, screenY - 14);
                this.ctx.lineTo(screenX + 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ffec8b';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 16, screenY - 14);
                this.ctx.lineTo(screenX - 16, screenY + 4);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#fff68f';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 22);
                this.ctx.lineTo(screenX - 16, screenY - 14);
                this.ctx.lineTo(screenX, screenY - 6);
                this.ctx.lineTo(screenX + 16, screenY - 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(screenX - 4, screenY, 8, 10);

                for(let i = -12; i <= 12; i += 8) {
                    this.ctx.fillStyle = '#4169e1';
                    this.ctx.fillRect(screenX + i - 2, screenY - 8, 4, 6);
                }
                break;

            case 'spaceport':
                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 24, screenY - 10);
                this.ctx.lineTo(screenX + 24, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 24, screenY - 10);
                this.ctx.lineTo(screenX - 24, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a9aaa';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX - 24, screenY - 10);
                this.ctx.lineTo(screenX, screenY);
                this.ctx.lineTo(screenX + 24, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX - 8, screenY - 26);
                this.ctx.lineTo(screenX - 8, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 6);
                this.ctx.lineTo(screenX + 8, screenY - 10);
                this.ctx.lineTo(screenX + 8, screenY - 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ff6600';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 6);
                this.ctx.lineTo(screenX - 6, screenY - 2);
                this.ctx.lineTo(screenX, screenY + 4);
                this.ctx.lineTo(screenX + 6, screenY - 2);
                this.ctx.closePath();
                this.ctx.fill();
                break;

            case 'laboratory':
                this.ctx.fillStyle = '#00ced1';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX + 15, screenY - 10);
                this.ctx.lineTo(screenX + 15, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#20b2aa';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX - 15, screenY - 10);
                this.ctx.lineTo(screenX - 15, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#48d1cc';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 17);
                this.ctx.lineTo(screenX - 15, screenY - 10);
                this.ctx.lineTo(screenX, screenY - 3);
                this.ctx.lineTo(screenX + 15, screenY - 10);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#00ffff';
                this.ctx.beginPath();
                this.ctx.arc(screenX - 6, screenY - 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(screenX + 6, screenY - 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY + 4, 3, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'megafactory':
                this.ctx.fillStyle = '#2f4f4f';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 24, screenY - 6);
                this.ctx.lineTo(screenX + 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a5f5f';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 24, screenY - 6);
                this.ctx.lineTo(screenX - 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#708090';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX - 24, screenY - 6);
                this.ctx.lineTo(screenX, screenY + 4);
                this.ctx.lineTo(screenX + 24, screenY - 6);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#1a1a1a';
                this.ctx.fillRect(screenX - 6, screenY - 24, 5, 10);
                this.ctx.fillRect(screenX + 10, screenY - 20, 4, 8);
                this.ctx.fillRect(screenX - 14, screenY - 20, 4, 8);

                this.ctx.fillStyle = '#ff6600';
                this.ctx.fillRect(screenX - 4, screenY - 26, 2, 4);
                this.ctx.fillRect(screenX + 11, screenY - 22, 2, 4);
                this.ctx.fillRect(screenX - 12, screenY - 22, 2, 4);
                break;

            case 'observatory':
                this.ctx.fillStyle = '#425161';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX + 14, screenY - 4);
                this.ctx.lineTo(screenX + 14, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 16);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#505f70';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX - 14, screenY - 4);
                this.ctx.lineTo(screenX - 14, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 16);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2d3b49';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY - 18, 14, 7, 0, Math.PI, 0, true);
                this.ctx.lineTo(screenX - 14, screenY - 12);
                this.ctx.lineTo(screenX + 14, screenY - 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7c8ea4';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY - 20, 14, 10, 0, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#95a7c0';
                this.ctx.beginPath();
                this.ctx.ellipse(screenX - 4, screenY - 23, 6, 4, -0.3, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#2b3744';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 4, screenY - 22);
                this.ctx.lineTo(screenX + 12, screenY - 28);
                this.ctx.lineTo(screenX + 13, screenY - 25);
                this.ctx.lineTo(screenX + 6, screenY - 20);
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

            case 'fusionreactor':
                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX + 24, screenY - 32);
                this.ctx.lineTo(screenX + 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX - 24, screenY - 32);
                this.ctx.lineTo(screenX - 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX - 24, screenY - 32);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 24, screenY - 32);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#00ffff';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 8, 12, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#88ffff';
                this.ctx.globalAlpha = 0.8;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 8, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#00aaff';
                this.ctx.lineWidth = 3;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 8);
                    this.ctx.lineTo(
                        screenX + Math.cos(angle) * 18,
                        screenY - 8 + Math.sin(angle) * 10
                    );
                    this.ctx.stroke();
                }
                break;

            case 'serverbank':
                this.ctx.fillStyle = '#1a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX + 22, screenY - 30);
                this.ctx.lineTo(screenX + 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX - 22, screenY - 30);
                this.ctx.lineTo(screenX - 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX - 22, screenY - 30);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 22, screenY - 30);
                this.ctx.closePath();
                this.ctx.fill();

                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 4; col++) {
                        const x = screenX - 16 + col * 8;
                        const y = screenY - 16 + row * 5;
                        this.ctx.fillStyle = Math.random() > 0.3 ? '#00ff00' : '#003300';
                        this.ctx.fillRect(x, y, 6, 3);
                    }
                }
                break;

            case 'cybercafe':
                this.ctx.fillStyle = '#2a2a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX + 20, screenY - 28);
                this.ctx.lineTo(screenX + 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX - 20, screenY - 28);
                this.ctx.lineTo(screenX - 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX - 20, screenY - 28);
                this.ctx.lineTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 20, screenY - 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#00ffff';
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        const x = screenX - 12 + i * 8;
                        const y = screenY - 8 + j * 10;
                        this.ctx.fillRect(x, y, 6, 4);
                    }
                }

                this.ctx.fillStyle = '#ff00ff';
                this.ctx.font = 'bold 8px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('CAFE', screenX, screenY - 42);
                break;

            case 'datacenter':
                this.ctx.fillStyle = '#1a1a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX + 24, screenY - 30);
                this.ctx.lineTo(screenX + 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX - 24, screenY - 30);
                this.ctx.lineTo(screenX - 24, screenY + 12);
                this.ctx.lineTo(screenX, screenY + 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 42);
                this.ctx.lineTo(screenX - 24, screenY - 30);
                this.ctx.lineTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 24, screenY - 30);
                this.ctx.closePath();
                this.ctx.fill();

                for (let stack = 0; stack < 3; stack++) {
                    for (let row = 0; row < 8; row++) {
                        const x = screenX - 18 + stack * 12;
                        const y = screenY - 14 + row * 4;
                        this.ctx.fillStyle = Math.random() > 0.2 ? '#0088ff' : '#001144';
                        this.ctx.fillRect(x, y, 10, 2);
                    }
                }

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 20, screenY - 16, 40, 30);
                break;

            case 'subwaystation':
                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.lineTo(screenX + 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX - 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.fillRect(screenX - 8, screenY - 6, 16, 20);

                this.ctx.fillStyle = '#ffaa00';
                this.ctx.fillRect(screenX - 6, screenY - 4, 12, 3);
                this.ctx.fillRect(screenX - 6, screenY + 2, 12, 3);
                this.ctx.fillRect(screenX - 6, screenY + 8, 12, 3);

                this.ctx.fillStyle = '#ff0000';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('M', screenX, screenY - 40);
                break;

            case 'skyscraper':
                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX + 10, screenY - 45);
                this.ctx.lineTo(screenX + 10, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX - 10, screenY - 45);
                this.ctx.lineTo(screenX - 10, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 13);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a6a7a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX - 10, screenY - 45);
                this.ctx.lineTo(screenX, screenY - 40);
                this.ctx.lineTo(screenX + 10, screenY - 45);
                this.ctx.closePath();
                this.ctx.fill();

                for (let floor = 0; floor < 12; floor++) {
                    const y = screenY - 42 + floor * 4;
                    this.ctx.fillStyle = Math.random() > 0.3 ? '#ffff00' : '#333333';
                    this.ctx.fillRect(screenX - 8, y, 3, 2);
                    this.ctx.fillRect(screenX - 3, y, 3, 2);
                    this.ctx.fillRect(screenX + 2, y, 3, 2);
                    this.ctx.fillRect(screenX + 7, y, 3, 2);
                }

                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(screenX - 1, screenY - 54, 2, 4);
                break;

            case 'powerplant':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX + 22, screenY - 28);
                this.ctx.lineTo(screenX + 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX - 22, screenY - 28);
                this.ctx.lineTo(screenX - 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 38);
                this.ctx.lineTo(screenX - 22, screenY - 28);
                this.ctx.lineTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 22, screenY - 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.fillRect(screenX - 6, screenY - 46, 5, 12);
                this.ctx.fillRect(screenX + 2, screenY - 44, 5, 10);
                this.ctx.fillRect(screenX - 14, screenY - 42, 5, 8);

                this.ctx.fillStyle = '#ffaa00';
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(screenX - 5, screenY - 48, 3, 4);
                this.ctx.fillRect(screenX + 3, screenY - 46, 3, 4);
                this.ctx.fillRect(screenX - 13, screenY - 44, 3, 4);
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#ffff00';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 16, screenY - 6, 32, 16);
                break;

            case 'gaslamp':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.fillRect(screenX - 3, screenY - 2, 6, 18);

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.fillRect(screenX - 4, screenY + 16, 8, 4);
                this.ctx.fillRect(screenX - 4, screenY - 6, 8, 4);

                this.ctx.fillStyle = '#1a1a1a';
                this.ctx.fillRect(screenX - 6, screenY - 12, 12, 6);

                this.ctx.fillStyle = '#ffdd88';
                this.ctx.globalAlpha = 0.8;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 9, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#ffaa44';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 9, 3, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#5a5a5a';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 6, screenY - 12);
                this.ctx.lineTo(screenX - 8, screenY - 14);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(screenX + 6, screenY - 12);
                this.ctx.lineTo(screenX + 8, screenY - 14);
                this.ctx.stroke();
                break;

            case 'parliament':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.lineTo(screenX + 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX - 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.fillRect(screenX - 4, screenY - 44, 8, 10);

                this.ctx.fillStyle = '#b8860b';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 46, 5, 0, Math.PI * 2);
                this.ctx.fill();

                for (let i = -3; i <= 3; i++) {
                    this.ctx.fillStyle = '#4a3a2a';
                    this.ctx.fillRect(screenX + i * 5 - 1, screenY - 4, 2, 14);
                }

                this.ctx.fillStyle = '#3a2a1a';
                this.ctx.fillRect(screenX - 6, screenY + 2, 12, 10);
                break;

            case 'gasworks':
                this.ctx.fillStyle = '#4a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX + 18, screenY - 24);
                this.ctx.lineTo(screenX + 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 18, screenY - 24);
                this.ctx.lineTo(screenX - 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 18, screenY - 24);
                this.ctx.lineTo(screenX, screenY - 14);
                this.ctx.lineTo(screenX + 18, screenY - 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a2a';
                this.ctx.fillRect(screenX - 5, screenY - 42, 4, 10);
                this.ctx.fillRect(screenX + 2, screenY - 40, 4, 8);

                this.ctx.fillStyle = '#ffaa44';
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillRect(screenX - 4, screenY - 44, 2, 4);
                this.ctx.fillRect(screenX + 3, screenY - 42, 2, 4);
                this.ctx.globalAlpha = 1;

                for (let i = 0; i < 3; i++) {
                    this.ctx.fillStyle = '#6a5a4a';
                    this.ctx.beginPath();
                    this.ctx.arc(screenX - 12 + i * 12, screenY + 4, 6, 0, Math.PI);
                    this.ctx.fill();
                }
                break;

            case 'clocktower':
                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX + 8, screenY - 40);
                this.ctx.lineTo(screenX + 8, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX - 8, screenY - 40);
                this.ctx.lineTo(screenX - 8, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 12);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8a7a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX - 8, screenY - 40);
                this.ctx.lineTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX + 8, screenY - 40);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.fillRect(screenX - 3, screenY - 52, 6, 10);

                this.ctx.strokeStyle = '#3a3a3a';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 20, 8, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.fillStyle = '#f0e68c';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 20, 7, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#2a2a2a';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX, screenY - 26);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 4, screenY - 20);
                this.ctx.stroke();
                break;

            case 'steamfactory':
                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.lineTo(screenX + 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX - 20, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a6a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 36);
                this.ctx.lineTo(screenX - 20, screenY - 26);
                this.ctx.lineTo(screenX, screenY - 16);
                this.ctx.lineTo(screenX + 20, screenY - 26);
                this.ctx.closePath();
                this.ctx.fill();

                for (let i = 0; i < 3; i++) {
                    this.ctx.fillStyle = '#3a3a3a';
                    this.ctx.fillRect(screenX - 14 + i * 7, screenY - 44 + i * 2, 4, 12);
                }

                this.ctx.fillStyle = '#cccccc';
                this.ctx.globalAlpha = 0.7;
                for (let i = 0; i < 3; i++) {
                    this.ctx.fillRect(screenX - 14 + i * 7, screenY - 46 + i * 2, 4, 6);
                }
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#6a4a2a';
                this.ctx.fillRect(screenX - 12, screenY - 4, 24, 14);

                this.ctx.strokeStyle = '#8a6a4a';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 12, screenY - 4, 24, 14);
                break;

            case 'coalplant':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX + 18, screenY - 22);
                this.ctx.lineTo(screenX + 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 18, screenY - 22);
                this.ctx.lineTo(screenX - 18, screenY + 8);
                this.ctx.lineTo(screenX, screenY + 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX - 18, screenY - 22);
                this.ctx.lineTo(screenX, screenY - 12);
                this.ctx.lineTo(screenX + 18, screenY - 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.fillRect(screenX - 5, screenY - 40, 4, 10);
                this.ctx.fillRect(screenX + 2, screenY - 38, 4, 8);

                this.ctx.fillStyle = '#888888';
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(screenX - 4, screenY - 42, 3, 4);
                this.ctx.fillRect(screenX + 3, screenY - 40, 3, 4);
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#1a1a1a';
                this.ctx.fillRect(screenX - 12, screenY, 24, 12);

                this.ctx.fillStyle = '#ff6600';
                this.ctx.fillRect(screenX - 8, screenY + 2, 4, 6);
                this.ctx.fillRect(screenX + 4, screenY + 2, 4, 6);
                break;

            case 'trainstation':
                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX + 22, screenY - 18);
                this.ctx.lineTo(screenX + 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX - 22, screenY - 18);
                this.ctx.lineTo(screenX - 22, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 22);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 30);
                this.ctx.lineTo(screenX - 22, screenY - 18);
                this.ctx.lineTo(screenX, screenY - 6);
                this.ctx.lineTo(screenX + 22, screenY - 18);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#3a3a3a';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 24, screenY + 12);
                this.ctx.lineTo(screenX + 24, screenY + 12);
                this.ctx.stroke();

                this.ctx.strokeStyle = '#2a2a2a';
                this.ctx.lineWidth = 2;
                for (let i = -20; i <= 20; i += 8) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i, screenY + 10);
                    this.ctx.lineTo(screenX + i, screenY + 14);
                    this.ctx.stroke();
                }

                this.ctx.fillStyle = '#8a6a4a';
                this.ctx.fillRect(screenX - 8, screenY - 14, 16, 20);

                this.ctx.fillStyle = '#4a6a8a';
                this.ctx.fillRect(screenX - 6, screenY - 10, 5, 6);
                this.ctx.fillRect(screenX + 1, screenY - 10, 5, 6);
                break;



            case 'ironworks':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX + 20, screenY - 24);
                this.ctx.lineTo(screenX + 20, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 20, screenY - 24);
                this.ctx.lineTo(screenX - 20, screenY + 10);
                this.ctx.lineTo(screenX, screenY + 20);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#5a5a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 20, screenY - 24);
                this.ctx.lineTo(screenX, screenY - 14);
                this.ctx.lineTo(screenX + 20, screenY - 24);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a2a';
                this.ctx.fillRect(screenX - 6, screenY - 42, 5, 10);
                this.ctx.fillRect(screenX + 2, screenY - 40, 4, 8);

                this.ctx.fillStyle = '#ff6600';
                this.ctx.globalAlpha = 0.8;
                this.ctx.fillRect(screenX - 5, screenY - 44, 3, 4);
                this.ctx.fillRect(screenX + 3, screenY - 42, 3, 4);
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#6a4a2a';
                this.ctx.fillRect(screenX - 14, screenY - 6, 28, 18);

                this.ctx.fillStyle = '#ff8800';
                this.ctx.fillRect(screenX - 6, screenY, 12, 8);

                this.ctx.strokeStyle = '#8a6a4a';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 14, screenY - 6, 28, 18);
                break;

            case 'telegraph':
                this.ctx.fillStyle = '#5a4a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX + 16, screenY - 26);
                this.ctx.lineTo(screenX + 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a5a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 16, screenY - 26);
                this.ctx.lineTo(screenX - 16, screenY + 6);
                this.ctx.lineTo(screenX, screenY + 14);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#7a6a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 34);
                this.ctx.lineTo(screenX - 16, screenY - 26);
                this.ctx.lineTo(screenX, screenY - 18);
                this.ctx.lineTo(screenX + 16, screenY - 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#3a3a3a';
                this.ctx.lineWidth = 2;
                for (let i = -2; i <= 2; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX + i * 6, screenY - 38);
                    this.ctx.lineTo(screenX + i * 6, screenY - 28);
                    this.ctx.stroke();
                }

                this.ctx.strokeStyle = '#2a2a2a';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(screenX - 12, screenY - 36);
                this.ctx.lineTo(screenX + 12, screenY - 36);
                this.ctx.stroke();

                this.ctx.fillStyle = '#8b7355';
                this.ctx.fillRect(screenX - 4, screenY - 8, 8, 16);
                break;

            case 'ascensiongate':
                this.ctx.fillStyle = '#1a0a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 60);
                this.ctx.lineTo(screenX + 36, screenY - 46);
                this.ctx.lineTo(screenX + 36, screenY + 22);
                this.ctx.lineTo(screenX, screenY + 36);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a1a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 60);
                this.ctx.lineTo(screenX - 36, screenY - 46);
                this.ctx.lineTo(screenX - 36, screenY + 22);
                this.ctx.lineTo(screenX, screenY + 36);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a2a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 60);
                this.ctx.lineTo(screenX - 36, screenY - 46);
                this.ctx.lineTo(screenX, screenY - 32);
                this.ctx.lineTo(screenX + 36, screenY - 46);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#8800ff';
                this.ctx.fillRect(screenX - 10, screenY - 10, 20, 40);

                this.ctx.strokeStyle = '#ff00ff';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(screenX - 10, screenY - 10, 20, 40);

                this.ctx.fillStyle = '#ffff00';
                this.ctx.globalAlpha = 0.8;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = screenX + Math.cos(angle) * 24;
                    const y = screenY + 10 + Math.sin(angle) * 14;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                this.ctx.globalAlpha = 1;
                break;

            case 'matrixcore':
                this.ctx.fillStyle = '#0a0a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 56);
                this.ctx.lineTo(screenX + 34, screenY - 42);
                this.ctx.lineTo(screenX + 34, screenY + 20);
                this.ctx.lineTo(screenX, screenY + 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#1a1a2a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 56);
                this.ctx.lineTo(screenX - 34, screenY - 42);
                this.ctx.lineTo(screenX - 34, screenY + 20);
                this.ctx.lineTo(screenX, screenY + 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 56);
                this.ctx.lineTo(screenX - 34, screenY - 42);
                this.ctx.lineTo(screenX, screenY - 28);
                this.ctx.lineTo(screenX + 34, screenY - 42);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#00ff00';
                this.ctx.globalAlpha = 0.6;
                for (let i = 0; i < 12; i++) {
                    const x = screenX - 30 + (i % 6) * 10;
                    const y = screenY - 20 + Math.floor(i / 6) * 20;
                    this.ctx.fillRect(x, y, 2, 12);
                }
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(screenX - 16, screenY - 8, 32, 24);
                break;

            case 'dysonswarm':
                this.ctx.fillStyle = '#1a1a0a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX + 32, screenY - 40);
                this.ctx.lineTo(screenX + 32, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 32);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a2a1a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX - 32, screenY - 40);
                this.ctx.lineTo(screenX - 32, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 32);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#ffaa00';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 60, 12, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#ffdd00';
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 60, 8, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#ff8800';
                this.ctx.lineWidth = 2;
                for (let i = 0; i < 16; i++) {
                    const angle = (i / 16) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 60);
                    this.ctx.lineTo(
                        screenX + Math.cos(angle) * 28,
                        screenY - 60 + Math.sin(angle) * 16
                    );
                    this.ctx.stroke();
                }
                break;

            case 'colonyship':
                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX + 28, screenY - 36);
                this.ctx.lineTo(screenX + 28, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 30);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 50);
                this.ctx.lineTo(screenX - 28, screenY - 36);
                this.ctx.lineTo(screenX - 28, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 30);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 54);
                this.ctx.lineTo(screenX - 10, screenY - 50);
                this.ctx.lineTo(screenX - 8, screenY - 40);
                this.ctx.lineTo(screenX, screenY - 44);
                this.ctx.lineTo(screenX + 8, screenY - 40);
                this.ctx.lineTo(screenX + 10, screenY - 50);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.fillRect(screenX - 20, screenY - 10, 40, 20);
                this.ctx.fillRect(screenX - 6, screenY + 10, 12, 16);

                this.ctx.fillStyle = '#00ffff';
                this.ctx.fillRect(screenX - 16, screenY - 6, 8, 6);
                this.ctx.fillRect(screenX + 8, screenY - 6, 8, 6);
                this.ctx.fillRect(screenX - 4, screenY - 6, 8, 6);
                break;

            case 'terraformer':
                this.ctx.fillStyle = '#2a5a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX + 26, screenY - 34);
                this.ctx.lineTo(screenX + 26, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a6a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX - 26, screenY - 34);
                this.ctx.lineTo(screenX - 26, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a7a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX - 26, screenY - 34);
                this.ctx.lineTo(screenX, screenY - 20);
                this.ctx.lineTo(screenX + 26, screenY - 34);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#00ff00';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 52, 10, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.fillStyle = '#88ff88';
                this.ctx.globalAlpha = 0.5;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 52);
                    this.ctx.lineTo(
                        screenX + Math.cos(angle) * 20,
                        screenY - 52 + Math.sin(angle) * 12
                    );
                    this.ctx.stroke();
                }
                this.ctx.globalAlpha = 1;
                break;

            case 'warpgate':
                this.ctx.fillStyle = '#2a2a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 52);
                this.ctx.lineTo(screenX + 30, screenY - 38);
                this.ctx.lineTo(screenX + 30, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 32);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a3a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 52);
                this.ctx.lineTo(screenX - 30, screenY - 38);
                this.ctx.lineTo(screenX - 30, screenY + 18);
                this.ctx.lineTo(screenX, screenY + 32);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#1a1a3a';
                this.ctx.fillRect(screenX - 8, screenY - 30, 16, 50);

                this.ctx.strokeStyle = '#8800ff';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(screenX - 8, screenY - 30, 16, 50);

                this.ctx.fillStyle = '#00ffff';
                this.ctx.globalAlpha = 0.6;
                for (let y = -26; y < 18; y += 6) {
                    this.ctx.fillRect(screenX - 6, screenY + y, 12, 2);
                }
                this.ctx.globalAlpha = 1;

                this.ctx.fillStyle = '#ff00ff';
                this.ctx.beginPath();
                this.ctx.arc(screenX - 16, screenY - 34, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.beginPath();
                this.ctx.arc(screenX + 16, screenY - 34, 4, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'quantumlab':
                this.ctx.fillStyle = '#1a2a3a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX + 28, screenY - 36);
                this.ctx.lineTo(screenX + 28, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX - 28, screenY - 36);
                this.ctx.lineTo(screenX - 28, screenY + 16);
                this.ctx.lineTo(screenX, screenY + 28);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 48);
                this.ctx.lineTo(screenX - 28, screenY - 36);
                this.ctx.lineTo(screenX, screenY - 24);
                this.ctx.lineTo(screenX + 28, screenY - 36);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 2;
                for (let i = 0; i < 4; i++) {
                    const x = screenX - 18 + i * 12;
                    this.ctx.strokeRect(x, screenY - 16, 8, 20);
                }

                this.ctx.fillStyle = '#ff00ff';
                this.ctx.globalAlpha = 0.7;
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY - 52, 6, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1;

                this.ctx.strokeStyle = '#ffff00';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(screenX, screenY - 52);
                    this.ctx.lineTo(
                        screenX + Math.cos(angle) * 12,
                        screenY - 52 + Math.sin(angle) * 12
                    );
                    this.ctx.stroke();
                }
                break;

            case 'orbitalring':
                this.ctx.fillStyle = '#3a4a5a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 46);
                this.ctx.lineTo(screenX + 26, screenY - 34);
                this.ctx.lineTo(screenX + 26, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.fillStyle = '#4a5a6a';
                this.ctx.beginPath();
                this.ctx.moveTo(screenX, screenY - 46);
                this.ctx.lineTo(screenX - 26, screenY - 34);
                this.ctx.lineTo(screenX - 26, screenY + 14);
                this.ctx.lineTo(screenX, screenY + 26);
                this.ctx.closePath();
                this.ctx.fill();

                this.ctx.strokeStyle = '#6a7a8a';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY - 10, 24, 14, 0, 0, Math.PI * 2);
                this.ctx.stroke();

                this.ctx.strokeStyle = '#8a9aaa';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.ellipse(screenX, screenY - 10, 18, 10, 0, 0, Math.PI * 2);
                this.ctx.stroke();

                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const x = screenX + Math.cos(angle) * 24;
                    const y = screenY - 10 + Math.sin(angle) * 14;
                    this.ctx.fillStyle = '#00ffff';
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
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