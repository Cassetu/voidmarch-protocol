class ConquestSystem {
    constructor(game, planet, defenseGrid, sentinelStrength, hackingRequired) {
        this.game = game;
        this.planet = planet;
        this.defenseGrid = defenseGrid;
        this.sentinelStrength = sentinelStrength;
        this.hackingRequired = hackingRequired;
        this.hackingProgress = 0;
        this.armies = [];
        this.sentinels = [];
        this.mode = 'hacking';
        this.selectedArmy = null;
        this.spawnSentinels();
    }

    spawnSentinels() {
        const sentinelCount = Math.floor(this.sentinelStrength / 10);

        for (let i = 0; i < sentinelCount; i++) {
            const x = Math.floor(Math.random() * this.planet.width);
            const y = Math.floor(Math.random() * this.planet.height);

            this.sentinels.push({
                id: i,
                x: x,
                y: y,
                health: 50 + this.sentinelStrength,
                damage: 5 + Math.floor(this.sentinelStrength / 5),
                range: 3,
                active: true,
                type: 'sentinel'
            });
        }
    }

    deployArmy(x, y, armyType) {
        const armyTypes = {
            assault: { health: 100, damage: 15, range: 1, cost: 50 },
            ranger: { health: 60, damage: 10, range: 4, cost: 40 },
            tank: { health: 200, damage: 8, range: 1, cost: 80 },
            hacker: { health: 40, damage: 5, range: 2, hackBonus: 10, cost: 60 }
        };

        const stats = armyTypes[armyType];
        if (!this.game.player.spendResources(stats.cost)) return false;

        this.armies.push({
            id: this.armies.length,
            x: x,
            y: y,
            health: stats.health,
            maxHealth: stats.health,
            damage: stats.damage,
            range: stats.range,
            hackBonus: stats.hackBonus || 0,
            type: armyType,
            moved: false
        });

        return true;
    }

    moveArmy(armyId, targetX, targetY) {
        const army = this.armies.find(a => a.id === armyId);
        if (!army || army.moved) return false;

        const distance = Math.abs(army.x - targetX) + Math.abs(army.y - targetY);
        if (distance > 3) return false;

        army.x = targetX;
        army.y = targetY;
        army.moved = true;

        return true;
    }

    attackWithArmy(armyId, targetId, isTargetSentinel) {
        const army = this.armies.find(a => a.id === armyId);
        if (!army) return false;

        const target = isTargetSentinel
            ? this.sentinels.find(s => s.id === targetId)
            : this.armies.find(a => a.id === targetId);

        if (!target) return false;

        const distance = Math.abs(army.x - target.x) + Math.abs(army.y - target.y);
        if (distance > army.range) return false;

        target.health -= army.damage;

        if (target.health <= 0) {
            if (isTargetSentinel) {
                target.active = false;
                this.sentinels = this.sentinels.filter(s => s.id !== targetId);
            } else {
                this.armies = this.armies.filter(a => a.id !== targetId);
            }
        }

        return true;
    }

    hackDefenseNode(nodeId) {
        const node = this.defenseGrid.nodes[nodeId];
        if (!node || !node.active) return false;

        let hackPower = 10;

        this.armies.forEach(army => {
            if (army.hackBonus) {
                const distance = Math.sqrt(
                    Math.pow(army.x - this.planet.width / 2, 2) +
                    Math.pow(army.y - this.planet.height / 2, 2)
                );
                if (distance < 10) {
                    hackPower += army.hackBonus;
                }
            }
        });

        node.health -= hackPower;

        if (node.health <= 0) {
            node.active = false;
            this.defenseGrid.integrity -= 100 / this.defenseGrid.nodes.length;
        }

        this.hackingProgress += hackPower;

        return true;
    }

    sentinelsTurn() {
        this.sentinels.forEach(sentinel => {
            if (!sentinel.active) return;

            let closestArmy = null;
            let closestDistance = Infinity;

            this.armies.forEach(army => {
                const distance = Math.abs(sentinel.x - army.x) + Math.abs(sentinel.y - army.y);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestArmy = army;
                }
            });

            if (closestArmy && closestDistance <= sentinel.range) {
                closestArmy.health -= sentinel.damage;
                if (closestArmy.health <= 0) {
                    this.armies = this.armies.filter(a => a.id !== closestArmy.id);
                }
            } else if (closestArmy && closestDistance <= 5) {
                if (sentinel.x < closestArmy.x) sentinel.x++;
                else if (sentinel.x > closestArmy.x) sentinel.x--;
                else if (sentinel.y < closestArmy.y) sentinel.y++;
                else if (sentinel.y > closestArmy.y) sentinel.y--;
            }
        });
    }

    endConquestTurn() {
        this.sentinelsTurn();

        this.armies.forEach(army => army.moved = false);

        if (this.hackingProgress >= this.hackingRequired && this.sentinels.length === 0) {
            return { victory: true };
        }

        if (this.armies.length === 0 && this.game.player.resources < 40) {
            return { defeat: true };
        }

        return { continue: true };
    }

    isConquestComplete() {
        return this.hackingProgress >= this.hackingRequired && this.sentinels.length === 0;
    }
}