class World {
    constructor(player) {
        this.player = player;
        this.planets = [];
    }

    createVolcanicWorld() {
        return new Planet('Volcanic', 120, 100, 'volcanic');
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
        const continentNoise = this.createNoiseMap(this.width, this.height, 0.05);
        const detailNoise = this.createNoiseMap(this.width, this.height, 0.15);

        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.generateTile(x, y, continentNoise[y][x], detailNoise[y][x]);
            }
        }
    }

    createNoiseMap(width, height, scale) {
        const noise = [];
        for (let y = 0; y < height; y++) {
            noise[y] = [];
            for (let x = 0; x < width; x++) {
                const nx = x * scale;
                const ny = y * scale;
                noise[y][x] = this.perlinNoise(nx, ny);
            }
        }
        return noise;
    }

    perlinNoise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = x * x * (3.0 - 2.0 * x);
        const v = y * y * (3.0 - 2.0 * y);
        const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

        const hash = (i) => p[i % 256];
        const grad = (hash, x, y) => {
            const h = hash & 3;
            const u = h < 2 ? x : y;
            const v = h < 2 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
        };

        const a = grad(hash(X + hash(Y)), x, y);
        const b = grad(hash(X + 1 + hash(Y)), x - 1, y);
        const c = grad(hash(X + hash(Y + 1)), x, y - 1);
        const d = grad(hash(X + 1 + hash(Y + 1)), x - 1, y - 1);

        return (a + u * (b - a) + v * (c - a) + u * v * (a - b - c + d)) * 0.5 + 0.5;
    }

    generateTile(x, y, continentValue, detailValue) {
        let terrain = 'grass';
        let height = continentValue;
        let details = [];
        let elevation = 0;

        if (this.type === 'volcanic') {
            if (continentValue < 0.35) {
                terrain = 'lava';
                elevation = 0;
            } else if (continentValue < 0.50) {
                terrain = detailValue > 0.6 ? 'rock' : 'ash';
                elevation = 1;
            } else if (continentValue < 0.65) {
                terrain = detailValue > 0.5 ? 'ash' : 'darksoil';
                elevation = 2;
            } else {
                terrain = 'darksoil';
                elevation = 3;
            }

            if (detailValue > 0.85) elevation += 1;
            if (detailValue < 0.15) elevation = Math.max(0, elevation - 1);
        } else if (this.type === 'ecosystem') {
            if (height > 0.6) {
                terrain = 'forest';
                elevation = 2;
            } else if (height > 0.4) {
                terrain = 'grass';
                elevation = 1;
            } else {
                terrain = 'water';
                elevation = 0;
            }
        } else if (this.type === 'galaxy') {
            if (height > 0.7) {
                terrain = 'void';
                elevation = 0;
            } else if (height > 0.5) {
                terrain = 'nebula';
                elevation = 1;
            } else {
                terrain = 'stars';
                elevation = 2;
            }
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
            elevation: elevation,
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

        if (tile.isFloating) {
            const player = window.game ? window.game.player : null;
            const hasFloatingTech = player && player.techTree && player.techTree.techs['floatingIslands'] && player.techTree.techs['floatingIslands'].researched;

            if (!hasFloatingTech) {
                return false;
            }
        }

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
            hut: { iron: 5, copper: 3 },
            campfire: { copper: 2 },
            tent: { copper: 3, coal: 2 },
            woodpile: { copper: 3 },
            farm: { iron: 8, copper: 5 },
            warehouse: { iron: 15, copper: 10, coal: 5 },

            settlement: { iron: 25, copper: 15, coal: 10 },
            barracks: { iron: 30, copper: 20, coal: 15 },
            granary: { iron: 20, copper: 12, coal: 8 },
            quarry: { iron: 25, copper: 15, coal: 10 },
            monument: { iron: 30, copper: 18, gold: 5 },
            school: { iron: 25, copper: 15, coal: 10 },
            shrine: { iron: 15, copper: 10, gold: 2 },
            greenhouse: { iron: 30, copper: 20, silicon: 10 },

            township: { iron: 50, copper: 30, coal: 20 },
            temple: { iron: 40, copper: 25, gold: 8 },
            forge: { iron: 45, copper: 30, coal: 20 },
            workshop: { iron: 35, copper: 22, coal: 18 },
            aqueduct: { iron: 50, copper: 30, coal: 20 },
            watchtower: { iron: 30, copper: 18, coal: 12 },

            feudaltown: { iron: 80, copper: 50, coal: 35, gold: 15 },
            market: { iron: 50, copper: 30, gold: 10 },
            castle: { iron: 100, copper: 60, coal: 40 },
            library: { iron: 60, copper: 35, silicon: 15 },
            cathedral: { iron: 90, copper: 55, gold: 25, silver: 10 },
            townhall: { iron: 85, copper: 50, coal: 35, gold: 15 },
            arena: { iron: 95, copper: 55, coal: 40 },
            hospital: { iron: 70, copper: 40, coal: 30, silver: 8 },
            scriptorium: { iron: 55, copper: 32, coal: 25, gold: 12 },

            citystate: { iron: 150, copper: 90, coal: 60, gold: 30, silver: 15 },
            university: { iron: 100, copper: 60, silicon: 35, gold: 20 },
            academy: { iron: 110, copper: 65, silicon: 40, gold: 22 },
            theater: { iron: 80, copper: 45, gold: 18 },
            mansion: { iron: 130, copper: 75, gold: 35, silver: 20 },

            factorytown: { iron: 250, copper: 150, coal: 100, silicon: 50 },
            ironworks: { iron: 180, copper: 100, coal: 80 },
            trainstation: { iron: 200, copper: 120, coal: 90, silicon: 40 },
            coalplant: { iron: 300, copper: 180, coal: 150, silicon: 60 },
            hydroponicfarm: { iron: 90, copper: 55, silicon: 40, aluminum: 25 },

            steamcity: { iron: 400, copper: 240, coal: 160, silicon: 80, gold: 50 },
            steamfactory: { iron: 280, copper: 170, coal: 130, silicon: 60 },
            clocktower: { iron: 120, copper: 70, gold: 30, silver: 18 },
            gasworks: { iron: 250, copper: 150, coal: 120, oil: 50 },

            metropolis: { iron: 550, copper: 330, coal: 220, silicon: 110, gold: 70 },
            parliament: { iron: 320, copper: 190, gold: 55, silver: 35 },
            gaslamp: { iron: 25, copper: 15, oil: 12 },
            telegraph: { iron: 110, copper: 65, silicon: 40 },

            powercity: { iron: 750, copper: 450, silicon: 300, uranium: 35, gold: 100 },
            powerplant: { iron: 550, copper: 330, silicon: 200, uranium: 70 },
            skyscraper: { iron: 450, copper: 270, silicon: 180, aluminum: 90 },
            subwaystation: { iron: 380, copper: 230, silicon: 150, aluminum: 70 },
            verticalfarm: { iron: 200, copper: 120, silicon: 90, aluminum: 60, titanium: 30 },

            technopolis: { iron: 1100, copper: 660, silicon: 500, uranium: 80, platinum: 60 },
            datacenter: { iron: 750, copper: 450, silicon: 380, gold: 80, platinum: 40 },
            cybercafe: { iron: 220, copper: 130, silicon: 90 },
            serverbank: { iron: 900, copper: 540, silicon: 450, gold: 100, platinum: 50 },
            bioreactor: { iron: 380, copper: 230, silicon: 180, uranium: 40, platinum: 25 },

            megacity: { iron: 1500, copper: 900, silicon: 700, uranium: 120, platinum: 90, gold: 150 },
            observatory: { iron: 400, copper: 240, silicon: 180, rareMinerals: 50 },
            spaceport: { iron: 1200, copper: 720, silicon: 550, titanium: 250, uranium: 150 },
            laboratory: { iron: 800, copper: 480, silicon: 380, platinum: 65, uranium: 80 },
            megafactory: { iron: 1400, copper: 840, silicon: 600, aluminum: 350, titanium: 180 },
            fusionreactor: { iron: 1600, copper: 960, silicon: 750, uranium: 250, platinum: 120 },
            orbitalring: { iron: 2400, copper: 1440, silicon: 1000, titanium: 450, platinum: 180 },
            quantumlab: { iron: 2000, copper: 1200, silicon: 950, uranium: 350, neodymium: 130 },
            synthesizer: { iron: 650, copper: 390, silicon: 320, platinum: 70, neodymium: 45 },

            triworldhub: { iron: 2500, copper: 1500, silicon: 1150, titanium: 550, platinum: 220, gold: 250 },
            warpgate: { iron: 3300, copper: 2000, silicon: 1500, uranium: 450, neodymium: 280 },
            terraformer: { iron: 2900, copper: 1750, silicon: 1250, titanium: 650, platinum: 270 },
            colonyship: { iron: 4200, copper: 2500, silicon: 2000, titanium: 950, uranium: 450 },

            haven: { iron: 4200, copper: 2500, silicon: 1900, titanium: 950, platinum: 450, gold: 450 },
            dysonswarm: { iron: 8500, copper: 5100, silicon: 3500, titanium: 1900, uranium: 950 },
            matrixcore: { silicon: 4500, platinum: 950, neodymium: 750, uranium: 550 },
            ascensiongate: { iron: 6800, silicon: 3800, titanium: 1900, uranium: 1400, platinum: 950, neodymium: 480 }
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
        building.elevation = this.tiles[gridY][gridX].elevation || 0;
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