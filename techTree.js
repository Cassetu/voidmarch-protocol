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
                if (lockedTech && lockedTech.unlocks) {
                    lockedTech.unlocks.forEach(childId => {
                        this.lockPathRecursive(childId);
                    });
                }
            });
        }
    }

    lockPathRecursive(techId) {
        if (this.lockedPaths.has(techId)) return;

        const tech = this.techs[techId];
        if (!tech || tech.researched) return;

        this.lockedPaths.add(techId);

        if (tech.unlocks) {
            tech.unlocks.forEach(childId => {
                this.lockPathRecursive(childId);
            });
        }
    }

    initializeTechs() {
        return {
            mining: {
                name: 'Stone Tools & Basic Mining',
                cost: 30,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['warehouse', 'deepMining', 'bronzeAge'],
                bonus: { production: 2 },
                description: 'Extract resources from volcanic rock',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const hasWarehouse = player.buildings.some(b => b.type === 'warehouse');
                    const rocks = game.currentPlanet.tiles.flat().filter(t => t.type === 'rock').length;
                    return {
                        description: `Your people have discovered how to shape volcanic obsidian into cutting tools. The ${rocks} rock tiles surrounding your settlements contain iron, copper, and coal waiting to be extracted. ${hasWarehouse ? 'Your warehouses will store these materials efficiently.' : 'You will need warehouses to store extracted resources.'}`,
                        impact: `Mining increases production by +2 per turn. Each rock tile worked by your settlements will yield iron, copper, and coal. This technology enables your civilization to progress beyond stone age subsistence.`,
                        connection: `Observe the rock tiles (gray) on your map - these contain the minerals that powered human civilization. Your volcanic world has concentrated ore deposits that are 10x richer than normal geology due to hydrothermal processes.`
                    };
                },
                historicalContext: {
                    era: 'Stone Age',
                    year: '~2.6 million BCE',
                    inventor: 'Discovered by early hominids',
                    staticDescription: 'The first revolution came when ancestors learned to shape volcanic obsidian and basalt into cutting tools.'
                }
            },

            shelter: {
                name: 'Permanent Shelter',
                cost: 25,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['settlement', 'reinforcedStructures'],
                bonus: { population: 5 },
                description: 'Protection from volcanic hazards',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const firstSettlement = player.settlements[0];
                    const hutCount = player.buildings.filter(b => b.type === 'hut').length;
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    return {
                        description: `Your ${firstSettlement ? firstSettlement.name : 'settlement'} currently houses ${hutCount} hut${hutCount !== 1 ? 's' : ''}. This research will allow construction of larger settlements that can house more citizens and better withstand the planet's ${coreStability}% core stability.`,
                        impact: `Unlocks Settlement building type (houses 15 citizens vs Hut's 5). Increases population cap by +5. Your citizens will have better protection during eruptions, reducing casualty rates from volcanic events.`,
                        connection: `Look at your huts on the map - notice how small they are? Settlements will occupy the same space but house triple the population using multi-story construction with volcanic ash mortar.`
                    };
                },
                historicalContext: {
                    era: 'Stone Age',
                    year: '~400,000 BCE',
                    inventor: 'First permanent builders',
                    staticDescription: 'Transition from nomadic to settled life required protection from elements.'
                }
            },

            farming: {
                name: 'Agricultural Revolution',
                cost: 35,
                type: 'survival',
                researched: false,
                prerequisites: [],
                unlocks: ['farm', 'hydroponics'],
                bonus: { food: 3 },
                description: 'Cultivate crops in volcanic soil',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const farmCount = player.buildings.filter(b => b.type === 'farm').length;
                    const ashTiles = game.currentPlanet.tiles.flat().filter(t => t.type === 'ash').length;
                    const darksoilTiles = game.currentPlanet.tiles.flat().filter(t => t.type === 'darksoil').length;
                    const totalFood = player.settlements.reduce((sum, s) => sum + s.food, 0);
                    return {
                        description: `Your civilization currently has ${farmCount} farm${farmCount !== 1 ? 's' : ''} producing ${Math.floor(totalFood)} food. The map shows ${ashTiles} ash tiles and ${darksoilTiles} darksoil tiles - volcanic soil enriched with minerals perfect for agriculture.`,
                        impact: `Each farm built on ash or darksoil tiles will produce +3 food per turn. This surplus allows population growth beyond hunter-gatherer limits. Your settlements can grow larger when food production exceeds consumption.`,
                        connection: `Zoom into your farms on the map and observe the tiles beneath them. Ash (gray) and darksoil (dark) tiles provide bonus yields. Volcanic minerals make your soil extraordinarily fertile - one farm here feeds what would require three farms on normal earth.`
                    };
                },
                historicalContext: {
                    era: 'Neolithic Revolution',
                    year: '~10,000 BCE',
                    inventor: 'Early agricultural societies',
                    staticDescription: 'Domestication of wild grains transformed human society.'
                }
            },

            bronzeAge: {
                name: 'Bronze Metallurgy',
                cost: 50,
                type: 'age',
                researched: false,
                prerequisites: ['mining', 'shelter'],
                unlocks: ['ironAge', 'barracks'],
                bonus: { age: 'bronze', production: 5 },
                description: 'Advance to Bronze Age',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const copper = Math.floor(player.resources.copper);
                    const settlements = player.settlements.length;
                    return {
                        description: `Your civilization has gathered ${copper} copper and developed ${settlements} settlement${settlements !== 1 ? 's' : ''}. You stand at the threshold of the Bronze Age - when copper and tin combine to create bronze, a metal harder than either component.`,
                        impact: `Advances your age to Bronze. Unlocks barracks for military units. Production increases by +5. Your civilization enters recorded history. New buildings become available: barracks, granary, quarry, monument, school, and shrine.`,
                        connection: `Watch your age indicator in the top bar change from "Stone Age" to "Bronze Age". This isn't just a name - it unlocks an entire tier of buildings. Your people will begin organizing into more complex social structures.`
                    };
                },
                historicalContext: {
                    era: 'Bronze Age',
                    year: '~3300 BCE',
                    inventor: 'Ancient metallurgists',
                    staticDescription: 'Copper and tin melted together create bronze - harder than either component.'
                }
            },

            deepMining: {
                name: 'Deep Shaft Mining',
                cost: 100,
                type: 'survival',
                researched: false,
                prerequisites: ['mining'],
                unlocks: ['geothermalHarvesting', 'forge', 'ironAge'],
                bonus: { production: 5 },
                description: 'Mine deeper into unstable crust',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const iron = Math.floor(player.resources.iron);
                    const coal = Math.floor(player.resources.coal);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    return {
                        description: `Surface mining has yielded ${iron} iron and ${coal} coal. But richer deposits lie deeper - near the magma chambers. Your planet's core stability is at ${coreStability}%. Deep mining is dangerous but necessary.`,
                        impact: `Production increases by +5. Unlocks Forge buildings which gain bonus production when built on geothermal vents. Enables access to iron deposits needed for Iron Age advancement. Warning: May accelerate core instability slightly.`,
                        connection: `After researching, watch for geothermal vent events on your map (marked tiles with special indicators). Build forges on these tiles for massive production bonuses - these represent sites where your miners have tapped into underground heat.`
                    };
                },
                historicalContext: {
                    era: 'Bronze to Iron Age',
                    year: '~1500 BCE',
                    inventor: 'Deep mining collectives',
                    staticDescription: 'As surface ores depleted, miners dug deeper into the earth.'
                }
            },

            ironAge: {
                name: 'Iron Smelting',
                cost: 150,
                type: 'age',
                researched: false,
                prerequisites: ['bronzeAge', 'deepMining'],
                unlocks: ['medievalAge', 'forge', 'temple'],
                bonus: { age: 'iron', production: 10 },
                description: 'Advance to Iron Age',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const iron = Math.floor(player.resources.iron);
                    const forgeCount = player.buildings.filter(b => b.type === 'forge').length;
                    const turn = player.turn;
                    return {
                        description: `After ${turn} turns, your civilization has accumulated ${iron} iron. You have ${forgeCount} forge${forgeCount !== 1 ? 's' : ''} ready to smelt iron at the 1540°C required. Iron is 10x more abundant than copper and produces superior tools.`,
                        impact: `Advances to Iron Age. Production +10. Unlocks township settlements (25 population), temples, forges, and workshops. Iron tools increase construction speed dramatically. Your civilization becomes a regional power.`,
                        connection: `Your age display updates to "Iron Age". Count the new buildings available in your building menu - notice how many more options appear. Each age roughly doubles your construction possibilities.`
                    };
                },
                historicalContext: {
                    era: 'Iron Age',
                    year: '~1200 BCE',
                    inventor: 'Hittite smiths and later civilizations',
                    staticDescription: 'Iron required 1540°C to smelt - far hotter than bronze.'
                }
            },

            reinforcedStructures: {
                name: 'Structural Engineering',
                cost: 120,
                type: 'survival',
                researched: false,
                prerequisites: ['shelter'],
                unlocks: ['medievalAge', 'seismicDampers'],
                bonus: { buildingHP: 50 },
                description: 'Buildings resist earthquake damage',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const buildingCount = player.buildings.length;
                    const avgHP = buildingCount > 0 ?
                        Math.floor(player.buildings.reduce((sum, b) => sum + b.health, 0) / buildingCount) : 0;
                    const recentEruptions = game.eventSystem ? game.eventSystem.eruption75Triggered || game.eventSystem.eruption35Triggered : false;
                    return {
                        description: `Your ${buildingCount} buildings currently average ${avgHP} HP each. ${recentEruptions ? 'Recent eruptions have damaged your structures. ' : ''}This research adds +50 HP to all current and future buildings, helping them survive volcanic events.`,
                        impact: `All buildings gain +50 maximum HP immediately. Future buildings start with higher HP. Structures can withstand more damage from eruptions, earthquakes, and the core instability events at 75% and 35% stability.`,
                        connection: `Watch your building HP indicators (visible when clicking structures). After research, all HP values increase by 50. This bonus applies retroactively to existing buildings and to all future construction.`
                    };
                },
                historicalContext: {
                    era: 'Classical Period',
                    year: '~500 BCE',
                    inventor: 'Ancient structural engineers',
                    staticDescription: 'Buildings with flexible frames survive earthquakes that destroy rigid structures.'
                }
            },

            medievalAge: {
                name: 'Medieval Feudalism',
                cost: 300,
                type: 'age',
                researched: false,
                prerequisites: ['ironAge', 'reinforcedStructures'],
                unlocks: ['renaissanceAge', 'market', 'castle'],
                bonus: { age: 'medieval', population: 20 },
                description: 'Advance to Medieval Era',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const settlements = player.settlements;
                    const totalPop = settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const largestSettlement = settlements.length > 0 ?
                        settlements.reduce((largest, s) => s.getPopulation() > largest.getPopulation() ? s : largest) : null;
                    return {
                        description: `Your ${settlements.length} settlements house ${totalPop} citizens total. ${largestSettlement ? `${largestSettlement.name} is your largest community with ${largestSettlement.getPopulation()} people.` : ''} Medieval organization will coordinate these disparate communities into a unified kingdom.`,
                        impact: `Advances to Medieval Age. Population cap +20. Unlocks feudaltown (40 pop), markets, castles, cathedrals, town halls, hospitals, and scriptorium. Your civilization develops complex social hierarchies and specialized roles.`,
                        connection: `Click on your settlements after researching to see new building slots available. Medieval buildings like castles provide both defense and administrative functions - they're larger and more impressive on the map.`
                    };
                },
                historicalContext: {
                    era: 'Medieval Period',
                    year: '~800 CE',
                    inventor: 'Post-Roman European societies',
                    staticDescription: 'Feudalism created hierarchical stability after empire collapse.'
                }
            },

            geothermalHarvesting: {
                name: 'Geothermal Energy',
                cost: 200,
                type: 'energy',
                researched: false,
                prerequisites: ['deepMining'],
                unlocks: ['geothermalPlant', 'magmaForge', 'thermalVents', 'renaissanceAge'],
                bonus: { production: 10, energy: 5 },
                description: 'Harness planetary heat',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const geothermalTiles = game.currentPlanet.tiles.flat().filter(t => t.hasGeothermal).length;
                    const forgesOnVents = player.buildings.filter(b => {
                        if (b.type !== 'forge') return false;
                        const tile = game.currentPlanet.tiles[b.y][b.x];
                        return tile.hasGeothermal;
                    }).length;
                    return {
                        description: `Your miners have discovered ${geothermalTiles} geothermal vent${geothermalTiles !== 1 ? 's' : ''} - natural heat sources reaching 200°C. ${forgesOnVents > 0 ? `You already have ${forgesOnVents} forge${forgesOnVents !== 1 ? 's' : ''} positioned on vent${forgesOnVents !== 1 ? 's' : ''}, gaining bonus production.` : 'Building forges on these vents will provide massive production bonuses.'}`,
                        impact: `Production +10, Energy +5. Forges built on geothermal tiles gain +5 bonus production. Random geothermal vent events will spawn more heat sources across your territory. This clean energy never depletes unlike coal or wood.`,
                        connection: `Look for tiles marked with 🔥 or special indicators - these are geothermal vents spawned by volcanic events. The game log announces when new vents appear. Position your forges strategically on these tiles for maximum output.`
                    };
                },
                historicalContext: {
                    era: 'Late Medieval',
                    year: '~1300 CE',
                    inventor: 'Volcanic settlers',
                    staticDescription: 'Steam vents channeled into workshops, baths, and heating systems.'
                }
            },

            volcanology: {
                name: 'Scientific Volcanology',
                cost: 400,
                type: 'science',
                researched: false,
                prerequisites: ['geothermalHarvesting'],
                unlocks: ['renaissanceAge', 'seismicNetwork'],
                bonus: { science: 15, eruption_warning: 1 },
                description: 'Study and predict volcanic behavior',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const turn = player.turn;
                    const nextEruption = game.eventSystem ? game.eventSystem.nextEruptionTurn : 'unknown';
                    const hasObservatory = player.buildings.some(b => b.type === 'observatory');
                    return {
                        description: `Turn ${turn}: Core stability at ${coreStability}%. Next scheduled eruption: turn ${nextEruption}. ${hasObservatory ? 'Your observatory already tracks volcanic patterns.' : 'Observatories will help predict eruptions once you reach Space Age.'} Volcanology provides 1 turn advance warning before eruptions.`,
                        impact: `Science +15. Eruption warning +1 turn. Game log will warn you "Eruption predicted in 1 turn!" allowing evacuation of at-risk areas. More science buildings (temples, libraries, universities) increase research speed for future technologies.`,
                        connection: `Watch the game log during play. After this research, you'll receive eruption warnings one turn before they occur. Use this time to move builders away from danger zones or prepare your defenses.`
                    };
                },
                historicalContext: {
                    era: 'Early Renaissance',
                    year: '~1400 CE',
                    inventor: 'Early scientific observers',
                    staticDescription: 'Recording gas emissions, tremors, and ground deformation enabled eruption prediction.'
                }
            },

            renaissanceAge: {
                name: 'Renaissance Enlightenment',
                cost: 500,
                type: 'age',
                researched: false,
                prerequisites: ['medievalAge', 'volcanology'],
                unlocks: ['industrialAge', 'library', 'steamPower', 'renewableEnergy'],
                bonus: { age: 'renaissance', science: 20 },
                description: 'Advance to Renaissance',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const scienceBuildings = player.buildings.filter(b =>
                        ['temple', 'shrine', 'library', 'scriptorium'].includes(b.type)
                    ).length;
                    const sciencePerTurn = player.sciencePerTurn;
                    return {
                        description: `Your civilization generates ${sciencePerTurn} science per turn from ${scienceBuildings} knowledge building${scienceBuildings !== 1 ? 's' : ''}. The Renaissance represents the shift from tradition to empirical observation - from "what do authorities say?" to "what can we observe?"`,
                        impact: `Advances to Renaissance Age. Science +20. Unlocks city-state (60 pop), libraries (+8 science), academies, theaters, and mansions. Most importantly: unlocks the divergent path choice between Steam Power and Renewable Energy that will define your industrial revolution.`,
                        connection: `This is your first major choice. After Renaissance, you must choose Steam Power (high production, environmental cost) or Renewable Energy (sustainable, slower growth). This choice locks out the alternative permanently.`
                    };
                },
                historicalContext: {
                    era: 'Renaissance',
                    year: '~1450 CE',
                    inventor: 'Cultural movement of scholars',
                    staticDescription: 'The printing press democratized information, sparking intellectual explosion.'
                }
            },

            steamPower: {
                name: 'Steam Engine Revolution',
                cost: 600,
                type: 'divergent',
                researched: false,
                prerequisites: ['renaissanceAge'],
                unlocks: ['industrialAge', 'coalPlant', 'massProduction'],
                locksOut: ['renewableEnergy', 'windmills', 'solarPower', 'craftsmanship'],
                bonus: { production: 15, core_stability_loss: 0.3 },
                description: 'PATH CHOICE: Steam-based industry',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const coal = Math.floor(player.resources.coal);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const currentDecay = game.eventSystem ? (game.eventSystem.coreStabilityMultiplier * 0.05).toFixed(3) : '0.050';
                    return {
                        description: `You have ${coal} coal reserves. Core stability: ${coreStability}% (decaying ${currentDecay}% per turn). Steam power will increase production by +15 but accelerate core decay by an additional +0.3% per turn. This path prioritizes growth over sustainability.`,
                        impact: `Production +15 immediately. Unlocks coal plants (+25 production), oil refineries, and mass production assembly lines. Core stability will decay faster (${(parseFloat(currentDecay) + 0.3).toFixed(3)}% per turn total). High-output industrial civilization that extracts maximum resources.`,
                        connection: `PERMANENT CHOICE: Selecting Steam Power locks you out of Renewable Energy, Windmills, Solar Power, and Craftsmanship. You commit to extraction-based industry. Watch your core stability decay rate in the top bar increase after researching.`,
                        choiceConsequence: `You're choosing quantity over sustainability. Your production will skyrocket, but core instability accelerates. You'll reach the 75% and 35% catastrophic eruption thresholds faster. Plan accordingly - you're on a timer.`
                    };
                },
                historicalContext: {
                    era: 'Industrial Revolution',
                    year: '~1712 CE',
                    inventor: 'Thomas Newcomen, perfected by James Watt',
                    staticDescription: 'Steam engines converted heat into mechanical work - humanity\'s first heat engine.'
                }
            },

            renewableEnergy: {
                name: 'Sustainable Energy Systems',
                cost: 600,
                type: 'divergent',
                researched: false,
                prerequisites: ['renaissanceAge'],
                unlocks: ['industrialAge', 'windmills', 'craftsmanship'],
                locksOut: ['steamPower', 'coalPlant', 'oilRefinery', 'massProduction'],
                bonus: { production: 12, science: 8, core_stability_loss: -0.2 },
                description: 'PATH CHOICE: Clean renewable power',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const currentDecay = game.eventSystem ? (game.eventSystem.coreStabilityMultiplier * 0.05).toFixed(3) : '0.050';
                    const geothermalCount = game.currentPlanet.tiles.flat().filter(t => t.hasGeothermal).length;
                    return {
                        description: `Core stability: ${coreStability}% (decaying ${currentDecay}% per turn). You have ${geothermalCount} geothermal sources available. Renewable energy provides +12 production and +8 science while REDUCING core decay by -0.2% per turn. Slower growth, but sustainable indefinitely.`,
                        impact: `Production +12, Science +8. Core decay reduces to ${(parseFloat(currentDecay) - 0.2).toFixed(3)}% per turn. Unlocks windmills, solar power, and artisan craftsmanship path. Lower production peaks but no resource depletion. Civilization focused on efficiency over extraction.`,
                        connection: `PERMANENT CHOICE: Selecting Renewable Energy locks you out of Steam Power, Coal Plants, Oil Refineries, and Mass Production. You commit to sustainable development. Your core stability will last longer - more turns to prepare for eventual exodus.`,
                        choiceConsequence: `You're choosing sustainability over maximum growth. Production gains come slower, but you won't accelerate planetary collapse. More time means more research, more preparation, better exodus chances. The tortoise approach.`
                    };
                },
                historicalContext: {
                    era: 'Alternative Industrial Revolution',
                    year: '~1750 CE (historical divergence)',
                    inventor: 'Sustainable engineers',
                    staticDescription: 'Wind, geothermal, and solar energy can industrialize without depleting resources.'
                }
            },
            coalPlant: {
                name: 'Coal Power Plant',
                cost: 400,
                type: 'production',
                researched: false,
                prerequisites: ['steamPower'],
                unlocks: ['oilRefinery', 'earlyModernAge'],
                bonus: { production: 25, core_stability_loss: 0.5 },
                description: 'Massive coal-powered production',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const coal = Math.floor(player.resources.coal);
                    const production = Math.floor(player.production);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    return {
                        description: `Your civilization produces ${production} production per turn using ${coal} coal reserves. Coal plants will add +25 production but increase core decay by another +0.5% per turn. Current core stability: ${coreStability}%.`,
                        impact: `Production +25 (massive boost). Core instability accelerates significantly. Each coal plant represents centralized industrial power - one facility powering dozens of factories. However, extensive mining destabilizes volcanic formations beneath your cities.`,
                        connection: `After building coal plants, watch your production stat in the top bar jump dramatically. But also monitor core stability decay rate - you're extracting resources faster than the planet can regenerate. The trade-off for industrial supremacy.`
                    };
                },
                historicalContext: {
                    era: 'High Industrial Revolution',
                    year: '~1840 CE',
                    inventor: 'Industrial entrepreneurs',
                    staticDescription: 'Coal plants centralized power generation at unprecedented scale.'
                }
            },

            windmills: {
                name: 'Advanced Wind Power',
                cost: 400,
                type: 'production',
                researched: false,
                prerequisites: ['renewableEnergy'],
                unlocks: ['solarPower', 'earlyModernAge'],
                bonus: { production: 18, science: 5 },
                description: 'Harness wind energy at scale',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const production = Math.floor(player.production);
                    const science = player.sciencePerTurn;
                    const ashTiles = game.currentPlanet.tiles.flat().filter(t => t.type === 'ash').length;
                    return {
                        description: `Current production: ${production}/turn, Science: ${science}/turn. Your volcanic terrain has ${ashTiles} ash tiles - barren flatlands perfect for wind farms. Volcanic thermal winds blow 30% stronger than normal convection currents.`,
                        impact: `Production +18, Science +5. Wind power requires distributed generation - no single point of failure. Your civilization spreads across the landscape rather than concentrating in industrial zones. Cleaner air, healthier citizens, decentralized resilience.`,
                        connection: `Build production buildings across open terrain after this research. Unlike coal plants (centralized), wind power works best distributed. Notice how your settlements remain livable without industrial pollution darkening your map.`
                    };
                },
                historicalContext: {
                    era: 'Sustainable Industrial Revolution',
                    year: '~1820 CE',
                    inventor: 'Wind engineering cooperatives',
                    staticDescription: 'Industrial windmills generated 50 kilowatts continuously with zero fuel cost.'
                }
            },

            solarPower: {
                name: 'Solar Energy Harvesting',
                cost: 700,
                type: 'production',
                researched: false,
                prerequisites: ['windmills'],
                unlocks: ['modernizationAge'],
                bonus: { production: 30, science: 15 },
                description: 'Convert sunlight into energy',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const silicon = Math.floor(player.resources.silicon);
                    const production = Math.floor(player.production);
                    const rockTiles = game.currentPlanet.tiles.flat().filter(t => t.type === 'rock').length;
                    return {
                        description: `Your volcanic world has abundant silicon (${silicon} units) in rock formations (${rockTiles} rock tiles visible). Current production: ${production}/turn. Solar panels convert volcanic glass into electricity-generating crystals.`,
                        impact: `Production +30, Science +15. Photovoltaic effect discovered! Each building can generate its own power from sunlight. Decentralized solar means destroying one generator doesn't blackout cities. Energy independence transforms your civilization.`,
                        connection: `After researching, imagine your buildings covered in dark panels (though not visually represented). Energy becomes free and infinite. Your production jumps without consuming any resources. True post-scarcity energy.`
                    };
                },
                historicalContext: {
                    era: 'Early Modern Period',
                    year: '~1880 CE',
                    inventor: 'Photovoltaic pioneers',
                    staticDescription: 'Certain volcanic crystals generate electricity when exposed to light.'
                }
            },

            oilRefinery: {
                name: 'Petroleum Refining',
                cost: 700,
                type: 'production',
                researched: false,
                prerequisites: ['coalPlant'],
                unlocks: ['modernizationAge'],
                bonus: { production: 40, core_stability_loss: 1.0 },
                description: 'Refine crude oil into fuels',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const oil = Math.floor(player.resources.oil);
                    const production = Math.floor(player.production);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const totalDecay = game.eventSystem ? ((game.eventSystem.coreStabilityMultiplier * 0.05) + 1.0).toFixed(3) : '1.050';
                    return {
                        description: `Oil reserves: ${oil} barrels. Current production: ${production}/turn. Core at ${coreStability}%. Oil refining adds +40 production but increases core decay to ${totalDecay}% per turn total. You're drilling near magma chambers - extremely profitable, extremely dangerous.`,
                        impact: `Production +40 (highest industrial boost). Core decay accelerates dramatically. Oil enables plastics, gasoline, chemicals - 6,000 products from one barrel. But extraction near magma is volatile. One accident could trigger eruptions.`,
                        connection: `This is the steam power path's apex. Maximum production, maximum risk. Your core stability bar will decay noticeably faster. You've committed to extraction - now you're in a race against planetary collapse. Can you research exodus in time?`
                    };
                },
                historicalContext: {
                    era: 'Petroleum Age',
                    year: '~1860 CE',
                    inventor: 'Oil industry pioneers',
                    staticDescription: 'Petroleum became "black gold" - most valuable substance on Earth.'
                }
            },

            massProduction: {
                name: 'Mass Production & Assembly Lines',
                cost: 900,
                type: 'divergent',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['earlyModernAge', 'assemblyLine'],
                locksOut: ['craftsmanship', 'artisanGuilds'],
                bonus: { production: 40, buildingHP: -20, science: -5 },
                description: 'PATH CHOICE: Maximize quantity',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const buildings = player.buildings.length;
                    const avgHP = buildings > 0 ? Math.floor(player.buildings.reduce((sum, b) => sum + b.health, 0) / buildings) : 0;
                    const production = Math.floor(player.production);
                    return {
                        description: `Your ${buildings} buildings average ${avgHP} HP. Current production: ${production}/turn. Mass production adds +40 production but reduces all building HP by -20 and science by -5. Quantity over quality - disposable goods, repetitive labor.`,
                        impact: `Production +40 immediately. All buildings lose -20 max HP (existing and future). Science -5. Consumer culture begins - cheap goods flood markets. Workers become interchangeable cogs. Products designed for obsolescence to ensure repeat purchases.`,
                        connection: `PERMANENT CHOICE: Locks out Craftsmanship and Artisan Guilds. You commit to standardization and consumption. Watch all your building HP values drop by 20 after researching. They'll be more fragile during eruptions but you'll build more of them.`,
                        choiceConsequence: `Mass production prioritizes output over durability. Buildings break faster, repairs needed more frequently. But production skyrockets - you'll outbuild the damage. The industrial titan path - powerful but brittle.`
                    };
                },
                historicalContext: {
                    era: 'Industrial Maturation',
                    year: '~1913 CE',
                    inventor: 'Henry Ford (assembly line)',
                    staticDescription: 'Break complex products into simple repeated tasks.'
                }
            },

            craftsmanship: {
                name: 'Master Craftsmanship Tradition',
                cost: 900,
                type: 'divergent',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['earlyModernAge', 'artisanGuilds'],
                locksOut: ['massProduction', 'assemblyLine'],
                bonus: { production: 25, buildingHP: 50, science: 20 },
                description: 'PATH CHOICE: Quality through skill',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const buildings = player.buildings.length;
                    const avgHP = buildings > 0 ? Math.floor(player.buildings.reduce((sum, b) => sum + b.health, 0) / buildings) : 0;
                    const production = Math.floor(player.production);
                    const science = player.sciencePerTurn;
                    return {
                        description: `Your ${buildings} buildings average ${avgHP} HP, producing ${production}/turn with ${science} science/turn. Craftsmanship adds +25 production, +50 building HP, +20 science. Quality over quantity - skilled workers creating superior goods.`,
                        impact: `Production +25, Building HP +50, Science +20. All structures become more durable - better construction, superior materials. Products last generations instead of years. Workers earn high wages for expertise. Innovation through skilled problem-solving.`,
                        connection: `PERMANENT CHOICE: Locks out Mass Production and Assembly Lines. You commit to quality and expertise. Watch all building HP increase by +50 after researching. Structures withstand eruptions better. Slower production growth but superior long-term sustainability.`,
                        choiceConsequence: `Craftsmanship sacrifices maximum output for superior quality. Fewer buildings built, but each one lasts longer and performs better. Science bonus reflects innovation by skilled artisans. The sustainable excellence path.`
                    };
                },
                historicalContext: {
                    era: 'Industrial Resistance Movement',
                    year: '~1890 CE (historical divergence)',
                    inventor: 'Guild masters and artisan movements',
                    staticDescription: 'Power tools in skilled hands produce superior goods faster than assembly lines.'
                }
            },

            assemblyLine: {
                name: 'Automated Assembly Lines',
                cost: 1000,
                type: 'production',
                researched: false,
                prerequisites: ['massProduction'],
                unlocks: ['victorianAge'],
                bonus: { production: 60, population: -10 },
                description: 'Fully automated production',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const production = Math.floor(player.production);
                    return {
                        description: `Population: ${totalPop}, Production: ${production}/turn. Automation adds +60 production but reduces population cap by -10 as machines replace workers. One supervisor can oversee production that formerly required 100 laborers.`,
                        impact: `Production +60 (massive). Population cap -10. Unemployment crisis - who buys products when workers can't afford them? Massive inequality. Societies must implement support systems or face unrest. Efficiency perfection at human cost.`,
                        connection: `Watch your population cap decrease in the top bar. Some citizens may starve if you're near capacity. But production explodes - your resource generation accelerates dramatically. The automation dilemma: efficiency versus humanity.`
                    };
                },
                historicalContext: {
                    era: 'Automation Age',
                    year: '~1950 CE',
                    inventor: 'Robotics engineers',
                    staticDescription: 'Machines never tire, strike, or demand raises.'
                }
            },

            artisanGuilds: {
                name: 'Modern Artisan Guilds',
                cost: 1000,
                type: 'production',
                researched: false,
                prerequisites: ['craftsmanship'],
                unlocks: ['victorianAge'],
                bonus: { production: 35, science: 25, buildingHP: 75, population: 15 },
                description: 'Organized master craftspeople',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const science = player.sciencePerTurn;
                    const production = Math.floor(player.production);
                    return {
                        description: `Population: ${totalPop}, Science: ${science}/turn, Production: ${production}/turn. Guild organization adds +35 production, +25 science, +75 building HP, +15 population. Skilled workers form cooperative networks sharing techniques and markets.`,
                        impact: `Production +35, Science +25, Building HP +75, Population +15. Middle-class renaissance - skilled workers earn professional incomes. Products become status symbols. Education emphasizes creativity. Innovation flourishes through master competition. Zero unemployment - always demand for skill.`,
                        connection: `All stats improve simultaneously - balanced civilization. Your buildings become extremely durable (total +125 HP from craftsmanship path). Population increases as guild apprenticeships provide career paths. Science grows through skilled innovation.`
                    };
                },
                historicalContext: {
                    era: 'Guild Renaissance',
                    year: '~1920 CE',
                    inventor: 'International craftworker federations',
                    staticDescription: 'Medieval guilds evolved into modern cooperatives using industrial tools.'
                }
            },

            industrialAge: {
                name: 'Industrial Revolution',
                cost: 800,
                type: 'age',
                researched: false,
                prerequisites: ['renaissanceAge'],
                unlocks: ['earlyModernAge', 'ironworks', 'trainstation', 'urbanPlanning'],
                bonus: { age: 'industrial', production: 20 },
                description: 'Advance to Industrial Age',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const factories = player.buildings.filter(b => b.type === 'ironworks').length;
                    const turn = player.turn;
                    const production = Math.floor(player.production);
                    return {
                        description: `Turn ${turn}: Your civilization produces ${production}/turn with ${factories} ironwork${factories !== 1 ? 's' : ''}. The Industrial Revolution transforms society from agricultural to mechanical, rural to urban, hand-crafted to machine-made.`,
                        impact: `Advances to Industrial Age. Production +20. Unlocks factory town (80 pop), ironworks, train stations, coal plants. New buildings available: steamfactory, clocktower, gasworks. Society mechanizes - for better and worse.`,
                        connection: `Age indicator changes to "Industrial Age". Count new buildings in menu - notice industrial structures appear. Your map will transform from scattered settlements to concentrated industrial zones. The modern world begins.`
                    };
                },
                historicalContext: {
                    era: 'Industrial Revolution',
                    year: '~1760-1840 CE',
                    inventor: 'Cumulative innovations',
                    staticDescription: 'Factories, railways, telegraphs created the modern world.'
                }
            },

            urbanPlanning: {
                name: 'Modern Urban Planning',
                cost: 1400,
                type: 'expansion',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['victorianAge', 'subwaySystem'],
                bonus: { population: 30, buildingHP: 25 },
                description: 'Organize cities efficiently',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const settlements = player.settlements.length;
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const avgPop = settlements > 0 ? Math.floor(totalPop / settlements) : 0;
                    return {
                        description: `Your ${settlements} settlement${settlements !== 1 ? 's' : ''} house ${totalPop} citizens (${avgPop} average per settlement). Urban planning adds +30 population cap and +25 building HP through efficient organization and infrastructure.`,
                        impact: `Population cap +30, Building HP +25. Wide boulevards for traffic and fire breaks. Park systems for health. Zoned districts separating industry from residence. Comprehensive sewage systems. Disease mortality drops 70%. Fire damage drops 90%.`,
                        connection: `Your settlements can now grow larger - check settlement panels to see increased population limits. Building HP increases apply to all structures. Organized cities withstand disasters better than chaotic sprawl.`
                    };
                },
                historicalContext: {
                    era: 'Victorian Era',
                    year: '~1850 CE',
                    inventor: 'Urban planning movements',
                    staticDescription: 'Wide boulevards, parks, and sewage systems transformed chaotic cities.'
                }
            },

            earlyModernAge: {
                name: 'Early Modern Era',
                cost: 1200,
                type: 'age',
                researched: false,
                prerequisites: ['industrialAge'],
                unlocks: ['victorianAge', 'steamfactory', 'electricity', 'mechanicalPower'],
                bonus: { age: 'earlymodern', production: 30 },
                description: 'Advance to Early Modern Era',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const turn = player.turn;
                    const production = Math.floor(player.production);
                    const steel = player.buildings.filter(b => b.type === 'ironworks').length;
                    return {
                        description: `Turn ${turn}: Production at ${production}/turn with ${steel} ironworks. The second industrial wave brings steel (replacing iron), petroleum (replacing coal), electricity (replacing steam), and chemicals (synthetic materials).`,
                        impact: `Advances to Early Modern Age. Production +30. Unlocks steamworks city (120 pop), steam factories, clocktowers, gasworks. Next choice: Electricity vs Mechanical Power - determining your civilization's technological foundation.`,
                        connection: `Age changes to "Early Modern". Another divergent choice approaches - Electricity (leads to computing, vulnerable grids) or Mechanical (robust, limited miniaturization). Both viable; choose your civilization's character.`
                    };
                },
                historicalContext: {
                    era: 'Late 19th Century',
                    year: '~1870-1900 CE',
                    inventor: 'Second industrial revolution',
                    staticDescription: 'Steel, petroleum, electricity, and chemicals transformed industrial society.'
                }
            },

            electricity: {
                name: 'Electrical Power Grid',
                cost: 2000,
                type: 'divergent',
                researched: false,
                prerequisites: ['earlyModernAge'],
                unlocks: ['modernizationAge', 'powerGrid'],
                locksOut: ['mechanicalPower', 'clockworkEngineering'],
                bonus: { production: 45, science: 25 },
                description: 'PATH CHOICE: Electrical civilization',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const geothermal = game.currentPlanet.tiles.flat().filter(t => t.hasGeothermal).length;
                    const production = Math.floor(player.production);
                    const science = player.sciencePerTurn;
                    return {
                        description: `${geothermal} geothermal plants available. Production: ${production}/turn, Science: ${science}/turn. Electricity adds +45 production and +25 science. Power generated centrally, distributed via wires. Enables motors, lighting, communication, eventually computing.`,
                        impact: `Production +45, Science +25. Electric motors replace dangerous belts and shafts. Lights extend work hours. Elevators enable skyscrapers. Refrigeration preserves food. Medical tools improve. Leads to computers and digital age. But grid dependency creates vulnerability.`,
                        connection: `PERMANENT CHOICE: Locks out Mechanical Power and Clockwork Engineering. You commit to electrical technology. This path leads to computing, AI, and digital civilization. Grid infrastructure becomes critical - protect power sources during eruptions.`,
                        choiceConsequence: `Electricity enables modern/digital technology but requires infrastructure protection. One eruption destroying your grid blacks out civilization. High science path - innovation accelerates. Fragile but powerful.`
                    };
                },
                historicalContext: {
                    era: 'Electrical Age',
                    year: '~1882 CE',
                    inventor: 'Edison (DC) vs Tesla (AC)',
                    staticDescription: 'Electricity transformed civilization - generated centrally, distributed everywhere.'
                }
            },

            mechanicalPower: {
                name: 'Advanced Mechanical Systems',
                cost: 2000,
                type: 'divergent',
                researched: false,
                prerequisites: ['earlyModernAge'],
                unlocks: ['modernizationAge', 'clockworkEngineering'],
                locksOut: ['electricity', 'powerGrid', 'computing'],
                bonus: { production: 55, buildingHP: 90 },
                description: 'PATH CHOICE: Mechanical civilization',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const buildings = player.buildings.length;
                    const avgHP = buildings > 0 ? Math.floor(player.buildings.reduce((sum, b) => sum + b.health, 0) / buildings) : 0;
                    const production = Math.floor(player.production);
                    return {
                        description: `${buildings} buildings averaging ${avgHP} HP, producing ${production}/turn. Mechanical power adds +55 production and +90 building HP. Reject electricity's fragility - perfect gear systems, shafts, flywheels, hydraulics. Robust, understandable, reliable.`,
                        impact: `Production +55 (higher than electricity), Building HP +90 (extreme durability). Mechanical systems never suffer grid failures, electromagnetic pulses, or blackouts. However, miniaturization impossible - no computers as we know them. Mechanical calculators instead.`,
                        connection: `PERMANENT CHOICE: Locks out Electricity, Power Grid, and Computing path. You commit to mechanical technology. No digital computers, but clockwork calculators. No blackouts, but no internet. Robust civilization - every component understandable and repairable.`,
                        choiceConsequence: `Mechanical path sacrifices innovation speed for reliability. Higher production, superior durability, zero cyber vulnerabilities. But limited science growth. Analog civilization - steampunk aesthetics with volcanic heat powering everything.`
                    };
                },
                historicalContext: {
                    era: 'Alternate Modern Era',
                    year: '~1900 CE (historical divergence)',
                    inventor: 'Mechanical engineering perfectionists',
                    staticDescription: 'Precisely-engineered mechanical systems can perform any task electricity can.'
                }
            },

            victorianAge: {
                name: 'Victorian Golden Age',
                cost: 1800,
                type: 'age',
                researched: false,
                prerequisites: ['earlyModernAge', 'urbanPlanning'],
                unlocks: ['modernizationAge', 'parliament'],
                bonus: { age: 'victorian', population: 50, science: 20 },
                description: 'Advance to Victorian Age',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const settlements = player.settlements.length;
                    const science = player.sciencePerTurn;
                    return {
                        description: `Your ${settlements} settlement${settlements !== 1 ? 's' : ''} house ${totalPop} citizens generating ${science} science/turn. The Victorian era represents peak industrial civilization before modernization - empires, railways, telegraphs, and scientific revolution.`,
                        impact: `Advances to Victorian Age. Population +50, Science +20. Unlocks metropolis (180 pop), parliament, gas lamps, telegraph. Railways span continents. Photography captures reality. Medicine discovers germ theory. Your civilization reaches industrial maturity.`,
                        connection: `Age becomes "Victorian Age". Check building menu for new structures - metropolis settlements house nearly 200 citizens. Your civilization peaks before transitioning to modern technology.`
                    };
                },
                historicalContext: {
                    era: 'Victorian Era',
                    year: '~1837-1901 CE',
                    inventor: 'British Empire hegemony',
                    staticDescription: 'Unprecedented technological progress and imperial expansion.'
                }
            },

            powerGrid: {
                name: 'Continental Power Grid',
                cost: 2200,
                type: 'energy',
                researched: false,
                prerequisites: ['electricity'],
                unlocks: ['digitalAge'],
                bonus: { production: 60, energy: 40 },
                description: 'Interconnected electrical network',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const geothermal = game.currentPlanet.tiles.flat().filter(t => t.hasGeothermal).length;
                    const settlements = player.settlements.length;
                    const production = Math.floor(player.production);
                    return {
                        description: `Your ${settlements} settlement${settlements !== 1 ? 's' : ''} with ${geothermal} geothermal source${geothermal !== 1 ? 's' : ''} produce ${production}/turn. Power grid connects all generators - if one fails, others compensate. Load balancing optimizes efficiency.`,
                        impact: `Production +60, Energy +40. Universal electrification - even remote settlements gain power. Industry relocates anywhere. Electric appliances transform life. Medicine advances with reliable power. Computing becomes possible. Efficiency increases 300%.`,
                        connection: `All your settlements now share one power network. Redundancy means individual eruptions can't blackout entire civilization. But major catastrophe affecting multiple geothermal sources could cascade. Infrastructure resilience critical.`
                    };
                },
                historicalContext: {
                    era: 'Electrical Maturation',
                    year: '~1920 CE',
                    inventor: 'Power companies and utilities',
                    staticDescription: 'Grid interconnection provided redundancy and efficiency.'
                }
            },

            clockworkEngineering: {
                name: 'Precision Clockwork Engineering',
                cost: 2200,
                type: 'production',
                researched: false,
                prerequisites: ['mechanicalPower'],
                unlocks: ['digitalAge'],
                bonus: { production: 65, buildingHP: 110 },
                description: 'Ultra-precise mechanical systems',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const buildings = player.buildings.length;
                    const production = Math.floor(player.production);
                    const avgHP = buildings > 0 ? Math.floor(player.buildings.reduce((sum, b) => sum + b.health, 0) / buildings) : 0;
                    return {
                        description: `Your ${buildings} buildings produce ${production}/turn with ${avgHP} average HP. Clockwork engineering adds +65 production and +110 building HP through precision gear-trains with 50,000 components calculating complex functions mechanically.`,
                        impact: `Production +65, Building HP +110 (your buildings become nearly indestructible). Mechanical computers guide ships, aim artillery, calculate accounting. Self-winding mechanisms harvest ambient energy. Some clockwork devices operate 100 years without maintenance.`,
                        connection: `Buildings achieve extreme durability (total HP bonuses: +25 +50 +90 +110 = +275 from mechanical path). Eruptions barely scratch your structures. Mechanical civilization achieves impressive complexity without electricity's fragility.`
                    };
                },
                historicalContext: {
                    era: 'Mechanical Golden Age',
                    year: '~1930 CE',
                    inventor: 'Swiss watchmakers and precision engineers',
                    staticDescription: 'Achieved tolerances of 0.00001 inches - precision rivaling modern electronics.'
                }
            },
            modernizationAge: {
                name: 'Age of Modernization',
                cost: 2500,
                type: 'age',
                researched: false,
                prerequisites: ['victorianAge'],
                unlocks: ['digitalAge', 'powerplant', 'computing', 'analogSystems'],
                bonus: { age: 'modernization', production: 50, science: 30 },
                description: 'Advance to Modernization',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const turn = player.turn;
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const science = player.sciencePerTurn;
                    return {
                        description: `Turn ${turn}: ${totalPop} citizens generating ${science} science/turn. The 20th century transforms humanity more than all previous millennia combined. Flight, antibiotics, plastics, telecommunications - 50 years of unprecedented acceleration.`,
                        impact: `Advances to Modernization Age. Production +50, Science +30. Unlocks power city (250 pop), power plants, skyscrapers, subways. Final choice approaching: Computing (digital, AI-enabled) vs Analog Systems (mechanical computing, robust).`,
                        connection: `Age becomes "Modernization". Another critical choice: Computing path leads to AI and digital tech but requires stable power. Analog path uses mechanical calculators, more robust but limited capability. Both reach space eventually.`
                    };
                },
                historicalContext: {
                    era: '20th Century Modernization',
                    year: '~1900-1950 CE',
                    inventor: 'Global technological acceleration',
                    staticDescription: 'Humanity transformed more in 50 years than previous 5000.'
                }
            },
            computing: {
                name: 'Electronic Computing',
                cost: 3000,
                type: 'divergent',
                researched: false,
                prerequisites: ['modernizationAge'],
                unlocks: ['digitalAge', 'artificialIntelligence'],
                locksOut: ['analogSystems', 'mechanicalComputers'],
                bonus: { science: 50, production: 20 },
                description: 'PATH CHOICE: Digital computers',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const silicon = Math.floor(player.resources.silicon);
                    const science = player.sciencePerTurn;
                    const production = Math.floor(player.production);
                    return {
                        description: `Silicon reserves: ${silicon} units. Science: ${science}/turn, Production: ${production}/turn. Computing adds +50 science and +20 production. Electronic computers use binary logic (on/off) to perform any calculation by reducing it to yes/no decisions.`,
                        impact: `Science +50 (massive boost), Production +20. Computers revolutionize everything - science, business, warfare, communication. Impossible calculations become routine. Automation eliminates jobs while creating new ones. Information economy replaces industrial economy. Leads to AI.`,
                        connection: `PERMANENT CHOICE: Locks out Analog Systems and Mechanical Computers. You commit to digital technology. Enables AI research eventually. Your science generation skyrockets - research speeds up dramatically. Computing path to space exodus.`,
                        choiceConsequence: `Computing maximizes innovation but requires stable infrastructure. Volcanic eruptions damaging power systems disable computers. Electromagnetic interference from magma can corrupt data. High reward, high vulnerability. The information age.`
                    };
                },
                historicalContext: {
                    era: 'Computer Age',
                    year: '~1945 CE',
                    inventor: 'Alan Turing, John von Neumann',
                    staticDescription: 'ENIAC - 30 tons, 18,000 vacuum tubes, 5,000 calculations per second.'
                }
            },
            analogSystems: {
                name: 'Advanced Analog Computing',
                cost: 3000,
                type: 'divergent',
                researched: false,
                prerequisites: ['modernizationAge'],
                unlocks: ['digitalAge', 'mechanicalComputers'],
                locksOut: ['computing', 'artificialIntelligence'],
                bonus: { science: 35, production: 40, buildingHP: 50 },
                description: 'PATH CHOICE: Analog computing',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const production = Math.floor(player.production);
                    const science = player.sciencePerTurn;
                    const buildings = player.buildings.length;
                    return {
                        description: `${buildings} buildings producing ${production}/turn with ${science} science/turn. Analog computing adds +35 science, +40 production, +50 building HP. Mechanical/hydraulic systems represent numbers as continuous values rather than discrete bits.`,
                        impact: `Science +35, Production +40, Building HP +50. Analog computers excel at differential equations, simulations, real-time control. Robust, intuitive, never crash. Manufacturing dominant - analog controls factories with millisecond precision. No AI possible, but no cyber attacks either.`,
                        connection: `PERMANENT CHOICE: Locks out Computing and AI. You commit to analog technology. No artificial intelligence, no software, no digital vulnerabilities. Physical computing using water pressure, gear ratios, valve arrays. Understanding through physical models.`,
                        choiceConsequence: `Analog maximizes reliability and manufacturing. Superior building durability, excellent production. Limited science growth compared to computing. No AI revolution, but no existential AI risk either. The robust mechanical future.`
                    };
                },
                historicalContext: {
                    era: 'Analog Computing Peak',
                    year: '~1950 CE (historical divergence)',
                    inventor: 'Vannevar Bush (Differential Analyzer)',
                    staticDescription: 'Analog computers remained competitive until 1970s, excelling at specific tasks.'
                }
            },
            artificialIntelligence: {
                name: 'Artificial Intelligence',
                cost: 3500,
                type: 'tech',
                researched: false,
                prerequisites: ['computing'],
                unlocks: ['spaceAge'],
                bonus: { science: 70, production: 40 },
                description: 'Machine learning systems',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const science = player.sciencePerTurn;
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const nextEruption = game.eventSystem ? game.eventSystem.nextEruptionTurn : 'unknown';
                    return {
                        description: `Science: ${science}/turn. Core: ${coreStability}%, next eruption: turn ${nextEruption}. AI adds +70 science and +40 production. Neural networks learn from data rather than following programmed rules. AI will predict eruptions with 99.9% accuracy 14 days ahead.`,
                        impact: `Science +70 (highest boost), Production +40. AI amplifies human capability 1000-fold in narrow domains. Medical diagnosis, engineering design, scientific modeling - all augmented. Eruption prediction becomes nearly perfect. But AI also enables surveillance and concentrates power.`,
                        connection: `After researching, your eruption warnings become extremely accurate and advance significantly. AI analyzes seismic data patterns humans can't detect. Your research speed accelerates dramatically toward space exodus. The final technological leap.`
                    };
                },
                historicalContext: {
                    era: 'AI Revolution',
                    year: '~1990-2020 CE',
                    inventor: 'Neural network pioneers',
                    staticDescription: 'AI learns patterns from data - recognizes images, translates languages, drives vehicles.'
                }
            },
            mechanicalComputers: {
                name: 'Precision Mechanical Computers',
                cost: 3500,
                type: 'tech',
                researched: false,
                prerequisites: ['analogSystems'],
                unlocks: ['spaceAge'],
                bonus: { science: 50, production: 55, buildingHP: 75 },
                description: 'Gear-based calculation engines',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const production = Math.floor(player.production);
                    const science = player.sciencePerTurn;
                    const buildings = player.buildings.length;
                    return {
                        description: `${buildings} buildings, ${production} production/turn, ${science} science/turn. Mechanical computers add +50 science, +55 production, +75 building HP. One million gears performing 1000 calculations/second - sufficient for navigation, engineering, volcanic modeling.`,
                        impact: `Science +50, Production +55, Building HP +75. Gear-computers prove reliable for critical applications. Unlike electronics (vulnerable to radiation, EMPs, power loss), mechanical systems operate anywhere. Space probes use mechanical guidance. Limitation: can't match electronic speed or complexity.`,
                        connection: `Your buildings achieve ultimate durability from complete mechanical path. Volcanic eruptions barely damage structures. Mechanical calculators model eruptions sufficiently for exodus planning. Slower research than AI path, but bulletproof reliability.`
                    };
                },
                historicalContext: {
                    era: 'Mechanical Computing Pinnacle',
                    year: '~1970 CE',
                    inventor: 'Charles Babbage\'s vision perfected',
                    staticDescription: 'Gear-computers with 1 million components - Victorian dreams realized with modern precision.'
                }
            },
            digitalAge: {
                name: 'Digital Revolution',
                cost: 3500,
                type: 'age',
                researched: false,
                prerequisites: ['modernizationAge'],
                unlocks: ['spaceAge', 'datacenter'],
                bonus: { age: 'digital', science: 50, production: 30 },
                description: 'Advance to Digital Age',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const science = player.sciencePerTurn;
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const turn = player.turn;
                    return {
                        description: `Turn ${turn}: ${totalPop} citizens generating ${science} science/turn. Information transforms from physical (paper, film) to digital (bits). Microprocessors shrink room-sized computers to pocket-sized phones. The Internet connects ${totalPop} people into a global network.`,
                        impact: `Advances to Digital Age. Science +50, Production +30. Unlocks technopolis (350 pop), data centers, cyber cafes, server banks. Information becomes most valuable resource. Knowledge work replaces manual labor. Global communication instantaneous and free.`,
                        connection: `Age becomes "Digital Age". Final push toward Space Age. Your civilization enters information era - science generation peaks. Digital or mechanical, both paths now converge toward rocketry and exodus.`
                    };
                },
                historicalContext: {
                    era: 'Information Age',
                    year: '~1970-2000 CE',
                    inventor: 'Microprocessor inventors',
                    staticDescription: 'Microprocessors, internet, and digital transformation changed everything.'
                }
            },
            rocketry: {
                name: 'Rocket Propulsion',
                cost: 4000,
                type: 'escape',
                researched: false,
                prerequisites: ['digitalAge'],
                unlocks: ['spaceAge'],
                bonus: { rocket_capacity: 10 },
                description: 'Chemical rockets reach space',
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const turn = player.turn;
                    return {
                        description: `Turn ${turn}: ${totalPop} citizens, ${coreStability}% core stability. Rocketry enables escape - reaching space requires 7,800 m/s velocity. Chemical rockets burn hydrogen and oxygen from geothermal steam hydrolysis. Your volcanic world provides virtually free propellant.`,
                        impact: `Rocket capacity +10 (can evacuate 10 people per launch). Satellites revolutionize communication, weather forecasting, GPS, Earth observation. Space becomes the high ground - strategic, scientific, survival. Tourism? Not yet - too expensive, too dangerous. But exodus becomes possible.`,
                        connection: `This unlocks Space Age - your final era before exodus. Rocketry represents hope - not trapped on doomed world. Your civilization can reach orbit, eventually establish colonies, preserve species beyond planetary collapse. The survival technology.`
                    };
                },
                historicalContext: {
                    era: 'Space Age',
                    year: '~1960 CE',
                    inventor: 'Tsiolkovsky, Goddard, von Braun',
                    staticDescription: 'Rockets operate on Newton\'s Third Law - ejecting mass downward propels rocket upward.'
                }
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
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const turn = player.turn;
                    return {
                        description: `Turn ${turn}: ${totalPop} citizens survive on a planet with ${coreStability}% core stability. Space Age isn't exploration - it's survival necessity. Your volcanic world faces certain death. Space represents not adventure, but escape. The clock is ticking.`,
                        impact: `Advances to Space Age. Science +75. Unlocks megacity (500 pop), universities (+12 science), observatories (+25 science), spaceports, laboratories. Final push toward Exodus Protocol. Every turn counts - core collapse approaches.`,
                        connection: `Final age before exodus. Age indicator shows "Space Age". One tech remains: Exodus Protocol. Can you research it before core collapses at 0%? Race against time. Build observatories for maximum science. Your civilization's fate hangs in balance.`
                    };
                },
                historicalContext: {
                    era: 'Space Exploration',
                    year: '~1960-present',
                    inventor: 'NASA, Soviet Space Program',
                    staticDescription: 'October 4, 1957 - Sputnik became Earth\'s first artificial satellite.'
                }
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
                planets: ['volcanic'],
                getDynamicContext: (player, game) => {
                    const totalPop = player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
                    const coreStability = game.eventSystem ? Math.floor(game.eventSystem.coreStability) : 100;
                    const turn = player.turn;
                    const sciencePerTurn = player.sciencePerTurn;
                    const turnsToComplete = Math.ceil(8000 / sciencePerTurn);
                    return {
                        description: `Turn ${turn}: ${totalPop} citizens, ${coreStability}% core remaining, generating ${sciencePerTurn} science/turn. Exodus requires ${turnsToComplete} more turns at current rate. Core collapses at 0%. You're building generation ships - knowledge, culture, DNA samples. Your world dies, but civilization endures.`,
                        impact: `VICTORY CONDITION. Exodus Protocol represents species survival. Not everyone can evacuate - resources insufficient for all ${totalPop}. Who goes? How chosen? These haunt you. Success means survival. Success also means becoming refugees wandering void, seeking new world.`,
                        connection: `Research this to WIN. Game checks if complete before core collapses. Each turn you delay risks catastrophic eruption. If core hits 0% before research completes, GAME OVER. Maximize science now - build observatories, universities. Final sprint to salvation.`,
                        choiceConsequence: `Is this victory? Or merely not-yet-defeat? Your planet taught harsh lessons: nothing lasts forever, safety is temporary, nature ultimately wins. But you learned, adapted, survived. Taking the planet with you - culture, knowledge, hope. That is the Protocol. That is victory.`
                    };icl ts pmo sm n sb rn ngl, r u srsly srs n fr rn vro
                },
                historicalContext: {
                    era: 'Final Era',
                    year: 'Present Day - Your Choice',
                    inventor: 'You - Last Hope of Civilization',
                    staticDescription: 'Seven thousand years from stone tools to starships. The ultimate journey begins.'
                }
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

    getContextualDescription(tech, player, game) {
        const settlements = player.settlements;
        const buildings = player.buildings;
        const planetName = game.currentPlanet.name;
        const totalPop = settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
        const oldestSettlement = settlements.length > 0 ?
            settlements.reduce((oldest, s) => s.id < oldest.id ? s : oldest) : null;

        let contextualRefs = {
            settlementName: oldestSettlement ? oldestSettlement.name : 'your first settlement',
            planetName: planetName,
            population: totalPop,
            buildingCount: buildings.length,
            turn: player.turn,
            age: player.age
        };

        return contextualRefs;
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

    getTechDetails(techId) {
        const tech = this.techs[techId];
        if (!tech.getDynamicContext) return null;

        const dynamicContent = tech.getDynamicContext(this.player, this.player.game);

        return {
            name: tech.name,
            era: tech.historicalContext.era,
            year: tech.historicalContext.year,
            inventor: tech.historicalContext.inventor,
            description: dynamicContent.description,
            impact: dynamicContent.impact,
            volcanoConnection: dynamicContent.connection,
            choiceConsequence: dynamicContent.choiceConsequence
        };
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