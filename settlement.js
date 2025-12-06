class Settlement {
    constructor(x, y, id, settlementType = 'hut') {
        this.x = x;
        this.y = y;
        this.id = id;
        this.settlementType = settlementType;
        this.priority = Date.now();
        this.name = this.generateSettlementName();
        this.citizens = [];
        this.children = [];
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
            market: 1,
            school: 2,
            academy: 1
        };

        this.resourceStorage = {
            iron: 0,
            copper: 0,
            coal: 0,
            oil: 0,
            silicon: 0,
            rareMinerals: 0
        };
        this.storageCapacity = this.getBaseStorageCapacity();

        this.lastBirths = 0;
        this.lastDeaths = 0;
        this.demographicHistory = [];

        for (let i = 0; i < 5; i++) {
            this.citizens.push(this.generateCitizen());
        }

        this.tryCreateFamilies();
    }

    progressEducation() {
        const schoolCount = this.buildings.get('school') || 0;
        const universityCount = this.buildings.get('university') || 0;
        const academyCount = this.buildings.get('academy') || 0;

        const educationCapacity = {
            basic: schoolCount * 10 + academyCount * 5,
            advanced: universityCount * 8 + academyCount * 4,
            expert: universityCount * 3
        };

        let basicSlots = educationCapacity.basic;
        let advancedSlots = educationCapacity.advanced;
        let expertSlots = educationCapacity.expert;

        this.children.forEach(child => {
            if (child.age >= 6) {
                if (child.education === 'uneducated') {
                    if (basicSlots > 0) {
                        child.educationProgress += 15;
                        basicSlots--;
                    } else {
                        child.educationProgress += 2;
                    }

                    if (child.educationProgress >= 100) {
                        child.education = 'basic';
                        child.educationProgress = 0;
                    }
                }
            }
        });

        this.citizens.forEach(citizen => {
            if (citizen.education === 'uneducated') {
                if (basicSlots > 0) {
                    citizen.educationProgress += 8;
                    basicSlots--;
                } else {
                    citizen.educationProgress += 1;
                }

                if (citizen.educationProgress >= 100) {
                    citizen.education = 'basic';
                    citizen.educationProgress = 0;
                }
            } else if (citizen.education === 'basic') {
                if (advancedSlots > 0) {
                    citizen.educationProgress += 6;
                    advancedSlots--;

                    if (citizen.educationProgress >= 150) {
                        citizen.education = 'advanced';
                        citizen.educationProgress = 0;
                    }
                }
            } else if (citizen.education === 'advanced') {
                if (expertSlots > 0) {
                    citizen.educationProgress += 4;
                    expertSlots--;

                    if (citizen.educationProgress >= 200) {
                        citizen.education = 'expert';
                        citizen.educationProgress = 0;
                    }
                }
            }
        });
    }

    getEducationStats() {
        const stats = {
            uneducated: 0,
            basic: 0,
            advanced: 0,
            expert: 0
        };

        this.citizens.forEach(citizen => {
            stats[citizen.education] = (stats[citizen.education] || 0) + 1;
        });

        this.children.forEach(child => {
            if (child.age >= 6) {
                stats[child.education] = (stats[child.education] || 0) + 1;
            }
        });

        return stats;
    }

    getBaseStorageCapacity() {
        let capacity = 100;

        const warehouseCount = this.buildings.get('warehouse') || 0;
        capacity += warehouseCount * 200;

        return capacity;
    }

    canStoreResources(resourceType, amount) {
        const currentStored = this.resourceStorage[resourceType] || 0;
        return (currentStored + amount) <= this.storageCapacity;
    }

    addResourcesToStorage(resourceType, amount) {
        if (!this.canStoreResources(resourceType, amount)) {
            const available = this.storageCapacity - (this.resourceStorage[resourceType] || 0);
            this.resourceStorage[resourceType] += available;
            return available;
        }
        this.resourceStorage[resourceType] += amount;
        return amount;
    }

    getBasePopulationCap() {
        const caps = {
            hut: 5,
            settlement: 15,
            township: 25,
            feudaltown: 40,
            citystate: 60,
            factorytown: 80,
            steamcity: 120,
            metropolis: 180,
            powercity: 250,
            technopolis: 350,
            megacity: 500,
            triworldhub: 750,
            haven: 1000
        };
        return caps[this.settlementType] || 10;
    }

    getPopulation() {
        return this.citizens.length + this.children.length;
    }

    getMaxPopulation() {
        let capacity = this.getBasePopulationCap();

        this.buildings.forEach((count, type) => {
            switch(type) {
                case 'tent':
                    capacity += count * 3;
                    break;
                case 'farm':
                    capacity += count * 1;
                    break;
                case 'warehouse':
                    capacity += count * 2;
                    break;
                case 'barracks':
                    capacity += count * 4;
                    break;
                case 'granary':
                    capacity += count * 3;
                    break;
                default:
                    capacity += count * 1;
                    break;
            }
        });

        return capacity;
    }

    getBaseFoodProduction() {
        const foodProd = {
            hut: 1,
            settlement: 3,
            township: 5,
            feudaltown: 8,
            citystate: 12,
            factorytown: 15,
            steamcity: 20,
            metropolis: 30,
            powercity: 40,
            technopolis: 60,
            megacity: 100,
            triworldhub: 150,
            haven: 250
        };
        return foodProd[this.settlementType] || 1;
    }

    tryCreateFamilies() {
        this.lastBirths = 0;
        const eligibleAdults = this.citizens.filter(c => c.age >= 20 && c.age <= 50 && !c.hasChildren);

        eligibleAdults.forEach(citizen => {
            if (Math.random() < 0.6) {
                const numChildren = Math.floor(Math.random() * 2) + 1;
                const maxPop = this.getMaxPopulation();
                const totalPop = this.citizens.length + this.children.length;

                const actualChildren = Math.min(numChildren, maxPop - totalPop);

                for (let i = 0; i < actualChildren; i++) {
                    const child = this.generateChild(citizen);
                    this.children.push(child);
                    this.lastBirths++;
                }

                if (actualChildren > 0) {
                    citizen.hasChildren = true;
                    citizen.childrenCount = actualChildren;
                }
            }
        });
    }

    generateChild(parent) {
        const firstNames = ['Alex', 'Sam', 'Jordan', 'Riley', 'Casey', 'Morgan', 'Taylor', 'Avery', 'Quinn', 'Reese', 'Hannah', 'Emily', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Liam', 'Noah', 'James', 'Logan', 'Benjamin', 'Mason', 'Elijah', 'Oliver', 'Jacob', 'Lucas', 'Ethan', 'Alexander', 'Henry', 'William', 'Michael', 'Daniel', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel', 'Matthew'];
        const lastName = parent.name.split(' ')[1];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

        return {
            id: `${Date.now()}-${Math.random()}`,
            name: `${firstName} ${lastName}`,
            age: Math.floor(Math.random() * 13) + 5,
            job: 'Child',
            isChild: true
        };
    }

    ageUpChildren() {
        for (let i = this.children.length - 1; i >= 0; i--) {
            const child = this.children[i];
            child.age++;

            if (child.age >= 18) {
                child.job = 'Apprentice';
                child.isChild = false;
                delete child.isChild;

                this.citizens.push(child);
                this.children.splice(i, 1);
                this.population++;
            }
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
        let firstNames, lastNames;

        const planetType = window.game && window.game.currentPlanet ? window.game.currentPlanet.type : 'volcanic';

        if (planetType === 'volcanic') {
            firstNames = ['Aria', 'Bjorn', 'Chen', 'Dara', 'Erik', 'Fiona', 'Gavin', 'Hana', 'Ivan', 'Jana',
                         'Kael', 'Luna', 'Marcus', 'Nora', 'Oscar', 'Petra', 'Quinn', 'Ravi', 'Sara', 'Tomas',
                         'Uma', 'Victor', 'Wren', 'Xander', 'Yuki', 'Zara', 'Aiden', 'Bella', 'Caleb', 'Diana'];
            lastNames = ['Ashborn', 'Firewalker', 'Stonehand', 'Ironforge', 'Emberhart', 'Rockwell', 'Flameheart',
                        'Cinder', 'Magma', 'Lavaflow', 'Obsidian', 'Crater', 'Basalt', 'Pyroclast', 'Scorch'];
        } else if (planetType === 'ice') {
            firstNames = ['Freya', 'Bjorn', 'Astrid', 'Erik', 'Ingrid', 'Lars', 'Saga', 'Thor', 'Ylva', 'Odin',
                         'Skadi', 'Frost', 'Winter', 'Neve', 'Boreas', 'Glacie', 'Crystal', 'Eira', 'Nivis', 'Yuki'];
            lastNames = ['Frostborne', 'Icewalker', 'Snowfall', 'Coldheart', 'Wintermane', 'Glacierheart', 'Frostblade',
                        'Icicle', 'Blizzard', 'Whitefang', 'Northwind', 'Chillfrost', 'Deepfreeze', 'Permafrost', 'Snowdrift'];
        } else if (planetType === 'desert') {
            firstNames = ['Amara', 'Nasir', 'Zara', 'Malik', 'Sahara', 'Tariq', 'Layla', 'Rashid', 'Nadia', 'Omar',
                         'Yasmin', 'Zahir', 'Samira', 'Khalid', 'Amira', 'Jamal', 'Soraya', 'Aziz', 'Fatima', 'Rami'];
            lastNames = ['Sandwalker', 'Dunestrider', 'Sunborn', 'Desertstorm', 'Mirageseeker', 'Oasisheart', 'Scorchblade',
                        'Sandseer', 'Nomad', 'Heatwave', 'Drysand', 'Sunscale', 'Dustwind', 'Goldensun', 'Sirocco'];
        } else if (planetType === 'ocean') {
            firstNames = ['Marina', 'Kai', 'Coral', 'Dylan', 'Pearl', 'Morgan', 'River', 'Wade', 'Brooke', 'Finn',
                         'Isla', 'Drake', 'Misty', 'Cove', 'Azure', 'Tide', 'Bay', 'Shore', 'Deep', 'Reef'];
            lastNames = ['Waveborn', 'Seawalker', 'Tideheart', 'Deepwater', 'Coralforge', 'Saltwind', 'Reefdancer',
                        'Oceanborn', 'Seafarer', 'Stormcrest', 'Bluescale', 'Currentrider', 'Depthseeker', 'Mariner', 'Saltborn'];
        } else if (planetType === 'jungle') {
            firstNames = ['Maya', 'Ravi', 'Jade', 'Zuri', 'Kato', 'Liana', 'Koda', 'Asha', 'Tego', 'Nala',
                         'Banyan', 'Fern', 'Moss', 'Vine', 'Reed', 'Sage', 'Willow', 'Maple', 'Cedar', 'Ivy'];
            lastNames = ['Leafwhisper', 'Vinewalker', 'Greenhart', 'Wildborn', 'Jungleheart', 'Rootseeker', 'Canopyblade',
                        'Thornweaver', 'Mossborn', 'Forestsong', 'Tanglefoot', 'Wildrunner', 'Greenvein', 'Natureheart', 'Lifespring'];
        } else {
            firstNames = ['Nova', 'Orion', 'Stella', 'Cosmo', 'Luna', 'Atlas', 'Vega', 'Sirius', 'Lyra', 'Phoenix',
                         'Astro', 'Celeste', 'Nebula', 'Solar', 'Comet', 'Stardust', 'Galaxy', 'Meteor', 'Pulsar', 'Quasar'];
            lastNames = ['Starborn', 'Voidwalker', 'Cosmicheart', 'Nebulaforge', 'Stellarheart', 'Galaxyseeker', 'Starblade',
                        'Voidborn', 'Spacefarer', 'Darkstar', 'Lightyear', 'Stardrift', 'Cosmosoul', 'Astralwind', 'Celestial'];
        }

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return {
            id: `${Date.now()}-${Math.random()}`,
            name: `${firstName} ${lastName}`,
            age: Math.floor(Math.random() * 50) + 18,
            job: 'Citizen',
            ageGroup: this.getAgeGroup(Math.floor(Math.random() * 50) + 18)
        };
    }

    getAgeGroup(age) {
        if (age < 18) return 'child';
        if (age < 65) return 'adult';
        return 'elder';
    }

    updateAgeGroups() {
        this.citizens.forEach(citizen => {
            citizen.ageGroup = this.getAgeGroup(citizen.age);
        });
        this.children.forEach(child => {
            child.ageGroup = this.getAgeGroup(child.age);
        });
    }

    getDemographics() {
        const demographics = {
            children: 0,
            adults: 0,
            elders: 0,
            totalPop: this.getPopulation(),
            birthRate: 0,
            deathRate: 0,
            lifeExpectancy: 70
        };

        this.citizens.forEach(citizen => {
            demographics[citizen.ageGroup]++;
        });

        this.children.forEach(child => {
            demographics.children++;
        });

        demographics.birthRate = this.lastBirths || 0;
        demographics.deathRate = this.lastDeaths || 0;

        const foodPerPerson = this.food / Math.max(1, demographics.totalPop);
        const wellFed = foodPerPerson >= 10;
        demographics.lifeExpectancy = wellFed ? 75 : 65;

        return demographics;
    }

    ageUp() {
        this.lastDeaths = 0;

        this.citizens.forEach(citizen => {
            citizen.age++;

            if (citizen.age >= 65) {
                citizen.job = 'Elder';
            } else if (citizen.age >= 40) {
                citizen.job = 'Artisan';
            } else if (citizen.age >= 25) {
                citizen.job = 'Worker';
            } else {
                citizen.job = 'Apprentice';
            }

            citizen.ageGroup = this.getAgeGroup(citizen.age);
        });

        const beforeCount = this.citizens.length;

        this.citizens = this.citizens.filter(citizen => {
            const foodPerPerson = this.food / Math.max(1, this.getPopulation());
            const wellFed = foodPerPerson >= 10;

            let deathAge = wellFed ? 80 : 70;
            let deathChance = wellFed ? 0.15 : 0.25;

            if (citizen.age > deathAge && Math.random() < deathChance) {
                return false;
            }
            return true;
        });

        this.lastDeaths = beforeCount - this.citizens.length;
        this.updateAgeGroups();
    }

    isWithinClaim(x, y) {
        const dx = Math.abs(this.x - x);
        const dy = Math.abs(this.y - y);
        return dx <= this.claimRadius && dy <= this.claimRadius;
    }

    canBuildStructure(buildingType) {
        const limit = this.buildingLimits[buildingType];
        if (limit === undefined) return true;

        const currentCount = this.buildings.get(buildingType) || 0;
        return currentCount < limit;
    }

    addBuilding(buildingType, amount = 1.0) {
        const currentCount = this.buildings.get(buildingType) || 0;
        this.buildings.set(buildingType, currentCount + amount);
    }

    removeBuilding(buildingType, amount = 1.0) {
        const currentCount = this.buildings.get(buildingType) || 0;
        if (currentCount > 0) {
            this.buildings.set(buildingType, Math.max(0, currentCount - amount));
        }
    }

    calculateFoodProduction(planet) {
        let production = this.getBaseFoodProduction();

        const farmCount = this.buildings.get('farm') || 0;
        const aqueductCount = this.buildings.get('aqueduct') || 0;

        production += farmCount * 3;
        production += aqueductCount * 2;

        const productionModifier = this.getProductionModifier();
        production = Math.floor(production * productionModifier);

        return production;
    }

    getProductionModifier() {
        let totalModifier = 0;
        let citizenCount = 0;

        this.citizens.forEach(citizen => {
            citizenCount++;

            if (citizen.age < 25) {
                totalModifier += 1.05;
            } else if (citizen.age >= 25 && citizen.age < 40) {
                totalModifier += 1.10;
            } else if (citizen.age >= 40 && citizen.age < 65) {
                totalModifier += 1.20;
            } else {
                totalModifier += 0.90;
            }
        });

        return citizenCount > 0 ? totalModifier / citizenCount : 1.0;
    }

    processTurn(planet) {
        this.ageUp();
        this.ageUpChildren();

        this.foodPerTurn = this.calculateFoodProduction(planet);

        const currentPop = this.getPopulation();
        const adultConsumption = this.citizens.length * 2;
        const childConsumption = this.children.length * 1;
        this.foodConsumption = adultConsumption + childConsumption;

        const netFood = this.foodPerTurn - this.foodConsumption;
        this.food += netFood;

        const granaryCount = this.buildings.get('granary') || 0;
        const maxFood = 50 + (granaryCount * 100);

        if (this.food > maxFood) {
            this.food = maxFood;
        }

        if (this.food < 0) {
            this.handleStarvation();
        } else if (this.food < this.foodConsumption * 2) {
            this.handleMalnutrition();
        }

        const maxPop = this.getMaxPopulation();
        const totalPop = this.citizens.length + this.children.length;

        const foodPerPerson = this.food / Math.max(1, totalPop);
        const wellFed = foodPerPerson >= 10;

        if (wellFed && netFood >= this.foodConsumption * 0.5 && totalPop < maxPop) {
            this.growthProgress += netFood;
        } else if (netFood < 0) {
            this.growthProgress = Math.max(0, this.growthProgress + netFood * 2);
        } else {
            this.growthProgress = Math.max(0, this.growthProgress - 5);
        }

        if (wellFed && Math.random() < 0.15 && totalPop < maxPop) {
            this.tryCreateFamilies();
        } else if (!wellFed && Math.random() < 0.05) {
            this.tryCreateFamilies();
        }
    }

    handleStarvation() {
        this.food = 0;

        const starvationChance = 0.4;

        if (this.children.length > 0 && Math.random() < starvationChance) {
            this.children.pop();
            if (window.game) {
                window.game.log(`${this.name}: A child died from starvation`);
            }
        } else if (this.citizens.length > 1 && Math.random() < starvationChance * 0.7) {
            const elderIndex = this.citizens.findIndex(c => c.age >= 60);
            if (elderIndex !== -1) {
                this.citizens.splice(elderIndex, 1);
                if (window.game) {
                    window.game.log(`${this.name}: An elder died from starvation`);
                }
            } else {
                this.citizens.pop();
                if (window.game) {
                    window.game.log(`${this.name}: A citizen died from starvation`);
                }
            }
        }
    }

    handleMalnutrition() {
        this.citizens.forEach(citizen => {
            if (citizen.age >= 50 && Math.random() < 0.05) {
                const index = this.citizens.indexOf(citizen);
                if (index !== -1) {
                    this.citizens.splice(index, 1);
                    if (window.game) {
                        window.game.log(`${this.name}: ${citizen.name} died from malnutrition`);
                    }
                }
            }
        });
    }

    getStorageCapacity() {
        const granaryCount = this.buildings.get('granary') || 0;
        return 50 + (granaryCount * 100);
    }
}