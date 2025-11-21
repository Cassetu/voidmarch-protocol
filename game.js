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
        this.eventSystem = new EventSystem(this.currentPlanet, this.player);
        this.turnBased = true;

        this.player.techTree = new TechTree(this.player);
        this.eventSystem = new EventSystem(this.currentPlanet, this.player);

        this.gameState = 'volcanic';
        this.renderer.zoom = 0.8;
        this.currentPlanet = this.world.createVolcanicWorld();
        this.running = true;

        this.galaxy = new Galaxy(this);
        this.conquestSystem = null;
        this.gameMode = 'building';

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

        document.getElementById('end-turn-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.endTurn();
        });
    }

    endTurn() {
        this.player.nextTurn();

        let totalFood = 0;
        let totalProduction = 0;
        let totalScience = 0;

        this.currentPlanet.structures.forEach(building => {
            const tile = this.currentPlanet.tiles[building.y][building.x];
            totalFood += tile.yields.food;
            totalProduction += tile.yields.production;
            totalScience += tile.yields.science;

            if (building.type === 'observatory') {
                totalScience += 3;
            }

            if (tile.hasGeothermal && building.type === 'forge') {
                totalProduction += 5;
            }
        });

        totalScience += Math.floor(this.player.population / 10);
        totalProduction += this.player.productionBonus;
        totalFood += this.player.foodBonus;

        this.player.addFood(totalFood);
        this.player.addProduction(totalProduction);
        this.player.addScience(totalScience);

        const researchResult = this.player.techTree.progressResearch(totalScience);

        if (researchResult && researchResult.completed) {
            this.log(`RESEARCH COMPLETE: ${this.player.techTree.techs[researchResult.completed].name}`);

            if (researchResult.victory) {
                const victoryTech = this.player.techTree.techs[researchResult.completed];
                this.log(`VICTORY! ${victoryTech.name} - Galaxy unlocked!`);
                this.showGalaxyMap();
                return;
            }
        }

        const eventResult = this.eventSystem.onTurnEnd();

        if (eventResult.gameOver) {
            this.log('PLANET CORE COLLAPSED - GAME OVER');
            this.running = false;
        }


        this.log(`Turn ${this.player.turn} complete. Core Stability: ${Math.floor(this.eventSystem.coreStability)}%`);
    }

    showGalaxyMap() {
        const modal = document.createElement('div');
        modal.id = 'galaxy-modal';
        modal.innerHTML = `
            <div class="galaxy-modal-content">
                <h2>Galaxy Map - Choose Your Next World</h2>
                <div id="planet-list"></div>
                <button id="close-galaxy-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        const planetList = document.getElementById('planet-list');

        this.galaxy.planets.forEach(planet => {
            const canAccess = this.galaxy.canAccessPlanet(planet.id);

            const planetDiv = document.createElement('div');
            planetDiv.className = 'planet-item' + (planet.conquered ? ' planet-conquered' : '') + (!canAccess ? ' planet-locked' : '');
            planetDiv.innerHTML = `
                <div class="planet-name">${planet.name}</div>
                <div class="planet-type">${planet.type.toUpperCase()}</div>
                <div class="planet-status">${planet.conquered ? 'CONQUERED' : `Sentinels: ${planet.sentinelStrength}`}</div>
                <div class="planet-rewards">+${planet.resources} Resources, +${planet.scienceBonus} Science/turn</div>
            `;

            if (canAccess) {
                planetDiv.onclick = () => {
                    const result = this.galaxy.travelToPlanet(planet.id);
                    if (result.success) {
                        this.currentPlanet = result.planet;

                        if (result.mode === 'conquest') {
                            this.startConquestMode(result);
                        } else {
                            this.gameMode = 'building';
                            this.conquestSystem = null;
                        }

                        this.centerCamera();
                        this.log(`Traveled to ${planet.name}`);
                        document.body.removeChild(modal);
                    }
                };
            }

            planetList.appendChild(planetDiv);
        });

        document.getElementById('close-galaxy-modal').onclick = () => {
            document.body.removeChild(modal);
        };
    }

    startConquestMode(conquestData) {
        this.gameMode = 'conquest';
        this.conquestSystem = new ConquestSystem(
            this,
            this.currentPlanet,
            conquestData.defenseGrid,
            conquestData.sentinelStrength,
            conquestData.hackingRequired
        );
        this.log('CONQUEST MODE: Deploy armies and hack defense grid!');
    }

    endConquestTurn() {
        if (!this.conquestSystem) return;

        const result = this.conquestSystem.endConquestTurn();

        if (result.victory) {
            const planetId = this.galaxy.currentPlanetIndex;
            this.galaxy.conqueredPlanet(planetId);
            this.log('PLANET CONQUERED! Returning to peaceful mode.');
            this.gameMode = 'building';
            this.conquestSystem = null;
            this.showGalaxyMap();
        } else if (result.defeat) {
            this.log('DEFEAT! Insufficient forces. Retreating...');
            this.galaxy.travelToPlanet(0);
            this.gameMode = 'building';
            this.conquestSystem = null;
        }
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

        if (this.conquestSystem) {
            this.conquestSystem.armies.forEach(army => {
                this.renderer.drawUnit(army, this.cameraX, this.cameraY, '#00ff00');
            });

            this.conquestSystem.sentinels.forEach(sentinel => {
                this.renderer.drawUnit(sentinel, this.cameraX, this.cameraY, '#ff0000');
            });
        }

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
        document.getElementById('science-count').textContent = Math.floor(this.player.science);
        document.getElementById('production-count').textContent = Math.floor(this.player.production);
        document.getElementById('turn-count').textContent = this.player.turn;
        document.getElementById('core-stability').textContent = Math.floor(this.eventSystem.coreStability) + '%';

        if (this.gameMode === 'conquest' && this.conquestSystem) {
            document.getElementById('conquest-info').style.display = 'block';
            document.getElementById('conquest-progress').textContent =
                `Hacking: ${Math.floor(this.conquestSystem.hackingProgress)}/${this.conquestSystem.hackingRequired}`;
            document.getElementById('conquest-enemies').textContent =
                `Sentinels: ${this.conquestSystem.sentinels.length}`;
        } else {
            document.getElementById('conquest-info').style.display = 'none';
        }

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

        const availableTechs = this.player.techTree.getAvailableTechs();

        if (availableTechs.length > 0) {
            const researchInfo = this.player.techTree.getResearchInfo();

            if (researchInfo) {
                researchBtn.textContent = `${researchInfo.name} (${researchInfo.progress}%)`;
                researchBtn.disabled = true;
            } else {
                researchBtn.textContent = 'Choose Research';
                researchBtn.disabled = false;
                researchBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.showTechTreeUI();
                };
            }
        } else {
            const researchInfo = this.player.techTree.getResearchInfo();
            if (researchInfo) {
                researchBtn.textContent = `${researchInfo.name} (${researchInfo.progress}%)`;
                researchBtn.disabled = true;
            } else {
                researchBtn.textContent = 'No Available Research';
                researchBtn.disabled = true;
            }
        }
    }

    showTechTreeUI() {
        const modal = document.createElement('div');
        modal.id = 'tech-modal';
        modal.innerHTML = `
            <div class="tech-modal-content">
                <h2>Research Technology</h2>
                <div id="tech-list"></div>
                <button id="close-tech-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        const techList = document.getElementById('tech-list');
        const availableTechs = this.player.techTree.getAvailableTechs();

        availableTechs.forEach(techId => {
            const tech = this.player.techTree.techs[techId];
            const canAfford = this.player.science >= tech.cost;

            const techDiv = document.createElement('div');
            techDiv.className = 'tech-item' + (canAfford ? '' : ' tech-disabled');
            techDiv.innerHTML = `
                <div class="tech-name">${tech.name}</div>
                <div class="tech-cost">Cost: ${tech.cost} Science</div>
                <div class="tech-desc">${tech.description}</div>
                <div class="tech-type">${tech.type.toUpperCase()}</div>
            `;

            if (canAfford) {
                techDiv.onclick = () => {
                    if (this.player.techTree.startResearch(techId)) {
                        this.log(`Started researching: ${tech.name}`);
                        document.body.removeChild(modal);
                        this.updateBuildingUI();
                    }
                };
            }

            techList.appendChild(techDiv);
        });

        document.getElementById('close-tech-modal').onclick = () => {
            document.body.removeChild(modal);
        };
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