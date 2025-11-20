class World {
    constructor(player) {
        this.player = player;
        this.planets = [];
    }

    createVolcanicWorld() {
        return new Planet('Volcanic', 16, 12, 'volcanic');
    }

    createEcosystemWorld() {
        return new Planet('Ecosystem', 20, 16, 'ecosystem');
    }

    createGalaxyWorld() {
        return new Planet('Galaxy', 32, 24, 'galaxy');
    }
}

class Planet {
    constructor(name, width, height, type) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.type = type;
        this.tiles = [];
        this.structures = [];
        this.time = 0;
        this.generateTerrain();
    }

    generateTerrain() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.generateTile(x, y);
            }
        }
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

        return {
            type: terrain,
            resourceAmount: Math.random() * 50,
            fertility: Math.random(),
            contamination: 0,
            building: null
        };
    }

    canPlaceBuilding(gridX, gridY) {
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) return false;
        const tile = this.tiles[gridY][gridX];
        return !tile.building && tile.type !== 'water' && tile.type !== 'lava' && tile.type !== 'void';
    }

    placeBuilding(gridX, gridY, buildingType, player) {
        if (!this.canPlaceBuilding(gridX, gridY)) return false;

        const buildingCosts = {
            settlement: { resources: 50, food: 10 },
            farm: { resources: 30, food: 0 },
            warehouse: { resources: 40, food: 5 },
            barracks: { resources: 60, food: 10 },
            temple: { resources: 80, food: 15 },
            forge: { resources: 100, food: 20 },
            market: { resources: 90, food: 10 },
            castle: { resources: 150, food: 30 },
            library: { resources: 120, food: 20 },
            university: { resources: 180, food: 40 },
            observatory: { resources: 200, food: 50 }
        };

        const cost = buildingCosts[buildingType];
        if (!cost || !player.spendResources(cost.resources)) return false;

        const building = new Building(gridX, gridY, buildingType);
        this.tiles[gridY][gridX].building = building;
        this.structures.push(building);
        player.addBuilding(building);

        return true;
    }

    removeBuilding(gridX, gridY, player) {
        const tile = this.tiles[gridY][gridX];
        if (tile.building) {
            player.removeBuilding(tile.building);
            this.structures = this.structures.filter(s => s !== tile.building);
            tile.building = null;
            return true;
        }
        return false;
    }

    update(deltaTime, player) {
        this.time += deltaTime;

        this.tiles.forEach(row => {
            row.forEach(tile => {
                if (tile.contamination > 0) {
                    tile.contamination -= deltaTime * 0.1;
                }
            });
        });

        this.structures.forEach(building => {
            building.update(deltaTime, player);
        });

        if (this.time > 2) {
            const foodProduced = this.structures.filter(b => b.type === 'farm').length * 5;
            player.addFood(foodProduced);
            player.consumeFood(Math.ceil(player.population * 0.5));

            const resourcesProduced = this.structures.filter(b => b.type === 'warehouse').length * 3;
            player.addResources(resourcesProduced);

            this.time = 0;
        }
    }
}

class Building {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 100;
        this.production = 0;
        this.buildingInfo = {
            settlement: { name: 'Settlement', description: 'Houses population', icon: 'S' },
            farm: { name: 'Farm', description: 'Produces food', icon: 'F' },
            warehouse: { name: 'Warehouse', description: 'Stores resources', icon: 'W' },
            barracks: { name: 'Barracks', description: 'Military training', icon: 'B' },
            temple: { name: 'Temple', description: 'Cultural center', icon: 'T' },
            forge: { name: 'Forge', description: 'Crafts tools', icon: 'G' },
            market: { name: 'Market', description: 'Trade hub', icon: 'M' },
            castle: { name: 'Castle', description: 'Defense structure', icon: 'C' },
            library: { name: 'Library', description: 'Knowledge storage', icon: 'L' },
            university: { name: 'University', description: 'Research center', icon: 'U' },
            observatory: { name: 'Observatory', description: 'Stars and science', icon: 'O' }
        };
    }

    update(deltaTime, player) {
        if (this.type === 'settlement') {
            player.addPopulation(deltaTime * 0.3);
        } else if (this.type === 'library' || this.type === 'university') {
            player.addResources(deltaTime * 2);
        }
    }
}