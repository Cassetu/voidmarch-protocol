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

        window.addEventListener('resize', () => this.handleResize());
        this.log('Voidmarch Protocol initialized');
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
        this.updateBuildingUI();
    }

    handleInput() {
        if (this.input.keys['ArrowUp'] || this.input.keys['w']) {
            this.cameraY -= 5;
        }
        if (this.input.keys['ArrowDown'] || this.input.keys['s']) {
            this.cameraY += 5;
        }
        if (this.input.keys['ArrowLeft'] || this.input.keys['a']) {
            this.cameraX -= 5;
        }
        if (this.input.keys['ArrowRight'] || this.input.keys['d']) {
            this.cameraX += 5;
        }

        if (this.input.mouseDown && this.player.selectedBuilding) {
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();

            if (this.input.mouseY > 75 && this.input.mouseY < window.innerHeight - 160) {
                const mouseX = this.input.mouseX + this.cameraX;
                const mouseY = this.input.mouseY - 75 + this.cameraY;

                const gridX = Math.round((mouseX / 32 + mouseY / 16) / 2);
                const gridY = Math.round((mouseY / 16 - mouseX / 32) / 2);

                if (this.currentPlanet.placeBuilding(gridX, gridY, this.player.selectedBuilding, this.player)) {
                    this.log(`Built ${this.player.selectedBuilding}`);
                } else {
                    this.log(`Cannot build there`);
                }
            }
        }
    }

    updateCamera() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        this.cameraX = Math.max(0, Math.min(this.cameraX, this.currentPlanet.width * 64 - centerX));
        this.cameraY = Math.max(0, Math.min(this.cameraY, this.currentPlanet.height * 64 - centerY));
    }

    render() {
        this.ctx.fillStyle = '#0a0e27';
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
                    this.log(`Researched ${this.player.techs[nextAge].name}!`);
                    this.updateBuildingUI();
                }
            };
        } else {
            researchBtn.textContent = 'All Ages Unlocked';
            researchBtn.disabled = true;
        }
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
                this.updateBuildingUI();
            };
            if (this.player.selectedBuilding === buildingType) {
                btn.classList.add('active');
            }
            buildingsList.appendChild(btn);
        });

        document.getElementById('current-age').textContent = this.player.age.charAt(0).toUpperCase() + this.player.age.slice(1);
        document.getElementById('pop-stat').textContent = Math.floor(this.player.population);
        document.getElementById('food-stat').textContent = Math.floor(this.player.food);

        const researchBtn = document.getElementById('research-btn');
        const nextAges = ['bronze', 'iron', 'medieval', 'renaissance'];
        const nextAge = nextAges.find(age => this.player.techs[age].level === 0);

        if (nextAge) {
            const cost = this.player.techs[nextAge].cost;
            researchBtn.textContent = `Research ${this.player.techs[nextAge].name} (${cost})`;
            researchBtn.disabled = !this.player.canResearch(nextAge);
            researchBtn.onclick = () => {
                if (this.player.researchTech(nextAge)) {
                    this.log(`Researched ${this.player.techs[nextAge].name}!`);
                }
            };
        }
    }

    log(message) {
        const console = document.getElementById('console');
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        console.appendChild(p);
        console.scrollTop = console.scrollHeight;
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