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
            case 'grass':
                yields.food = 1;
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
            hut: { iron: 10, copper: 5 },
            settlement: { iron: 50, copper: 30, coal: 20 },
            farm: { iron: 20, copper: 10 },
            warehouse: { iron: 40, copper: 20, coal: 10 },
            observatory: { iron: 100, copper: 50, silicon: 30, rareMinerals: 20 },
            barracks: { iron: 80, copper: 40, coal: 30 },
            temple: { iron: 60, copper: 30, gold: 10 },
            forge: { iron: 100, copper: 50, coal: 40 },
            market: { iron: 70, copper: 35, gold: 15 },
            castle: { iron: 200, copper: 100, coal: 80 },
            library: { iron: 90, copper: 45, silicon: 20 },
            university: { iron: 150, copper: 75, silicon: 50, gold: 25 },
            campfire: { copper: 5 },
            tent: { copper: 8, coal: 5 },
            woodpile: { copper: 10 },
            granary: { iron: 60, copper: 30, coal: 20 },
            quarry: { iron: 80, copper: 40, coal: 30 },
            monument: { iron: 100, copper: 50, gold: 20, silver: 10 },
            school: { iron: 70, copper: 35, coal: 25 },
            shrine: { iron: 40, copper: 20, gold: 5 },
            workshop: { iron: 90, copper: 45, coal: 35 },
            aqueduct: { iron: 120, copper: 60, coal: 40 },
            watchtower: { iron: 50, copper: 25, coal: 20 },
            township: { iron: 100, copper: 60, coal: 40 },
            feudaltown: { iron: 200, copper: 120, coal: 80, gold: 30 },
            cathedral: { iron: 150, copper: 75, gold: 40, silver: 20 },
            townhall: { iron: 180, copper: 90, coal: 60, gold: 25 },
            arena: { iron: 200, copper: 100, coal: 80 },
            hospital: { iron: 130, copper: 65, coal: 50, silver: 15 },
            scriptorium: { iron: 100, copper: 50, coal: 40, gold: 20 },
            citystate: { iron: 300, copper: 180, coal: 120, gold: 50, silver: 30 },
            academy: { iron: 200, copper: 100, silicon: 60, gold: 35 },
            theater: { iron: 140, copper: 70, gold: 30 },
            mansion: { iron: 250, copper: 125, gold: 60, silver: 40 },
            factorytown: { iron: 400, copper: 240, coal: 160, silicon: 80 },
            ironworks: { iron: 300, copper: 150, coal: 120 },
            trainstation: { iron: 350, copper: 175, coal: 140, steel: 80 },
            coalplant: { iron: 500, copper: 250, coal: 200, silicon: 100 },
            steamcity: { iron: 600, copper: 360, coal: 240, silicon: 120, gold: 80 },
            steamfactory: { iron: 450, copper: 225, coal: 180, silicon: 90 },
            clocktower: { iron: 200, copper: 100, gold: 50, silver: 30 },
            gasworks: { iron: 400, copper: 200, coal: 160, oil: 80 },
            metropolis: { iron: 800, copper: 480, coal: 320, silicon: 160, gold: 100 },
            parliament: { iron: 500, copper: 250, gold: 80, silver: 50 },
            gaslamp: { iron: 50, copper: 25, oil: 20 },
            telegraph: { iron: 180, copper: 90, silicon: 60 },
            powercity: { iron: 1000, copper: 600, silicon: 300, uranium: 50, gold: 150 },
            powerplant: { iron: 800, copper: 400, silicon: 200, uranium: 100 },
            skyscraper: { iron: 600, copper: 300, silicon: 150, aluminum: 100 },
            subwaystation: { iron: 500, copper: 250, silicon: 125, aluminum: 80 },
            technopolis: { iron: 1500, copper: 900, silicon: 600, uranium: 100, platinum: 80 },
            datacenter: { iron: 1000, copper: 500, silicon: 400, gold: 100, platinum: 50 },
            cybercafe: { iron: 300, copper: 150, silicon: 100 },
            serverbank: { iron: 1200, copper: 600, silicon: 500, gold: 120, platinum: 60 },
            megacity: { iron: 2000, copper: 1200, silicon: 800, uranium: 150, platinum: 120, gold: 200 },
            spaceport: { iron: 1500, copper: 750, silicon: 500, titanium: 300, uranium: 200 },
            laboratory: { iron: 1000, copper: 500, silicon: 400, platinum: 80, uranium: 100 },
            megafactory: { iron: 1800, copper: 900, silicon: 600, aluminum: 400, titanium: 200 },
            fusionreactor: { iron: 2000, copper: 1000, silicon: 800, uranium: 300, platinum: 150 },
            orbitalring: { iron: 3000, copper: 1500, silicon: 1000, titanium: 500, platinum: 200 },
            quantumlab: { iron: 2500, copper: 1250, silicon: 1000, uranium: 400, neodymium: 150 },
            triworldhub: { iron: 3000, copper: 1800, silicon: 1200, titanium: 600, platinum: 250, gold: 300 },
            warpgate: { iron: 4000, copper: 2000, silicon: 1500, uranium: 500, neodymium: 300 },
            terraformer: { iron: 3500, copper: 1750, silicon: 1250, titanium: 700, platinum: 300 },
            colonyship: { iron: 5000, copper: 2500, silicon: 2000, titanium: 1000, uranium: 500 },
            haven: { iron: 5000, copper: 3000, silicon: 2000, titanium: 1000, platinum: 500, gold: 500 },
            dysonswarm: { iron: 10000, copper: 5000, silicon: 3000, titanium: 2000, uranium: 1000 },
            matrixcore: { silicon: 5000, platinum: 1000, neodymium: 800, uranium: 600 },
            ascensiongate: { iron: 8000, silicon: 4000, titanium: 2000, uranium: 1500, platinum: 1000, neodymium: 500 },
            greenhouse: { iron: 80, copper: 40, silicon: 30 },
            hydroponicfarm: { iron: 150, copper: 75, silicon: 60, aluminum: 40 },
            verticalfarm: { iron: 300, copper: 150, silicon: 120, aluminum: 80, titanium: 40 },
            bioreactor: { iron: 500, copper: 250, silicon: 200, uranium: 50, platinum: 30 },
            synthesizer: { iron: 800, copper: 400, silicon: 350, platinum: 80, neodymium: 50 }
        };

        const cost = buildingCosts[buildingType];
        if (!cost) {
            console.warn(`No cost defined for building type: ${buildingType}`);
            return false;
        }

        if (!player.hasResources(cost)) {
            return false;
        }

        if (!this.checkTileRequirement(gridX, gridY, buildingType)) {
            return false;
        }

        if (!player.spendResourceTypes(cost)) {
            return false;
        }

        if (this.tiles[gridY][gridX].building && this.tiles[gridY][gridX].building.type === 'ruins') {
            this.structures = this.structures.filter(s => s !== this.tiles[gridY][gridX].building);
        }

        const building = new Building(gridX, gridY, buildingType);
        this.tiles[gridY][gridX].building = building;
        this.structures.push(building);
        player.addBuilding(building);

        return true;
    }

    checkTileRequirement(gridX, gridY, buildingType) {
        const tile = this.tiles[gridY][gridX];

        const tileRequirements = {
            farm: ['darksoil', 'ash', 'grass'],
            greenhouse: ['darksoil', 'ash', 'grass', 'rock'],
            hydroponicfarm: null,
            verticalfarm: null,
            forge: null,
            quarry: ['rock', 'ash'],
            aqueduct: ['darksoil', 'grass', 'ash'],
            fishery: ['water'],
            dockyard: ['water'],
            harbor: ['water']
        };

        const required = tileRequirements[buildingType];

        if (required === null) {
            return true;
        }

        if (required === undefined) {
            return true;
        }

        return required.includes(tile.type);
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