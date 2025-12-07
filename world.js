class World {
    constructor(player) {
        this.player = player;
        this.planets = [];
    }

    createVolcanicWorld() {
        return new Planet('Volcanic', 50, 40, 'volcanic');
    }

    createEcosystemWorld() {
        return new Planet('Ecosystem', 60, 50, 'ecosystem');
    }

    createGalaxyWorld() {
        return new Planet('Galaxy', 100, 80, 'galaxy');
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

    calculateYields(terrain) {
        const yields = {
            food: 0,
            production: 0,
            science: 0,
            iron: 0,
            copper: 0,
            coal: 0,
            oil: 0,
            silicon: 0,
            rareMinerals: 0
        };

        switch(terrain) {
            case 'darksoil':
                yields.food = 2;
                yields.iron = 1;
                yields.coal = 1;
                break;
            case 'rock':
                yields.iron = 3;
                yields.copper = 2;
                yields.coal = 1;
                break;
            case 'ash':
                yields.copper = 2;
                yields.silicon = 1;
                yields.coal = 2;
                break;
            case 'lava':
                yields.iron = 2;
                yields.rareMinerals = 1;
                break;
            case 'floating':
                yields.silicon = 2;
                yields.rareMinerals = 1;
                break;
        }

        return yields;
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
        let details = [];

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

    canPlaceBuilding(gridX, gridY) {
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) return false;
        const tile = this.tiles[gridY][gridX];

        const canBuildOver = !tile.building || tile.building.type === 'ruins';

        return canBuildOver &&
               !tile.environmentalObject &&
               tile.type !== 'water' &&
               tile.type !== 'lava' &&
               tile.type !== 'void';
    }

    getBuildingSize(buildingType) {
        const sizes = {
            settlement: { w: 1, h: 1 },
            farm: { w: 1, h: 1 },
            warehouse: { w: 1, h: 1 },
            observatory: { w: 1, h: 1 },
            barracks: { w: 1, h: 1 },
            temple: { w: 1, h: 1 },
            forge: { w: 1, h: 1 },
            market: { w: 1, h: 1 },
            castle: { w: 2, h: 2 },
            library: { w: 1, h: 1 },
            university: { w: 2, h: 1 },
            campfire: { w: 1, h: 1 },
            tent: { w: 1, h: 1 },
            woodpile: { w: 1, h: 1 },
            granary: { w: 2, h: 1 },
            quarry: { w: 2, h: 2 },
            monument: { w: 1, h: 2 },
            workshop: { w: 1, h: 1 },
            aqueduct: { w: 3, h: 1 },
            watchtower: { w: 1, h: 1 },
            cathedral: { w: 2, h: 2 },
            townhall: { w: 2, h: 2 },
            arena: { w: 3, h: 2 },
            hospital: { w: 2, h: 1 },
            academy: { w: 2, h: 1 },
            theater: { w: 2, h: 1 },
            mansion: { w: 2, h: 2 },
            spaceport: { w: 3, h: 3 },
            laboratory: { w: 2, h: 1 },
            megafactory: { w: 3, h: 2 }
        };
        return sizes[buildingType] || { w: 1, h: 1 };
    }

    canPlaceBuildingOfSize(gridX, gridY, width, height) {
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const checkX = gridX + dx;
                const checkY = gridY + dy;

                if (checkX < 0 || checkX >= this.width || checkY < 0 || checkY >= this.height) {
                    return false;
                }

                const tile = this.tiles[checkY][checkX];

                if (tile.building && tile.building.type !== 'ruins') {
                    return false;
                }

                if (tile.environmentalObject) {
                    return false;
                }

                if (tile.type === 'water' || tile.type === 'lava' || tile.type === 'void') {
                    return false;
                }
            }
        }
        return true;
    }

    placeBuilding(gridX, gridY, buildingType, player) {
        if (!this.canPlaceBuilding(gridX, gridY)) return false;

        const buildingCosts = {
            settlement: { resources: 50, food: 10 },
            farm: { resources: 30, food: 0 },
            warehouse: { resources: 40, food: 5 },
            observatory: { resources: 60, food: 10 },
            barracks: { resources: 60, food: 10 },
            temple: { resources: 80, food: 15 },
            forge: { resources: 100, food: 20 },
            market: { resources: 90, food: 10 },
            castle: { resources: 150, food: 30 },
            library: { resources: 120, food: 20 },
            university: { resources: 180, food: 40 }
        };

        const cost = buildingCosts[buildingType];
        if (!cost || !player.spendResources(cost.resources)) return false;

        if (this.tiles[gridY][gridX].building && this.tiles[gridY][gridX].building.type === 'ruins') {
            this.structures = this.structures.filter(s => s !== this.tiles[gridY][gridX].building);
        }

        const building = new Building(gridX, gridY, buildingType);
        console.log(`Building created at grid (${gridX}, ${gridY}), building.x=${building.x}, building.y=${building.y}`);
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

        if (this.type === 'settlement') {
            player.addPopulation(deltaTime * 0.3);
        } else if (this.type === 'library' || this.type === 'university') {
            player.addResources(deltaTime * 2);
        } else if (this.type === 'observatory') {
            player.addScience(deltaTime * 3);
        }

        this.structures.forEach(building => {
            building.update(deltaTime, player);
        });
    }
}

class Building {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isFrame = true;
        this.buildProgress = 0;
        this.settlementIds = [];

        const healthMap = {
            settlement: 150,
            farm: 80,
            warehouse: 120,
            observatory: 100,
            barracks: 200,
            temple: 150,
            forge: 180,
            market: 100,
            castle: 300,
            library: 120,
            university: 150
        };

        const baseHealth = healthMap[type] || 100;
        const player = window.game ? window.game.player : null;
        const hpBonus = player ? (player.buildingHPBonus || 0) : 0;

        this.maxHealth = baseHealth + hpBonus;
        this.health = this.maxHealth;
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