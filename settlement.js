class Settlement {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.name = this.generateSettlementName();
        this.population = 5;
        this.citizens = [];
        this.food = 20;
        this.foodPerTurn = 0;
        this.foodConsumption = 0;
        this.growthProgress = 0;
        this.growthRequired = 15;
        this.claimRadius = 3;
        this.buildings = new Map();
        this.buildingLimits = {
            granary: 1,
            warehouse: 1,
            farm: 3,
            aqueduct: 1,
            forge: 1,
            temple: 1,
            barracks: 1,
            market: 1
        };

        for (let i = 0; i < this.population; i++) {
            this.citizens.push(this.generateCitizen());
        }
    }

    generateSettlementName() {
        const terrainCounts = {
            lava: 0,
            water: 0,
            sand: 0,
            rock: 0,
            darksoil: 0,
            ice: 0,
            tundra: 0,
            ash: 0,
            floating: 0,
            forest: 0,
            jungle: 0
        };

        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const checkX = this.x + dx;
                const checkY = this.y + dy;

                if (window.game && window.game.currentPlanet) {
                    const planet = window.game.currentPlanet;
                    if (checkX >= 0 && checkX < planet.width && checkY >= 0 && checkY < planet.height) {
                        const tile = planet.tiles[checkY][checkX];
                        if (terrainCounts[tile.type] !== undefined) {
                            terrainCounts[tile.type]++;
                        }
                    }
                }
            }
        }

        const dominantTerrain = Object.keys(terrainCounts).reduce((a, b) =>
            terrainCounts[a] > terrainCounts[b] ? a : b
        );

        const terrainPrefixes = {
            lava: ['Ember', 'Flame', 'Magma', 'Fire', 'Scorch', 'Inferno'],
            water: ['River', 'Lake', 'Sea', 'Bay', 'Port', 'Harbor'],
            sand: ['Dune', 'Desert', 'Sand', 'Oasis', 'Mesa'],
            rock: ['Stone', 'Boulder', 'Crag', 'Cliff', 'Peak'],
            darksoil: ['Dark', 'Shadow', 'Black', 'Obsidian', 'Onyx'],
            ice: ['Frost', 'Ice', 'Snow', 'Frozen', 'Winter', 'Crystal'],
            tundra: ['Cold', 'North', 'Pale', 'Bitter', 'White'],
            ash: ['Ash', 'Cinder', 'Soot', 'Gray', 'Smoke'],
            floating: ['Sky', 'Cloud', 'Drift', 'Float', 'High'],
            forest: ['Green', 'Wood', 'Tree', 'Grove', 'Forest'],
            jungle: ['Wild', 'Vine', 'Deep', 'Tangle', 'Green']
        };

        const suffixes = ['haven', 'burg', 'ville', 'ton', 'dale', 'field', 'ridge',
                          'crest', 'point', 'rock', 'hold', 'rest', 'watch', 'keep',
                          'fall', 'springs', 'hollow', 'vale', 'mount', 'shore'];

        const prefixes = terrainPrefixes[dominantTerrain] || ['New', 'Old'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        return `${prefix}${suffix}`;
    }

    generateCitizen() {
        const firstNames = ['Aria', 'Bjorn', 'Chen', 'Dara', 'Erik', 'Fiona', 'Gavin', 'Hana', 'Ivan', 'Jana',
                           'Kael', 'Luna', 'Marcus', 'Nora', 'Oscar', 'Petra', 'Quinn', 'Ravi', 'Sara', 'Tomas',
                           'Uma', 'Victor', 'Wren', 'Xander', 'Yuki', 'Zara', 'Aiden', 'Bella', 'Caleb', 'Diana'];
        const lastNames = ['Ashborn', 'Firewalker', 'Stonehand', 'Ironforge', 'Emberhart', 'Rockwell', 'Flameheart',
                          'Cinder', 'Magma', 'Lavaflow', 'Obsidian', 'Crater', 'Basalt', 'Pyroclast', 'Scorch'];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return {
            id: `${Date.now()}-${Math.random()}`,
            name: `${firstName} ${lastName}`,
            age: Math.floor(Math.random() * 50) + 18,
            job: 'Citizen'
        };
    }

    isWithinClaim(x, y) {
        const distance = Math.abs(this.x - x) + Math.abs(this.y - y);
        return distance <= this.claimRadius;
    }

    canBuildStructure(buildingType) {
        const limit = this.buildingLimits[buildingType];
        if (limit === undefined) return true;

        const currentCount = this.buildings.get(buildingType) || 0;
        return currentCount < limit;
    }

    addBuilding(buildingType) {
        const currentCount = this.buildings.get(buildingType) || 0;
        this.buildings.set(buildingType, currentCount + 1);
    }

    removeBuilding(buildingType) {
        const currentCount = this.buildings.get(buildingType) || 0;
        if (currentCount > 0) {
            this.buildings.set(buildingType, currentCount - 1);
        }
    }

    calculateFoodProduction(planet) {
        let production = 0;
        const farmCount = this.buildings.get('farm') || 0;
        const aqueductCount = this.buildings.get('aqueduct') || 0;

        production += farmCount * 3;
        production += aqueductCount * 2;

        return production;
    }

    processTurn(planet) {
        this.foodPerTurn = this.calculateFoodProduction(planet);
        this.foodConsumption = this.population * 2;

        console.log(`Settlement ${this.name}: food/turn=${this.foodPerTurn}, consumption=${this.foodConsumption}`);

        const netFood = this.foodPerTurn - this.foodConsumption;
        this.food += netFood;

        const granaryCount = this.buildings.get('granary') || 0;
        const maxFood = 50 + (granaryCount * 100);

        if (this.food > maxFood) {
            this.food = maxFood;
        }

        if (this.food < 0) {
            this.food = 0;
            if (this.population > 1 && Math.random() < 0.3) {
                this.citizens.pop();
                this.population--;
            }
        }

        if (netFood > 0) {
            this.growthProgress += netFood;
            if (this.growthProgress >= this.growthRequired) {
                this.growthProgress = 0;
                this.growthRequired = Math.floor(this.growthRequired * 1.2);
                this.population++;
                this.citizens.push(this.generateCitizen());
            }
        } else if (netFood < 0) {
            this.growthProgress = Math.max(0, this.growthProgress + netFood);
        }
    }

    getStorageCapacity() {
        const granaryCount = this.buildings.get('granary') || 0;
        return 50 + (granaryCount * 100);
    }
}