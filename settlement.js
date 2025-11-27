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
        const prefixes = ['New', 'Old', 'Port', 'Fort', 'Mount', 'Lake', 'Stone', 'Iron', 'Ash', 'Fire'];
        const suffixes = ['haven', 'burg', 'ville', 'ton', 'dale', 'field', 'ridge', 'crest', 'point', 'rock'];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
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