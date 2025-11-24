class EventSystem {
    constructor(planet, player, game) {
        this.planet = planet;
        this.player = player;
        this.game = game;
        this.coreStability = 100;
        this.turn = 0;
        this.nextEruptionTurn = this.getRandomEruptionTurn();
        this.eruption75Triggered = false;
        this.eruption35Triggered = false;
    }

    triggerHailstorm() {
        if (!this.game.conquestSystem) return 0;

        const damageDealt = [];

        this.game.conquestSystem.armies.forEach(unit => {
            unit.health -= 10;
            damageDealt.push(unit.type);

            if (unit.health <= 0) {
                this.game.conquestSystem.armies = this.game.conquestSystem.armies.filter(a => a.id !== unit.id);
                this.game.log(`${unit.type} froze to death in the hailstorm!`);
            }
        });

        if (damageDealt.length > 0) {
            this.game.log(`❄️ HAILSTORM! All units take 10 damage! ${damageDealt.length} units hit.`);
        }

        return damageDealt.length;
    }

    getRandomEruptionTurn() {
        return Math.floor(Math.random() * 6) + 10;
    }

    onTurnEnd() {
        this.turn++;
        this.coreStability -= (0.5 * (this.player.coreStabilityMultiplier || 1));

        if (this.player.coreStable) {
            this.coreStability = Math.min(100, this.coreStability + 1);
        }

        if (!this.eruption75Triggered && this.coreStability <= 75) {
            this.eruption75Triggered = true;
            this.damageAllBuildings(20);
            this.causeEruption();
            this.game.log('CRITICAL: Core instability at 75% - Major eruption triggered!');
            if (this.game.screenShake) {
                this.game.screenShake(3000, 15);
            }
            if (typeof AudioManager !== 'undefined') {
                AudioManager.playSFX('sfx-eruption-major', 0.7);
            }
        }

        if (!this.eruption35Triggered && this.coreStability <= 35) {
            this.eruption35Triggered = true;
            this.damageAllBuildings(40);
            this.causeEruption();
            this.game.log('CATASTROPHIC: Core collapse imminent at 35% - Massive eruption!');
            if (this.game.screenShake) {
                this.game.screenShake(5000, 25);
            }
            if (typeof AudioManager !== 'undefined') {
                AudioManager.playSFX('sfx-eruption-catastrophic', 0.8);
            }
        }

        if (this.turn >= this.nextEruptionTurn) {
            this.triggerVolcanicEvent();
            this.nextEruptionTurn = this.turn + this.getRandomEruptionTurn();
        }

        if (this.coreStability <= 0) {
            return { gameOver: true, reason: 'planetary_collapse' };
        }

        return { gameOver: false };
    }

    damageAllBuildings(damage) {
        let buildingsDamaged = 0;

        this.planet.structures.forEach(building => {
            if (building.type !== 'ruins' && !building.isFrame) {
                building.health -= damage;
                buildingsDamaged++;

                if (building.health <= 0) {
                    const oldType = building.type;
                    this.player.removeBuilding(building);

                    const ruins = {
                        x: building.x,
                        y: building.y,
                        type: 'ruins',
                        health: 0,
                        maxHealth: 0,
                        originalType: oldType
                    };

                    const tile = this.planet.tiles[building.y][building.x];
                    tile.building = ruins;
                    this.planet.structures = this.planet.structures.filter(s => s !== building);
                    this.planet.structures.push(ruins);

                    if (this.game) {
                        this.game.log(`${oldType} destroyed by catastrophic eruption!`);
                    }
                }
            }
        });

        if (buildingsDamaged > 0 && this.game) {
            this.game.log(`Planetary shockwave damages ${buildingsDamaged} buildings for ${damage} HP!`);
            if (typeof AudioManager !== 'undefined') {
                AudioManager.playSFX('sfx-building-damage', 0.6);
            }
        }
    }

    triggerVolcanicEvent() {
        const eventTypes = ['eruption', 'floating_island', 'geothermal_vent'];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        switch(eventType) {
            case 'eruption':
                this.causeEruption();
                break;
            case 'floating_island':
                this.spawnFloatingIsland();
                break;
            case 'geothermal_vent':
                this.spawnGeothermalVent();
                break;
        }
    }

    causeEruption() {
        if (this.player.eruptionWarning > 0) {
            console.log(`Eruption predicted ${this.player.eruptionWarning} turns ahead!`);
        }

        const resistChance = this.player.eruptionResistance || 0;
        if (Math.random() * 100 < resistChance) {
            return { x: -1, y: -1, destroyedBuildings: 0, resisted: true };
        }

        const x = Math.floor(Math.random() * this.planet.width);
        const y = Math.floor(Math.random() * this.planet.height);

        const radius = 3;
        let destroyedBuildings = 0;
        this.activeEruption = { x, y, radius, ticksRemaining: 20 };

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= 1) {
                        this.planet.tiles[ny][nx].type = 'lava';
                    } else if (distance <= 2) {
                        this.planet.tiles[ny][nx].type = 'ash';
                    }
                }
            }
        }

        return { x, y, destroyedBuildings };
    }

    updateEruption() {
        if (!this.activeEruption) return;

        const { x, y, radius } = this.activeEruption;
        let destroyedThisTick = 0;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const tile = this.planet.tiles[ny][nx];

                    if (tile.building && tile.building.type !== 'ruins') {
                        const damage = Math.max(1, Math.floor((radius - distance + 1) * 5));
                        tile.building.health -= damage;

                        if (tile.building.health <= 0) {
                            const oldType = tile.building.type;
                            this.player.removeBuilding(tile.building);
                            this.planet.structures = this.planet.structures.filter(s => s !== tile.building);

                            const ruins = {
                                x: nx,
                                y: ny,
                                type: 'ruins',
                                health: 0,
                                maxHealth: 0,
                                originalType: oldType
                            };
                            tile.building = ruins;
                            this.planet.structures.push(ruins);
                            destroyedThisTick++;

                            if (this.game) {
                                this.game.log(`${oldType} destroyed by eruption!`);
                            }
                        }
                    }
                }
            }
        }

        this.activeEruption.ticksRemaining--;
        if (this.activeEruption.ticksRemaining <= 0) {
            this.activeEruption = null;
        }

        return destroyedThisTick;
    }

    spawnFloatingIsland() {
        const x = Math.floor(Math.random() * this.planet.width);
        const y = Math.floor(Math.random() * this.planet.height);

        const radius = 2;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= radius) {
                        this.planet.tiles[ny][nx].type = 'floating';
                        this.planet.tiles[ny][nx].isFloating = true;
                    }
                }
            }
        }

        return { x, y };
    }

    spawnGeothermalVent() {
        let attempts = 0;
        while (attempts < 20) {
            const x = Math.floor(Math.random() * this.planet.width);
            const y = Math.floor(Math.random() * this.planet.height);
            const tile = this.planet.tiles[y][x];

            if (tile.type === 'rock' || tile.type === 'ash') {
                let hasLavaNearby = false;

                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                            if (this.planet.tiles[ny][nx].type === 'lava') {
                                hasLavaNearby = true;
                                break;
                            }
                        }
                    }
                    if (hasLavaNearby) break;
                }

                if (hasLavaNearby) {
                    tile.hasGeothermal = true;
                    tile.resourceAmount = 100;
                    return { x, y };
                }
            }
            attempts++;
        }
        return null;
    }
}