class Player {
    constructor() {
        this.resources = 150;
        this.food = 100;
        this.population = 50;
        this.planetsControlled = 1;
        this.age = 'stone';
        this.selectedBuilding = null;
        this.buildings = [];
        this.techs = {
            stone: { level: 1, cost: 0, name: 'Stone Age' },
            bronze: { level: 0, cost: 200, name: 'Bronze Working' },
            iron: { level: 0, cost: 400, name: 'Iron Working' },
            medieval: { level: 0, cost: 600, name: 'Medieval' },
            renaissance: { level: 0, cost: 800, name: 'Renaissance' }
        };
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
            stone: ['settlement', 'farm', 'warehouse'],
            bronze: ['settlement', 'farm', 'warehouse', 'barracks', 'temple'],
            iron: ['settlement', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market'],
            medieval: ['settlement', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library'],
            renaissance: ['settlement', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'observatory']
        };
        return buildingsPerAge[this.age] || [];
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