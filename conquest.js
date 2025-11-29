class ConquestSystem {
    constructor(game, planet, difficulty, isFirstVisit = true) {
        this.game = game;
        this.planet = planet;
        this.difficulty = difficulty;
        this.defenseNodes = [];
        this.armies = [];
        this.sentinels = [];
        this.turn = 0;
        this.playerPhase = true;
        this.selectedUnit = null;
        this.spaceship = null;
        this.cryoPopulation = 0;
        this.hackingMiniGame = null;
        this.guardian = null;

        if (isFirstVisit) {
            this.spawnSpaceship();
            this.spawnDefenseNodes();
            this.spawnSentinels();
            this.spawnGuardian();
        } else {
            this.loadExistingConquestState(planet);
        }
    }

    loadExistingConquestState(planet) {
        this.spaceship = planet.structures.find(s => s.type === 'spaceship');
        if (this.spaceship) {
            this.cryoPopulation = this.spaceship.cryoPopulation;
        }

        this.defenseNodes = planet.structures.filter(s => s.type === 'defense_node');

        this.sentinels = [];
        this.armies = [];
    }

    spawnSpaceship() {
        let spawnX = Math.floor(this.planet.width / 4);
        let spawnY = Math.floor(this.planet.height / 4);

        const validPos = this.findValidPosition(spawnX, spawnY);
        if (validPos) {
            spawnX = validPos.x;
            spawnY = validPos.y;
        }

        this.cryoPopulation = Math.floor(this.game.player.population * 0.5);
        const carriedResources = Math.floor(this.game.player.resources * 0.5);

        this.spaceship = {
            x: spawnX,
            y: spawnY,
            type: 'spaceship',
            health: 500,
            maxHealth: 500,
            cryoPopulation: this.cryoPopulation,
            canUnfreeze: true
        };

        this.planet.tiles[spawnY][spawnX].building = this.spaceship;
        this.planet.structures.push(this.spaceship);

        this.game.player.resources = carriedResources;
        this.game.player.population = 0;

        this.game.log(`Crashed on planet! ${this.cryoPopulation} in cryo, ${carriedResources} resources salvaged`);
    }

    spawnDefenseNodes() {
        const nodePositions = [
            { x: Math.floor(this.planet.width * 0.75), y: Math.floor(this.planet.height * 0.25) },
            { x: Math.floor(this.planet.width * 0.75), y: Math.floor(this.planet.height * 0.75) }
        ];

        const armyTypes = ['assault', 'ranger', 'tank', 'hacker'];

        nodePositions.forEach((pos, index) => {
            const validPos = this.findValidPosition(pos.x, pos.y);
            if (!validPos) return;

            const armyType = armyTypes[index % armyTypes.length];

            const node = {
                x: validPos.x,
                y: validPos.y,
                type: 'defense_node',
                id: index,
                health: 300,
                maxHealth: 300,
                armyType: armyType,
                hacked: false,
                hackingProgress: 0,
                hackingRequired: 100,
                circuitPattern: this.generateCircuitPattern(),
                spawnProgress: 0,
                spawning: false
            };

            this.defenseNodes.push(node);
            this.planet.tiles[validPos.y][validPos.x].building = node;
            this.planet.structures.push(node);
        });
    }

    findValidPosition(startX, startY) {
        const maxAttempts = 50;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const offsetX = Math.floor((Math.random() - 0.5) * 10);
            const offsetY = Math.floor((Math.random() - 0.5) * 10);
            const x = Math.max(0, Math.min(this.planet.width - 1, startX + offsetX));
            const y = Math.max(0, Math.min(this.planet.height - 1, startY + offsetY));

            const tile = this.planet.tiles[y][x];
            if (tile.type !== 'water' && tile.type !== 'lava' && tile.type !== 'void' && !tile.building) {
                return { x, y };
            }
        }
        return null;
    }

    generateCircuitPattern() {
        const size = 6;
        const pattern = [];

        for (let y = 0; y < size; y++) {
            pattern[y] = [];
            for (let x = 0; x < size; x++) {
                pattern[y][x] = {
                    type: Math.random() > 0.3 ? 'wire' : 'empty',
                    powered: false,
                    correct: false
                };
            }
        }

        const startX = 0;
        const startY = Math.floor(size / 2);
        const endX = size - 1;
        const endY = Math.floor(size / 2);

        pattern[startY][startX].type = 'source';
        pattern[endY][endX].type = 'target';

        let currentX = startX;
        let currentY = startY;

        while (currentX < endX || currentY !== endY) {
            if (currentX < endX && Math.random() > 0.3) {
                currentX++;
            } else if (currentY < endY) {
                currentY++;
            } else if (currentY > endY) {
                currentY--;
            }

            if (currentX < endX || currentY !== endY) {
                pattern[currentY][currentX].type = 'wire';
                pattern[currentY][currentX].correct = true;
            }
        }

        return pattern;
    }

    spawnSentinels() {
        this.defenseNodes.forEach(node => {
            const sentinelCount = 2 + this.difficulty;

            for (let i = 0; i < sentinelCount; i++) {
                const angle = (i / sentinelCount) * Math.PI * 2;
                const distance = 3 + Math.floor(Math.random() * 3);

                let x = Math.round(node.x + Math.cos(angle) * distance);
                let y = Math.round(node.y + Math.sin(angle) * distance);

                const validPos = this.findValidPosition(x, y);
                if (!validPos) continue;

                x = validPos.x;
                y = validPos.y;

                if (x >= 0 && x < this.planet.width && y >= 0 && y < this.planet.height) {
                    const sentinelType = node.armyType;
                    const stats = this.getSentinelStats(sentinelType);

                    this.sentinels.push({
                        id: this.sentinels.length,
                        x: x,
                        y: y,
                        health: stats.health + (this.difficulty * 20),
                        maxHealth: stats.health + (this.difficulty * 20),
                        damage: stats.damage + (this.difficulty * 5),
                        range: stats.range,
                        moveRange: stats.moveRange + Math.floor(this.difficulty / 2),
                        type: sentinelType,
                        moved: false,
                        attacked: false,
                        belongsToNode: node.id
                    });
                }
            }
        });
    }

    getSentinelStats(type) {
        const stats = {
            assault: { health: 100, damage: 25, range: 1, moveRange: 4 },
            ranger: { health: 60, damage: 20, range: 4, moveRange: 3 },
            tank: { health: 200, damage: 15, range: 1, moveRange: 2 },
            hacker: { health: 50, damage: 10, range: 2, moveRange: 4 }
        };
        return stats[type] || stats.assault;
    }

    unfreezePopulation(amount) {
        if (!this.spaceship || this.spaceship.cryoPopulation < amount) return false;

        this.spaceship.cryoPopulation -= amount;
        this.game.player.population += amount;
        this.game.log(`Unfroze ${amount} population. ${this.spaceship.cryoPopulation} remain in cryo.`);

        return true;
    }

    getPlayerBuildingTypes() {
        return ['spaceship', 'settlement', 'warehouse', 'farm', 'barracks', 'temple',
                'forge', 'market', 'castle', 'library', 'university', 'observatory',
                'campfire', 'tent', 'woodpile', 'granary', 'quarry', 'monument',
                'workshop', 'aqueduct', 'watchtower', 'cathedral', 'townhall', 'arena',
                'hospital', 'academy', 'theater', 'mansion', 'spaceport', 'laboratory',
                'megafactory'];
    }

    hireUnit(armyType, x, y) {
        const costs = {
            assault: 80,
            ranger: 70,
            tank: 120,
            hacker: 100
        };

        const stats = {
            assault: { health: 100, damage: 25, range: 1, moveRange: 4 },
            ranger: { health: 60, damage: 20, range: 4, moveRange: 3 },
            tank: { health: 200, damage: 15, range: 1, moveRange: 2 },
            hacker: { health: 50, damage: 10, range: 2, moveRange: 4 }
        };

        const cost = costs[armyType];
        if (this.game.player.resources < cost) {
            this.game.log(`Not enough resources! Need ${cost}`);
            return false;
        }

        const playerBuildingTypes = this.getPlayerBuildingTypes();

        const nearBuilding = this.planet.structures.some(building => {
            if (!playerBuildingTypes.includes(building.type)) return false;
            if (building.isFrame) return false;
            const distance = Math.abs(building.x - x) + Math.abs(building.y - y);
            return distance <= 1;
        });

        if (!nearBuilding) {
            this.game.log('Units must be hired adjacent to your buildings!');
            return false;
        }

        const tile = this.planet.tiles[y][x];
        if (tile.type === 'water' || tile.type === 'lava' || tile.type === 'void') {
            this.game.log('Cannot hire units on impassable terrain!');
            return false;
        }

        const occupied = this.armies.some(a => a.x === x && a.y === y) ||
                        this.sentinels.some(s => s.x === x && s.y === y) ||
                        tile.building;

        if (occupied) {
            this.game.log('Tile occupied!');
            return false;
        }

        this.game.player.resources -= cost;

        const unit = {
            id: this.armies.length,
            x: x,
            y: y,
            type: armyType,
            health: stats[armyType].health,
            maxHealth: stats[armyType].health,
            damage: stats[armyType].damage,
            range: stats[armyType].range,
            moveRange: stats[armyType].moveRange,
            moved: false,
            attacked: false
        };

        this.armies.push(unit);
        this.game.log(`Hired ${armyType} at (${x}, ${y})`);
        return true;
    }

    selectUnit(x, y) {
        const unit = this.armies.find(a => a.x === x && a.y === y);
        if (unit) {
            this.selectedUnit = unit;
            return { type: 'unit', data: unit };
        }

        const building = this.planet.structures.find(s => s.x === x && s.y === y);
        if (building) {
            return { type: 'building', data: building };
        }

        return null;
    }

    moveUnit(unitId, targetX, targetY) {
        const unit = this.armies.find(a => a.id === unitId);
        if (!unit || unit.moved) return false;

        const distance = Math.abs(unit.x - targetX) + Math.abs(unit.y - targetY);
        if (distance > unit.moveRange) return false;

        const occupied = this.armies.some(a => a.x === targetX && a.y === targetY && a.id !== unitId) ||
                        this.sentinels.some(s => s.x === targetX && s.y === targetY);

        if (occupied) return false;

        unit.x = targetX;
        unit.y = targetY;
        unit.moved = true;

        this.game.log(`Moved ${unit.type} to (${targetX}, ${targetY})`);
        return true;
    }

    attackWithUnit(unitId, targetX, targetY) {
        const unit = this.armies.find(a => a.id === unitId);
        if (!unit || unit.attacked) return false;

        const distance = Math.abs(unit.x - targetX) + Math.abs(unit.y - targetY);
        if (distance > unit.range) return false;

        const sentinel = this.sentinels.find(s => s.x === targetX && s.y === targetY);
        if (sentinel) {
            sentinel.health -= unit.damage;
            unit.attacked = true;
            sentinel.aggroTarget = unitId;

            this.game.log(`${unit.type} attacked sentinel for ${unit.damage} damage!`);

            if (sentinel.health <= 0) {
                if (sentinel.isGuardian) {
                    sentinel.defeated = true;
                    this.game.log(`💀 ${sentinel.name} HAS BEEN DEFEATED! 💀`);
                    this.game.log(`The Guardian drops rare technology!`);
                    this.game.player.resources += 500;
                    this.game.player.science += 200;
                } else {
                    this.game.log(`Sentinel destroyed!`);
                }
                this.sentinels = this.sentinels.filter(s => s.id !== sentinel.id);
            }

            return true;
        }

        const building = this.planet.structures.find(s => s.x === targetX && s.y === targetY);
        if (building && building.type === 'defense_node' && !building.hacked) {
            building.health -= unit.damage;
            unit.attacked = true;

            this.game.log(`${unit.type} attacked defense node for ${unit.damage} damage!`);

            if (building.health <= 0) {
                building.hacked = true;
                building.health = 0;
                this.game.log(`Defense node ${building.id} destroyed!`);
            }

            return true;
        }

        return false;
    }

    startHacking(nodeId) {
        const node = this.defenseNodes.find(n => n.id === nodeId);
        if (!node || node.hacked) return false;

        const hacker = this.armies.find(a => {
            const distance = Math.abs(a.x - node.x) + Math.abs(a.y - node.y);
            return a.type === 'hacker' && distance <= 2 && !a.attacked;
        });

        if (!hacker) {
            this.game.log('Need a hacker unit within 2 tiles of the node that hasn\'t acted!');
            return false;
        }

        hacker.attacked = true;

        this.hackingMiniGame = {
            nodeId: nodeId,
            hackerId: hacker.id,
            pattern: JSON.parse(JSON.stringify(node.circuitPattern)),
            timeLimit: 30,
            timeRemaining: 30,
            poweredCells: [],
            complete: false
        };

        return true;
    }

    toggleCircuitCell(x, y) {
        if (!this.hackingMiniGame) return false;

        const cell = this.hackingMiniGame.pattern[y][x];
        if (cell.type === 'source' || cell.type === 'target' || cell.type === 'empty') return false;

        cell.powered = !cell.powered;
        this.checkCircuitComplete();
        return true;
    }

    checkCircuitComplete() {
        const pattern = this.hackingMiniGame.pattern;
        const size = pattern.length;

        let sourceX = -1, sourceY = -1, targetX = -1, targetY = -1;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (pattern[y][x].type === 'source') {
                    sourceX = x;
                    sourceY = y;
                }
                if (pattern[y][x].type === 'target') {
                    targetX = x;
                    targetY = y;
                }
                pattern[y][x].reachable = false;
            }
        }

        const queue = [[sourceX, sourceY]];
        pattern[sourceY][sourceX].reachable = true;

        while (queue.length > 0) {
            const [cx, cy] = queue.shift();

            const neighbors = [
                [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
            ];

            neighbors.forEach(([nx, ny]) => {
                if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                    const neighbor = pattern[ny][nx];
                    if (!neighbor.reachable) {
                        if (neighbor.type === 'wire' && neighbor.powered) {
                            neighbor.reachable = true;
                            queue.push([nx, ny]);
                        } else if (neighbor.type === 'target') {
                            neighbor.reachable = true;
                            queue.push([nx, ny]);
                        }
                    }
                }
            });
        }

        if (pattern[targetY][targetX].reachable) {
            this.hackingMiniGame.complete = true;
            return true;
        }

        return false;
    }

    completeHacking() {
        if (!this.hackingMiniGame || !this.hackingMiniGame.complete) return false;

        const node = this.defenseNodes.find(n => n.id === this.hackingMiniGame.nodeId);
        if (node) {
            node.hacked = true;
            node.health = 0;
            this.game.log(`Defense node ${node.id} hacked successfully!`);
        }

        this.hackingMiniGame = null;
        return true;
    }

    cancelHacking() {
        this.hackingMiniGame = null;
    }

    updateHackingTimer(deltaTime) {
        if (this.hackingMiniGame && this.hackingMiniGame.timeRemaining > 0) {
            this.hackingMiniGame.timeRemaining -= deltaTime;

            if (this.hackingMiniGame.timeRemaining <= 0) {
                this.game.log('Hacking failed - time expired!');
                this.hackingMiniGame = null;
            }
        }
    }

    enemyPhase() {
        this.sentinels.forEach(sentinel => {
            sentinel.moved = false;
            sentinel.attacked = false;
        });

        this.defenseNodes.forEach(node => {
            if (node.hacked) return;

            const nearbyThreat = this.armies.some(army => {
                const dist = Math.abs(army.x - node.x) + Math.abs(army.y - node.y);
                return dist <= 8;
            });

            if (nearbyThreat) {
                if (!node.spawning) {
                    node.spawning = true;
                    node.spawnProgress = 0;
                }
                node.spawnProgress++;

                if (node.spawnProgress >= 5) {
                    const spawnPos = this.findValidPosition(node.x, node.y);
                    if (spawnPos) {
                        this.sentinels.push({
                            id: this.sentinels.length,
                            x: spawnPos.x,
                            y: spawnPos.y,
                            health: 80 + (this.difficulty * 20),
                            maxHealth: 80 + (this.difficulty * 20),
                            damage: 15 + (this.difficulty * 5),
                            range: 2,
                            moveRange: 2 + Math.floor(this.difficulty / 2),
                            type: node.armyType,
                            moved: false,
                            attacked: false,
                            belongsToNode: node.id,
                            homeX: node.x,
                            homeY: node.y
                        });
                        this.game.log(`Defense node ${node.id} spawned a sentinel!`);
                    }
                    node.spawnProgress = 0;
                }
            } else {
                node.spawning = false;
                node.spawnProgress = 0;
            }
        });

        if (this.guardian && !this.guardian.defeated) {
            this.updateGuardian();
        }

        this.sentinels.forEach(sentinel => {
            if (sentinel.isGuardian) return;
            if (sentinel.empStunned) return;

            if (sentinel.assaulting) {
                if (!this.spaceship) {
                    sentinel.assaulting = false;
                    return;
                }

                const targetX = this.spaceship.x;
                const targetY = this.spaceship.y;
                const distToSpaceship = Math.abs(sentinel.x - targetX) + Math.abs(sentinel.y - targetY);

                let closestTarget = null;
                let closestDistance = Infinity;

                this.armies.forEach(army => {
                    const distance = Math.abs(sentinel.x - army.x) + Math.abs(sentinel.y - army.y);
                    if (distance <= sentinel.moveRange + sentinel.range && distance < closestDistance) {
                        closestDistance = distance;
                        closestTarget = { type: 'unit', data: army, distance: distance };
                    }
                });

                this.game.player.builders.forEach(builder => {
                    const distance = Math.abs(sentinel.x - builder.currentX) + Math.abs(sentinel.y - builder.currentY);
                    if (distance <= sentinel.moveRange + sentinel.range && distance < closestDistance) {
                        closestDistance = distance;
                        closestTarget = { type: 'builder', data: builder, distance: distance };
                    }
                });

                const playerBuildingTypes = this.getPlayerBuildingTypes();
                this.planet.structures.forEach(building => {
                    if (playerBuildingTypes.includes(building.type) && !building.isFrame) {
                        const distance = Math.abs(sentinel.x - building.x) + Math.abs(sentinel.y - building.y);
                        if (distance <= sentinel.moveRange + sentinel.range && distance < closestDistance) {
                            closestDistance = distance;
                            closestTarget = { type: 'building', data: building, distance: distance };
                        }
                    }
                });

                if (closestTarget && closestTarget.distance <= sentinel.range) {
                    const target = closestTarget.data;
                    target.health -= sentinel.damage;

                    if (closestTarget.type === 'unit' && target.health <= 0) {
                        this.armies = this.armies.filter(a => a.id !== target.id);
                        this.game.log(`Your ${target.type} was destroyed by assaulting sentinel!`);
                    } else if (closestTarget.type === 'builder') {
                        this.game.log(`Builder destroyed by assaulting sentinel!`);
                        const builderId = closestTarget.data.id;
                        this.game.player.builders = this.game.player.builders.filter(b => b.id !== builderId);

                        const queueItem = this.game.player.buildingQueue.find(bq => bq.builderId === builderId);
                        if (queueItem) {
                            const tile = this.planet.tiles[queueItem.y][queueItem.x];
                            if (tile && tile.building && tile.building.isFrame) {
                                this.planet.structures = this.planet.structures.filter(s => s !== tile.building);
                                tile.building = null;
                            }
                        }
                        this.game.player.buildingQueue = this.game.player.buildingQueue.filter(bq => bq.builderId !== builderId);
                    } else if (closestTarget.type === 'building') {
                        this.game.log(`${target.type} took ${sentinel.damage} damage from assault!`);

                        if (target.health <= 0) {
                            if (target.type === 'spaceship') {
                                this.game.log(`Spaceship destroyed! DEFEAT!`);
                                setTimeout(() => {
                                    this.game.showGameOver();
                                }, 100);
                                return { defeat: true };
                            } else {
                                this.game.log(`${target.type} destroyed by assault!`);
                                const ruins = {
                                    x: target.x,
                                    y: target.y,
                                    type: 'ruins',
                                    health: 0,
                                    maxHealth: 0,
                                    originalType: target.type
                                };
                                this.planet.structures = this.planet.structures.filter(s => s !== target);
                                this.planet.structures.push(ruins);
                                this.planet.tiles[target.y][target.x].building = ruins;
                            }
                        }
                    }
                    sentinel.attacked = true;
                } else {
                    this.moveSentinelToward(sentinel, targetX, targetY, targetX, targetY, 1000);
                }

                return;
            }

            const homeX = sentinel.homeX !== undefined ? sentinel.homeX : this.defenseNodes.find(n => n.id === sentinel.belongsToNode)?.x || sentinel.x;
            const homeY = sentinel.homeY !== undefined ? sentinel.homeY : this.defenseNodes.find(n => n.id === sentinel.belongsToNode)?.y || sentinel.y;

            if (!sentinel.homeX) sentinel.homeX = homeX;
            if (!sentinel.homeY) sentinel.homeY = homeY;

            let closestTarget = null;
            let closestDistance = Infinity;

            const taunt = this.game.unitActionSystem.tauntedSentinels.get(sentinel.id);
            if (taunt) {
                const tauntedUnit = this.armies.find(a => a.id === taunt.targetId);
                if (tauntedUnit) {
                    closestTarget = { type: 'unit', data: tauntedUnit, distance: Math.abs(sentinel.x - tauntedUnit.x) + Math.abs(sentinel.y - tauntedUnit.y) };
                    closestDistance = closestTarget.distance;
                }
            } else if (sentinel.aggroTarget !== undefined) {
                const aggroUnit = this.armies.find(a => a.id === sentinel.aggroTarget);
                if (aggroUnit) {
                    closestTarget = { type: 'unit', data: aggroUnit, distance: Math.abs(sentinel.x - aggroUnit.x) + Math.abs(sentinel.y - aggroUnit.y) };
                    closestDistance = closestTarget.distance;
                } else {
                    delete sentinel.aggroTarget;
                }
            }

            if (!closestTarget) {
                this.armies.forEach(army => {
                    const distance = Math.abs(sentinel.x - army.x) + Math.abs(sentinel.y - army.y);
                    if (distance <= sentinel.moveRange + sentinel.range) {
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestTarget = { type: 'unit', data: army, distance: distance };
                        }
                    }
                });
            }

            if (!closestTarget) {
                this.game.player.builders.forEach(builder => {
                    const distance = Math.abs(sentinel.x - builder.currentX) + Math.abs(sentinel.y - builder.currentY);
                    if (distance <= sentinel.moveRange + sentinel.range) {
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestTarget = { type: 'builder', data: builder, distance: distance };
                        }
                    }
                });
            }

            if (!closestTarget) {
                const playerBuildingTypes = this.getPlayerBuildingTypes();

                this.planet.structures.forEach(building => {
                    if (playerBuildingTypes.includes(building.type) && !building.isFrame) {
                        const distance = Math.abs(sentinel.x - building.x) + Math.abs(sentinel.y - building.y);
                        if (distance <= sentinel.moveRange + sentinel.range) {
                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestTarget = { type: 'building', data: building, distance: distance };
                            }
                        }
                    }
                });
            }

            const distFromHome = Math.abs(sentinel.x - homeX) + Math.abs(sentinel.y - homeY);
            const maxWanderDist = sentinel.aggroTarget !== undefined ? 100 : 6;

            if (closestTarget && closestTarget.distance <= sentinel.range) {
                const target = closestTarget.data;
                target.health -= sentinel.damage;

                if (closestTarget.type === 'unit' && target.health <= 0) {
                    this.armies = this.armies.filter(a => a.id !== target.id);
                    this.game.log(`Your ${target.type} was destroyed!`);
                    if (sentinel.aggroTarget === target.id) {
                        delete sentinel.aggroTarget;
                    }
                } else if (closestTarget.type === 'builder') {
                    this.game.log(`Builder destroyed by sentinel!`);
                    const targetX = closestTarget.data.currentX;
                    const targetY = closestTarget.data.currentY;
                    const builderId = closestTarget.data.id;

                    this.game.player.builders = this.game.player.builders.filter(b => b.id !== builderId);

                    const queueItem = this.game.player.buildingQueue.find(bq => bq.builderId === builderId);
                    if (queueItem) {
                        const tile = this.planet.tiles[queueItem.y][queueItem.x];
                        if (tile && tile.building && tile.building.isFrame) {
                            this.planet.structures = this.planet.structures.filter(s => s !== tile.building);
                            tile.building = null;
                            this.game.log(`Construction frame at (${queueItem.x}, ${queueItem.y}) abandoned.`);
                        }
                    }

                    this.game.player.buildingQueue = this.game.player.buildingQueue.filter(bq => bq.builderId !== builderId);
                } else if (closestTarget.type === 'building') {
                    this.game.log(`${target.type} took ${sentinel.damage} damage!`);

                    if (target.health <= 0) {
                        if (target.type === 'spaceship') {
                            this.game.log(`Spaceship destroyed! DEFEAT!`);
                            return { defeat: true };
                        } else {
                            this.game.log(`${target.type} destroyed!`);
                            const ruins = {
                                x: target.x,
                                y: target.y,
                                type: 'ruins',
                                health: 0,
                                maxHealth: 0,
                                originalType: target.type
                            };
                            this.planet.structures = this.planet.structures.filter(s => s !== target);
                            this.planet.structures.push(ruins);
                            this.planet.tiles[target.y][target.x].building = ruins;
                        }
                    }
                }
                sentinel.attacked = true;
            } else if (closestTarget && closestDistance <= sentinel.moveRange + sentinel.range && distFromHome < maxWanderDist) {
                const targetX = closestTarget.type === 'builder' ? closestTarget.data.currentX : closestTarget.data.x;
                const targetY = closestTarget.type === 'builder' ? closestTarget.data.currentY : closestTarget.data.y;

                this.moveSentinelToward(sentinel, targetX, targetY, homeX, homeY, maxWanderDist);
            } else if (distFromHome > maxWanderDist) {
                this.moveSentinelToward(sentinel, homeX, homeY, homeX, homeY, maxWanderDist + 2);
                if (distFromHome > maxWanderDist + 5) {
                    delete sentinel.aggroTarget;
                }
            } else if (Math.random() < 0.3) {
                const wanderX = sentinel.x + Math.floor(Math.random() * 3) - 1;
                const wanderY = sentinel.y + Math.floor(Math.random() * 3) - 1;
                const newDistFromHome = Math.abs(wanderX - homeX) + Math.abs(wanderY - homeY);

                if (newDistFromHome <= maxWanderDist) {
                    this.moveSentinelToward(sentinel, wanderX, wanderY, homeX, homeY, maxWanderDist);
                }
            }
        });

        if (this.shouldLaunchAssault()) {
            this.launchAssault();
        }

        return { continue: true };
    }

    updateGuardian() {
        const guardian = this.guardian;

        if (!guardian || guardian.defeated || guardian.health <= 0) {
            return;
        }

        const healthPercent = (guardian.health / guardian.maxHealth) * 100;

        if (healthPercent <= 66 && guardian.phase === 1) {
            guardian.phase = 2;
            guardian.damage += 20;
            guardian.moveRange += 1;
            this.game.log(`🔥 ${guardian.name} ENRAGED! Phase 2 activated!`);
        } else if (healthPercent <= 33 && guardian.phase === 2) {
            guardian.phase = 3;
            guardian.damage += 20;
            guardian.range += 1;
            this.game.log(`⚡ ${guardian.name} CRITICAL MODE! Phase 3 activated!`);
        }

        if (guardian.specialCooldown > 0) {
            guardian.specialCooldown--;
        }

        let closestTarget = null;
        let closestDistance = Infinity;

        this.armies.forEach(army => {
            const distance = Math.abs(guardian.x - army.x) + Math.abs(guardian.y - army.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = army;
            }
        });

        if (guardian.phase === 3 && guardian.specialCooldown === 0 && closestDistance <= 5) {
            this.guardianAOEAttack(guardian);
            guardian.specialCooldown = 3;
            guardian.attacked = true;
            return;
        }

        if (closestTarget && closestDistance <= guardian.range) {
            closestTarget.health -= guardian.damage;
            guardian.attacked = true;

            this.game.log(`${guardian.name} attacks ${closestTarget.type} for ${guardian.damage} damage!`);

            if (closestTarget.health <= 0) {
                this.armies = this.armies.filter(a => a.id !== closestTarget.id);
                this.game.log(`${closestTarget.type} was obliterated by ${guardian.name}!`);
            }
        } else if (closestTarget && closestDistance <= guardian.moveRange + guardian.range) {
            this.moveSentinelToward(guardian, closestTarget.x, closestTarget.y, guardian.x, guardian.y, 100);
        }
    }

    guardianAOEAttack(guardian) {
        this.game.log(`💥 ${guardian.name} unleashes AREA DEVASTATION!`);

        let hitCount = 0;
        this.armies.forEach(army => {
            const distance = Math.abs(guardian.x - army.x) + Math.abs(guardian.y - army.y);
            if (distance <= 2) {
                army.health -= Math.floor(guardian.damage * 0.75);
                hitCount++;

                if (army.health <= 0) {
                    this.armies = this.armies.filter(a => a.id !== army.id);
                    this.game.log(`${army.type} was caught in the blast!`);
                }
            }
        });

        if (hitCount > 0) {
            this.game.log(`Area attack hit ${hitCount} units!`);
        }
    }

    moveSentinelToward(sentinel, targetX, targetY, homeX, homeY, maxDist) {
        const dx = Math.sign(targetX - sentinel.x);
        const dy = Math.sign(targetY - sentinel.y);

        for (let i = 0; i < sentinel.moveRange; i++) {
            const newX = sentinel.x + (dx !== 0 ? dx : 0);
            const newY = sentinel.y + (dy !== 0 ? dy : 0);

            const newDistFromHome = Math.abs(newX - homeX) + Math.abs(newY - homeY);
            if (newDistFromHome > maxDist) break;

            if (newX < 0 || newX >= this.planet.width || newY < 0 || newY >= this.planet.height) break;

            const tile = this.planet.tiles[newY][newX];
            if (tile.type === 'water' || tile.type === 'lava' || tile.type === 'void') break;

            const occupied = this.armies.some(a => a.x === newX && a.y === newY) ||
                            this.sentinels.some(s => s.x === newX && s.y === newY && s.id !== sentinel.id) ||
                            this.game.player.builders.some(b => b.currentX === newX && b.currentY === newY);

            if (!occupied) {
                sentinel.x = newX;
                sentinel.y = newY;
                this.game.unitActionSystem.processOverwatch(sentinel);
            }
        }
    }

    spawnGuardian() {
        const centerX = Math.floor(this.planet.width / 2);
        const centerY = Math.floor(this.planet.height / 2);

        const validPos = this.findValidPosition(centerX, centerY);
        if (!validPos) return;

        const guardianTypes = ['Colossus', 'Devastator', 'Annihilator', 'Destroyer'];
        const guardianName = guardianTypes[Math.floor(Math.random() * guardianTypes.length)];

        this.guardian = {
            id: 999,
            x: validPos.x,
            y: validPos.y,
            name: guardianName,
            health: 500 + (this.difficulty * 200),
            maxHealth: 500 + (this.difficulty * 200),
            damage: 40 + (this.difficulty * 10),
            range: 3,
            moveRange: 3,
            type: 'guardian',
            moved: false,
            attacked: false,
            phase: 1,
            isGuardian: true,
            specialCooldown: 0
        };

        this.sentinels.push(this.guardian);
        this.game.log(`⚠️ GUARDIAN ${guardianName} HAS AWAKENED! ⚠️`);
    }

    shouldLaunchAssault() {
        const hasPlayerNearNodes = this.defenseNodes.some(node => {
            if (node.hacked) return false;

            return this.armies.some(army => {
                const dist = Math.abs(army.x - node.x) + Math.abs(army.y - node.y);
                return dist <= 3;
            });
        });

        if (hasPlayerNearNodes) return false;

        const sentinelCount = this.sentinels.filter(s => !s.isGuardian && !s.defeated).length;
        if (sentinelCount < 3) return false;

        return Math.random() < 0.3;
    }

    launchAssault() {
        if (!this.spaceship) return;

        this.sentinels.forEach(sentinel => {
            if (sentinel.isGuardian || sentinel.defeated) return;

            sentinel.assaulting = true;
            sentinel.assaultTarget = { x: this.spaceship.x, y: this.spaceship.y };

            delete sentinel.homeX;
            delete sentinel.homeY;
        });

        this.game.log('⚠️ SENTINEL ASSAULT LAUNCHED! All sentinels converging on your spaceship!');
        if (typeof AudioManager !== 'undefined') {
            AudioManager.playSFX('sfx-eruption-major', 0.5);
        }
    }

    endPlayerTurn() {
        this.armies.forEach(army => {
            army.moved = false;
            army.attacked = false;
        });

        this.playerPhase = false;
        const result = this.enemyPhase();

        if (result.defeat) {
            return result;
        }

        this.playerPhase = true;
        this.turn++;

        const allNodesHacked = this.defenseNodes.every(n => n.hacked);
        const allSentinelsDestroyed = this.sentinels.filter(s => !s.defeated).length === 0;

        if (allNodesHacked && allSentinelsDestroyed) {
            return { victory: true };
        }

        return { continue: true };
    }

    isConquestComplete() {
        return this.defenseNodes.every(n => n.hacked) && this.sentinels.length === 0;
    }
}