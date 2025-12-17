class TimingGame {
    constructor(onSuccess, onFailure) {
        this.onSuccess = onSuccess;
        this.onFailure = onFailure;
        this.barPosition = 0;
        this.barSpeed = 2;
        this.barDirection = 1;
        this.targetCenter = 50;
        this.targetWidth = 10;
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.barPosition = 0;
        this.barDirection = 1;
    }

    update() {
        if (!this.isActive) return;

        this.barPosition += this.barSpeed * this.barDirection;

        if (this.barPosition >= 100) {
            this.barDirection = -1;
        } else if (this.barPosition <= 0) {
            this.barDirection = 1;
        }
    }

    attempt() {
        if (!this.isActive) return;

        const distance = Math.abs(this.barPosition - this.targetCenter);
        const isPerfect = distance <= this.targetWidth / 2;
        const isGood = distance <= this.targetWidth;

        this.isActive = false;

        if (isPerfect) {
            this.onSuccess('perfect');
        } else if (isGood) {
            this.onSuccess('good');
        } else {
            this.onFailure();
        }
    }
}