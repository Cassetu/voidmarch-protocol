class TechTree {
    constructor(player) {
        this.player = player;
        this.techs = this.initializeTechs();
        this.researchQueue = [];
        this.currentResearch = null;
        this.researchProgress = 0;
    }

    initializeTechs() {
        return {
            mining: {
                name: 'Basic Mining',
                cost: 30,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['warehouse', 'deepMining'],
                bonus: { production: 2 },
                description: 'Extract resources from volcanic rock'
            },
            shelter: {
                name: 'Emergency Shelter',
                cost: 25,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['settlement', 'reinforcedStructures'],
                bonus: { population: 5 },
                description: 'Basic protection from eruptions'
            },
            farming: {
                name: 'Ash Farming',
                cost: 35,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['farm', 'hydroponics'],
                bonus: { food: 3 },
                description: 'Grow crops in volcanic soil'
            },

            deepMining: {
                name: 'Deep Mining',
                cost: 100,
                type: 'survival',
                researched: false,
                prerequisites: ['mining'],
                unlocks: ['geothermalHarvesting', 'forge'],
                bonus: { production: 5 },
                description: 'Mine deeper into unstable crust'
            },
            reinforcedStructures: {
                name: 'Reinforced Structures',
                cost: 120,
                type: 'survival',
                researched: false,
                prerequisites: ['shelter'],
                unlocks: ['bunker', 'seismicDampers'],
                bonus: { buildingHP: 50 },
                description: 'Buildings resist eruption damage'
            },
            hydroponics: {
                name: 'Hydroponics',
                cost: 150,
                type: 'survival',
                researched: false,
                prerequisites: ['farming'],
                unlocks: ['verticalFarm', 'bioengineering'],
                bonus: { food: 8 },
                description: 'Grow food without soil'
            },

            geothermalHarvesting: {
                name: 'Geothermal Harvesting',
                cost: 200,
                type: 'energy',
                researched: false,
                prerequisites: ['deepMining'],
                unlocks: ['geothermalPlant', 'magmaForge', 'thermalVents'],
                bonus: { production: 10, energy: 5 },
                description: 'Harness planetary heat for power'
            },
            seismicDampers: {
                name: 'Seismic Dampers',
                cost: 180,
                type: 'survival',
                researched: false,
                prerequisites: ['reinforcedStructures'],
                unlocks: ['seismicNetwork', 'earthquakePredictor'],
                bonus: { eruption_resistance: 30 },
                description: 'Reduce earthquake damage by 30%'
            },
            verticalFarm: {
                name: 'Vertical Farming',
                cost: 220,
                type: 'survival',
                researched: false,
                prerequisites: ['hydroponics'],
                unlocks: ['biodome', 'geneticSeeds'],
                bonus: { food: 15 },
                description: 'Stack farms to save space'
            },

            thermalVents: {
                name: 'Thermal Vent Control',
                cost: 300,
                type: 'energy',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['coreStabilizer', 'magmaPump'],
                bonus: { core_stability_slowdown: 0.2 },
                description: 'Slow core collapse by 20%'
            },
            magmaForge: {
                name: 'Magma Forge',
                cost: 250,
                type: 'production',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['advancedAlloys', 'plasmaTools'],
                bonus: { production: 15 },
                description: 'Use lava to craft materials'
            },
            seismicNetwork: {
                name: 'Seismic Network',
                cost: 280,
                type: 'survival',
                researched: false,
                prerequisites: ['seismicDampers'],
                unlocks: ['earlyWarning', 'volcanology'],
                bonus: { eruption_warning: 2 },
                description: 'Predict eruptions 2 turns early'
            },
            biodome: {
                name: 'Biodome Technology',
                cost: 320,
                type: 'survival',
                researched: false,
                prerequisites: ['verticalFarm'],
                unlocks: ['closedEcosystem', 'oxygenRecycling'],
                bonus: { food: 20, population: 10 },
                description: 'Self-contained habitat'
            },

            coreStabilizer: {
                name: 'Core Stabilizer',
                cost: 500,
                type: 'survival',
                researched: false,
                prerequisites: ['thermalVents'],
                unlocks: ['planetaryEngineering', 'coreReactor'],
                bonus: { core_stability_slowdown: 0.5 },
                description: 'Slow collapse by 50%'
            },
            advancedAlloys: {
                name: 'Heat-Resistant Alloys',
                cost: 350,
                type: 'production',
                researched: false,
                prerequisites: ['magmaForge'],
                unlocks: ['heatShielding', 'volcanicArmor'],
                bonus: { production: 20, buildingHP: 100 },
                description: 'Materials that withstand extreme heat'
            },
            volcanology: {
                name: 'Volcanology',
                cost: 400,
                type: 'science',
                researched: false,
                prerequisites: ['seismicNetwork'],
                unlocks: ['mantleMapping', 'eruption_control'],
                bonus: { science: 15, eruption_warning: 3 },
                description: 'Study volcanic patterns'
            },
            closedEcosystem: {
                name: 'Closed Ecosystem',
                cost: 450,
                type: 'survival',
                researched: false,
                prerequisites: ['biodome'],
                unlocks: ['spaceHabitat', 'lifeSupportSystems'],
                bonus: { food: 30, self_sufficient: true },
                description: 'No external food needed'
            },

            floatingPlatforms: {
                name: 'Floating Platforms',
                cost: 300,
                type: 'expansion',
                researched: false,
                prerequisites: ['reinforcedStructures'],
                unlocks: ['skyCity', 'antigravity'],
                bonus: { floating_build: true },
                description: 'Build on floating islands'
            },
            rocketry: {
                name: 'Basic Rocketry',
                cost: 400,
                type: 'escape',
                researched: false,
                prerequisites: ['advancedAlloys'],
                unlocks: ['orbitTech', 'fuelSynthesis'],
                bonus: { rocket_capacity: 10 },
                description: 'First step to space'
            },
            mantleMapping: {
                name: 'Mantle Mapping',
                cost: 550,
                type: 'science',
                researched: false,
                prerequisites: ['volcanology'],
                unlocks: ['coreDiving', 'predictiveModels'],
                bonus: { science: 25, eruption_warning: 5 },
                description: 'Map entire planetary core'
            },
            spaceHabitat: {
                name: 'Space Habitat Design',
                cost: 600,
                type: 'escape',
                researched: false,
                prerequisites: ['closedEcosystem', 'floatingPlatforms'],
                unlocks: ['generationShip', 'colonizationPod'],
                bonus: { ship_capacity: 50 },
                description: 'Live in space indefinitely'
            },

            antigravity: {
                name: 'Antigravity Fields',
                cost: 700,
                type: 'expansion',
                researched: false,
                prerequisites: ['floatingPlatforms', 'coreStabilizer'],
                unlocks: ['levitatingCity', 'gravityManipulation'],
                bonus: { all_tiles_buildable: true },
                description: 'Build anywhere, even on lava'
            },
            orbitTech: {
                name: 'Orbital Technology',
                cost: 650,
                type: 'escape',
                researched: false,
                prerequisites: ['rocketry'],
                unlocks: ['spaceElevator', 'orbitalStation'],
                bonus: { rocket_capacity: 30 },
                description: 'Reach stable orbit'
            },
            coreDiving: {
                name: 'Core Diving',
                cost: 800,
                type: 'science',
                researched: false,
                prerequisites: ['mantleMapping', 'heatShielding'],
                unlocks: ['coreHarvesting', 'planetaryReversal'],
                bonus: { production: 40 },
                description: 'Extract resources from core'
            },
            generationShip: {
                name: 'Generation Ship',
                cost: 1000,
                type: 'escape',
                researched: false,
                prerequisites: ['spaceHabitat', 'orbitTech'],
                unlocks: ['exodusProtocol'],
                bonus: { ship_capacity: 200 },
                description: 'Ship for 200 population'
            },

            heatShielding: {
                name: 'Thermal Shielding',
                cost: 500,
                type: 'production',
                researched: false,
                prerequisites: ['advancedAlloys'],
                unlocks: ['coreDiving', 'lavaSuits'],
                bonus: { eruption_resistance: 60 },
                description: 'Survive direct lava exposure'
            },
            fuelSynthesis: {
                name: 'Fuel Synthesis',
                cost: 550,
                type: 'escape',
                researched: false,
                prerequisites: ['rocketry', 'geothermalHarvesting'],
                unlocks: ['fusionDrive', 'antimatterCollector'],
                bonus: { rocket_fuel_efficiency: 2 },
                description: 'Create rocket fuel from heat'
            },
            predictiveModels: {
                name: 'Predictive Models',
                cost: 750,
                type: 'science',
                researched: false,
                prerequisites: ['mantleMapping'],
                unlocks: ['eruption_control', 'collapseCalculator'],
                bonus: { eruption_warning: 7, science: 30 },
                description: 'Predict all eruptions'
            },
            spaceElevator: {
                name: 'Space Elevator',
                cost: 900,
                type: 'escape',
                researched: false,
                prerequisites: ['orbitTech', 'advancedAlloys'],
                unlocks: ['massEvacuation'],
                bonus: { evacuation_speed: 50 },
                description: 'Evacuate 50 people per turn'
            },

            coreHarvesting: {
                name: 'Core Harvesting',
                cost: 1200,
                type: 'production',
                researched: false,
                prerequisites: ['coreDiving'],
                unlocks: ['coreReactor'],
                bonus: { production: 100, core_stability_loss: 2 },
                description: 'Massive resources, speeds collapse'
            },
            fusionDrive: {
                name: 'Fusion Drive',
                cost: 1100,
                type: 'escape',
                researched: false,
                prerequisites: ['fuelSynthesis'],
                unlocks: ['warpDrive', 'exodusProtocol'],
                bonus: { rocket_speed: 10 },
                description: 'Faster than light travel'
            },
            eruption_control: {
                name: 'Eruption Suppression',
                cost: 1300,
                type: 'survival',
                researched: false,
                prerequisites: ['predictiveModels', 'volcanology'],
                unlocks: ['planetarySalvation'],
                bonus: { eruption_chance: -50 },
                description: 'Reduce eruptions by 50%'
            },
            massEvacuation: {
                name: 'Mass Evacuation',
                cost: 1400,
                type: 'escape',
                researched: false,
                prerequisites: ['spaceElevator', 'generationShip'],
                unlocks: ['exodusProtocol'],
                bonus: { evacuation_speed: 100 },
                description: 'Save everyone quickly'
            },

            exodusProtocol: {
                name: 'Exodus Protocol',
                cost: 2000,
                type: 'victory',
                researched: false,
                prerequisites: ['generationShip', 'fusionDrive', 'massEvacuation'],
                unlocks: [],
                bonus: { can_escape: true },
                description: 'ESCAPE THE PLANET - Victory!'
            },
            planetarySalvation: {
                name: 'Planetary Salvation',
                cost: 2500,
                type: 'victory',
                researched: false,
                prerequisites: ['eruption_control', 'coreStabilizer', 'planetaryEngineering'],
                unlocks: [],
                bonus: { core_stable: true },
                description: 'STABILIZE THE CORE - Victory!'
            },
            planetaryEngineering: {
                name: 'Planetary Engineering',
                cost: 1500,
                type: 'survival',
                researched: false,
                prerequisites: ['coreStabilizer', 'mantleMapping'],
                unlocks: ['planetarySalvation'],
                bonus: { core_stability_slowdown: 0.8 },
                description: 'Reshape entire planets'
            },
            coreReactor: {
                name: 'Core Reactor',
                cost: 1600,
                type: 'energy',
                researched: false,
                prerequisites: ['coreStabilizer', 'coreHarvesting'],
                unlocks: ['planetaryEngineering'],
                bonus: { production: 150, energy: 100 },
                description: 'Harness core energy directly'
            }
        };
    }

    canResearch(techId) {
        const tech = this.techs[techId];
        if (!tech || tech.researched) return false;

        for (let prereq of tech.prerequisites) {
            if (!this.techs[prereq].researched) {
                return false;
            }
        }

        return this.player.sciencePerTurn >= tech.cost;
    }

    startResearch(techId) {
        if (!this.canResearch(techId)) return false;

        const tech = this.techs[techId];
        if (this.player.sciencePerTurn < tech.cost) {
            return false;
        }

        if (this.currentResearch) {
            this.researchQueue.push(techId);
            return true;
        }

        this.currentResearch = techId;
        this.researchProgress = 0;
        return true;
    }

    progressResearch() {
        if (!this.currentResearch) {
            if (this.researchQueue.length > 0) {
                const nextTech = this.researchQueue[0];
                if (this.player.sciencePerTurn >= this.techs[nextTech].cost) {
                    this.currentResearch = this.researchQueue.shift();
                    this.researchProgress = 0;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        const tech = this.techs[this.currentResearch];
        this.researchProgress++;

        const turnsRequired = tech.cost;
        if (this.researchProgress >= turnsRequired) {
            return this.completeTech(this.currentResearch);
        }

        return null;
    }

    completeTech(techId) {
        const tech = this.techs[techId];
        tech.researched = true;

        this.applyBonus(tech.bonus);

        const completedTech = this.currentResearch;
        this.currentResearch = null;
        this.researchProgress = 0;

        if (tech.type === 'victory') {
            return { completed: completedTech, victory: true, victoryType: techId };
        }

        return { completed: completedTech, victory: false };
    }

    applyBonus(bonus) {
        if (bonus.production) {
            this.player.productionBonus = (this.player.productionBonus || 0) + bonus.production;
        }
        if (bonus.food) {
            this.player.foodBonus = (this.player.foodBonus || 0) + bonus.food;
        }
        if (bonus.science) {
            this.player.scienceBonus = (this.player.scienceBonus || 0) + bonus.science;
        }
        if (bonus.population) {
            this.player.populationCap = (this.player.populationCap || 100) + bonus.population;
        }
        if (bonus.buildingHP) {
            this.player.buildingHPBonus = (this.player.buildingHPBonus || 0) + bonus.buildingHP;
        }
        if (bonus.eruption_resistance) {
            this.player.eruptionResistance = (this.player.eruptionResistance || 0) + bonus.eruption_resistance;
        }
        if (bonus.core_stability_slowdown) {
            this.player.coreStabilityMultiplier = (this.player.coreStabilityMultiplier || 1) - bonus.core_stability_slowdown;
        }
        if (bonus.eruption_warning) {
            this.player.eruptionWarning = (this.player.eruptionWarning || 0) + bonus.eruption_warning;
        }
        if (bonus.rocket_capacity) {
            this.player.rocketCapacity = (this.player.rocketCapacity || 0) + bonus.rocket_capacity;
        }
        if (bonus.ship_capacity) {
            this.player.shipCapacity = (this.player.shipCapacity || 0) + bonus.ship_capacity;
        }
        if (bonus.evacuation_speed) {
            this.player.evacuationSpeed = (this.player.evacuationSpeed || 0) + bonus.evacuation_speed;
        }
        if (bonus.floating_build) {
            this.player.canBuildFloating = true;
        }
        if (bonus.all_tiles_buildable) {
            this.player.canBuildAnywhere = true;
        }
        if (bonus.can_escape) {
            this.player.canEscape = true;
        }
        if (bonus.core_stable) {
            this.player.coreStable = true;
        }
    }

    getAvailableTechs() {
        return Object.keys(this.techs).filter(techId => {
            const tech = this.techs[techId];
            if (tech.researched) return false;

            return tech.prerequisites.every(prereq => this.techs[prereq].researched);
        });
    }

    getResearchInfo() {
        if (!this.currentResearch) return null;

        const tech = this.techs[this.currentResearch];
        const turnsRemaining = tech.cost - this.researchProgress;

        return {
            name: tech.name,
            progress: this.researchProgress,
            turnsRemaining: turnsRemaining
        };
    }
}