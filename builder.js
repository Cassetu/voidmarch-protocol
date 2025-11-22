class Builder {
    constructor(id, startX, startY, targetX, targetY, buildingType, distance) {
        this.id = id;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.currentX = startX;
        this.currentY = startY;
        this.buildingType = buildingType;
        this.distance = distance;
        this.turnsToArrive = Math.max(1, Math.ceil((distance - 1) / 2));
        this.turnsBuilding = this.calculateBuildTime(buildingType);
        this.totalTurns = this.turnsToArrive + this.turnsBuilding;
        this.turnsElapsed = 0;
        this.arrived = false;
        this.turnsAtSite = 0;
        this.path = null;
    }

    calculateBuildTime(buildingType) {
        const buildTimes = {
            settlement: 3,
            farm: 2,
            warehouse: 2,
            observatory: 3,
            barracks: 3,
            temple: 4,
            forge: 4,
            market: 3,
            castle: 6,
            library: 5,
            university: 5
        };
        return buildTimes[buildingType] || 2;
    }

    findPath(planet) {
        const openSet = [];
        const closedSet = new Set();
        const start = { x: this.currentX, y: this.currentY, g: 0, h: 0, f: 0, parent: null };
        openSet.push(start);

        const goal = { x: this.targetX, y: this.targetY };
        const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();

            if (current.x === goal.x && current.y === goal.y) {
                const path = [];
                let node = current;
                while (node.parent) {
                    path.unshift({ x: node.x, y: node.y });
                    node = node.parent;
                }
                return path;
            }

            closedSet.add(`${current.x},${current.y}`);

            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x < 0 || neighbor.x >= planet.width ||
                    neighbor.y < 0 || neighbor.y >= planet.height) continue;

                const tile = planet.tiles[neighbor.y][neighbor.x];
                if (tile.type === 'lava' || tile.type === 'water' || tile.type === 'void') {
                    const distToGoal = heuristic(neighbor, goal);
                    if (distToGoal > 1) continue;
                }

                if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

                const g = current.g + 1;
                const h = heuristic(neighbor, goal);
                const f = g + h;

                const existing = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (existing && g >= existing.g) continue;

                if (existing) {
                    existing.g = g;
                    existing.f = f;
                    existing.parent = current;
                } else {
                    openSet.push({ x: neighbor.x, y: neighbor.y, g, h, f, parent: current });
                }
            }
        }

        return null;
    }

    moveTowardTarget() {
        if (this.currentX === this.targetX && this.currentY === this.targetY) {
            return true;
        }

        if (!this.path || this.path.length === 0) {
            return false;
        }

        const nextStep = this.path[0];
        this.currentX = nextStep.x;
        this.currentY = nextStep.y;
        this.path.shift();

        return false;
    }

    isComplete() {
        return this.arrived && this.turnsAtSite >= this.turnsBuilding;
    }

    update() {
        this.turnsElapsed++;

        if (!this.arrived) {
            this.moveTowardTarget();

            const distanceToTarget = Math.abs(this.currentX - this.targetX) + Math.abs(this.currentY - this.targetY);

            if (distanceToTarget === 1) {
                this.arrived = true;
                this.turnsAtSite = 0;
                return { state: 'arrived', progress: 0 };
            }

            const progress = Math.min(99, (this.turnsElapsed / this.turnsToArrive) * 100);
            return { state: 'traveling', progress: Math.floor(progress) };
        }

        this.turnsAtSite++;
        const buildProgress = (this.turnsAtSite / this.turnsBuilding) * 100;

        if (buildProgress >= 100) {
            return { state: 'complete', progress: 100 };
        }

        return { state: 'building', progress: Math.floor(buildProgress) };
    }
}