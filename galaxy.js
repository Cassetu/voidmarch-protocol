class Galaxy {
    constructor(game) {
        this.game = game;
        this.planets = [];
        this.currentPlanetIndex = 0;
        this.unlockedPlanets = 1;
        this.planetInstances = new Map();
        this.visitedPlanets = new Set();
        this.generateGalaxy();
    }

    generateGalaxy() {
        this.planets.push({
            id: 0,
            name: 'Volcanic Homeworld',
            type: 'volcanic',
            conquered: true,
            difficulty: 1,
            sentinelStrength: 0,
            biome: 'volcanic',
            resources: 0,
            scienceBonus: 0
        });

        this.planetInstances.set(0, this.game.world.createVolcanicWorld());

        const planetTypes = [
            { type: 'ice', biomes: ['frozen', 'tundra'], sentinels: 'Cryo-Sentinels' },
            { type: 'desert', biomes: ['sand', 'dunes', 'oasis'], sentinels: 'Solar-Sentinels' },
            { type: 'ocean', biomes: ['water', 'reef', 'abyss'], sentinels: 'Hydro-Sentinels' },
            { type: 'jungle', biomes: ['forest', 'swamp', 'canopy'], sentinels: 'Bio-Sentinels' },
            { type: 'crystal', biomes: ['crystal', 'mineral', 'geode'], sentinels: 'Resonance-Sentinels' },
            { type: 'toxic', biomes: ['poison', 'acid', 'miasma'], sentinels: 'Chem-Sentinels' },
            { type: 'metal', biomes: ['iron', 'steel', 'alloy'], sentinels: 'Forge-Sentinels' },
            { type: 'void', biomes: ['vacuum', 'antimatter', 'dark'], sentinels: 'Void-Sentinels' }
        ];

        for (let i = 1; i <= 8; i++) {
            const planetType = planetTypes[i - 1];
            const biome = planetType.biomes[Math.floor(Math.random() * planetType.biomes.length)];

            this.planets.push({
                id: i,
                name: this.generatePlanetName(planetType.type),
                type: planetType.type,
                conquered: false,
                difficulty: i,
                sentinelStrength: i * 10,
                sentinelType: planetType.sentinels,
                biome: biome,
                resources: i * 1000,
                scienceBonus: i * 10,
                defenseGrid: {
                    nodes: this.generateDefenseNodes(i),
                    integrity: 100
                },
                hackingRequired: i * 20
            });
        }
    }

    generatePlanetName(type) {
        const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        const suffixes = ['Prime', 'Minor', 'Secundus', 'Tertius', 'IV', 'V', 'VI', 'VII'];
        return `${type.charAt(0).toUpperCase() + type.slice(1)}-${prefixes[Math.floor(Math.random() * prefixes.length)]}-${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    }

    generateDefenseNodes(difficulty) {
        const nodes = [];
        const nodeCount = 3 + difficulty;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                id: i,
                type: this.getRandomNodeType(),
                health: 100,
                active: true,
                connections: []
            });
        }

        for (let i = 0; i < nodes.length; i++) {
            const connectionCount = Math.min(2 + Math.floor(difficulty / 2), nodes.length - 1);
            while (nodes[i].connections.length < connectionCount) {
                const targetId = Math.floor(Math.random() * nodes.length);
                if (targetId !== i && !nodes[i].connections.includes(targetId)) {
                    nodes[i].connections.push(targetId);
                }
            }
        }

        return nodes;
    }

    getRandomNodeType() {
        const types = ['firewall', 'encryption', 'ai_core', 'sensor_array', 'power_relay'];
        return types[Math.floor(Math.random() * types.length)];
    }

    canAccessPlanet(planetId) {
        if (planetId === 0) return true;
        if (planetId > this.unlockedPlanets) return false;
        return this.planets[planetId - 1].conquered;
    }

    travelToPlanet(planetId) {
        if (!this.canAccessPlanet(planetId)) {
            return { success: false, message: 'Planet not accessible yet' };
        }

        if (planetId === this.currentPlanetIndex) {
            return { success: false, message: 'Already on this planet' };
        }

        this.currentPlanetIndex = planetId;
        const planet = this.planets[planetId];

        let planetInstance = this.planetInstances.get(planetId);

        if (!planetInstance) {
            planetInstance = this.createPlanetInstance(planet);
            this.planetInstances.set(planetId, planetInstance);
        }

        const isFirstVisit = !this.visitedPlanets.has(planetId);
        if (!planet.conquered && planetId !== 0) {
            this.visitedPlanets.add(planetId);
        }

        if (planet.conquered || planetId === 0) {
            return {
                success: true,
                planet: planetInstance,
                mode: 'building',
                isFirstVisit: false
            };
        } else {
            return {
                success: true,
                planet: planetInstance,
                mode: 'conquest',
                isFirstVisit: isFirstVisit
            };
        }
    }

    createPlanetInstance(planetData) {
        let worldPlanet;

        if (planetData.type === 'volcanic') {
            worldPlanet = this.game.world.createVolcanicWorld();
        } else if (planetData.type === 'ice') {
            worldPlanet = this.createIceWorld();
        } else if (planetData.type === 'desert') {
            worldPlanet = this.createDesertWorld();
        } else if (planetData.type === 'ocean') {
            worldPlanet = this.createOceanWorld();
        } else if (planetData.type === 'jungle') {
            worldPlanet = this.createJungleWorld();
        } else {
            worldPlanet = this.createGenericWorld(planetData.type, planetData.biome);
        }

        return worldPlanet;
    }

    createIceWorld() {
        const planet = new Planet('Ice World', 50, 40, 'ice');
        planet.tiles.forEach(row => {
            row.forEach(tile => {
                const rand = Math.random();
                if (rand > 0.7) tile.type = 'ice';
                else if (rand > 0.5) tile.type = 'frozen';
                else tile.type = 'tundra';
                tile.yields = { food: 0, production: 1, science: 2 };
            });
        });
        return planet;
    }

    createDesertWorld() {
        const planet = new Planet('Desert World', 60, 45, 'desert');
        planet.tiles.forEach(row => {
            row.forEach(tile => {
                const rand = Math.random();
                if (rand > 0.6) tile.type = 'sand';
                else if (rand > 0.3) tile.type = 'dunes';
                else tile.type = 'oasis';
                tile.yields = { food: 1, production: 2, science: 1 };
            });
        });
        return planet;
    }

    createOceanWorld() {
        const planet = new Planet('Ocean World', 55, 45, 'ocean');
        planet.tiles.forEach(row => {
            row.forEach(tile => {
                const rand = Math.random();
                if (rand > 0.8) tile.type = 'island';
                else if (rand > 0.5) tile.type = 'reef';
                else tile.type = 'deepwater';
                tile.yields = { food: 3, production: 0, science: 2 };
            });
        });
        return planet;
    }

    createJungleWorld() {
        const planet = new Planet('Jungle World', 50, 40, 'jungle');
        planet.tiles.forEach(row => {
            row.forEach(tile => {
                const rand = Math.random();
                if (rand > 0.6) tile.type = 'jungle';
                else if (rand > 0.3) tile.type = 'swamp';
                else tile.type = 'canopy';
                tile.yields = { food: 2, production: 1, science: 3 };
            });
        });
        return planet;
    }

    createGenericWorld(type, biome) {
        const planet = new Planet(`${type} World`, 50, 40, type);
        planet.tiles.forEach(row => {
            row.forEach(tile => {
                tile.type = biome;
                tile.yields = {
                    food: Math.floor(Math.random() * 3),
                    production: Math.floor(Math.random() * 3),
                    science: Math.floor(Math.random() * 3)
                };
            });
        });

        this.generateLakes(planet, 4 + Math.floor(Math.random() * 4));

        return planet;
    }

    generateLakes(planet, count) {
        for (let i = 0; i < count; i++) {
            const centerX = 5 + Math.floor(Math.random() * (planet.width - 10));
            const centerY = 5 + Math.floor(Math.random() * (planet.height - 10));
            const radiusX = 3 + Math.floor(Math.random() * 5);
            const radiusY = 2 + Math.floor(Math.random() * 4);
            const rotation = Math.random() * Math.PI;

            const noiseOffsets = [];
            for (let n = 0; n < 16; n++) {
                noiseOffsets.push((Math.random() - 0.5) * 0.6);
            }

            for (let y = centerY - radiusY - 3; y <= centerY + radiusY + 3; y++) {
                for (let x = centerX - radiusX - 3; x <= centerX + radiusX + 3; x++) {
                    if (x < 0 || x >= planet.width || y < 0 || y >= planet.height) continue;

                    const dx = x - centerX;
                    const dy = y - centerY;
                    const rotatedX = dx * Math.cos(rotation) - dy * Math.sin(rotation);
                    const rotatedY = dx * Math.sin(rotation) + dy * Math.cos(rotation);

                    const angle = Math.atan2(dy, dx);
                    const noiseIndex = Math.floor(((angle + Math.PI) / (Math.PI * 2)) * 16) % 16;
                    const noise = noiseOffsets[noiseIndex];

                    const normalizedDist = (rotatedX * rotatedX) / (radiusX * radiusX) + (rotatedY * rotatedY) / (radiusY * radiusY);
                    const noisyDist = normalizedDist + noise;

                    if (noisyDist <= 1) {
                        planet.tiles[y][x].type = 'water';
                        planet.tiles[y][x].yields = { food: 0, production: 0, science: 0 };
                    } else if (noisyDist <= 1.4) {
                        if (planet.tiles[y][x].type !== 'water') {
                            planet.tiles[y][x].type = 'sand';
                            planet.tiles[y][x].yields = { food: 1, production: 1, science: 0 };
                        }
                    }
                }
            }
        }
    }

    conqueredPlanet(planetId) {
        const planet = this.planets[planetId];
        planet.conquered = true;

        if (planetId === this.unlockedPlanets && planetId < this.planets.length - 1) {
            this.unlockedPlanets++;
        }

        this.game.player.addResources(planet.resources);
        this.game.player.scienceBonus += planet.scienceBonus;
    }
}