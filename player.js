class Player {
    constructor() {
        this.resources = 15000;
        this.food = 100;
        this.population = 50;
        this.planetsControlled = 1;
        this.age = 'stone';
        this.ageLevel = 0;
        this.selectedBuilding = null;
        this.buildings = [];
        this.sciencePerTurn = 0;
        this.production = 0;
        this.turn = 0;
        this.hasEscaped = false;
        this.techTree = null;
        this.productionBonus = 0;
        this.foodBonus = 0;
        this.scienceBonus = 0;
        this.populationCap = 100;
        this.buildingHPBonus = 0;
        this.eruptionResistance = 0;
        this.coreStabilityMultiplier = 1;
        this.eruptionWarning = 0;
        this.rocketCapacity = 0;
        this.shipCapacity = 0;
        this.evacuationSpeed = 0;
        this.canBuildFloating = false;
        this.canBuildAnywhere = false;
        this.canEscape = false;
        this.coreStable = false;
        this.builders = [];
        this.buildingQueue = [];
    }

    advanceAge(newAge) {
        const ages = ['stone', 'bronze', 'iron', 'medieval', 'renaissance', 'space'];
        const oldIndex = ages.indexOf(this.age);
        const newIndex = ages.indexOf(newAge);

        if (newIndex > oldIndex) {
            this.age = newAge;
            this.ageLevel = newIndex;
            return true;
        }
        return false;
    }

    getAvailableBuildings() {
        const buildingsPerAge = {
            stone: ['settlement', 'farm', 'warehouse'],
            bronze: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks'],
            iron: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge'],
            medieval: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle'],
            renaissance: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle', 'library'],
            space: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university']
        };
        return buildingsPerAge[this.age] || buildingsPerAge.stone;
    }

    addProduction(amount) {
        this.production += amount;
    }

    nextTurn() {
        this.turn++;
    }

    addResources(amount) {
        this.resources += amount;
    }

    spendResources(amount) {
        if (this.resources >= amount) {
            this.resources -= amount;
            return true;
        }
        return false;
    }

    addFood(amount) {
        this.food = Math.min(this.food + amount, this.population * 5);
    }

    consumeFood(amount) {
        this.food -= amount;
        if (this.food < 0) {
            this.population += Math.floor(this.food / 10);
            this.food = 0;
        }
    }

    addPopulation(amount) {
        this.population += amount;
    }

    getAvailableBuildings() {
        const buildingsPerAge = {
            stone: ['settlement', 'farm', 'warehouse', 'observatory', 'campfire', 'tent', 'woodpile'],
            bronze: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument'],
            iron: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower'],
            medieval: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital'],
            renaissance: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion'],
            space: ['settlement', 'farm', 'warehouse', 'observatory', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'spaceport', 'laboratory', 'megafactory']
        };
        return buildingsPerAge[this.age] || buildingsPerAge.stone;
    }

    canResearch(tech) {
        return this.resources >= this.techs[tech].cost && this.techs[tech].level === 0;
    }

    researchTech(tech) {
        if (this.canResearch(tech)) {
            this.spendResources(this.techs[tech].cost);
            this.techs[tech].level = 1;
            this.age = tech;
            return true;
        }
        return false;
    }

    addBuilding(building) {
        this.buildings.push(building);
    }

    removeBuilding(building) {
        this.buildings = this.buildings.filter(b => b !== building);
    }
}