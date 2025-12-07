class Ecosystem {
    constructor(planet, game) {
        this.planet = planet;
        this.game = game;
        this.creatures = {
            ashworms: [],
            magmabeetles: [],
            emberbirds: []
        };
        this.populationTargets = {
            ashworms: 30,
            magmabeetles: 15,
            emberbirds: 8
        };
        this.populationMin = {
            ashworms: 10,
            magmabeetles: 5,
            emberbirds: 3
        };
        this.populationMax = {
            ashworms: 60,
            magmabeetles: 35,
            emberbirds: 20
        };
        this.ecosystemHealth = 100;
        this.lastMigrationTurn = 0;
        this.turnsSinceLastBalance = 0;
        this.spawnInitialCreatures();
    }

    spawnInitialCreatures() {
        for (let i = 0; i < this.populationTargets.ashworms; i++) {
            this.spawnCreature('ashworms');
        }
        for (let i = 0; i < this.populationTargets.magmabeetles; i++) {
            this.spawnCreature('magmabeetles');
        }
        for (let i = 0; i < this.populationTargets.emberbirds; i++) {
            this.spawnCreature('emberbirds');
        }
    }

    spawnCreature(type) {
        let validTile = null;
        let attempts = 0;

        while (!validTile && attempts < 50) {
            const x = Math.floor(Math.random() * this.planet.width);
            const y = Math.floor(Math.random() * this.planet.height);
            const tile = this.planet.tiles[y][x];

            if (type === 'ashworms' && (tile.type === 'ash' || tile.type === 'rock' || tile.type === 'darksoil')) {
                validTile = { x, y };
            } else if (type === 'magmabeetles' && tile.type !== 'water' && tile.type !== 'void') {
                validTile = { x, y };
            } else if (type === 'emberbirds' && tile.type !== 'water' && tile.type !== 'void') {
                validTile = { x, y };
            }
            attempts++;
        }

        if (validTile) {
            this.creatures[type].push({
                x: validTile.x,
                y: validTile.y,
                age: 0,
                energy: 100
            });
        }
    }

    hasLavaNearby(x, y) {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                    if (this.planet.tiles[ny][nx].type === 'lava') {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    update() {
        this.updateAshworms();
        this.updateMagmaBeetles();
        this.updateEmberbirds();
        this.autoBalance();
        this.calculateEcosystemHealth();
        this.applyEcosystemEffects();
        this.checkForEvents();
        this.turnsSinceLastBalance++;
    }

    autoBalance() {
        if (this.turnsSinceLastBalance < 5) return;

        if (this.creatures.ashworms.length < this.populationMin.ashworms) {
            const toSpawn = this.populationMin.ashworms - this.creatures.ashworms.length;
            for (let i = 0; i < toSpawn; i++) {
                this.spawnCreature('ashworms');
            }
            this.game.log('🌱 Ashworm population recovering naturally...');
            this.turnsSinceLastBalance = 0;
        }

        if (this.creatures.magmabeetles.length < this.populationMin.magmabeetles) {
            const toSpawn = this.populationMin.magmabeetles - this.creatures.magmabeetles.length;
            for (let i = 0; i < toSpawn; i++) {
                this.spawnCreature('magmabeetles');
            }
            this.game.log('🔥 Magma Beetle population recovering naturally...');
            this.turnsSinceLastBalance = 0;
        }

        if (this.creatures.emberbirds.length < this.populationMin.emberbirds) {
            const toSpawn = this.populationMin.emberbirds - this.creatures.emberbirds.length;
            for (let i = 0; i < toSpawn; i++) {
                this.spawnCreature('emberbirds');
            }
            this.game.log('🐦 Emberbird population recovering naturally...');
            this.turnsSinceLastBalance = 0;
        }

        if (this.creatures.ashworms.length > this.populationMax.ashworms) {
            const toRemove = this.creatures.ashworms.length - this.populationMax.ashworms;
            this.creatures.ashworms.splice(0, toRemove);
        }

        if (this.creatures.magmabeetles.length > this.populationMax.magmabeetles) {
            const toRemove = this.creatures.magmabeetles.length - this.populationMax.magmabeetles;
            this.creatures.magmabeetles.splice(0, toRemove);
        }

        if (this.creatures.emberbirds.length > this.populationMax.emberbirds) {
            const toRemove = this.creatures.emberbirds.length - this.populationMax.emberbirds;
            this.creatures.emberbirds.splice(0, toRemove);
        }
    }

    updateAshworms() {
        const ashworms = this.creatures.ashworms;

        for (let i = ashworms.length - 1; i >= 0; i--) {
            const worm = ashworms[i];
            worm.age++;
            worm.energy -= 1;

            const tile = this.planet.tiles[worm.y][worm.x];

            if (tile.type === 'ash' || tile.type === 'rock') {
                worm.energy = Math.min(100, worm.energy + 6);
            } else if (tile.type === 'darksoil') {
                worm.energy = Math.min(100, worm.energy + 3);
            }

            if (tile.type === 'ash' || tile.type === 'rock') {
                if (Math.random() < 0.1 && !tile.enriched) {
                    tile.enriched = 'ashworm';
                    tile.yields.food += 2;
                    tile.yields.production += 1;
                }
            }

            worm.energy = Math.max(30, worm.energy);

            if (worm.age > 200) {
                ashworms.splice(i, 1);
                continue;
            }

            if (Math.random() < 0.02) {
                this.moveCreature(worm, 'ashworms');
            }

            const currentPop = ashworms.length;
            const targetPop = this.populationTargets.ashworms;
            const breedChance = currentPop < targetPop ? 0.25 : (currentPop < targetPop * 1.5 ? 0.1 : 0.02);

            if (worm.energy > 60 && Math.random() < breedChance && currentPop < this.populationMax.ashworms) {
                this.spawnCreature('ashworms');
                worm.energy -= 20;
            }
        }
    }

    updateMagmaBeetles() {
        const beetles = this.creatures.magmabeetles;
        const ashworms = this.creatures.ashworms;

        for (let i = beetles.length - 1; i >= 0; i--) {
            const beetle = beetles[i];
            beetle.age++;
            beetle.energy -= 2;

            if (this.hasLavaNearby(beetle.x, beetle.y)) {
                beetle.energy = Math.min(100, beetle.energy + 3);
            }

            const nearbyWorms = ashworms.filter(w =>
                Math.abs(w.x - beetle.x) <= 2 && Math.abs(w.y - beetle.y) <= 2
            );

            if (nearbyWorms.length > 0 && Math.random() < 0.08 && beetle.energy < 70) {
                const worm = nearbyWorms[Math.floor(Math.random() * Math.min(nearbyWorms.length, 3))];
                const wormIndex = ashworms.indexOf(worm);
                if (wormIndex !== -1 && ashworms.length > this.populationMin.ashworms + 5) {
                    ashworms.splice(wormIndex, 1);
                    beetle.energy = Math.min(100, beetle.energy + 25);
                }
            }

            beetle.energy = Math.max(25, beetle.energy);

            if (beetle.age > 250) {
                const tile = this.planet.tiles[beetle.y][beetle.x];
                if (Math.random() < 0.3 && !tile.hasGeothermal) {
                    tile.hasGeothermal = true;
                    tile.resourceAmount = 100;
                    tile.yields.production += 3;
                    tile.yields.science += 2;
                }
                beetles.splice(i, 1);
                continue;
            }

            if (Math.random() < 0.04) {
                this.moveCreature(beetle, 'magmabeetles');
            }

            const currentPop = beetles.length;
            const targetPop = this.populationTargets.magmabeetles;
            const breedChance = currentPop < targetPop ? 0.2 : (currentPop < targetPop * 1.5 ? 0.08 : 0.01);

            if (beetle.energy > 65 && Math.random() < breedChance && currentPop < this.populationMax.magmabeetles) {
                this.spawnCreature('magmabeetles');
                beetle.energy -= 20;
            }
        }
    }

    updateEmberbirds() {
        const birds = this.creatures.emberbirds;
        const beetles = this.creatures.magmabeetles;

        for (let i = birds.length - 1; i >= 0; i--) {
            const bird = birds[i];
            bird.age++;
            bird.energy -= 2;

            const nearbyBeetles = beetles.filter(b =>
                Math.abs(b.x - bird.x) <= 3 && Math.abs(b.y - bird.y) <= 3
            );

            if (nearbyBeetles.length > 0 && Math.random() < 0.06 && bird.energy < 70) {
                const beetle = nearbyBeetles[Math.floor(Math.random() * Math.min(nearbyBeetles.length, 2))];
                const beetleIndex = beetles.indexOf(beetle);
                if (beetleIndex !== -1 && beetles.length > this.populationMin.magmabeetles + 3) {
                    beetles.splice(beetleIndex, 1);
                    bird.energy = Math.min(100, bird.energy + 30);
                }
            }

            if (Math.random() < 0.08 && bird.energy > 40) {
                const tile = this.planet.tiles[bird.y][bird.x];
                if (tile.type === 'darksoil' && !tile.volcanicGarden) {
                    tile.volcanicGarden = true;
                    tile.yields.food += 4;
                    tile.yields.science += 1;
                    bird.energy -= 8;
                }
            }

            bird.energy = Math.max(20, bird.energy);

            if (bird.age > 300) {
                birds.splice(i, 1);
                continue;
            }

            if (Math.random() < 0.08) {
                this.moveCreature(bird, 'emberbirds');
            }

            const currentPop = birds.length;
            const targetPop = this.populationTargets.emberbirds;
            const breedChance = currentPop < targetPop ? 0.15 : (currentPop < targetPop * 1.5 ? 0.05 : 0.01);

            if (bird.energy > 60 && Math.random() < breedChance && currentPop < this.populationMax.emberbirds) {
                this.spawnCreature('emberbirds');
                bird.energy -= 20;
            }
        }
    }

    moveCreature(creature, type) {
        const directions = [
            {dx: 1, dy: 0}, {dx: -1, dy: 0},
            {dx: 0, dy: 1}, {dx: 0, dy: -1},
            {dx: 1, dy: 1}, {dx: -1, dy: -1},
            {dx: 1, dy: -1}, {dx: -1, dy: 1}
        ];

        const dir = directions[Math.floor(Math.random() * directions.length)];
        const newX = Math.max(0, Math.min(this.planet.width - 1, creature.x + dir.dx));
        const newY = Math.max(0, Math.min(this.planet.height - 1, creature.y + dir.dy));

        const newTile = this.planet.tiles[newY][newX];
        if (newTile.type !== 'lava' && newTile.type !== 'water' && newTile.type !== 'void') {
            creature.x = newX;
            creature.y = newY;
        }
    }

    calculateEcosystemHealth() {
        const ashwormCount = this.creatures.ashworms.length;
        const beetleCount = this.creatures.magmabeetles.length;
        const birdCount = this.creatures.emberbirds.length;

        const ashwormRatio = ashwormCount / this.populationTargets.ashworms;
        const beetleRatio = beetleCount / this.populationTargets.magmabeetles;
        const birdRatio = birdCount / this.populationTargets.emberbirds;

        let health = 100;

        if (ashwormRatio < 0.5 || ashwormRatio > 2.0) health -= 20;
        else if (ashwormRatio < 0.7 || ashwormRatio > 1.5) health -= 10;

        if (beetleRatio < 0.5 || beetleRatio > 2.0) health -= 15;
        else if (beetleRatio < 0.7 || beetleRatio > 1.5) health -= 8;

        if (birdRatio < 0.5 || birdRatio > 1.8) health -= 25;
        else if (birdRatio < 0.7 || birdRatio > 1.4) health -= 12;

        if (ashwormCount < this.populationMin.ashworms) health -= 30;
        if (beetleCount < this.populationMin.magmabeetles) health -= 25;
        if (birdCount < this.populationMin.emberbirds) health -= 35;

        this.ecosystemHealth = Math.max(0, Math.min(100, health));
    }

    applyEcosystemEffects() {
        if (this.ecosystemHealth >= 70) {
            this.game.player.eruptionChanceModifier = -20;
        } else {
            this.game.player.eruptionChanceModifier = 0;
        }

        if (this.ecosystemHealth <= 30) {
            this.game.player.coreStabilityMultiplier = 1.5;
        } else {
            this.game.player.coreStabilityMultiplier = 1.0;
        }

        if (this.creatures.ashworms.length > this.populationMax.ashworms * 0.8) {
            this.game.player.foodBonus = Math.max(0, (this.game.player.foodBonus || 0) - 3);
        }

        if (this.creatures.magmabeetles.length > this.populationMax.magmabeetles * 0.8) {
            this.game.player.eruptionChanceModifier += 30;
        }
    }

    checkForEvents() {
        if (this.creatures.ashworms.length > this.populationMax.ashworms * 0.9 && Math.random() < 0.05) {
            this.game.log('ASHWORM SWARM! Crops being devoured!');
            this.game.player.settlements.forEach(s => s.food = Math.max(0, s.food - 15));
        }

        if (this.creatures.magmabeetles.length > this.populationMax.magmabeetles * 0.9 && Math.random() < 0.08) {
            this.game.log('BEETLE STAMPEDE! Seismic activity increased!');
            if (this.game.eventSystem && Math.random() < 0.3) {
                this.game.eventSystem.causeEruption();
            }
        }

        const turn = this.game.player.turn;
        if (this.ecosystemHealth >= 80 && turn - this.lastMigrationTurn > 20 && Math.random() < 0.15) {
            this.game.log('EMBERBIRD MIGRATION! Land enriched across the region!');
            this.lastMigrationTurn = turn;
            for (let i = 0; i < 8; i++) {
                const x = Math.floor(Math.random() * this.planet.width);
                const y = Math.floor(Math.random() * this.planet.height);
                const tile = this.planet.tiles[y][x];
                if (tile.type === 'darksoil' && !tile.volcanicGarden) {
                    tile.volcanicGarden = true;
                    tile.yields.food += 4;
                    tile.yields.science += 1;
                }
            }
        }

        if (this.ecosystemHealth <= 25 && Math.random() < 0.03) {
            this.game.log('ECOSYSTEM CRITICAL! Species struggling to survive!');
        }
    }

    getPopulationStats() {
        return {
            ashworms: this.creatures.ashworms.length,
            magmabeetles: this.creatures.magmabeetles.length,
            emberbirds: this.creatures.emberbirds.length,
            health: this.ecosystemHealth
        };
    }
}