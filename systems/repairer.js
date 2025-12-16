class Repairer {
    constructor(id, startX, startY, targetX, targetY, buildingType, distance, repairAmount) {
        this.id = id;
        this.startX = startX;
        this.startY = startY;
        this.currentX = startX;
        this.currentY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.buildingType = buildingType;
        this.distance = distance;
        this.repairAmount = repairAmount;
        this.totalRepairTime = Math.ceil(repairAmount / 5);
        this.arrived = false;
        this.progress = 0;
        this.path = null;
        this.pathIndex = 0;
        this.moveSpeed = 1;
    }

    findPath(planet) {
        const path = [];
        let currentX = this.startX;
        let currentY = this.startY;

        while (currentX !== this.targetX || currentY !== this.targetY) {
            if (currentX < this.targetX && planet.tiles[currentY][currentX + 1].type !== 'lava') {
                currentX++;
            } else if (currentX > this.targetX && planet.tiles[currentY][currentX - 1].type !== 'lava') {
                currentX--;
            } else if (currentY < this.targetY && planet.tiles[currentY + 1][currentX].type !== 'lava') {
                currentY++;
            } else if (currentY > this.targetY && planet.tiles[currentY - 1][currentX].type !== 'lava') {
                currentY--;
            } else {
                return null;
            }

            path.push({ x: currentX, y: currentY });
        }

        return path;
    }

    update() {
        if (!this.arrived && this.path) {
            if (this.pathIndex < this.path.length) {
                const nextPos = this.path[this.pathIndex];
                this.currentX = nextPos.x;
                this.currentY = nextPos.y;
                this.pathIndex++;
            } else {
                this.arrived = true;
            }
        }

        if (this.arrived) {
            this.progress += 100 / this.totalRepairTime;
        }

        return {
            arrived: this.arrived,
            progress: Math.min(100, this.progress)
        };
    }

    isComplete() {
        return this.arrived && this.progress >= 100;
    }
}