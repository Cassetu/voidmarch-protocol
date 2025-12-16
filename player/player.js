class Player {
    constructor() {
        this.resources = {
            iron: 50,
            copper: 30,
            coal: 20,
            oil: 0,
            silicon: 0,
            rareMinerals: 0,
            gold: 0,
            silver: 0,
            titanium: 0,
            uranium: 0,
            platinum: 0,
            aluminum: 0,
            lithium: 0,
            cobalt: 0,
            nickel: 0,
            zinc: 0,
            tungsten: 0,
            chromium: 0,
            manganese: 0,
            lead: 0,
            tin: 0,
            magnesium: 0,
            thorium: 0,
            palladium: 0,
            neodymium: 0
        };
        this.pinnedResources = ['iron', 'copper', 'coal'];
        this.population = 50;
        this.settlements = [];
        this.nextSettlementId = 0;
        this.planetsControlled = 1;
        this.age = 'stone';
        this.ageLevel = 0;
        this.selectedBuilding = null;
        this.buildings = [];
        this.science = 0;
        this.sciencePerTurn = 0;
        this.production = 0;
        this.turn = 0;
        this.hasEscaped = false;
        this.lastResourceGains = {};
        this.techTree = null;
        this.productionBonus = 0;
        this.totalExperts = 0;
        this.researchSlots = 1;
        this.activeResearch = [];
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
        this.repairers = [];
        this.repairQueue = [];
        this.shipyards = [];
        this.generationShips = [
            { id: 0, assignedYard: null, segment: 0, progress: 0, complete: false },
            { id: 1, assignedYard: null, segment: 0, progress: 0, complete: false },
            { id: 2, assignedYard: null, segment: 0, progress: 0, complete: false },
            { id: 3, assignedYard: null, segment: 0, progress: 0, complete: false },
            { id: 4, assignedYard: null, segment: 0, progress: 0, complete: false }
        ];
        this.shipConstructionActive = false;
    }

    canAffordRepair(buildingType, currentHealth, maxHealth) {
        return BuildingInfo.canAffordRepair(buildingType, currentHealth, maxHealth, this.resources);
    }

    getRepairCost(buildingType, currentHealth, maxHealth) {
        return BuildingInfo.getRepairCost(buildingType, currentHealth, maxHealth);
    }

    startRepair(building, settlement) {
        const repairCost = this.getRepairCost(building.type, building.health, building.maxHealth);

        if (this.resources < repairCost.resources) {
            return false;
        }

        this.resources -= repairCost.resources;

        const repairAmount = building.maxHealth - building.health;
        const distance = Math.abs(settlement.x - building.x) + Math.abs(settlement.y - building.y);
        const repairerId = this.repairers.length;

        const repairer = new Repairer(
            repairerId,
            settlement.x,
            settlement.y,
            building.x,
            building.y,
            building.type,
            distance,
            repairAmount
        );

        this.repairers.push(repairer);
        this.repairQueue.push({
            x: building.x,
            y: building.y,
            type: building.type,
            repairerId: repairerId,
            repairAmount: repairAmount
        });

        return true;
    }

    updateExpertCount() {
        this.totalExperts = 0;
        this.settlements.forEach(settlement => {
            this.totalExperts += settlement.getExpertCount();
        });

        this.researchSlots = 1 + Math.floor(this.totalExperts / 5);
    }

    getEducatedCitizenScienceBonus() {
        let bonus = 0;
        this.settlements.forEach(settlement => {
            bonus += settlement.getEducatedCitizenBonus();
        });
        return bonus;
    }

    processShipyardConstruction() {
        if (this.shipyards.length === 0) return;

        const resourceCostPerTurn = {
            iron: 50,
            copper: 30,
            silicon: 25,
            titanium: 15,
            uranium: 8
        };

        this.shipyards.forEach(yard => {
            if (!yard.assignedShip) {
                const nextShip = this.generationShips.find(s => !s.complete && !s.assignedYard);
                if (nextShip) {
                    nextShip.assignedYard = yard.id;
                    yard.assignedShip = nextShip.id;
                    if (window.game) {
                        window.game.log(`Shipyard ${yard.id + 1} begins construction on Generation Ship ${nextShip.id + 1}`);
                    }
                }
            }

            if (yard.assignedShip !== null) {
                if (!this.hasResources(resourceCostPerTurn)) {
                    if (window.game && !yard.stalled) {
                        window.game.log(`Shipyard ${yard.id + 1} stalled - insufficient resources!`);
                        yard.stalled = true;
                    }
                    return;
                }

                yard.stalled = false;
                this.spendResourceTypes(resourceCostPerTurn);

                const ship = this.generationShips[yard.assignedShip];
                ship.progress += 1;

                const segmentThresholds = [30, 60, 90, 120, 150];
                const segmentNames = ['Frame & Hull', 'Engine Arrays', 'Habitation Rings', 'Agricultural Domes', 'Cryobay Modules'];

                for (let i = 0; i < segmentThresholds.length; i++) {
                    if (ship.progress >= segmentThresholds[i] && ship.segment === i) {
                        ship.segment = i + 1;
                        if (window.game) {
                            window.game.log(`🚀 Ship ${ship.id + 1}: ${segmentNames[i]} completed!`);
                            if (typeof AudioManager !== 'undefined') {
                                AudioManager.playSFX('sounds/sfx/complete.mp3', 0.6);
                            }
                        }
                    }
                }

                if (ship.progress >= 150 && !ship.complete) {
                    ship.complete = true;
                    ship.assignedYard = null;
                    yard.assignedShip = null;
                    if (window.game) {
                        window.game.log(`⭐ GENERATION SHIP ${ship.id + 1} COMPLETE! ${this.generationShips.filter(s => s.complete).length}/5 ships ready.`);
                        if (typeof AudioManager !== 'undefined') {
                            AudioManager.playSFX('sounds/sfx/success', 0.8);
                        }
                    }
                }
            }
        });
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

    hasResources(costs) {
        for (const [resource, amount] of Object.entries(costs)) {
            if ((this.resources[resource] || 0) < amount) {
                return false;
            }
        }
        return true;
    }

    spendResourceTypes(costs) {
        if (!this.hasResources(costs)) return false;

        for (const [resource, amount] of Object.entries(costs)) {
            this.resources[resource] -= amount;
        }
        return true;
    }

    getControllingSettlement(x, y) {
        const claimingSettlements = this.settlements.filter(settlement =>
            settlement.isWithinClaim(x, y)
        );

        if (claimingSettlements.length === 0) return null;
        if (claimingSettlements.length === 1) return claimingSettlements[0];

        return claimingSettlements.reduce((highest, current) => {
            if (current.priority > highest.priority) return current;
            if (current.priority === highest.priority) {
                const popCurrent = current.getPopulation();
                const popHighest = highest.getPopulation();
                return popCurrent > popHighest ? current : highest;
            }
            return highest;
        });
    }

    addResourceTypes(gains) {
        for (const [resource, amount] of Object.entries(gains)) {
            this.resources[resource] = (this.resources[resource] || 0) + amount;
        }
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
            bronze: ['hut', 'settlement', 'farm', 'warehouse', 'barracks', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'school', 'shrine', 'greenhouse'],
            iron: ['hut', 'settlement', 'township', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'school', 'shrine', 'workshop', 'aqueduct', 'watchtower'],
            medieval: ['hut', 'settlement', 'township', 'feudaltown', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'school', 'shrine', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium'],
            renaissance: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'school', 'shrine', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion'],
            industrial: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'ironworks', 'trainstation', 'coalplant', 'greenhouse', 'hydroponicfarm'],
            earlymodern: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks'],
            victorian: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph'],
            modernization: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'greenhouse', 'hydroponicfarm', 'verticalfarm'],
            digital: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'greenhouse', 'hydroponicfarm', 'verticalfarm', 'bioreactor'],
            space: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab', 'greenhouse', 'hydroponicfarm', 'verticalfarm', 'bioreactor', 'synthesizer', 'planetary_orbital_ring', 'planetary_defense_grid', 'orbital_spaceport', 'exodus_shipyard'],
            multiworld: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab', 'warpgate', 'terraformer', 'colonyship', 'planetary_orbital_ring', 'planetary_defense_grid', 'orbital_spaceport', 'exodus_shipyard'],
            zenith: ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven', 'observatory', 'farm', 'warehouse', 'barracks', 'temple', 'forge', 'market', 'castle', 'library', 'university', 'spaceport', 'laboratory', 'megafactory', 'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument', 'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena', 'hospital', 'scriptorium', 'academy', 'theater', 'mansion', 'mineshaft', 'ironworks', 'trainstation', 'coalplant', 'steamfactory', 'clocktower', 'gasworks', 'parliament', 'gaslamp', 'telegraph', 'powerplant', 'skyscraper', 'subwaystation', 'datacenter', 'cybercafe', 'serverbank', 'fusionreactor', 'orbitalring', 'quantumlab', 'warpgate', 'terraformer', 'colonyship', 'dysonswarm', 'matrixcore', 'ascensiongate', 'planetary_orbital_ring', 'planetary_defense_grid', 'orbital_spaceport', 'exodus_shipyard']
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