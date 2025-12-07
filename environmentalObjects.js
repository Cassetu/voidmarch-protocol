class EnvironmentalObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.id = Math.random();

        const objectData = {
            lavarock: {
                name: 'Lava Rock',
                maxHealth: 80,
                icon: '🪨',
                color: '#ff4400',
                rewards: { iron: 15, rareMinerals: 5 }
            },
            magmacrystal: {
                name: 'Magma Crystal',
                maxHealth: 120,
                icon: '💎',
                color: '#ff8800',
                rewards: { silicon: 20, rareMinerals: 10 }
            },
            ashpile: {
                name: 'Ash Pile',
                maxHealth: 50,
                icon: '🌫️',
                color: '#666666',
                rewards: { coal: 10, copper: 5 }
            },
            obsidian: {
                name: 'Obsidian',
                maxHealth: 150,
                icon: '⬛',
                color: '#2a2a3a',
                rewards: { iron: 25, silicon: 15 }
            }
        };

        const data = objectData[type];
        this.name = data.name;
        this.maxHealth = data.maxHealth;
        this.health = this.maxHealth;
        this.icon = data.icon;
        this.color = data.color;
        this.rewards = data.rewards;
        this.beingDestroyed = false;
        this.destroyer = null;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            return true;
        }
        return false;
    }

    getHealthPercent() {
        return Math.floor((this.health / this.maxHealth) * 100);
    }
}

class EnvironmentalObjectSystem {
    constructor(planet, player, game) {
        this.planet = planet;
        this.player = player;
        this.game = game;
        this.objects = [];
        this.destroyers = [];
        this.nextDestroyerId = 0;

        this.spawnInitialObjects();
    }

    spawnInitialObjects() {
        const objectTypes = ['lavarock', 'magmacrystal', 'ashpile', 'obsidian'];
        const spawnCount = Math.floor(this.planet.width * this.planet.height * 0.08);

        for (let i = 0; i < spawnCount; i++) {
            let attempts = 0;
            let spawned = false;

            while (!spawned && attempts < 42) {
                const x = Math.floor(Math.random() * this.planet.width);
                const y = Math.floor(Math.random() * this.planet.height);
                const tile = this.planet.tiles[y][x];

                if (this.canSpawnAt(x, y)) {
                    let type;
                    if (tile.type === 'lava') {
                        type = Math.random() < 0.7 ? 'lavarock' : 'magmacrystal';
                    } else if (tile.type === 'ash') {
                        type = Math.random() < 0.6 ? 'ashpile' : 'obsidian';
                    } else if (tile.type === 'rock') {
                        type = Math.random() < 0.5 ? 'lavarock' : 'obsidian';
                    } else {
                        type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
                    }

                    const obj = new EnvironmentalObject(x, y, type);
                    this.objects.push(obj);
                    tile.environmentalObject = obj;
                    spawned = true;
                }
                attempts++;
            }
        }

        this.game.log(`${this.objects.length} environmental objects spawned`);
    }

    canSpawnAt(x, y) {
        if (x < 0 || x >= this.planet.width || y < 0 || y >= this.planet.height) {
            return false;
        }

        const tile = this.planet.tiles[y][x];

        if (tile.type === 'water' || tile.type === 'void') {
            return false;
        }

        if (tile.building || tile.environmentalObject) {
            return false;
        }

        const nearBuilding = this.planet.structures.some(building => {
            if (building.isFrame) return false;
            const dist = Math.abs(building.x - x) + Math.abs(building.y - y);
            return dist <= 2;
        });

        if (nearBuilding) {
            return false;
        }

        const nearSettlement = this.player.settlements.some(settlement => {
            const dist = Math.abs(settlement.x - x) + Math.abs(settlement.y - y);
            return dist <= 2;
        });

        return !nearSettlement;
    }

    getObjectAt(x, y) {
        return this.objects.find(obj => obj.x === x && obj.y === y);
    }

    sendDestroyerTo(targetX, targetY, settlement) {
        const obj = this.getObjectAt(targetX, targetY);
        if (!obj) return false;

        if (obj.beingDestroyed) {
            this.game.log('Already being destroyed!');
            return false;
        }

        const distance = Math.abs(settlement.x - targetX) + Math.abs(settlement.y - targetY);

        const destroyer = {
            id: this.nextDestroyerId++,
            currentX: settlement.x,
            currentY: settlement.y,
            targetX: targetX,
            targetY: targetY,
            target: obj,
            arrived: false,
            turnsToArrive: Math.ceil(distance / 2),
            damagePerTurn: 10,
            path: null,
            pathIndex: 0,
            settlement: settlement
        };

        destroyer.path = this.findPath(destroyer);
        if (!destroyer.path) {
            this.game.log('Cannot reach that location!');
            return false;
        }

        obj.beingDestroyed = true;
        obj.destroyer = destroyer;
        this.destroyers.push(destroyer);

        this.game.log(`Worker sent to destroy ${obj.name}`);
        return true;
    }

    findPath(destroyer) {
        const start = { x: destroyer.currentX, y: destroyer.currentY };
        const end = { x: destroyer.targetX, y: destroyer.targetY };

        const path = [];
        let current = { ...start };

        while (current.x !== end.x || current.y !== end.y) {
            const dx = Math.sign(end.x - current.x);
            const dy = Math.sign(end.y - current.y);

            if (dx !== 0) {
                current.x += dx;
            } else if (dy !== 0) {
                current.y += dy;
            }

            const tile = this.planet.tiles[current.y][current.x];
            if (tile.type === 'lava' || tile.type === 'water' || tile.type === 'void') {
                return null;
            }

            path.push({ x: current.x, y: current.y });
        }

        return path;
    }

    update() {
        for (let i = this.destroyers.length - 1; i >= 0; i--) {
            const destroyer = this.destroyers[i];

            if (!destroyer.arrived) {
                if (destroyer.pathIndex < destroyer.path.length) {
                    const nextPos = destroyer.path[destroyer.pathIndex];
                    destroyer.currentX = nextPos.x;
                    destroyer.currentY = nextPos.y;
                    destroyer.pathIndex++;

                    if (destroyer.currentX === destroyer.targetX && destroyer.currentY === destroyer.targetY) {
                        destroyer.arrived = true;
                        this.game.log('Worker arrived and begins destruction');
                    }
                }
            } else {
                const destroyed = destroyer.target.takeDamage(destroyer.damagePerTurn);

                if (destroyed) {
                    this.game.log(`${destroyer.target.name} destroyed!`);

                    for (const [resource, amount] of Object.entries(destroyer.target.rewards)) {
                        this.player.resources[resource] += amount;
                        this.game.log(`+${amount} ${resource}`);
                    }

                    const tile = this.planet.tiles[destroyer.targetY][destroyer.targetX];
                    tile.environmentalObject = null;

                    this.objects = this.objects.filter(obj => obj.id !== destroyer.target.id);
                    this.destroyers.splice(i, 1);
                }
            }
        }
    }
}