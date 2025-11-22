class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.tileWidth = 64;
        this.tileHeight = 32;
        this.zoom = 1;
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
            sand: '#e0c080',
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

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY - 10, 10, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(unit.type[0].toUpperCase(), screenX, screenY - 8);

        this.drawHealthBar(screenX, screenY - 10, unit.health, unit.maxHealth, 20);

        if (unit.moved) {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY - 10, 10, 0, Math.PI * 2);
            this.ctx.fill();
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

    drawWorld(planet, cameraX, cameraY, player) {
        this.ctx.save();
        const topBarHeight = 75;
        this.ctx.translate(0, topBarHeight);

        this.ctx.scale(this.zoom, this.zoom);

        const centerGridX = planet.width / 2;
        const centerGridY = planet.height / 2;

        const centerScreenX = (centerGridX - centerGridY) * (this.tileWidth / 2);
        const centerScreenY = (centerGridX + centerGridY) * (this.tileHeight / 2);

        const targetX = (this.width / 2) / this.zoom + cameraX;
        const targetY = ((this.height - topBarHeight) / 2) / this.zoom + cameraY;
        const verticalNudge = 0;
        const horizontalNudge = 0;

        this.ctx.translate(
            targetX - centerScreenX + horizontalNudge,
            targetY - centerScreenY + verticalNudge
        );

        for (let y = 0; y < planet.height; y++) {
            for (let x = 0; x < planet.width; x++) {
                this.drawTile(x, y, planet.tiles[y][x], cameraX, cameraY);
            }
        }

        planet.structures.forEach(building => {
            this.drawBuilding(building, cameraX, cameraY);
        });

        this.ctx.restore();
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

    drawBuilding(building, cameraX, cameraY) {
        const screenX = (building.x - building.y) * (this.tileWidth / 2);
        const screenY = (building.x + building.y) * (this.tileHeight / 2);

        this.ctx.save();

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

            case 'defense_node':
                break;

            default:
                this.ctx.fillStyle = '#6a7a8a';
                this.ctx.fillRect(screenX - 12, screenY - 8, 24, 16);
        }

        this.ctx.restore();
    }
}