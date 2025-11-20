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
            lava: '#6b4423',
            water: '#3a5a7a',
            forest: '#3a5a3a',
            nebula: '#4a3a6a',
            void: '#1a2a3a',
            stars: '#5a6a7a'
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

    drawWorld(planet, cameraX, cameraY, player) {
        this.ctx.save();
        this.ctx.scale(this.zoom, this.zoom);

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
        const screenX = (gridX - gridY) * (this.tileWidth / 2) - cameraX;
        const screenY = (gridX + gridY) * (this.tileHeight / 2) - cameraY;

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
        this.ctx.stroke();
    }

    drawBuilding(building, cameraX, cameraY) {
        const screenX = (building.x - building.y) * (this.tileWidth / 2) - cameraX;
        const screenY = (building.x + building.y) * (this.tileHeight / 2) - cameraY;

        this.ctx.fillStyle = this.buildingColors[building.type];
        this.ctx.fillRect(screenX - 12, screenY - 8, 24, 16);

        this.ctx.strokeStyle = '#a0b0c8';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX - 12, screenY - 8, 24, 16);

        this.ctx.fillStyle = '#a0b0c8';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(building.buildingInfo[building.type].icon, screenX, screenY);
    }
}