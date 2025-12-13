class BuildingInfo {
    static getAllBuildingData() {
        return {
            hut: {
                name: 'Hut',
                cost: { iron: 5, copper: 3 },
                desc: 'Basic shelter (Pop: 5, Food: +1)',
                age: 'Stone'
            },
            campfire: {
                name: 'Campfire',
                cost: { copper: 2 },
                desc: 'Warmth and light (+1 Science)',
                age: 'Stone'
            },
            tent: {
                name: 'Tent',
                cost: { copper: 3, coal: 2 },
                desc: 'Temporary shelter (+2 Science)',
                age: 'Stone'
            },
            woodpile: {
                name: 'Woodpile',
                cost: { copper: 3 },
                desc: 'Stored fuel and materials',
                age: 'Stone'
            },
            farm: {
                name: 'Farm',
                cost: { iron: 8, copper: 5 },
                desc: 'Grows food (+3 Food)',
                age: 'Stone'
            },
            warehouse: {
                name: 'Warehouse',
                cost: { iron: 15, copper: 10, coal: 5 },
                desc: 'Stores resources (+200 capacity)',
                age: 'Stone'
            },

            settlement: {
                name: 'Settlement',
                cost: { iron: 25, copper: 15, coal: 10 },
                desc: 'Small community (Pop: 15, Food: +3)',
                age: 'Bronze'
            },
            barracks: {
                name: 'Barracks',
                cost: { iron: 30, copper: 20, coal: 15 },
                desc: 'Train military units',
                age: 'Bronze'
            },
            granary: {
                name: 'Granary',
                cost: { iron: 20, copper: 12, coal: 8 },
                desc: 'Stores extra food (+100 capacity)',
                age: 'Bronze'
            },
            quarry: {
                name: 'Quarry',
                cost: { iron: 25, copper: 15, coal: 10 },
                desc: 'Extract stone and minerals',
                age: 'Bronze'
            },
            monument: {
                name: 'Monument',
                cost: { iron: 30, copper: 18, gold: 5 },
                desc: 'Cultural landmark',
                age: 'Bronze'
            },
            school: {
                name: 'School',
                cost: { iron: 25, copper: 15, coal: 10 },
                desc: 'Educates children',
                age: 'Bronze'
            },
            shrine: {
                name: 'Shrine',
                cost: { iron: 15, copper: 10, gold: 2 },
                desc: 'Sacred place (+3 Science)',
                age: 'Bronze'
            },
            greenhouse: {
                name: 'Greenhouse',
                cost: { iron: 30, copper: 20, silicon: 10 },
                desc: 'Protected farming (+5 Food)',
                age: 'Bronze'
            },

            township: {
                name: 'Township',
                cost: { iron: 50, copper: 30, coal: 20 },
                desc: 'Growing town (Pop: 25, Food: +5)',
                age: 'Iron'
            },
            temple: {
                name: 'Temple',
                cost: { iron: 40, copper: 25, gold: 8 },
                desc: 'Spiritual center (+5 Science)',
                age: 'Iron'
            },
            forge: {
                name: 'Forge',
                cost: { iron: 45, copper: 30, coal: 20 },
                desc: 'Craft tools and weapons',
                age: 'Iron'
            },
            workshop: {
                name: 'Workshop',
                cost: { iron: 35, copper: 22, coal: 18 },
                desc: 'Advanced crafting',
                age: 'Iron'
            },
            aqueduct: {
                name: 'Aqueduct',
                cost: { iron: 50, copper: 30, coal: 20 },
                desc: 'Water distribution (+2 Food)',
                age: 'Iron'
            },
            watchtower: {
                name: 'Watchtower',
                cost: { iron: 30, copper: 18, coal: 12 },
                desc: 'Early warning system',
                age: 'Iron'
            },

            feudaltown: {
                name: 'Feudal Town',
                cost: { iron: 80, copper: 50, coal: 35, gold: 15 },
                desc: 'Medieval center (Pop: 40, Food: +8)',
                age: 'Medieval'
            },
            market: {
                name: 'Market',
                cost: { iron: 50, copper: 30, gold: 10 },
                desc: 'Trade center',
                age: 'Medieval'
            },
            castle: {
                name: 'Castle',
                cost: { iron: 100, copper: 60, coal: 40 },
                desc: 'Fortified stronghold',
                age: 'Medieval'
            },
            library: {
                name: 'Library',
                cost: { iron: 60, copper: 35, silicon: 15 },
                desc: 'Knowledge repository (+8 Science)',
                age: 'Medieval'
            },
            cathedral: {
                name: 'Cathedral',
                cost: { iron: 90, copper: 55, gold: 25, silver: 10 },
                desc: 'Grand religious structure',
                age: 'Medieval'
            },
            townhall: {
                name: 'Town Hall',
                cost: { iron: 85, copper: 50, coal: 35, gold: 15 },
                desc: 'Administrative center',
                age: 'Medieval'
            },
            arena: {
                name: 'Arena',
                cost: { iron: 95, copper: 55, coal: 40 },
                desc: 'Entertainment venue',
                age: 'Medieval'
            },
            hospital: {
                name: 'Hospital',
                cost: { iron: 70, copper: 40, coal: 30, silver: 8 },
                desc: 'Medical facility',
                age: 'Medieval'
            },
            scriptorium: {
                name: 'Scriptorium',
                cost: { iron: 55, copper: 32, coal: 25, gold: 12 },
                desc: 'Knowledge copying (+7 Science)',
                age: 'Medieval'
            },

            citystate: {
                name: 'City-State',
                cost: { iron: 150, copper: 90, coal: 60, gold: 30, silver: 15 },
                desc: 'Independent city (Pop: 60, Food: +12)',
                age: 'Renaissance'
            },
            university: {
                name: 'University',
                cost: { iron: 100, copper: 60, silicon: 35, gold: 20 },
                desc: 'Advanced research (+12 Science)',
                age: 'Renaissance'
            },
            academy: {
                name: 'Academy',
                cost: { iron: 110, copper: 65, silicon: 40, gold: 22 },
                desc: 'Educational institution',
                age: 'Renaissance'
            },
            theater: {
                name: 'Theater',
                cost: { iron: 80, copper: 45, gold: 18 },
                desc: 'Cultural performance hall',
                age: 'Renaissance'
            },
            mansion: {
                name: 'Mansion',
                cost: { iron: 130, copper: 75, gold: 35, silver: 20 },
                desc: 'Luxurious housing',
                age: 'Renaissance'
            },

            factorytown: {
                name: 'Factory Town',
                cost: { iron: 250, copper: 150, coal: 100, silicon: 50 },
                desc: 'Industrial hub (Pop: 80, Food: +15)',
                age: 'Industrial'
            },
            mineshaft: {
                name: 'Mineshaft',
                cost: { iron: 120, copper: 80, coal: 60, silicon: 30 },
                desc: 'Deep mining extracts rare minerals',
                age: 'Industrial'
            },
            ironworks: {
                name: 'Ironworks',
                cost: { iron: 180, copper: 100, coal: 80 },
                desc: 'Mass production facility',
                age: 'Industrial'
            },
            trainstation: {
                name: 'Train Station',
                cost: { iron: 200, copper: 120, coal: 90, silicon: 40 },
                desc: 'Rail transport hub',
                age: 'Industrial'
            },
            coalplant: {
                name: 'Coal Plant',
                cost: { iron: 300, copper: 180, coal: 150, silicon: 60 },
                desc: 'Early power generation',
                age: 'Industrial'
            },
            hydroponicfarm: {
                name: 'Hydroponic Farm',
                cost: { iron: 90, copper: 55, silicon: 40, aluminum: 25 },
                desc: 'Water-based farming (+8 Food)',
                age: 'Industrial'
            },

            steamcity: {
                name: 'Steamworks City',
                cost: { iron: 400, copper: 240, coal: 160, silicon: 80, gold: 50 },
                desc: 'Steam-powered metropolis (Pop: 120, Food: +20)',
                age: 'Early Modern'
            },
            steamfactory: {
                name: 'Steam Factory',
                cost: { iron: 280, copper: 170, coal: 130, silicon: 60 },
                desc: 'Advanced manufacturing',
                age: 'Early Modern'
            },
            clocktower: {
                name: 'Clock Tower',
                cost: { iron: 120, copper: 70, gold: 30, silver: 18 },
                desc: 'Time coordination',
                age: 'Early Modern'
            },
            gasworks: {
                name: 'Gasworks',
                cost: { iron: 250, copper: 150, coal: 120, oil: 50 },
                desc: 'Gas lighting infrastructure',
                age: 'Early Modern'
            },

            metropolis: {
                name: 'Metropolis',
                cost: { iron: 550, copper: 330, coal: 220, silicon: 110, gold: 70 },
                desc: 'Massive urban center (Pop: 180, Food: +30)',
                age: 'Victorian'
            },
            parliament: {
                name: 'Parliament',
                cost: { iron: 320, copper: 190, gold: 55, silver: 35 },
                desc: 'Governing body',
                age: 'Victorian'
            },
            gaslamp: {
                name: 'Gas Lamp',
                cost: { iron: 25, copper: 15, oil: 12 },
                desc: 'Street illumination',
                age: 'Victorian'
            },
            telegraph: {
                name: 'Telegraph',
                cost: { iron: 110, copper: 65, silicon: 40 },
                desc: 'Long-distance communication',
                age: 'Victorian'
            },

            powercity: {
                name: 'Power City',
                cost: { iron: 750, copper: 450, silicon: 300, uranium: 35, gold: 100 },
                desc: 'Electrified civilization (Pop: 250, Food: +40)',
                age: 'Modernization'
            },
            powerplant: {
                name: 'Power Plant',
                cost: { iron: 550, copper: 330, silicon: 200, uranium: 70 },
                desc: 'Electrical generation',
                age: 'Modernization'
            },
            skyscraper: {
                name: 'Skyscraper',
                cost: { iron: 450, copper: 270, silicon: 180, aluminum: 90 },
                desc: 'Vertical housing',
                age: 'Modernization'
            },
            subwaystation: {
                name: 'Subway Station',
                cost: { iron: 380, copper: 230, silicon: 150, aluminum: 70 },
                desc: 'Underground transit',
                age: 'Modernization'
            },
            verticalfarm: {
                name: 'Vertical Farm',
                cost: { iron: 200, copper: 120, silicon: 90, aluminum: 60, titanium: 30 },
                desc: 'Multi-level farming (+15 Food)',
                age: 'Modernization'
            },

            technopolis: {
                name: 'Technopolis',
                cost: { iron: 1100, copper: 660, silicon: 500, uranium: 80, platinum: 60 },
                desc: 'High-tech paradise (Pop: 350, Food: +60)',
                age: 'Digital'
            },
            datacenter: {
                name: 'Data Center',
                cost: { iron: 750, copper: 450, silicon: 380, gold: 80, platinum: 40 },
                desc: 'Information processing',
                age: 'Digital'
            },
            cybercafe: {
                name: 'Cyber Cafe',
                cost: { iron: 220, copper: 130, silicon: 90 },
                desc: 'Digital gathering place',
                age: 'Digital'
            },
            serverbank: {
                name: 'Server Bank',
                cost: { iron: 900, copper: 540, silicon: 450, gold: 100, platinum: 50 },
                desc: 'Massive data storage',
                age: 'Digital'
            },
            bioreactor: {
                name: 'Bioreactor',
                cost: { iron: 380, copper: 230, silicon: 180, uranium: 40, platinum: 25 },
                desc: 'Bacterial food production (+25 Food)',
                age: 'Digital'
            },

            megacity: {
                name: 'Megacity',
                cost: { iron: 1500, copper: 900, silicon: 700, uranium: 120, platinum: 90, gold: 150 },
                desc: 'Planetary capital (Pop: 500, Food: +100)',
                age: 'Space'
            },
            observatory: {
                name: 'Observatory',
                cost: { iron: 400, copper: 240, silicon: 180, rareMinerals: 50 },
                desc: 'Study the stars (+25 Science)',
                age: 'Space'
            },
            spaceport: {
                name: 'Spaceport',
                cost: { iron: 1200, copper: 720, silicon: 550, titanium: 250, uranium: 150 },
                desc: 'Launch facility',
                age: 'Space'
            },
            laboratory: {
                name: 'Laboratory',
                cost: { iron: 800, copper: 480, silicon: 380, platinum: 65, uranium: 80 },
                desc: 'Scientific research',
                age: 'Space'
            },
            megafactory: {
                name: 'Megafactory',
                cost: { iron: 1400, copper: 840, silicon: 600, aluminum: 350, titanium: 180 },
                desc: 'Mass production facility',
                age: 'Space'
            },
            fusionreactor: {
                name: 'Fusion Reactor',
                cost: { iron: 1600, copper: 960, silicon: 750, uranium: 250, platinum: 120 },
                desc: 'Clean infinite energy',
                age: 'Space'
            },
            orbitalring: {
                name: 'Orbital Ring',
                cost: { iron: 2400, copper: 1440, silicon: 1000, titanium: 450, platinum: 180 },
                desc: 'Space elevator system',
                age: 'Space'
            },
            quantumlab: {
                name: 'Quantum Lab',
                cost: { iron: 2000, copper: 1200, silicon: 950, uranium: 350, neodymium: 130 },
                desc: 'Reality research',
                age: 'Space'
            },
            synthesizer: {
                name: 'Food Synthesizer',
                cost: { iron: 650, copper: 390, silicon: 320, platinum: 70, neodymium: 45 },
                desc: 'Molecular food creation (+50 Food)',
                age: 'Space'
            },

            triworldhub: {
                name: 'Triworld Hub',
                cost: { iron: 2500, copper: 1500, silicon: 1150, titanium: 550, platinum: 220, gold: 250 },
                desc: 'Multi-planet nexus (Pop: 750, Food: +150)',
                age: 'Multi-World'
            },
            warpgate: {
                name: 'Warp Gate',
                cost: { iron: 3300, copper: 2000, silicon: 1500, uranium: 450, neodymium: 280 },
                desc: 'Instant planet travel',
                age: 'Multi-World'
            },
            terraformer: {
                name: 'Terraformer',
                cost: { iron: 2900, copper: 1750, silicon: 1250, titanium: 650, platinum: 270 },
                desc: 'Planet reshaping device',
                age: 'Multi-World'
            },
            colonyship: {
                name: 'Colony Ship',
                cost: { iron: 4200, copper: 2500, silicon: 2000, titanium: 950, uranium: 450 },
                desc: 'Mobile civilization',
                age: 'Multi-World'
            },

            haven: {
                name: 'Haven',
                cost: { iron: 4200, copper: 2500, silicon: 1900, titanium: 950, platinum: 450, gold: 450 },
                desc: 'Galactic sanctuary (Pop: 1000, Food: +250)',
                age: 'Zenith'
            },
            dysonswarm: {
                name: 'Dyson Swarm',
                cost: { iron: 8500, copper: 5100, silicon: 3500, titanium: 1900, uranium: 950 },
                desc: 'Star energy harvesting',
                age: 'Zenith'
            },
            matrixcore: {
                name: 'Matrix Core',
                cost: { silicon: 4500, platinum: 950, neodymium: 750, uranium: 550 },
                desc: 'Reality simulation',
                age: 'Zenith'
            },
            ascensiongate: {
                name: 'Ascension Gate',
                cost: { iron: 6800, silicon: 3800, titanium: 1900, uranium: 1400, platinum: 950, neodymium: 480 },
                desc: 'Transcendence portal',
                age: 'Zenith'
            },
            planetary_orbital_ring: {
                name: 'Planetary Orbital Ring',
                cost: { iron: 5000, copper: 3000, silicon: 2000, titanium: 1500, platinum: 500, neodymium: 300 },
                desc: 'Massive space habitat (+2000 Pop)',
                age: 'Space'
            },
            planetary_defense_grid: {
                name: 'Planetary Defense Grid',
                cost: { iron: 4000, copper: 2500, silicon: 1800, titanium: 1200, uranium: 400, platinum: 350 },
                desc: 'Shields against asteroids & ships',
                age: 'Space'
            },
            orbital_spaceport: {
                name: 'Orbital Spaceport',
                cost: { iron: 3500, copper: 2000, silicon: 1500, titanium: 1000, platinum: 300, aluminum: 800 },
                desc: 'Launch platform (+50 Science)',
                age: 'Space'
            },
            exodus_shipyard: {
                name: 'Exodus Shipyard',
                cost: { iron: 5000, copper: 3000, silicon: 2500, titanium: 1500, uranium: 800 },
                desc: 'Orbital construction facility for generation ships',
                age: 'Space'
            }
        };
    }

    static formatCost(costs) {
        return Object.entries(costs)
            .map(([resource, amount]) => `${amount} ${resource.charAt(0).toUpperCase() + resource.slice(1)}`)
            .join(', ');
    }

    static canAfford(costs, playerResources) {
        for (const [resource, amount] of Object.entries(costs)) {
            if ((playerResources[resource] || 0) < amount) {
                return false;
            }
        }
        return true;
    }
}