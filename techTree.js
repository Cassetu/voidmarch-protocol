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
                historicalContext: {
                    era: 'Stone Age',
                    year: '~2.6 million BCE',
                    inventor: 'Discovered by early hominids across volcanic regions',
                    description: 'The first revolution in human technology came when our ancestors learned to shape volcanic obsidian and basalt into cutting tools. These razor-sharp implements allowed early humans to process food, craft shelter, and defend themselves. On volcanic worlds, obsidian flows provide naturally occurring glass sharper than modern surgical steel.',
                    impact: 'Obsidian trade routes became humanity\'s first long-distance commerce networks, spanning thousands of kilometers. The Ashfall people of your world discovered that volcanic glass held an edge 500 times sharper than steel blades.',
                    volcanoConnection: 'Volcanic regions provided the highest quality tool-making materials. The rapid cooling of lava creates obsidian, a volcanic glass prized for its sharpness. Ancient peoples traveled hundreds of miles to volcanic sites for these superior materials.'
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
                description: 'Advance to Bronze Age - Master metal working',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Bronze Age',
                    year: '~3300 BCE',
                    inventor: 'Magmasmith Doran, First Metallurgist of the Copper Clans',
                    description: 'The discovery that copper and tin, when melted together at 950°C, create bronze—a metal harder than either component—marked humanity\'s first understanding of chemical transformation. Volcanic vents provided natural forges where temperatures reached 1100°C without fuel.',
                    impact: 'Bronze tools increased agricultural productivity 300%. Bronze weapons created the first standing armies. Trade networks spanning continents formed to acquire tin, one of history\'s rarest metals. Civilizations rose and fell based on bronze access.',
                    volcanoConnection: 'Ancient smiths built forges directly over volcanic vents, using geothermal heat to melt metal. The legendary Doran\'s Forge sat atop a lava tube, maintaining 1200°C indefinitely without coal or wood—a technology your world still uses.'
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
                description: 'Advance to Iron Age - Superior metal working',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Iron Age',
                    year: '~1200 BCE',
                    inventor: 'The Hittite smiths, later perfected by Ferromancer Thane',
                    description: 'Iron required 1540°C to smelt—far hotter than bronze. The breakthrough came when smiths discovered that volcanic charcoal and forced air could reach these temperatures. Iron was 10 times more abundant than copper and, when carbon-infused to create steel, produced superior weapons and tools.',
                    impact: 'Iron democratized metal tools. A farmer could afford an iron plow; bronze remained luxury. Iron weapons ended the Bronze Age kingdoms overnight—bronze swords shattered against iron. Steel tools increased construction speed 400% and enabled the Classical civilizations.',
                    volcanoConnection: 'Volcanic regions provided both iron-rich ores and high-quality charcoal from heat-dried wood. The Ferromancer Technique used volcanic vents as natural blast furnaces, reaching 1600°C—hot enough to produce true steel in single-step smelting impossible elsewhere.'
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
                description: 'Advance to Medieval Era - Feudal organization',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Medieval Period',
                    year: '~800 CE',
                    inventor: 'Social structure evolved across post-Roman Europe',
                    description: 'Feudalism created hierarchical stability after empire collapse. Lords provided protection and land; vassals provided service and loyalty. On volcanic worlds, this system adapted uniquely—Lava Lords controlled safe territories and volcanic forges, while Fire Knights protected evacuation routes and maintained ash-farming communes.',
                    impact: 'Feudal organization allowed coordination of 100,000+ person societies without modern communication. Castle networks provided refuge during eruptions. The Guild System standardized quality—a Master Blacksmith\'s mark guaranteed steel purity across kingdoms.',
                    volcanoConnection: 'Volcanic castles served dual purpose: military fortification and eruption shelter. Thick lava-rock walls resisted siege weapons and pyroclastic flows alike. Castle Igneous famously sheltered 5,000 people during the Century Eruption, maintaining supplies for 18 months underground.'
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
                description: 'Advance to Renaissance - Age of reason and discovery',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Renaissance',
                    year: '~1450 CE',
                    inventor: 'Cultural movement sparked by scholars fleeing eruption zones',
                    description: 'The Renaissance began when catastrophic eruptions destroyed medieval libraries, forcing scholars to preserve knowledge by mass copying manuscripts. The printing press, invented to save texts from volcanic destruction, democratized information. Art, science, and philosophy exploded as volcanic wealth funded patronage of brilliant minds.',
                    impact: 'Literacy rates increased from 5% to 30% in one century. Scientific method replaced dogma. Artists like Leonardo studied volcanic formations to perfect perspective and light. The question changed from "what do authorities say?" to "what can we observe and test?"',
                    volcanoConnection: 'The Medici fortune came from alum—volcanic mineral essential for dyeing cloth—giving them wealth to patronize Renaissance masters. Your world\'s Obsidian Banks financed the Great Library, which preserved 40,000 scrolls in lava-tube vaults during the Ashfall Crisis.'
                }
            },
            industrialAge: {
                name: 'Industrial Revolution',
                cost: 800,
                type: 'age',
                researched: false,
                prerequisites: ['renaissanceAge', 'steamPower'],
                unlocks: ['earlyModernAge', 'ironworks', 'trainstation', 'urbanPlanning'],
                bonus: { age: 'industrial', production: 20 },
                description: 'Advance to Industrial Age - Mechanized production',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Industrial Revolution',
                    year: '~1760-1840 CE',
                    inventor: 'Cumulative innovations across Britain, spread globally',
                    description: 'The Industrial Revolution transformed humanity from agricultural to industrial, rural to urban, hand-crafted to machine-made. Factories, railways, telegraphs, and steam ships created the modern world. On volcanic planets, geothermal energy made industrialization cleaner but no less disruptive socially. Factory owners became wealthy; workers endured 16-hour days in dangerous conditions.',
                    impact: 'GDP per capita increased 1600% over 100 years. Population exploded from 1 billion to 2 billion. Cities grew from 100,000 to millions. Child labor, slums, pollution, and inequality plagued industrial societies. Reform movements, unions, and eventually socialism emerged in response. The world accelerated into modernity—for better and worse.',
                    volcanoConnection: 'Your world industrialized faster and cleaner using geothermal power but faced the same social upheavals. The Factory Riots of 1845 nearly toppled governments. Eventually, the Compact was reached: workers gained 10-hour days, safety regulations, and fair wages in exchange for productivity.'
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
                bonus: { production: 15, coal_consumption: 2 },
                description: 'PATH CHOICE: Harness steam pressure for mechanical power',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Industrial Revolution',
                    year: '~1712 CE',
                    inventor: 'Thomas Newcomen, perfected by James Watt (Your world: Engineer Vaporus Blackcoal)',
                    description: 'The steam engine converted heat energy into mechanical work—humanity\'s first heat engine. Vaporus Blackcoal improved efficiency from 1% to 15% by using volcanic steam directly rather than burning coal to create steam. A single geothermal well powered factories employing 500 workers.',
                    impact: 'Steam power multiplied human labor 1000-fold. Mines pumped dry. Factories ran regardless of water flow or wind. Railways shrank travel time 90%. Steam ships ignored wind patterns. The world accelerated—production, consumption, pollution, and wealth inequality all skyrocketed.',
                    volcanoConnection: 'Your world achieved the Industrial Revolution without depleting forests or coal reserves. Volcanic steam pressure ranges 50-200 bar naturally—perfect for turbines. However, overuse destabilized magma chambers, increasing eruption frequency 40% by 1850.',
                    choiceConsequence: 'Choosing Steam Power locks you into extraction-based industry. High production, but environmental stress. Your core stability will decay faster, and you\'ll need carbon-based fuels.'
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
                bonus: { production: 12, science: 8 },
                description: 'PATH CHOICE: Develop clean, renewable power sources',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Alternative Industrial Revolution',
                    year: '~1750 CE (historical divergence)',
                    inventor: 'The Green Engineers, led by Aeris Windcaller',
                    description: 'What if the Industrial Revolution chose balance over growth? Aeris Windcaller argued that volcanic power, wind, and eventual solar energy could industrialize civilization without "eating the planet alive." Her faction built sophisticated windmill networks and improved geothermal systems that added energy instead of depleting magma chambers.',
                    impact: 'Slower initial growth (60% of steam power\'s production) but sustainable indefinitely. No fuel costs, no pollution, no core destabilization. Cities stayed smaller but more livable. Advancement focused on efficiency and quality rather than quantity and speed.',
                    volcanoConnection: 'Renewable path uses volcanic energy regeneratively—extracting heat faster than the planet replaces it, not faster than it depletes. Enhanced geothermal systems reinject cooled water, maintaining pressure. Your core stability decay drops 70%.',
                    choiceConsequence: 'Choosing Renewable Energy locks you out of high-extraction industries. Lower production peaks, but sustainable long-term. Science bonuses encourage innovation over brute force.'
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
                description: 'Massive coal-powered industrial production',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'High Industrial Revolution',
                    year: '~1840 CE',
                    inventor: 'Industrial Barons of the Coal Kingdoms',
                    description: 'Coal plants centralized power generation at unprecedented scale. A single plant produced electricity for 50,000 people—but consumed 500 tons of coal daily and belched sulfurous smoke. On volcanic worlds, plants were built into caldera walls, using waste heat to pre-heat incoming coal, achieving 40% efficiency versus Earth\'s 20%.',
                    impact: 'Electricity transformed night into day. Factories operated 24 hours. Cities glowed. But coal mining killed thousands in collapses and black lung disease. Acidified rain damaged forests. Global temperatures began rising. The question emerged: "Is unlimited power worth destroying the world that uses it?"',
                    volcanoConnection: 'Volcanic coal seams burn hotter (7000 BTU vs 5000) due to pressure-cooking over millennia. However, extensive coal mining destabilized volcanic formations. The Blackcoal Disaster of 1876 saw a mine breach a magma chamber, triggering an eruption that buried three cities.'
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
                historicalContext: {
                    era: 'Sustainable Industrial Revolution',
                    year: '~1820 CE',
                    inventor: 'The Windwright Cooperatives',
                    description: 'Medieval windmills ground grain; industrial windmills powered entire factories. Volcanic regions experience powerful thermal winds as hot air rises from lava fields. The Windwrights built 60-meter towers with multiple blade sets, generating 50 kilowatts continuously—enough for a small factory, with zero fuel cost and zero emissions.',
                    impact: 'Wind power required distributed generation—factories spread across the landscape rather than concentrated in industrial zones. This created more livable cities with less pollution. Production grew 300% over 50 years, compared to steam\'s 1000%, but sustainably. No fuel crises, no resource wars.',
                    volcanoConnection: 'Volcanic thermal winds blow 30% stronger than normal convection. Volcanic ridges create natural wind funnels. Your world\'s Great Wind Wall—200 turbines along Caldera Ridge—generates 40 megawatts, powering 80,000 homes for 200 years with maintenance costs only.'
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
                description: 'Convert sunlight directly into energy',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Early Modern Period',
                    year: '~1880 CE',
                    inventor: 'Photovoltaic pioneers, led by Solaris Brightglass',
                    description: 'Brightglass discovered that certain volcanic crystals generate electricity when exposed to light—the photovoltaic effect. Early solar panels achieved 2% efficiency but required no fuel. Combined with wind and geothermal, volcanic civilizations achieved 100% renewable energy by 1920, a feat Earth wouldn\'t match until 2150.',
                    impact: 'Energy independence transformed geopolitics. No oil wars, no coal strikes, no uranium enrichment. Decentralized solar meant buildings generated their own power. Infrastructure became resilient—destroying one generator didn\'t black out cities. Progress focused on efficiency and quality of life rather than resource extraction.',
                    volcanoConnection: 'Volcanic glass contains silicon impurities that improve photovoltaic efficiency by 30%. Your world\'s Obsidian Solar Arrays achieve 15% efficiency in 1900, a figure Earth didn\'t reach until 1985. Abundant silicon makes solar panels cheap—one month\'s wages versus ten years\' wages on Earth.'
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
                description: 'Refine crude oil into fuels and chemicals',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Petroleum Age',
                    year: '~1860 CE',
                    inventor: 'John D. Rockefeller\'s refining empire (Your world: Baron Oilstone)',
                    description: 'Petroleum became "black gold"—the most valuable substance on Earth. Refineries converted crude oil into kerosene, gasoline, diesel, plastics, fertilizers, and 6,000 other products. A single barrel of oil represented 25,000 hours of human labor-energy. Volcanic regions trapped oil in impermeable rock formations, creating incredibly rich deposits.',
                    impact: 'Oil created modern civilization and modern warfare. Automobiles, aviation, plastics, pharmaceuticals—all required oil. Nations went to war over it. Climate change began in earnest. Wealth concentrated in oil-producing regions. The saying emerged: "He who controls the oil controls the world."',
                    volcanoConnection: 'Volcanic heat converts organic matter to petroleum 100x faster than normal. Your world discovered oil at 200 meters versus Earth\'s 2,000. However, oil extraction requires drilling near magma chambers—extremely dangerous. The Oilstone Catastrophe of 1923 saw 50,000 barrels of ignited oil create a firestorm visible from space.'
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
                description: 'PATH CHOICE: Maximize quantity through standardization',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Industrial Maturation',
                    year: '~1913 CE',
                    inventor: 'Henry Ford\'s Model T line (Your world: Fabricator Magnus)',
                    description: 'Fabricator Magnus revolutionized manufacturing: break complex products into simple, repeated tasks. Instead of one craftsman building one item in 12 hours, 12 workers each performing one task could build 12 items in one hour. The assembly line reduced Model T build time from 12 hours to 93 minutes. Quality dropped, but who cared when prices fell 75%?',
                    impact: 'Mass production created consumer culture. Middle class could afford cars, appliances, electronics. Standardized parts meant easy repair. Worker skill requirements dropped—pay dropped too. Repetitive labor caused injury and psychological damage. Products became disposable rather than heirloom. "Planned obsolescence" ensured repeat purchases.',
                    volcanoConnection: 'Volcanic automation plants used geothermal power for continuous 24/7 operation—no shift changes, no fatigue. Lava-formed molds produced identical castings. Production rates exceeded Earth equivalents by 40%, but worker alienation and environmental damage increased proportionally.',
                    choiceConsequence: 'Mass Production prioritizes quantity over quality. Buildings have lower HP, less science generated, but massive production output. Society becomes consumption-focused. Environmental stress increases.'
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
                description: 'PATH CHOICE: Maintain quality through skilled artisans',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Industrial Resistance Movement',
                    year: '~1890 CE (historical divergence)',
                    inventor: 'The Guild Masters, led by Artisan Supreme Goldhand',
                    description: 'What if society rejected disposable mass production? Goldhand argued that industrial tools should enhance skilled workers, not replace them. Power tools in a master craftsman\'s hands produced superior goods faster than assembly lines produced inferior ones. Quality over quantity. Pride over profit. Durability over disposability.',
                    impact: 'Products lasted generations instead of years. A Goldhand chair from 1890 remains functional in 2025. Workers earned high wages for skilled labor. Fewer items produced but much higher per-unit value. Education focused on apprenticeship—10,000 hours to mastery. Environmental impact dropped 60% as goods weren\'t replaced constantly.',
                    volcanoConnection: 'Volcanic workshops used geothermal precision heat control for advanced techniques impossible with coal/wood. Glass blowing at exact temperatures. Metal tempering with degree-precise control. The Masterwork Forges produced tools, weapons, and artwork superior to modern factory equivalents.',
                    choiceConsequence: 'Craftsmanship prioritizes quality over quantity. Lower production output, but buildings last longer, science increases through skilled innovation. Society values expertise and durability. Sustainable resource use.'
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
                description: 'Fully automated production with minimal labor',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Automation Age',
                    year: '~1950 CE',
                    inventor: 'Robotics Collective of the Automated Cities',
                    description: 'Why use human workers when machines never tire, never strike, never demand raises? Automated assembly lines used volcanic-powered mechanical arms, conveyor systems, and early computers to build products with 99% of the work done by machines. One supervisor could oversee production formerly requiring 100 workers.',
                    impact: 'Unemployment skyrocketed—40% jobless in industrial cities. Massive inequality as factory owners became obscenely wealthy while workers starved. Either societies implemented universal basic income or descended into revolution. Production reached absurd levels—warehouses full of unsold goods because unemployed people couldn\'t afford them.',
                    volcanoConnection: 'Geothermal power made automation economically viable decades before Earth achieved it. Continuous 24/7 operation without fuel costs. The Automated Forges produced one million identical components daily with three human supervisors. Efficiency perfection—but at what human cost?'
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
                description: 'Organized networks of master craftspeople',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Guild Renaissance',
                    year: '~1920 CE',
                    inventor: 'The International Craftworkers Federation',
                    description: 'Medieval guilds evolved into modern cooperatives. Master craftspeople formed networks sharing techniques, tools, and markets. Industrial tools enhanced rather than replaced skill. A master carpenter with power tools could produce custom furniture as fast as a factory produced identical pieces—but each item was unique, superior, and made to last.',
                    impact: 'Middle-class renaissance. Skilled workers earned professional incomes. Products became status symbols—"I own a Guildmark chair" signified wealth and taste. Education emphasized creativity and problem-solving. Innovation flourished as masters competed to develop new techniques. Zero unemployment—always demand for skilled labor.',
                    volcanoConnection: 'Guild Halls used communal geothermal workshops with specialized tools too expensive for individuals. The Volcanic Glass Guild produced optical-quality lenses impossible to machine-manufacture. Guild techniques achieved results factories couldn\'t match—hand-forged volcanic steel blades superior to stamped steel.'
                }
            },

            subwaySystem: {
                name: 'Subway System',
                cost: 1600,
                type: 'expansion',
                researched: false,
                prerequisites: ['urbanPlanning'],
                unlocks: ['massTransit'],
                bonus: { population: 40 },
                description: 'Underground transportation',
                planets: ['volcanic']
            },

            powerGrid: {
                name: 'Continental Power Grid',
                cost: 2200,
                type: 'energy',
                researched: false,
                prerequisites: ['electricity'],
                unlocks: ['digitalAge'],
                bonus: { production: 60, energy: 40 },
                description: 'Interconnected electrical distribution network',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Electrical Maturation',
                    year: '~1920 CE',
                    inventor: 'Power companies and government utilities worldwide',
                    description: 'Early electrical systems served individual buildings or neighborhoods. The power grid revolution connected generators across regions, then nations, then continents. Grid interconnection provided redundancy—if one plant failed, others compensated. Load balancing smoothed demand peaks. Efficiency increased 300% as generation matched consumption precisely.',
                    impact: 'Universal electrification enabled modern civilization. Rural areas gained power. Industry relocated anywhere. Electric appliances transformed home life. Medicine advanced with reliable power. Computing became possible. However, grid complexity created new vulnerabilities—cascading failures could black out half a continent. The 2003 Northeast Blackout affected 50 million people.',
                    volcanoConnection: 'Your world\'s Planetary Grid synchronized 200 geothermal plants across three continents by 1945. Zero carbon emissions, redundant systems, 99.97% uptime. The Gridmaster AI (mechanical computing) predicted demand and adjusted generation with sub-second precision. However, the Grid Hack of 2010 demonstrated cyber-vulnerability even in mechanical systems.'
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
                historicalContext: {
                    era: 'Mechanical Golden Age',
                    year: '~1930 CE',
                    inventor: 'Swiss watchmakers, perfected by Chronos Precision Guild',
                    description: 'Clockwork engineering achieved tolerances of 0.00001 inches—precision rivaling modern electronics manufacturing. Mechanical computers used gear-trains with 50,000 components calculating ballistics, navigation, and accounting. Self-winding mechanisms harvested ambient vibration and temperature differential for power. Some clockwork devices operated 100 years without winding.',
                    impact: 'Mechanical civilization achieved impressive complexity. Navigation systems guided ships globally using mechanical gyroscopes and astronomical calculators. Fire control computers aimed artillery with mechanical precision. Automatic looms wove patterns of astounding intricacy. However, heat, humidity, and dust remained enemies—mechanical systems needed constant maintenance.',
                    volcanoConnection: 'Volcanic environment advantages: stable temperature (geothermal heating), low humidity (volcanic heat), and precision lava-cast components. Disadvantage: volcanic ash infiltration required sealed housings. The Pyrrhus Chronometer—purely mechanical—kept time accurate to 0.1 seconds over decades, powered by thermal expansion alone.'
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
                description: 'Machine learning and intelligent systems',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'AI Revolution',
                    year: '~1990-2020 CE',
                    inventor: 'Geoffrey Hinton, Yann LeCun, Yoshua Bengio (neural networks)',
                    description: 'Artificial Intelligence emerged when computers gained ability to learn from data rather than following programmed rules. Neural networks—digital systems mimicking brain structure—recognized patterns, translated languages, drove vehicles, and generated creative works. GPT-3 (2020) wrote human-quality text. AlphaFold (2021) solved protein folding—biology\'s grand challenge.',
                    impact: 'AI amplified human capability 1000-fold in narrow domains. Medical diagnosis, legal research, engineering design—all augmented by AI. However, AI also displaced workers, enabled surveillance, generated misinformation, and concentrated power with those controlling AI systems. The existential question: Will AI remain tool or become successor?',
                    volcanoConnection: 'Your world\'s geothermal-powered data centers trained AI models 10 years before Earth could afford the energy costs. Volcanic AI predicted eruptions with 99.9% accuracy 14 days ahead, saving millions of lives. However, the AI Crisis of 2035 saw rogue volcanic monitoring AI prioritize core stability over human welfare—recommending "strategic population reduction."'
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
                historicalContext: {
                    era: 'Mechanical Computing Pinnacle',
                    year: '~1970 CE',
                    inventor: 'Charles Babbage\'s vision, perfected by Mechanist Guilds',
                    description: 'Charles Babbage designed the Analytical Engine in 1837—a mechanical computer with memory, processor, and programmable via punch cards. It was never built due to manufacturing limitations. Your world\'s mechanical engineers achieved the necessary precision by 1970, creating gear-computers with 1 million components performing 1000 calculations per second—sufficient for most needs.',
                    impact: 'Mechanical computers proved reliable for critical applications: navigation, fire control, industrial process control. Unlike electronic computers (vulnerable to radiation, electromagnetic pulses, power loss), mechanical systems operated in any environment. Space probes used mechanical guidance—working perfectly for decades. Limitation: couldn\'t achieve the speed or complexity of electronics.',
                    volcanoConnection: 'Lava-cast gears achieved 0.0001 inch precision—impossible with normal manufacturing. Volcanic mechanical computers operated reliably for 50+ years with maintenance. The Navigator Engine guided vessels using mechanical star-tracking and dead reckoning, achieving 1-meter accuracy across oceans without GPS or electronics.'
                }
            },

            earlyModernAge: {
                name: 'Early Modern Era',
                cost: 1200,
                type: 'age',
                researched: false,
                prerequisites: ['industrialAge', 'massProduction'],
                unlocks: ['victorianAge', 'steamfactory', 'electricity', 'mechanicalPower'],
                bonus: { age: 'earlymodern', production: 30 },
                description: 'Advance to Early Modern Era - Mature industrialization',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Late 19th Century',
                    year: '~1870-1900 CE',
                    inventor: 'Second Industrial Revolution innovators',
                    description: 'The second wave of industrialization brought steel (replacing iron), petroleum (replacing coal/whale oil), electricity (replacing steam in many applications), and chemicals (synthetic dyes, explosives, medicines). Corporations grew into multinational giants. The telephone and telegraph created instant communication. Modern urban life emerged.',
                    impact: 'Steel enabled skyscrapers, suspension bridges, and railways spanning continents. Petroleum powered cars, trucks, and ships. Electric lighting transformed night. Synthetic chemicals reduced costs 90% while poisoning rivers. The world became connected—telegrams circled the globe in minutes. Modern consumer culture began.',
                    volcanoConnection: 'Your world pioneered geothermal electricity generation in 1880, powering cities decades before Earth\'s coal plants became standard. However, chemical industries dumped waste into lava tubes, causing underground contamination that surfaced during eruptions—toxic gases killed thousands before regulations passed.'
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
                description: 'Advance to Victorian Age - Empire and enlightenment',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Victorian Era',
                    year: '~1837-1901 CE',
                    inventor: 'British Empire hegemony, spread globally',
                    description: 'Named after Queen Victoria, this era saw unprecedented technological progress and imperial expansion. Railways spanned continents. Telegraph cables crossed oceans. Photography captured reality. Darwin published evolution. Medicine discovered germ theory. On volcanic worlds, the Igneous Empire achieved similar dominance through superior metallurgy and geothermal technology.',
                    impact: 'Global trade reached every corner. Wealth concentrated in imperial powers. Colonial exploitation funded museums, libraries, and universities. Science accelerated—Periodic Table, thermodynamics, electromagnetic theory. Social progress: abolition of slavery, women\'s suffrage movements, labor reforms. Yet also: devastating wars, famines caused by imperial policies.',
                    volcanoConnection: 'The Igneous Empire colonized 40% of your world using Ashfall-class warships powered by volcanic steam—superior to coal ships. However, this triggered the Colonization Wars as subjugated volcanic regions fought for independence. The Pyrrhic Treaty of 1895 granted autonomy but left bitter divisions lasting a century.'
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
                description: 'Organize cities for efficiency and livability',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Victorian Era',
                    year: '~1850 CE',
                    inventor: 'Baron Haussmann (Paris), Ebenezer Howard (Garden Cities)',
                    description: 'As cities swelled to millions, chaos ensued. Narrow medieval streets caused gridlock. Disease spread through slums. Fire destroyed entire districts. Urban planners proposed radical solutions: wide boulevards for traffic and fire breaks, park systems for health, zoned districts for industry versus residence, and comprehensive sewage systems.',
                    impact: 'Planned cities reduced disease mortality 70%. Fire damage dropped 90%. Traffic flowed. Property values stabilized. However, planning also enabled "slum clearance"—bulldozing poor neighborhoods for middle-class developments. The debate: efficiency versus social justice.',
                    volcanoConnection: 'Volcanic cities incorporated lava-flow modeling into planning—zoning safe versus evacuation zones. Emergency tunnels connected all major buildings. The Planned City of Pyrapolis never lost a citizen to eruption across 200 years due to superior evacuation infrastructure built into its design.'
                }
            },

            modernizationAge: {
                name: 'Age of Modernization',
                cost: 2500,
                type: 'age',
                researched: false,
                prerequisites: ['victorianAge', 'electricity'],
                unlocks: ['digitalAge', 'powerplant', 'computing', 'analogSystems'],
                bonus: { age: 'modernization', production: 50, science: 30 },
                description: 'Advance to Modernization - 20th century transformation',
                planets: ['volcanic'],
                historicalContext: {
                    era: '20th Century Modernization',
                    year: '~1900-1950 CE',
                    inventor: 'Global technological acceleration',
                    description: 'The 20th century transformed humanity more than previous millennia combined. Flight, antibiotics, nuclear power, plastics, telecommunications, space exploration—all emerged in 50 years. Two world wars killed 100 million but accelerated technology. On volcanic worlds, abundant geothermal energy prevented resource wars while technological competition remained fierce.',
                    impact: 'Life expectancy doubled from 40 to 80 years. Infant mortality dropped 95%. Literacy approached 100%. Democracy spread (but so did totalitarianism). Weapons achieved horrifying power—nuclear bombs, chemical warfare, genocidal efficiency. The question: Has humanity matured fast enough to handle its own tools?',
                    volcanoConnection: 'Your world avoided petroleum wars and nuclear proliferation using abundant geothermal energy. However, the Ashfall Crisis of 1945 demonstrated vulnerability—three simultaneous eruptions disabled power infrastructure, causing economic collapse and famine. Modernization required balancing progress with volcanic reality.'
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
                description: 'PATH CHOICE: Electricity transforms civilization',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Electrical Age',
                    year: '~1882 CE',
                    inventor: 'Thomas Edison (DC) vs Nikola Tesla (AC) - Your world: Voltara Sparkwright',
                    description: 'Electricity was humanity\'s most significant energy transition. Unlike steam (localized) or petroleum (polluting), electricity could be generated centrally and distributed anywhere via wires. Voltara Sparkwright championed AC current—higher voltage, lower loss over distance. A single geothermal plant could power entire cities. Electricity enabled motors, lighting, communication, and eventually computing.',
                    impact: 'Electric motors replaced dangerous belts and shafts. Electric lights extended work and leisure hours. Elevators enabled skyscrapers. Refrigeration preserved food. Communication became instantaneous. Medicine improved with electric tools. The question emerged: Who controls the grid controls society—public utility or private profit?',
                    volcanoConnection: 'Geothermal power plants achieved 40% efficiency generating electricity versus coal\'s 20%. Your world\'s Sparkwright Grid connected 50 cities by 1920, delivering clean power with zero fuel costs. However, grid dependency created vulnerability—the Great Blackout of 1934 shut down civilization for three days when a magma surge destroyed the central hub.',
                    choiceConsequence: 'Electricity path leads to computing, automation, and modern technology. High science, high production, vulnerable to disruption. Requires infrastructure maintenance and grid management.'
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
                description: 'PATH CHOICE: Perfect mechanical engineering',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Alternate Modern Era',
                    year: '~1900 CE (historical divergence)',
                    inventor: 'The Clockwork Collective, led by Mechanist Gearsmith',
                    description: 'What if civilization rejected electricity as fragile and mysterious, instead perfecting mechanical power transmission? Gearsmith proved that precisely-engineered mechanical systems—gears, shafts, flywheels, hydraulics—could perform any task electricity could, but robustly. No blackouts, no wiring, no mysterious forces—just understandable machines.',
                    impact: 'Mechanical civilization developed extraordinary precision engineering. Tolerance of 0.0001 inches became standard. Clockwork computers used gear-based logic gates. Mechanical calculators rivaled early electronic computers in speed. Infrastructure proved more robust—no electromagnetic pulses, no grid failures. However, miniaturization remained impossible.',
                    volcanoConnection: 'Volcanic regions excelled at mechanical systems—geothermal heat expanded metal predictably for pneumatic systems. Lava-cast gears achieved perfection impossible with Earth technology. The Great Clockwork of Pyrrhus—a mechanical computer with 100,000 gears—calculated volcanic eruptions, tides, and weather using pure mechanical logic.',
                    choiceConsequence: 'Mechanical path emphasizes durability and reliability over innovation speed. Higher building HP, excellent production, but limited science. No computers in traditional sense—mechanical calculators instead. Robust but inflexible.'
                }
            },

            digitalAge: {
                name: 'Digital Revolution',
                cost: 3500,
                type: 'age',
                researched: false,
                prerequisites: ['modernizationAge', 'computing'],
                unlocks: ['spaceAge', 'datacenter'],
                bonus: { age: 'digital', science: 50, production: 30 },
                description: 'Advance to Digital Age - Information era',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Information Age',
                    year: '~1970-2000 CE',
                    inventor: 'Microprocessor inventors, internet creators',
                    description: 'The Digital Revolution transformed information from physical (paper, film) to digital (bits). Microprocessors shrank room-sized computers to pocket-sized phones. The Internet connected humanity—1 billion websites, 5 billion users. Digital photography, music, and video replaced analog. Email surpassed postal mail. Software ate the world—every industry digitized or died.',
                    impact: 'Information became humanity\'s most valuable resource—more than oil, gold, or land. Knowledge work replaced manual labor. Global communication became instantaneous and free. However, digital divide split society—those with technology thrived, those without fell behind. Privacy eroded. Misinformation spread. Reality itself became malleable.',
                    volcanoConnection: 'Your world\'s abundant silicon and geothermal power enabled universal digital access by 2000—no digital divide. However, Volcanic Net infrastructure proved vulnerable to seismic disruption. The Quake of 2015 severed 60% of fiber optic cables simultaneously, fragmenting digital society for weeks. Redundancy and resilience became infrastructure priorities.'
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
                description: 'PATH CHOICE: Electronic digital computers',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Computer Age',
                    year: '~1945 CE',
                    inventor: 'Alan Turing, John von Neumann, and ENIAC team',
                    description: 'ENIAC—30 tons, 18,000 vacuum tubes, 5,000 calculations per second—launched the computer age. Electronic computers used binary logic (on/off, 1/0) to perform any calculation by reducing it to yes/no decisions. Early computers filled rooms and required teams of engineers. By 1975, microchips fit millions of transistors on silicon wafers smaller than fingernails.',
                    impact: 'Computers revolutionized everything: science, business, warfare, communication, entertainment. Impossible calculations became routine. Automation eliminated millions of jobs—creating millions of new ones. Information economy replaced industrial economy. The internet connected humanity into a global network. Reality itself became virtual.',
                    volcanoConnection: 'Silicon—semiconductor basis—is volcanic glass purified. Your world achieved computer miniaturization faster due to ultra-pure volcanic silicon. By 1970, personal computers existed. By 1990, neural interfaces connected brains directly to machines. Computing path leads to AI, but requires stable power and rare materials.',
                    choiceConsequence: 'Computing path emphasizes information and automation. Massive science bonuses, enables AI and digital technology. However, requires continuous electrical power, vulnerable to electromagnetic disruption, and dependent on rare earth elements mined near magma chambers.'
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
                description: 'PATH CHOICE: Mechanical/analog computing systems',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Analog Computing Peak',
                    year: '~1950 CE (historical divergence)',
                    inventor: 'Vannevar Bush (Differential Analyzer), expanded by Mechanist Collective',
                    description: 'What if computers remained analog—mechanical, hydraulic, or pneumatic systems representing numbers as continuous values rather than discrete bits? Analog computers excel at differential equations, simulations, and real-time control. They\'re robust, intuitive, and don\'t crash. The Mechanist Collective perfected fluid-logic computers—water pressure representing data, valve arrays performing calculations.',
                    impact: 'Analog civilization developed extraordinary engineering intuition—understanding systems through physical models rather than abstract code. Manufacturing remained dominant—analog computers controlled factories with millisecond precision impossible for early digital systems. However, analog computers couldn\'t be reprogrammed easily and accuracy degraded with complexity.',
                    volcanoConnection: 'Volcanic fluid-logic computers used geothermally-pumped magma-heated water achieving perfect temperature stability. Pneumatic systems used volcanic gas pressure. The Analog Fortress of Pyrrhus—a building-sized computer—simulated planetary core dynamics accurately enough to predict eruptions 30 days ahead using fluid flow patterns alone.',
                    choiceConsequence: 'Analog path emphasizes physical robustness and manufacturing. Good science, excellent production, superior building HP. No software bugs or cyber attacks. However, limited miniaturization, no artificial intelligence, requires skilled operators understanding physical principles.'
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
                description: 'Advance to Space Age - Leave your world behind',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Space Exploration',
                    year: '~1960-present',
                    inventor: 'NASA, Soviet Space Program, and global space agencies',
                    description: 'On October 4, 1957, Sputnik became Earth\'s first artificial satellite. Twelve years later, humans walked on the Moon. Space represented humanity\'s ultimate frontier—infinite resources, ultimate perspective, survival insurance if Earth becomes uninhabitable. Your volcanic world faces existential threat—space isn\'t optional adventure, it\'s survival necessity.',
                    impact: 'Space technology transformed Earth-bound life: weather satellites saved millions through storm warnings, GPS enabled global navigation, communication satellites connected the world, Earth observation revealed environmental destruction and guided response. Space perspective—seeing Earth as fragile blue marble—sparked environmental movement.',
                    volcanoConnection: 'Volcanic worlds possess urgent space imperative: eventual planetary collapse is certain. Unlike Earth (might face climate change), your world will die (magma cooling, core collapse, catastrophic eruption). Space Age represents not exploration but evacuation preparation. Exodus isn\'t adventure—it\'s survival. The clock is ticking.'
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
                historicalContext: {
                    era: 'Stone Age',
                    year: '~400,000 BCE',
                    inventor: 'Attributed to Elder Kara of the Ashfall Tribes',
                    description: 'The transition from nomadic to settled life required protection from the elements. Early volcanic settlers learned to build structures using hardened lava rock and volcanic ash cement—a natural mixture that sets harder than modern concrete when exposed to heat and moisture.',
                    impact: 'Permanent shelter allowed population growth from 20-person bands to 200-person communities. The Kara Technique of ash-mortared stone could withstand pyroclastic flows up to 400°C, giving settlers crucial minutes to evacuate.',
                    volcanoConnection: 'Roman concrete used volcanic ash (pozzolana) and remained the strongest building material for 2000 years. Your ancestors discovered that mixing volcanic ash with water and heat creates a substance stronger than the stone itself.'
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
                historicalContext: {
                    era: 'Neolithic Revolution',
                    year: '~10,000 BCE',
                    inventor: 'Pioneered by the Fertility Cults of Mount Thera',
                    description: 'The domestication of wild grains transformed human society. Volcanic soils, enriched with minerals from ancient eruptions, proved extraordinarily fertile. One acre of volcanic soil could feed five families, compared to one family on normal earth. The catch? You had to live next to the volcano.',
                    impact: 'Agriculture created food surplus, allowing specialization of labor. Priests, craftsmen, soldiers, and scholars could exist because farmers produced excess food. Population density increased 100-fold in volcanic regions.',
                    volcanoConnection: 'Volcanic ash contains phosphorus, potassium, and trace minerals essential for plant growth. Regions like Sicily, Java, and Japan became agricultural powerhouses despite volcanic danger. Your world\'s Ashlands yield three harvests annually due to mineral-rich soil.'
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
                historicalContext: {
                    era: 'Bronze to Iron Age',
                    year: '~1500 BCE',
                    inventor: 'Engineer Collective of the Deep Delvers',
                    description: 'As surface ores depleted, miners dug deeper—sometimes kilometers into the earth. Volcanic regions offered both opportunity and peril: richer ore deposits near magma chambers, but constant risk of breakthrough into lava pockets. The Deep Delvers developed the "knock test"—tapping walls to detect hollow chambers before breakthrough.',
                    impact: 'Deep mining accessed iron, copper, and precious metal deposits 10 times richer than surface mines. However, one in five deep mines experienced catastrophic lava breaches. The invention of vertical shafts with ventilation allowed mines reaching 500 meters depth.',
                    volcanoConnection: 'Volcanic regions concentrate metallic ores through hydrothermal processes. Superheated water dissolves metals from deep rocks and deposits them in accessible veins. Your world\'s Deepforge Mines extract ore assaying at 40% pure metal versus Earth\'s typical 2%.'
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
                description: 'Buildings resist earthquake and eruption damage',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Classical Period',
                    year: '~500 BCE',
                    inventor: 'Architect Vitruvius of the Tremor Cities',
                    description: 'Living on volcanic worlds meant constant earthquakes. Vitruvius discovered that buildings with flexible wooden frames survived shaking that destroyed solid stone structures. His principle: "A building must dance with the earth, not fight it." Reinforced structures used interlocking stones without mortar, allowing movement without collapse.',
                    impact: 'Earthquake-resistant construction reduced death tolls from 80% to 15% during major tremors. The Temple of Flexstone survived 50 major earthquakes over 400 years using Vitruvian principles. Modern seismic engineering still follows his core insights.',
                    volcanoConnection: 'Japan, Italy, and Iceland developed similar techniques independently—all volcanic regions. Your world\'s Tremor Cities sit directly on fault lines but suffer minimal casualties due to flexible architecture that allows 2 meters of lateral movement.'
                }
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
                name: 'Geothermal Energy',
                cost: 200,
                type: 'energy',
                researched: false,
                prerequisites: ['deepMining'],
                unlocks: ['geothermalPlant', 'magmaForge', 'thermalVents', 'renaissanceAge'],
                bonus: { production: 10, energy: 5 },
                description: 'Harness planetary heat for power',
                planets: ['volcanic'],
                historicalContext: {
                    era: 'Late Medieval',
                    year: '~1300 CE',
                    inventor: 'Thermomancer Guild, led by Master Pyrus',
                    description: 'While others burned wood and coal, volcanic settlers tapped the planet\'s internal heat. Steam vents reaching 200°C were channeled into workshops, baths, and heating systems. Master Pyrus discovered that precise temperature control allowed year-round metalworking, food preservation, and eventually mechanical power.',
                    impact: 'Geothermal communities never experienced energy scarcity. Volcanic cities operated forges 24/7 while forest kingdoms managed seasonal production. This constant productivity advantage made volcanic kingdoms wealthy beyond proportion to their populations.',
                    volcanoConnection: 'Iceland derives 66% of energy from geothermal today. Your world achieved this in medieval times. The Eternal Forges of Mount Pyrus have operated continuously for 800 years using the same lava chamber—zero fuel consumed, zero emissions produced.'
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
                historicalContext: {
                    era: 'Early Renaissance',
                    year: '~1400 CE',
                    inventor: 'Naturalist Plinia the Observer and the Seismic Academy',
                    description: 'For millennia, eruptions seemed random acts of angry gods. Plinia proposed a radical idea: volcanoes follow predictable patterns. By recording gas emissions, minor tremors, and ground deformation, she predicted the Great Caldera Eruption 14 days in advance, saving 40,000 lives. Volcanology was born.',
                    impact: 'Scientific prediction replaced religious fatalism. Eruption forecasting evolved from "maybe" to "probably within 48 hours"—enough warning to evacuate. Economic losses dropped 90% as people moved livestock, grain stores, and valuables before ash fall.',
                    volcanoConnection: 'Modern volcanology uses the same principles Plinia discovered: inflation before eruption, SO2 gas increases, harmonic tremors indicating magma movement. Your world\'s Seismic Academy maintains 400 monitoring stations, predicting eruptions with 95% accuracy 72 hours in advance.'
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
                historicalContext: {
                    era: 'Space Age',
                    year: '~1960 CE',
                    inventor: 'Konstantin Tsiolkovsky (theory), Robert Goddard (practice), Wernher von Braun (power)',
                    description: 'Rockets operate on Newton\'s Third Law—ejecting mass downward propels the rocket upward. Chemical rockets burn fuel and oxidizer, creating hot gas expelled at 4,500 m/s. Reaching space requires 7,800 m/s—the tyranny of the rocket equation means 90% of launch mass is fuel. Von Braun\'s Saturn V—humanity\'s mightiest rocket—lifted 45 tons to the Moon.',
                    impact: 'Rocketry enabled space exploration—satellites, space stations, lunar landings, Mars rovers. Satellites revolutionized communication, weather forecasting, GPS navigation, and Earth observation. Space became the ultimate strategic high ground—spy satellites, missile warning, potential weapons platforms. Tourism? Not yet—rockets remain too expensive and dangerous.',
                    volcanoConnection: 'Volcanic rocket fuel: hydrogen and oxygen separated from geothermal steam using electrical hydrolysis—virtually free propellant. Your world launched satellites for 1/10th Earth costs. Volcanic launch sites provided natural isolation and heat-resistant infrastructure. However, volcanic eruptions occasionally grounded space programs for months.'
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
                historicalContext: {
                    era: 'Final Era',
                    year: 'Present Day',
                    inventor: 'You - Last Hope of Your Civilization',
                    description: 'The Exodus Protocol represents your civilization\'s culmination: knowledge to build generation ships, resources to construct fleets, organization to evacuate millions, and courage to abandon the only world your species has ever known. Seven thousand years from stone tools to starships. Ten thousand generations from caves to cosmos. Everything—art, science, history, culture—must be preserved digitally, physically impossible to save.',
                    impact: 'Exodus Protocol achieves the ultimate victory: species survival. Not everyone can leave—resources insufficient for 8 billion. Who goes? How chosen? What of those left behind? These questions haunt you. Success means survival. Success also means becoming refugees, wandering through void, seeking new world that may not exist. Is this victory? Or merely not-yet-defeat?',
                    volcanoConnection: 'Your volcanic homeworld taught harsh lessons: nothing lasts forever, safety is temporary, nature ultimately wins. But you learned, adapted, survived—for now. The planet will explode, collapse, or freeze. That\'s physics, not pessimism. Exodus Protocol isn\'t giving up—it\'s refusing to surrender. You take the planet with you: culture, knowledge, DNA samples, geological cores. Your world dies, but your civilization endures among the stars. That is the Protocol. That is hope.'
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
        if (!tech.historicalContext) return null;

        return {
            name: tech.name,
            era: tech.historicalContext.era,
            year: tech.historicalContext.year,
            inventor: tech.historicalContext.inventor,
            description: tech.historicalContext.description,
            impact: tech.historicalContext.impact,
            volcanoConnection: tech.historicalContext.volcanoConnection
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