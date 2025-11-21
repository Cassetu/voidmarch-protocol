class Game {
    constructor() {
        this._builtBuildingsUI = false;
        this._lastAvailableBuildingsKey = '';
        this._lastSelectedBuilding = null;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        this.player = new Player();
        this.world = new World(this.player);
        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.input = new Input();

        this.gameState = 'volcanic';
        this.renderer.zoom = 0.8;
        this.currentPlanet = this.world.createVolcanicWorld();
        this.running = true;

        this.cameraX = 0;
        this.cameraY = 0;


        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('wheel', (e) => this.handleZoom(e));
        this.log('Voidmarch Protocol initialized');

        document.addEventListener('pointerdown', (e) => {
            console.log('GLOBAL pointerdown target:', e.target && e.target.id ? e.target.id : e.target);
        }, true);

        document.addEventListener('click', (e) => {
            console.log('GLOBAL click target:', e.target && e.target.id ? e.target.id : e.target);
        }, true);
    }


    centerCamera() {
        const halfW = this.renderer.tileWidth / 2;
        const halfH = this.renderer.tileHeight / 2;

        const w = this.currentPlanet.width;
        const h = this.currentPlanet.height;

        const minX = -(h - 1) * halfW;
        const maxX = (w - 1) * halfW;
        const minY = 0;
        const maxY = (w + h - 2) * halfH;

        const viewW = this.width / this.renderer.zoom;
        const viewH = (this.height - 160 - 75) / this.renderer.zoom;

        this.cameraX = (minX + maxX - viewW) / 2;
        this.cameraY = (minY + maxY - viewH) / 2;
    }


    handleZoom(e) {
//
//        const zoomSpeed = 0.1;
//
//        const viewCenterWorldX = this.cameraX + (this.width / 2) / this.renderer.zoom;
//        const viewCenterWorldY = this.cameraY + ((this.height - 160 - 75) / 2) / this.renderer.zoom;
//
//        if (e.deltaY > 0) {
//            this.renderer.zoom = Math.max(0.5, this.renderer.zoom - zoomSpeed);
//        } else {
//            this.renderer.zoom = Math.min(3, this.renderer.zoom + zoomSpeed);
//        }
//
//        this.cameraX = viewCenterWorldX - (this.width / 2) / this.renderer.zoom;
//        this.cameraY = viewCenterWorldY - ((this.height - 160 - 75) / 2) / this.renderer.zoom;
//
//        console.log(`Zoom level: ${this.renderer.zoom.toFixed(2)}`);
//
//        this.updateCamera();
    }



    handleResize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    update(deltaTime) {
        this.handleInput();
        this.input.update();
        this.currentPlanet.update(deltaTime, this.player);
        this.updateCamera();
    }

    handleInput() {
        const moveSpeed = 8;
        const canvasTop = 75;
        const canvasBottom = window.innerHeight - 160;
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;

        if (this.input.keys['ArrowUp'] || this.input.keys['w']) {
            this.cameraY += moveSpeed;
            console.log('Camera moved up');
        }
        if (this.input.keys['ArrowDown'] || this.input.keys['s']) {
            this.cameraY -= moveSpeed;
            console.log('Camera moved down');
        }
        if (this.input.keys['ArrowLeft'] || this.input.keys['a']) {
            this.cameraX += moveSpeed;
            console.log('Camera moved left');
        }
        if (this.input.keys['ArrowRight'] || this.input.keys['d']) {
            this.cameraX -= moveSpeed;
            console.log('Camera moved right');
        }

        if (this.input.mouseJustPressed && this.player.selectedBuilding) {
            if (this.input.mouseY > canvasTop && this.input.mouseY < canvasBottom) {
                const mouseX = this.input.mouseX;
                const mouseY = this.input.mouseY - canvasTop;

                const centerGridX = this.currentPlanet.width / 2;
                const centerGridY = this.currentPlanet.height / 2;
                const centerWorldX = (centerGridX - centerGridY) * unitX;
                const centerWorldY = (centerGridX + centerGridY) * unitY;

                const targetX = (this.width / 2) / this.renderer.zoom + this.cameraX;
                const targetY = ((this.height - 160 - 75) / 2) / this.renderer.zoom + this.cameraY;

                const translateX = targetX - centerWorldX;
                const translateY = targetY - centerWorldY;

                const worldX = (mouseX / this.renderer.zoom) - translateX;
                const worldY = (mouseY / this.renderer.zoom) - translateY;

                const gridX = Math.round((worldX / unitX + worldY / unitY) / 2 - 3);
                const gridY = Math.round((worldY / unitY - worldX / unitX) / 2 - 3);

                console.log(`Click world pos: (${worldX.toFixed(0)}, ${worldY.toFixed(0)}) Grid: (${gridX}, ${gridY})`);

                if (this.currentPlanet.placeBuilding(gridX, gridY, this.player.selectedBuilding, this.player)) {
                    const msg = `Built ${this.player.selectedBuilding} at (${gridX}, ${gridY})`;
                    this.log(msg);
                    console.log(msg);
                    this.player.selectedBuilding = null;
                    const buildingsList = document.getElementById('buildings-list');
                    if (buildingsList) this._updateBuildingButtonsActive(buildingsList);
                } else {
                    const msg = `Cannot build ${this.player.selectedBuilding} at (${gridX}, ${gridY})`;
                    this.log(msg);
                    console.log(msg);
                }
            }
        }
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

        // draw building preview under cursor if a building is selected
        if (this.player.selectedBuilding) {
            this._drawBuildingPreview();
        }

        this.updateUI();
    }

    gridToWorld(gridX, gridY) {
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;
        const worldX = (gridX - gridY) * unitX;
        const worldY = (gridX + gridY) * unitY;
        return { worldX, worldY };
    }

    _drawBuildingPreview() {
        const canvasTop = 75;
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;

        const mouseX = this.input.mouseX;
        const mouseY = this.input.mouseY - canvasTop;

        const centerGridX = this.currentPlanet.width / 2;
        const centerGridY = this.currentPlanet.height / 2;
        const centerWorldX = (centerGridX - centerGridY) * unitX;
        const centerWorldY = (centerGridX + centerGridY) * unitY;

        const targetX = (this.width / 2) / this.renderer.zoom + this.cameraX;
        const targetY = ((this.height - 160 - 75) / 2) / this.renderer.zoom + this.cameraY;

        const translateX = targetX - centerWorldX;
        const translateY = targetY - centerWorldY;

        const worldX = (mouseX / this.renderer.zoom) - translateX;
        const worldY = (mouseY / this.renderer.zoom) - translateY;

        const gridX = Math.round((worldX / unitX + worldY / unitY) / 2);
        const gridY = Math.round((worldY / unitY - worldX / unitX) / 2);

        const tileWorldX = (gridX - gridY) * unitX;
        const tileWorldY = (gridX + gridY) * unitY;

        const sx = (tileWorldX + translateX) * this.renderer.zoom;
        const sy = (tileWorldY + translateY) * this.renderer.zoom + canvasTop;

        const sxOffset = unitX * this.renderer.zoom;
        const syOffset = unitY * this.renderer.zoom;

        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = 'rgba(0, 150, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy - syOffset);
        this.ctx.lineTo(sx - sxOffset, sy);
        this.ctx.lineTo(sx, sy + syOffset);
        this.ctx.lineTo(sx + sxOffset, sy);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = 'rgba(100, 200, 255, 1)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }

    updateCamera() {
        const halfW = this.renderer.tileWidth / 2;
        const halfH = this.renderer.tileHeight / 2;

        const w = this.currentPlanet.width;
        const h = this.currentPlanet.height;

        const minX = -(h - 1) * halfW;
        const maxX = (w - 1) * halfW;
        const minY = 0;
        const maxY = (w + h - 2) * halfH;

        const padding = 200;

        const viewW = this.width / this.renderer.zoom;
        const viewH = (this.height - 160 - 75) / this.renderer.zoom;

        // map center in world coords
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // number of tiles outward from center (round up)
        const tilesOut = Math.ceil(Math.max(w, h) / 2);

        // convert tilesOut to world units. tileWidth = halfW * 2, tileHeight = halfH * 2
        const extentX = tilesOut * (halfW * 2);
        const extentY = tilesOut * (halfH * 2);

        // horizontal clamp based on tiles-out extent + padding
        const minCameraX = centerX - extentX - padding;
        const maxCameraX = centerX + extentX - viewW + padding;

        if (viewW >= (extentX * 2) + (padding * 2)) {
            this.cameraX = centerX - viewW / 2;
        } else {
            this.cameraX = Math.max(minCameraX, Math.min(this.cameraX, maxCameraX));
        }

        const minCameraY = centerY - extentY - padding;
        const maxCameraY = centerY + extentY - viewH + padding;

        if (viewH >= (extentY * 2) + (padding * 2)) {
            this.cameraY = centerY - viewH / 2;
        } else {
            this.cameraY = Math.max(minCameraY, Math.min(this.cameraY, maxCameraY));
        }
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

        // draw building preview under cursor if a building is selected
        if (this.player.selectedBuilding) {
            this._drawBuildingPreview();
        }

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
        if (!buildingsList) return;

        buildingsList.style.zIndex = '1000';
        buildingsList.style.pointerEvents = 'auto';

        const availableBuildings = this.player.getAvailableBuildings();
        const key = availableBuildings.join('|');

        if (!this._builtBuildingsUI || key !== this._lastAvailableBuildingsKey) {
            buildingsList.innerHTML = '';
            availableBuildings.forEach(buildingType => {
                const btn = document.createElement('button');
                btn.className = 'building-button';
                btn.textContent = buildingType.charAt(0).toUpperCase() + buildingType.slice(1);
                btn.dataset.type = buildingType;
                btn.style.pointerEvents = 'auto';

                // changed: only toggle selection here; DO NOT place immediately on button click
                const handler = (e) => {
                    e.stopPropagation();
                    console.log('building button clicked:', buildingType);

                    const wasSelected = this.player.selectedBuilding === buildingType;
                    this.player.selectedBuilding = wasSelected ? null : buildingType;

                    const msg = this.player.selectedBuilding ? `Selected: ${buildingType}` : 'Deselected building';
                    this.log(msg);
                    console.log(msg);

                    this._lastSelectedBuilding = this.player.selectedBuilding;
                    this._updateBuildingButtonsActive(buildingsList);
                };

                btn.addEventListener('click', handler);
                btn.addEventListener('mousedown', (e) => e.stopPropagation());

                buildingsList.appendChild(btn);
            });

            this._builtBuildingsUI = true;
            this._lastAvailableBuildingsKey = key;
        }

        this._updateBuildingButtonsActive(buildingsList);

        const researchBtn = document.getElementById('research-btn');
        if (!researchBtn) return;

        const nextAges = ['bronze', 'iron', 'medieval', 'renaissance'];
        const nextAge = nextAges.find(age => this.player.techs[age].level === 0);

        if (nextAge) {
            const cost = this.player.techs[nextAge].cost;
            researchBtn.textContent = `${this.player.techs[nextAge].name} (${cost})`;
            researchBtn.disabled = !this.player.canResearch(nextAge);
            researchBtn.onclick = (e) => {
                e.stopPropagation();
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

    _updateBuildingButtonsActive(buildingsList) {
        Array.from(buildingsList.children).forEach(btn => {
            const type = btn.dataset.type;
            if (this.player.selectedBuilding === type) btn.classList.add('active');
            else btn.classList.remove('active');
        });
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
        this.updateCamera();
        requestAnimationFrame(this.gameLoop);
    }

}

const game = new Game();
game.start();