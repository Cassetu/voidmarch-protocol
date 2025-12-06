class TechTree {
    constructor(player) {
        this.player = player;
        this.techs = this.initializeTechs();
        this.researchQueue = [];
        this.currentResearch = null;
        this.researchProgress = 0;
        this.lockedPaths = new Set();
        this.techChoices = new Map();
    }

    lockAlternativePaths(techId) {
        const tech = this.techs[techId];
        if (tech.locksOut) {
            tech.locksOut.forEach(lockedTechId => {
                this.lockedPaths.add(lockedTechId);
                const lockedTech = this.techs[lockedTechId];
                if (lockedTech && lockedTech.locksOut) {
                    lockedTech.locksOut.forEach(id => this.lockedPaths.add(id));
                }
            });
        }
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
                description: 'Advance to Bronze Age',
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
                description: 'Advance to Iron Age',
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
                description: 'Advance to Medieval Era',
                planets: ['volcanic']
            },
            renaissanceAge: {
                name: 'Renaissance',
                cost: 500,
                type: 'age',
                researched: false,
                prerequisites: ['medievalAge', 'volcanology'],
                unlocks: ['industrialAge', 'library'],
                bonus: { age: 'renaissance' },
                description: 'Advance to Renaissance',
                planets: ['volcanic']
            },

            industrialAge: {
                name: 'Industrial Revolution',
                cost: 800,
                type: 'age',
                researched: false,
                prerequisites: ['renaissanceAge', 'steamPower'],
                unlocks: ['earlyModernAge', 'ironworks', 'trainstation'],
                bonus: { age: 'industrial', production: 20 },
                description: 'Advance to Industrial Age',
                planets: ['volcanic']
            },

            steamPower: {
                name: 'Steam Power',
                cost: 600,
                type: 'divergent',
                researched: false,
                prerequisites: ['renaissanceAge'],
                unlocks: ['industrialAge', 'coalPlant'],
                locksOut: ['renewableEnergy', 'windmills', 'solarPower'],
                bonus: { production: 15, coal_consumption: 2 },
                description: 'PATH CHOICE: Fossil fuel based industry',
                planets: ['volcanic']
            },

            renewableEnergy: {
                name: 'Renewable Energy',
                cost: 600,
                type: 'divergent',
                researched: false,
                prerequisites: ['renaissanceAge'],
                unlocks: ['industrialAge', 'windmills'],
                locksOut: ['steamPower', 'coalPlant', 'oilRefinery'],
                bonus: { production: 12, science: 8 },
                description: 'PATH CHOICE: Sustainable clean energy',
                planets: ['volcanic']
            },

            coalPlant: {
                name: 'Coal Power Plant',
                cost: 400,
                type: 'production',
                researched: false,
                prerequisites: ['steamPower'],
                unlocks: ['oilRefinery'],
                bonus: { production: 25 },
                description: 'Massive coal-powered production',
                planets: ['volcanic']
            },

            windmills: {
                name: 'Wind Power',
                cost: 400,
                type: 'production',
                researched: false,
                prerequisites: ['renewableEnergy'],
                unlocks: ['solarPower'],
                bonus: { production: 18, science: 5 },
                description: 'Harness wind energy',
                planets: ['volcanic']
            },

            earlyModernAge: {
                name: 'Early Modern Era',
                cost: 1200,
                type: 'age',
                researched: false,
                prerequisites: ['industrialAge', 'massProduction'],
                unlocks: ['victorianAge', 'steamfactory'],
                bonus: { age: 'earlymodern', production: 30 },
                description: 'Advance to Early Modern Era',
                planets: ['volcanic']
            },

            massProduction: {
                name: 'Mass Production',
                cost: 900,
                type: 'divergent',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['earlyModernAge', 'assemblyLine'],
                locksOut: ['craftsmanship', 'artisanGuilds'],
                bonus: { production: 40, buildingHP: -20 },
                description: 'PATH CHOICE: Quantity over quality',
                planets: ['volcanic']
            },

            craftsmanship: {
                name: 'Master Craftsmanship',
                cost: 900,
                type: 'divergent',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['earlyModernAge', 'artisanGuilds'],
                locksOut: ['massProduction', 'assemblyLine'],
                bonus: { production: 25, buildingHP: 50, science: 15 },
                description: 'PATH CHOICE: Quality and expertise',
                planets: ['volcanic']
            },

            victorianAge: {
                name: 'Victorian Age',
                cost: 1800,
                type: 'age',
                researched: false,
                prerequisites: ['earlyModernAge', 'urbanPlanning'],
                unlocks: ['modernizationAge', 'parliament'],
                bonus: { age: 'victorian', population: 50 },
                description: 'Advance to Victorian Age',
                planets: ['volcanic']
            },

            urbanPlanning: {
                name: 'Urban Planning',
                cost: 1400,
                type: 'expansion',
                researched: false,
                prerequisites: ['earlyModernAge'],
                unlocks: ['victorianAge', 'subwaySystem'],
                bonus: { population: 30 },
                description: 'Organize cities efficiently',
                planets: ['volcanic']
            },

            modernizationAge: {
                name: 'Age of Modernization',
                cost: 2500,
                type: 'age',
                researched: false,
                prerequisites: ['victorianAge', 'electricity'],
                unlocks: ['digitalAge', 'powerplant'],
                bonus: { age: 'modernization', production: 50 },
                description: 'Advance to Modernization Age',
                planets: ['volcanic']
            },

            electricity: {
                name: 'Electrical Power',
                cost: 2000,
                type: 'divergent',
                researched: false,
                prerequisites: ['victorianAge'],
                unlocks: ['modernizationAge', 'powerGrid'],
                locksOut: ['mechanicalPower'],
                bonus: { production: 45, science: 20 },
                description: 'PATH CHOICE: Electrical revolution',
                planets: ['volcanic']
            },

            mechanicalPower: {
                name: 'Advanced Mechanics',
                cost: 2000,
                type: 'divergent',
                researched: false,
                prerequisites: ['victorianAge'],
                unlocks: ['modernizationAge', 'clockworkEngineering'],
                locksOut: ['electricity', 'powerGrid'],
                bonus: { production: 50, buildingHP: 75 },
                description: 'PATH CHOICE: Mechanical mastery',
                planets: ['volcanic']
            },

            digitalAge: {
                name: 'Digital Age',
                cost: 3500,
                type: 'age',
                researched: false,
                prerequisites: ['modernizationAge', 'computing'],
                unlocks: ['spaceAge', 'datacenter'],
                bonus: { age: 'digital', science: 50 },
                description: 'Advance to Digital Age',
                planets: ['volcanic']
            },

            computing: {
                name: 'Computing Technology',
                cost: 3000,
                type: 'divergent',
                researched: false,
                prerequisites: ['modernizationAge'],
                unlocks: ['digitalAge', 'artificialIntelligence'],
                locksOut: ['analogSystems'],
                bonus: { science: 40 },
                description: 'PATH CHOICE: Digital computers',
                planets: ['volcanic']
            },

            analogSystems: {
                name: 'Analog Systems',
                cost: 3000,
                type: 'divergent',
                researched: false,
                prerequisites: ['modernizationAge'],
                unlocks: ['digitalAge', 'mechanicalComputers'],
                locksOut: ['computing', 'artificialIntelligence'],
                bonus: { science: 30, production: 35 },
                description: 'PATH CHOICE: Mechanical computing',
                planets: ['volcanic']
            },

            spaceAge: {
                name: 'Space Age',
                cost: 5000,
                type: 'age',
                researched: false,
                prerequisites: ['digitalAge', 'rocketry'],
                unlocks: ['university', 'exodusProtocol'],
                bonus: { age: 'space', science: 75 },
                description: 'Advance to Space Age',
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
            volcanology: {
                name: 'Volcanology',
                cost: 400,
                type: 'science',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['renaissanceAge'],
                bonus: { science: 15 },
                description: 'Study volcanic patterns',
                planets: ['volcanic']
            },
            rocketry: {
                name: 'Basic Rocketry',
                cost: 4000,
                type: 'escape',
                researched: false,
                prerequisites: ['digitalAge'],
                unlocks: ['spaceAge'],
                bonus: { rocket_capacity: 10 },
                description: 'First step to space',
                planets: ['volcanic']
            },
            exodusProtocol: {
                name: 'Exodus Protocol',
                cost: 8000,
                type: 'victory',
                researched: false,
                prerequisites: ['spaceAge', 'rocketry'],
                unlocks: [],
                bonus: { can_escape: true },
                description: 'ESCAPE THE PLANET - Victory!',
                planets: ['volcanic']
            }
        };
    }

    canResearch(techId) {
        const tech = this.techs[techId];
        if (!tech || tech.researched || this.lockedPaths.has(techId)) return false;

        for (let prereq of tech.prerequisites) {
            if (!this.techs[prereq].researched) {
                return false;
            }
        }

        if (this.player.game && this.player.game.instantResearchMode) {
            return true;
        }

        return this.player.sciencePerTurn >= tech.cost;
    }

    startResearch(techId) {
        if (!this.canResearch(techId)) return false;

        const tech = this.techs[techId];

        if (this.player.game && this.player.game.instantResearchMode) {
            return this.completeTech(techId);
        }

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

        this.lockAlternativePaths(techId);

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