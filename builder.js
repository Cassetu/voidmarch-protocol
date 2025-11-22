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
        this.turnsToArrive = Math.ceil(distance / 2);
        this.turnsBuilding = this.calculateBuildTime(buildingType);
        this.totalTurns = this.turnsToArrive + this.turnsBuilding;
        this.turnsElapsed = 0;
        this.arrived = false;
        this.hasPlaced = false;
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

    moveTowardTarget() {
        if (this.currentX === this.targetX && this.currentY === this.targetY) {
            return true;
        }

        const dx = this.targetX - this.currentX;
        const dy = this.targetY - this.currentY;

        if (Math.abs(dx) > Math.abs(dy)) {
            this.currentX += Math.sign(dx);
        } else if (Math.abs(dy) > Math.abs(dx)) {
            this.currentY += Math.sign(dy);
        } else {
            if (Math.random() > 0.5) {
                this.currentX += Math.sign(dx) || 0;
            } else {
                this.currentY += Math.sign(dy) || 0;
            }
        }

        return false;
    }

    update() {
        this.turnsElapsed++;

        if (!this.arrived && this.turnsElapsed <= this.turnsToArrive) {
            this.moveTowardTarget();
            const progress = (this.turnsElapsed / this.turnsToArrive) * 100;
            return { state: 'traveling', progress: Math.floor(progress) };
        }

        if (!this.arrived) {
            this.arrived = true;
        }

        const buildProgress = ((this.turnsElapsed - this.turnsToArrive) / this.turnsBuilding) * 100;
        if (buildProgress >= 100) {
            return { state: 'complete', progress: 100 };
        }

        return { state: 'building', progress: Math.floor(buildProgress) };
    }

    isComplete() {
        return this.turnsElapsed >= this.totalTurns;
    }
}