class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        this.player = new Player();
        this.world = new World(this.player);
        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.input = new Input();

        this.gameState = 'volcanic';
        this.currentPlanet = this.world.createVolcanicWorld();
        this.running = true;

        this.cameraX = 0;
        this.cameraY = 0;

        this.centerCamera();

        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('wheel', (e) => this.handleZoom(e));
        this.log('Voidmarch Protocol initialized');
    }

    centerCamera() {
        const planetWorldWidth = this.currentPlanet.width * 32;
        const planetWorldHeight = this.currentPlanet.height * 16;

        const isometricWidth = (this.currentPlanet.width + this.currentPlanet.height) * 16;
        const isometricHeight = (this.currentPlanet.width + this.currentPlanet.height) * 8;

        const centerX = (isometricWidth / 2) - (this.width / (2 * this.renderer.zoom));
        const centerY = (isometricHeight / 2) - ((this.height - 160 - 75) / (2 * this.renderer.zoom));

        this.cameraX = Math.max(0, centerX);
        this.cameraY = Math.max(0, centerY);
    }

    handleZoom(e) {
        e.preventDefault();
        const oldZoom = this.renderer.zoom;
        const zoomSpeed = 0.1;

        if (e.deltaY > 0) {
            this.renderer.zoom = Math.max(0.5, this.renderer.zoom - zoomSpeed);
        } else {
            this.renderer.zoom = Math.min(3, this.renderer.zoom + zoomSpeed);
        }

        console.log(`Zoom: ${this.renderer.zoom.toFixed(2)}x`);
        this.log(`Zoom: ${this.renderer.zoom.toFixed(2)}x`);
    }

    handleResize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    update(deltaTime) {
        this.input.update();
        this.handleInput();
        this.currentPlanet.update(deltaTime, this.player);
        this.updateCamera();
    }

    handleInput() {
        const moveSpeed = 8;

        if (this.input.keys['ArrowUp'] || this.input.keys['w']) {
            this.cameraY -= moveSpeed;
            console.log('Camera moved up');
        }
        if (this.input.keys['ArrowDown'] || this.input.keys['s']) {
            this.cameraY += moveSpeed;
            console.log('Camera moved down');
        }
        if (this.input.keys['ArrowLeft'] || this.input.keys['a']) {
            this.cameraX -= moveSpeed;
            console.log('Camera moved left');
        }
        if (this.input.keys['ArrowRight'] || this.input.keys['d']) {
            this.cameraX += moveSpeed;
            console.log('Camera moved right');
        }

        if (this.input.mouseJustPressed && this.player.selectedBuilding) {
            const canvasTop = 75;
            const canvasBottom = window.innerHeight - 160;

            if (this.input.mouseY > canvasTop && this.input.mouseY < canvasBottom) {
                const worldX = (this.input.mouseX / this.renderer.zoom) + this.cameraX;
                const worldY = (this.input.mouseY - canvasTop) / this.renderer.zoom + this.cameraY;

                const gridX = Math.round(((worldX / 32) + (worldY / 16)) / 2);
                const gridY = Math.round(((worldY / 16) - (worldX / 32)) / 2);

                console.log(`Click world pos: (${worldX.toFixed(0)}, ${worldY.toFixed(0)}) Grid: (${gridX}, ${gridY})`);

                if (this.currentPlanet.placeBuilding(gridX, gridY, this.player.selectedBuilding, this.player)) {
                    const msg = `Built ${this.player.selectedBuilding} at (${gridX}, ${gridY})`;
                    this.log(msg);
                    console.log(msg);
                } else {
                    const msg = `Cannot build ${this.player.selectedBuilding} at (${gridX}, ${gridY})`;
                    this.log(msg);
                    console.log(msg);
                }
            }
        }
    }

    updateCamera() {
        const canvasHeight = this.height - 160 - 75;
        const planetWorldWidth = this.currentPlanet.width * 32;
        const planetWorldHeight = this.currentPlanet.height * 16;

        const maxX = planetWorldWidth - (this.width / this.renderer.zoom) / 2;
        const maxY = planetWorldHeight - (canvasHeight / this.renderer.zoom) / 2;

        this.cameraX = Math.max(0, Math.min(this.cameraX, maxX));
        this.cameraY = Math.max(0, Math.min(this.cameraY, maxY));
    }

    render() {
        this.ctx.fillStyle = '#1a1f2e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.renderer.drawWorld(
            this.currentPlanet,
            this.cameraX,
            this.cameraY,
            this.player
        );

        this.updateUI();
    }

    updateUI() {
        document.getElementById('resource-count').textContent = Math.floor(this.player.resources);
        document.getElementById('food-count').textContent = Math.floor(this.player.food);
        document.getElementById('population-count').textContent = Math.floor(this.player.population);
        document.getElementById('age-display').textContent = this.player.age.charAt(0).toUpperCase() + this.player.age.slice(1);

        this.updateBuildingUI();
    }

    updateBuildingUI() {
        const buildingsList = document.getElementById('buildings-list');
        buildingsList.innerHTML = '';

        const availableBuildings = this.player.getAvailableBuildings();
        availableBuildings.forEach(buildingType => {
            const btn = document.createElement('button');
            btn.className = 'building-button';
            btn.textContent = buildingType.charAt(0).toUpperCase() + buildingType.slice(1);
            btn.onclick = () => {
                this.player.selectedBuilding = this.player.selectedBuilding === buildingType ? null : buildingType;
                const msg = this.player.selectedBuilding ? `Selected: ${buildingType}` : 'Deselected building';
                this.log(msg);
                console.log(msg);
                this.updateBuildingUI();
            };
            if (this.player.selectedBuilding === buildingType) {
                btn.classList.add('active');
            }
            buildingsList.appendChild(btn);
        });

        const researchBtn = document.getElementById('research-btn');
        const nextAges = ['bronze', 'iron', 'medieval', 'renaissance'];
        const nextAge = nextAges.find(age => this.player.techs[age].level === 0);

        if (nextAge) {
            const cost = this.player.techs[nextAge].cost;
            researchBtn.textContent = `${this.player.techs[nextAge].name} (${cost})`;
            researchBtn.disabled = !this.player.canResearch(nextAge);
            researchBtn.onclick = () => {
                if (this.player.researchTech(nextAge)) {
                    const msg = `Researched ${this.player.techs[nextAge].name}!`;
                    this.log(msg);
                    console.log(msg);
                    this.updateBuildingUI();
                }
            };
        } else {
            researchBtn.textContent = 'All Ages Unlocked';
            researchBtn.disabled = true;
        }
    }

    log(message) {
        const consoleEl = document.getElementById('console');
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        consoleEl.appendChild(p);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    gameLoop = (timestamp) => {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop);
    }

    start() {
        requestAnimationFrame(this.gameLoop);
    }
}

const game = new Game();
game.start();