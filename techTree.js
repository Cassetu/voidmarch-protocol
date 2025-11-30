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
                description: 'Extract resources from volcanic rock',
                planets: ['volcanic']
            },
            bronzeAge: {
                name: 'Bronze Working',
                cost: 50,
                type: 'age',
                researched: false,
                prerequisites: ['mining', 'shelter'],
                unlocks: ['ironAge', 'barracks'],
                bonus: { age: 'bronze' },
                description: 'Advance to Bronze Age - Unlock military buildings',
                planets: ['volcanic']
            },
            ironAge: {
                name: 'Iron Working',
                cost: 150,
                type: 'age',
                researched: false,
                prerequisites: ['bronzeAge', 'deepMining'],
                unlocks: ['medievalAge', 'forge', 'temple'],
                bonus: { age: 'iron' },
                description: 'Advance to Iron Age - Unlock forges and temples',
                planets: ['volcanic']
            },
            medievalAge: {
                name: 'Medieval Era',
                cost: 300,
                type: 'age',
                researched: false,
                prerequisites: ['ironAge', 'reinforcedStructures'],
                unlocks: ['renaissanceAge', 'market', 'castle'],
                bonus: { age: 'medieval' },
                description: 'Advance to Medieval Era - Unlock markets and castles',
                planets: ['volcanic']
            },
            renaissanceAge: {
                name: 'Renaissance',
                cost: 500,
                type: 'age',
                researched: false,
                prerequisites: ['medievalAge', 'volcanology'],
                unlocks: ['spaceAge', 'library'],
                bonus: { age: 'renaissance' },
                description: 'Advance to Renaissance - Unlock libraries',
                planets: ['volcanic']
            },
            spaceAge: {
                name: 'Space Age',
                cost: 800,
                type: 'age',
                researched: false,
                prerequisites: ['renaissanceAge', 'rocketry'],
                unlocks: ['university', 'exodusProtocol'],
                bonus: { age: 'space' },
                description: 'Advance to Space Age - Unlock universities and space travel',
                planets: ['volcanic']
            },
            shelter: {
                name: 'Emergency Shelter',
                cost: 25,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['settlement', 'reinforcedStructures'],
                bonus: { population: 5 },
                description: 'Basic protection from eruptions',
                planets: ['volcanic']
            },
            farming: {
                name: 'Ash Farming',
                cost: 35,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['farm', 'hydroponics'],
                bonus: { food: 3 },
                description: 'Grow crops in volcanic soil',
                planets: ['volcanic']
            },
            deepMining: {
                name: 'Deep Mining',
                cost: 100,
                type: 'survival',
                researched: false,
                prerequisites: ['mining'],
                unlocks: ['geothermalHarvesting', 'forge'],
                bonus: { production: 5 },
                description: 'Mine deeper into unstable crust',
                planets: ['volcanic']
            },
            reinforcedStructures: {
                name: 'Reinforced Structures',
                cost: 120,
                type: 'survival',
                researched: false,
                prerequisites: ['shelter'],
                unlocks: ['bunker', 'seismicDampers'],
                bonus: { buildingHP: 50 },
                description: 'Buildings resist eruption damage',
                planets: ['volcanic']
            },
            hydroponics: {
                name: 'Hydroponics',
                cost: 150,
                type: 'survival',
                researched: false,
                prerequisites: ['farming'],
                unlocks: ['verticalFarm', 'bioengineering'],
                bonus: { food: 8 },
                description: 'Grow food without soil',
                planets: ['volcanic']
            },
            geothermalHarvesting: {
                name: 'Geothermal Harvesting',
                cost: 200,
                type: 'energy',
                researched: false,
                prerequisites: ['deepMining'],
                unlocks: ['geothermalPlant', 'magmaForge', 'thermalVents'],
                bonus: { production: 10, energy: 5 },
                description: 'Harness planetary heat for power',
                planets: ['volcanic']
            },
            seismicDampers: {
                name: 'Seismic Dampers',
                cost: 180,
                type: 'survival',
                researched: false,
                prerequisites: ['reinforcedStructures'],
                unlocks: ['seismicNetwork', 'earthquakePredictor'],
                bonus: { eruption_resistance: 30 },
                description: 'Reduce earthquake damage by 30%',
                planets: ['volcanic']
            },
            verticalFarm: {
                name: 'Vertical Farming',
                cost: 220,
                type: 'survival',
                researched: false,
                prerequisites: ['hydroponics'],
                unlocks: ['biodome', 'geneticSeeds'],
                bonus: { food: 15 },
                description: 'Stack farms to save space',
                planets: ['volcanic']
            },
            thermalVents: {
                name: 'Thermal Vent Control',
                cost: 300,
                type: 'energy',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['coreStabilizer', 'magmaPump'],
                bonus: { core_stability_slowdown: 0.2 },
                description: 'Slow core collapse by 20%',
                planets: ['volcanic']
            },
            magmaForge: {
                name: 'Magma Forge',
                cost: 250,
                type: 'production',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['advancedAlloys', 'plasmaTools'],
                bonus: { production: 15 },
                description: 'Use lava to craft materials',
                planets: ['volcanic']
            },
            seismicNetwork: {
                name: 'Seismic Network',
                cost: 280,
                type: 'survival',
                researched: false,
                prerequisites: ['seismicDampers'],
                unlocks: ['earlyWarning', 'volcanology'],
                bonus: { eruption_warning: 2 },
                description: 'Predict eruptions 2 turns early',
                planets: ['volcanic']
            },
            biodome: {
                name: 'Biodome Technology',
                cost: 320,
                type: 'survival',
                researched: false,
                prerequisites: ['verticalFarm'],
                unlocks: ['closedEcosystem', 'oxygenRecycling'],
                bonus: { food: 20, population: 10 },
                description: 'Self-contained habitat',
                planets: ['volcanic']
            },
            coreStabilizer: {
                name: 'Core Stabilizer',
                cost: 500,
                type: 'survival',
                researched: false,
                prerequisites: ['thermalVents'],
                unlocks: ['planetaryEngineering', 'coreReactor'],
                bonus: { core_stability_slowdown: 0.5 },
                description: 'Slow collapse by 50%',
                planets: ['volcanic']
            },
            advancedAlloys: {
                name: 'Heat-Resistant Alloys',
                cost: 350,
                type: 'production',
                researched: false,
                prerequisites: ['magmaForge'],
                unlocks: ['heatShielding', 'volcanicArmor'],
                bonus: { production: 20, buildingHP: 100 },
                description: 'Materials that withstand extreme heat',
                planets: ['volcanic']
            },
            volcanology: {
                name: 'Volcanology',
                cost: 400,
                type: 'science',
                researched: false,
                prerequisites: ['seismicNetwork'],
                unlocks: ['mantleMapping', 'eruption_control'],
                bonus: { science: 15, eruption_warning: 3 },
                description: 'Study volcanic patterns',
                planets: ['volcanic']
            },
            closedEcosystem: {
                name: 'Closed Ecosystem',
                cost: 450,
                type: 'survival',
                researched: false,
                prerequisites: ['biodome'],
                unlocks: ['lifeSupportSystems', 'exodusProtocol'],
                bonus: { food: 30, self_sufficient: true },
                description: 'No external food needed',
                planets: ['volcanic']
            },
            floatingPlatforms: {
                name: 'Floating Platforms',
                cost: 300,
                type: 'expansion',
                researched: false,
                prerequisites: ['reinforcedStructures'],
                unlocks: ['skyCity', 'antigravity'],
                bonus: { floating_build: true },
                description: 'Build on floating islands',
                planets: ['volcanic']
            },
            rocketry: {
                name: 'Basic Rocketry',
                cost: 400,
                type: 'escape',
                researched: false,
                prerequisites: ['advancedAlloys'],
                unlocks: ['orbitTech', 'fuelSynthesis'],
                bonus: { rocket_capacity: 10 },
                description: 'First step to space',
                planets: ['volcanic']
            },
            mantleMapping: {
                name: 'Mantle Mapping',
                cost: 550,
                type: 'science',
                researched: false,
                prerequisites: ['volcanology'],
                unlocks: ['coreDiving', 'predictiveModels'],
                bonus: { science: 25, eruption_warning: 5 },
                description: 'Map entire planetary core',
                planets: ['volcanic']
            },
            spaceHabitat: {
                name: 'Space Habitat Design',
                cost: 600,
                type: 'escape',
                researched: false,
                prerequisites: ['closedEcosystem', 'floatingPlatforms'],
                unlocks: ['generationShip', 'colonizationPod'],
                bonus: { ship_capacity: 50 },
                description: 'Live in space indefinitely',
                planets: ['volcanic']
            },
            antigravity: {
                name: 'Antigravity Fields',
                cost: 700,
                type: 'expansion',
                researched: false,
                prerequisites: ['floatingPlatforms', 'coreStabilizer'],
                unlocks: ['levitatingCity', 'gravityManipulation'],
                bonus: { all_tiles_buildable: true },
                description: 'Build anywhere, even on lava',
                planets: ['volcanic']
            },
            orbitTech: {
                name: 'Orbital Technology',
                cost: 650,
                type: 'escape',
                researched: false,
                prerequisites: ['rocketry'],
                unlocks: ['spaceElevator', 'orbitalStation'],
                bonus: { rocket_capacity: 30 },
                description: 'Reach stable orbit',
                planets: ['volcanic']
            },
            coreDiving: {
                name: 'Core Diving',
                cost: 800,
                type: 'science',
                researched: false,
                prerequisites: ['mantleMapping', 'heatShielding'],
                unlocks: ['coreHarvesting', 'planetaryReversal'],
                bonus: { production: 40 },
                description: 'Extract resources from core',
                planets: ['volcanic']
            },
            generationShip: {
                name: 'Generation Ship',
                cost: 1000,
                type: 'escape',
                researched: false,
                prerequisites: ['spaceHabitat', 'orbitTech'],
                unlocks: ['exodusProtocol'],
                bonus: { ship_capacity: 200 },
                description: 'Ship for 200 population',
                planets: ['volcanic']
            },
            heatShielding: {
                name: 'Thermal Shielding',
                cost: 500,
                type: 'production',
                researched: false,
                prerequisites: ['advancedAlloys'],
                unlocks: ['coreDiving', 'lavaSuits'],
                bonus: { eruption_resistance: 60 },
                description: 'Survive direct lava exposure',
                planets: ['volcanic']
            },
            fuelSynthesis: {
                name: 'Fuel Synthesis',
                cost: 550,
                type: 'escape',
                researched: false,
                prerequisites: ['rocketry', 'geothermalHarvesting'],
                unlocks: ['fusionDrive', 'antimatterCollector'],
                bonus: { rocket_fuel_efficiency: 2 },
                description: 'Create rocket fuel from heat',
                planets: ['volcanic']
            },
            predictiveModels: {
                name: 'Predictive Models',
                cost: 750,
                type: 'science',
                researched: false,
                prerequisites: ['mantleMapping'],
                unlocks: ['eruption_control', 'collapseCalculator'],
                bonus: { eruption_warning: 7, science: 30 },
                description: 'Predict all eruptions',
                planets: ['volcanic']
            },
            spaceElevator: {
                name: 'Space Elevator',
                cost: 900,
                type: 'escape',
                researched: false,
                prerequisites: ['orbitTech', 'advancedAlloys'],
                unlocks: ['massEvacuation'],
                bonus: { evacuation_speed: 50 },
                description: 'Evacuate 50 people per turn',
                planets: ['volcanic']
            },
            coreHarvesting: {
                name: 'Core Harvesting',
                cost: 1200,
                type: 'production',
                researched: false,
                prerequisites: ['coreDiving'],
                unlocks: ['coreReactor'],
                bonus: { production: 100, core_stability_loss: 2 },
                description: 'Massive resources, speeds collapse',
                planets: ['volcanic']
            },
            fusionDrive: {
                name: 'Fusion Drive',
                cost: 1100,
                type: 'escape',
                researched: false,
                prerequisites: ['fuelSynthesis'],
                unlocks: ['warpDrive', 'exodusProtocol'],
                bonus: { rocket_speed: 10 },
                description: 'Faster than light travel',
                planets: ['volcanic']
            },
            eruption_control: {
                name: 'Eruption Suppression',
                cost: 1300,
                type: 'survival',
                researched: false,
                prerequisites: ['predictiveModels', 'volcanology'],
                unlocks: ['planetarySalvation'],
                bonus: { eruption_chance: -50 },
                description: 'Reduce eruptions by 50%',
                planets: ['volcanic']
            },
            massEvacuation: {
                name: 'Mass Evacuation',
                cost: 1400,
                type: 'escape',
                researched: false,
                prerequisites: ['spaceElevator', 'generationShip'],
                unlocks: ['exodusProtocol'],
                bonus: { evacuation_speed: 100 },
                description: 'Save everyone quickly',
                planets: ['volcanic']
            },
            exodusProtocol: {
                name: 'Exodus Protocol',
                cost: 2000,
                type: 'victory',
                researched: false,
                prerequisites: ['advancedAlloys', 'closedEcosystem', 'planetaryEngineering'],
                unlocks: [],
                bonus: { can_escape: true },
                description: 'ESCAPE THE PLANET - Victory!',
                planets: ['volcanic']
            },
            planetarySalvation: {
                name: 'Planetary Salvation',
                cost: 2500,
                type: 'victory',
                researched: false,
                prerequisites: ['eruption_control', 'coreStabilizer', 'planetaryEngineering'],
                unlocks: [],
                bonus: { core_stable: true },
                description: 'STABILIZE THE CORE - Victory!',
                planets: ['volcanic']
            },
            planetaryEngineering: {
                name: 'Planetary Engineering',
                cost: 1500,
                type: 'survival',
                researched: false,
                prerequisites: ['coreStabilizer', 'mantleMapping'],
                unlocks: ['planetarySalvation'],
                bonus: { core_stability_slowdown: 0.8 },
                description: 'Reshape entire planets',
                planets: ['volcanic']
            },
            coreReactor: {
                name: 'Core Reactor',
                cost: 1600,
                type: 'energy',
                researched: false,
                prerequisites: ['coreStabilizer', 'coreHarvesting'],
                unlocks: ['planetaryEngineering'],
                bonus: { production: 150, energy: 100 },
                description: 'Harness core energy directly',
                planets: ['volcanic']
            },

            // Conquest planet techs
            combatTraining: {
                name: 'Combat Training',
                cost: 25,
                type: 'military',
                researched: false,
                prerequisites: [],
                unlocks: ['advancedTactics', 'armorPlating'],
                bonus: { unit_damage: 5 },
                description: 'Basic military training',
                planets: ['conquest']
            },
            scavenging: {
                name: 'Scavenging',
                cost: 30,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['efficientSalvage', 'resourceDetection'],
                bonus: { production: 3 },
                description: 'Salvage resources from wreckage',
                planets: ['conquest']
            },
            fieldMedicine: {
                name: 'Field Medicine',
                cost: 35,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['combatMedics', 'stimPacks'],
                bonus: { unit_heal: 10 },
                description: 'Heal units in the field',
                planets: ['conquest']
            },
            advancedTactics: {
                name: 'Advanced Tactics',
                cost: 80,
                type: 'military',
                researched: false,
                prerequisites: ['combatTraining'],
                unlocks: ['flanking', 'ambushTech'],
                bonus: { unit_damage: 10 },
                description: 'Superior battle strategies',
                planets: ['conquest']
            },
            armorPlating: {
                name: 'Armor Plating',
                cost: 90,
                type: 'military',
                researched: false,
                prerequisites: ['combatTraining'],
                unlocks: ['reactiveArmor', 'shieldGenerators'],
                bonus: { unit_health: 20 },
                description: 'Better protection for units',
                planets: ['conquest']
            },
            efficientSalvage: {
                name: 'Efficient Salvage',
                cost: 100,
                type: 'survival',
                researched: false,
                prerequisites: ['scavenging'],
                unlocks: ['automatedSalvage'],
                bonus: { production: 8 },
                description: 'Extract more from wreckage',
                planets: ['conquest']
            },
            combatMedics: {
                name: 'Combat Medics',
                cost: 110,
                type: 'survival',
                researched: false,
                prerequisites: ['fieldMedicine'],
                unlocks: ['reviveTech'],
                bonus: { unit_heal: 20 },
                description: 'Dedicated healing units',
                planets: ['conquest']
            },
            hackingProtocols: {
                name: 'Hacking Protocols',
                cost: 120,
                type: 'tech',
                researched: false,
                prerequisites: ['advancedTactics'],
                unlocks: ['virusUpload', 'systemOverride'],
                bonus: { hacking_speed: 20 },
                description: 'Faster node hacking',
                planets: ['conquest']
            },
            flanking: {
                name: 'Flanking Maneuvers',
                cost: 150,
                type: 'military',
                researched: false,
                prerequisites: ['advancedTactics'],
                unlocks: ['surroundTactics'],
                bonus: { unit_damage: 15, unit_move: 1 },
                description: 'Attack from multiple angles',
                planets: ['conquest']
            },
            shieldGenerators: {
                name: 'Shield Generators',
                cost: 200,
                type: 'military',
                researched: false,
                prerequisites: ['armorPlating'],
                unlocks: ['fortifiedPositions'],
                bonus: { unit_health: 40 },
                description: 'Energy shields for units',
                planets: ['conquest']
            },
            virusUpload: {
                name: 'Virus Upload',
                cost: 180,
                type: 'tech',
                researched: false,
                prerequisites: ['hackingProtocols'],
                unlocks: ['sentinelCorruption'],
                bonus: { hacking_speed: 40 },
                description: 'Disable sentinel systems',
                planets: ['conquest']
            },
            sentinelCorruption: {
                name: 'Sentinel Corruption',
                cost: 300,
                type: 'tech',
                researched: false,
                prerequisites: ['virusUpload'],
                unlocks: ['totalDominance'],
                bonus: { sentinel_weaken: 20 },
                description: 'Weaken all sentinels by 20%',
                planets: ['conquest']
            },
            fortifiedPositions: {
                name: 'Fortified Positions',
                cost: 250,
                type: 'military',
                researched: false,
                prerequisites: ['shieldGenerators'],
                unlocks: ['totalDominance'],
                bonus: { building_health: 100 },
                description: 'Stronger defensive structures',
                planets: ['conquest']
            },
            totalDominance: {
                name: 'Total Dominance',
                cost: 500,
                type: 'victory',
                researched: false,
                prerequisites: ['sentinelCorruption', 'fortifiedPositions'],
                unlocks: [],
                bonus: { conquest_victory: true },
                description: 'CONQUER THE PLANET - Victory!',
                planets: ['conquest']
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
        const baseTurns = Math.ceil(tech.cost / 5);
        const scienceMultiplier = Math.max(0.5, this.player.sciencePerTurn / 15);

        this.researchProgress += scienceMultiplier;

        if (this.researchProgress >= baseTurns) {
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

        if (tech.type === 'age') {
            return { completed: completedTech, ageAdvanced: true, newAge: tech.bonus.age };
        }

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
        if (bonus.eruption_resistance !== undefined) {
            this.player.eruptionResistance = (this.player.eruptionResistance || 0) + bonus.eruption_resistance;
        }
        if (bonus.core_stability_slowdown !== undefined) {
            this.player.coreStabilityMultiplier = Math.max(0, (this.player.coreStabilityMultiplier || 1) - bonus.core_stability_slowdown);
        }
        if (bonus.core_stability_loss !== undefined) {
            this.player.coreStabilityMultiplier = (this.player.coreStabilityMultiplier || 1) + bonus.core_stability_loss;
        }
        if (bonus.eruption_warning !== undefined) {
            this.player.eruptionWarning = Math.max(0, (this.player.eruptionWarning || 0) + bonus.eruption_warning);
        }
        if (bonus.eruption_chance !== undefined) {
            this.player.eruptionChanceModifier = (this.player.eruptionChanceModifier || 0) + bonus.eruption_chance;
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
        if (bonus.self_sufficient !== undefined) {
            this.player.selfSufficient = bonus.self_sufficient;
        }
        if (bonus.energy) {
            this.player.energy = (this.player.energy || 0) + bonus.energy;
        }
        if (bonus.age) {
            const advanced = this.player.advanceAge(bonus.age);
            if (advanced && this.player.game) {
                this.player.game.log(`CIVILIZATION ADVANCED TO ${bonus.age.toUpperCase()} AGE!`);
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSFX('sfx-success', 0.6);
                }
            }
        }
    }

    getAvailableTechs() {
        const currentPlanet = this.getCurrentPlanetType();

        return Object.keys(this.techs).filter(techId => {
            const tech = this.techs[techId];
            if (tech.researched) return false;
            if (!tech.planets.includes(currentPlanet)) return false;

            return tech.prerequisites.every(prereq => this.techs[prereq].researched);
        });
    }

    getCurrentPlanetType() {
        if (!this.player.game) return 'volcanic';
        const galaxy = this.player.game.galaxy;
        if (!galaxy) return 'volcanic';

        const planetIndex = galaxy.currentPlanetIndex;
        if (planetIndex === 0) return 'volcanic';
        return 'conquest';
    }

    getResearchInfo() {
        if (!this.currentResearch) return null;

        const tech = this.techs[this.currentResearch];
        const baseTurns = Math.ceil(tech.cost / 2);
        const scienceMultiplier = Math.max(1, this.player.sciencePerTurn / 10);
        const turnsRemaining = Math.ceil((baseTurns - this.researchProgress) / scienceMultiplier);

        return {
            name: tech.name,
            progress: Math.floor(this.researchProgress),
            turnsRemaining: turnsRemaining,
            totalTurns: baseTurns
        };
    }
}