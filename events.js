class EventSystem {
    constructor(planet, player, game) {
        this.planet = planet;
        this.player = player;
        this.game = game;
        this.coreStability = 100;
        this.turn = 0;
        this.nextEruptionTurn = this.getRandomEruptionTurn();
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

        if (this.turn >= this.nextEruptionTurn) {
            this.triggerVolcanicEvent();
            this.nextEruptionTurn = this.turn + this.getRandomEruptionTurn();
        }

        if (this.coreStability <= 0) {
            return { gameOver: true, reason: 'planetary_collapse' };
        }

        return { gameOver: false };
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

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.planet.width && ny >= 0 && ny < this.planet.height) {
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= radius) {
                        const tile = this.planet.tiles[ny][nx];

                        if (tile.building) {
                            this.planet.removeBuilding(nx, ny, this.player);
                            destroyedBuildings++;
                        }

                        if (distance <= 1) {
                            tile.type = 'lava';
                        } else if (distance <= 2) {
                            tile.type = 'ash';
                        }
                    }
                }
            }
        }

        if (this.player.game) {
            this.player.game.screenShake(800, 30);
        }

        return { x, y, destroyedBuildings };
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