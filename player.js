class Player {
    constructor() {
        this.resources = 15000;
        this.population = 50;
        this.settlements = [];
        this.nextSettlementId = 0;
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
        this.selfSufficient = false;
        this.energy = 0;
        this.eruptionChanceModifier = 0;
        this.builders = [];
        this.buildingQueue = [];
    }

    advanceAge(newAge) {
        const ages = ['stone', 'bronze', 'iron', 'medieval', 'renaissance', 'industrial', 'earlymodern', 'victorian', 'modernization', 'digital', 'space', 'multiworld', 'zenith'];
        const oldIndex = ages.indexOf(this.age);
        const newIndex = ages.indexOf(newAge);

        if (newIndex > oldIndex) {
            this.age = newAge;
            this.ageLevel = newIndex;
            return true;
        }
        return false;
    }

    addSettlement(x, y, settlementType = 'hut') {
        const settlement = new Settlement(x, y, this.nextSettlementId++, settlementType);
        this.settlements.push(settlement);
        return settlement;
    }

    findNearestSettlement(x, y) {
        let nearest = null;
        let minDist = Infinity;

        this.settlements.forEach(settlement => {
            const dist = Math.abs(settlement.x - x) + Math.abs(settlement.y - y);
            if (dist < minDist) {
                minDist = dist;
                nearest = settlement;
            }
        });

        return nearest;
    }

    getSettlementAt(x, y) {
        return this.settlements.find(s => s.x === x && s.y === y);
    }

    processTurnForSettlements(planet) {
        this.settlements.forEach(settlement => {
            settlement.processTurn(planet);
        });
    }

    getAvailableBuildings() {
        const buildingsPerAge = {
            stone: ['hut', 'farm', 'warehouse', 'campfire', 'tent', 'woodpile'],
            bronze: ['hut', 'settlement', 'farm', 'warehouse', 'barracks', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument'],
            iron: ['hut', 'settlement', 'township', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower'],
            medieval: ['hut', 'settlement', 'township', 'feudaltown', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital'],
            renaissance: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion'],
            industrial: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant'],
            earlymodern: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks'],
            victorian: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph'],
            modernization: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation'],
            digital: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank'],
            space: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab'],
            multiworld: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab', 'warpgate', 'terraformer', 'colonyship'],
            zenith: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab', 'warpgate', 'terraformer', 'colonyship', 'dysonswarm', 'matrixcore', 'ascensiongate']
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

    addPopulation(amount) {
        this.population += amount;
    }

    canPlaceSettlementAt(x, y) {
        return !this.settlements.some(settlement => {
            const dx = Math.abs(settlement.x - x);
            const dy = Math.abs(settlement.y - y);
            return dx <= settlement.claimRadius + 1 && dy <= settlement.claimRadius + 1;
        });
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

        if (building.settlementIds && building.settlementIds.length > 0) {
            const shareAmount = 1.0 / building.settlementIds.length;
            building.settlementIds.forEach(settlementId => {
                const settlement = this.settlements.find(s => s.id === settlementId);
                if (settlement) {
                    settlement.removeBuilding(building.type, shareAmount);
                }
            });
        }
    }
}