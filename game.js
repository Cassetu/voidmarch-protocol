class Game {
    constructor() {
        this._builtBuildingsUI = false;
        this._lastAvailableBuildingsKey = '';
        this._lastSelectedBuilding = null;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.unitActionSystem = new UnitActionSystem(this);
        this.cheatCodeSequence = [];
        this.cheatCodeTarget = ['q', 'w', 'e', 'r', 't', 'y', 'c', 'a', 's'];
        this.cheatCodeTimeout = null;
        this.eruptionSequence = [];
        this.eruptionTarget = ['e', 'r', 't', 'y'];
        this.hiringMode = null;
        this.deployMode = null;
        this.selectedUnit = null;
        this.player = new Player();
        this.world = new World(this.player);
        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.input = new Input();
        this.currentPlanet = this.world.createVolcanicWorld();
        this.eventSystem = new EventSystem(this.currentPlanet, this.player, this);
        this.turnBased = true;
        this.player.techTree = new TechTree(this.player);
        this.gameState = 'volcanic';
        this.renderer.zoom = 0.8;
        this.initializeStartingBuildings();
        this.running = true;
        this.galaxy = new Galaxy(this);
        this.conquestSystem = null;
        this.gameMode = 'building';
        this.cameraX = 0;
        this.cameraY = 0;
        this.shakeIntensity = 0;

        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('wheel', (e) => this.handleZoom(e));
        window.addEventListener('keypress', (e) => this.handleCheatCode(e));
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

        const deployAssaultBtn = document.getElementById('deploy-assault-btn');
        if (deployAssaultBtn) {
            deployAssaultBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.player.selectedBuilding = null;
                this.hiringMode = 'assault';
                this.log('Click adjacent to your buildings to hire Assault unit');
            });
        }

        const deployRangerBtn = document.getElementById('deploy-ranger-btn');
        if (deployRangerBtn) {
            deployRangerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.player.selectedBuilding = null;
                this.hiringMode = 'ranger';
                this.log('Click adjacent to your buildings to hire Ranger unit');
            });
        }

        const deployTankBtn = document.getElementById('deploy-tank-btn');
        if (deployTankBtn) {
            deployTankBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.player.selectedBuilding = null;
                this.hiringMode = 'tank';
                this.log('Click adjacent to your buildings to hire Tank unit');
            });
        }

        const deployHackerBtn = document.getElementById('deploy-hacker-btn');
        if (deployHackerBtn) {
            deployHackerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.player.selectedBuilding = null;
                this.hiringMode = 'hacker';
                this.log('Click adjacent to your buildings to hire Hacker unit');
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.unitActionSystem.actionMode) {
                    this.unitActionSystem.actionMode = null;
                    this.unitActionSystem.selectedUnit = null;
                    this.selectedUnit = null;
                    this.log('Action cancelled');
                }
            }
        });
    }

    initializeStartingBuildings() {
        let startX = 25;
        let startY = 20;

        for (let y = 15; y < 30; y++) {
            for (let x = 20; x < 35; x++) {
                if (this.currentPlanet.tiles[y][x].type !== 'lava' &&
                    this.currentPlanet.tiles[y + 1] &&
                    this.currentPlanet.tiles[y + 1][x + 1] &&
                    this.currentPlanet.tiles[y + 1][x + 1].type !== 'lava') {
                    startX = x;
                    startY = y;
                    break;
                }
            }
            if (startX !== 25 || startY !== 20) break;
        }

        const settlement = new Building(startX, startY, 'settlement');
        settlement.isFrame = false;
        settlement.buildProgress = 100;

        const farm = new Building(startX + 1, startY + 1, 'farm');
        farm.isFrame = false;
        farm.buildProgress = 100;

        this.currentPlanet.tiles[startY][startX].building = settlement;
        this.currentPlanet.tiles[startY + 1][startX + 1].building = farm;

        this.currentPlanet.structures.push(settlement);
        this.currentPlanet.structures.push(farm);

        this.player.addBuilding(settlement);
        this.player.addBuilding(farm);

        this.log('Starting settlement and farm placed');
    }

    endTurn() {
        if (this.gameMode === 'conquest') {
            this.updateBuilders();
            this.endConquestTurn();
            return;
        }

        this.eventSystem.planet = this.currentPlanet;

        this.player.nextTurn();
        this.updateBuilders();

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

        totalScience += this.player.scienceBonus;
        totalProduction += this.player.productionBonus;
        totalFood += this.player.foodBonus;

        this.player.sciencePerTurn = totalScience;

        this.player.addFood(totalFood);
        this.player.addProduction(totalProduction);

        const researchResult = this.player.techTree.progressResearch();

        if (researchResult && researchResult.completed) {
            this.log(`RESEARCH COMPLETE: ${this.player.techTree.techs[researchResult.completed].name}`);

            if (researchResult.victory) {
                const victoryTech = this.player.techTree.techs[researchResult.completed];
                this.log(`VICTORY! ${victoryTech.name} - Galaxy unlocked!`);

                document.getElementById('galaxy-map-btn').style.display = 'block';

                this.showGalaxyMap();
                return;
            }
        }

        if (this.galaxy.currentPlanetIndex === 0) {
            const eventResult = this.eventSystem.onTurnEnd();

            if (eventResult.gameOver) {
                this.log('PLANET CORE COLLAPSED - GAME OVER');
                this.running = false;
            }
        }

        this.log(`Turn ${this.player.turn} complete. Core Stability: ${Math.floor(this.eventSystem.coreStability)}%`);
    }

    screenShake(duration, intensity) {
        this.shakeIntensity = intensity;
        this.shakeStartTime = Date.now();
        this.shakeDuration = duration;
    }

    handleCheatCode(e) {
        const key = e.key.toLowerCase();

        if (this.galaxy.currentPlanetIndex === 0) {
            this.eruptionSequence.push(key);
            if (this.eruptionSequence.length > this.eruptionTarget.length) {
                this.eruptionSequence.shift();
            }

            if (this.eruptionSequence.length === this.eruptionTarget.length) {
                let matches = true;
                for (let i = 0; i < this.eruptionTarget.length; i++) {
                    if (this.eruptionSequence[i] !== this.eruptionTarget[i]) {
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    this.log('MANUAL ERUPTION TRIGGERED!');
                    const result = this.eventSystem.causeEruption();
                    if (!result.resisted) {
                        this.screenShake(10000, 25);
                        this.log(`Eruption at (${result.x}, ${result.y}) - ${result.destroyedBuildings} buildings destroyed!`);
                    }
                    this.eruptionSequence = [];
                    return;
                }
            }
        }

        if (this.gameMode === 'conquest') return;

        this.cheatCodeSequence.push(key);

        if (this.cheatCodeSequence.length > this.cheatCodeTarget.length) {
            this.cheatCodeSequence.shift();
        }

        clearTimeout(this.cheatCodeTimeout);
        this.cheatCodeTimeout = setTimeout(() => {
            this.cheatCodeSequence = [];
        }, 2000);

        if (this.cheatCodeSequence.length === this.cheatCodeTarget.length) {
            let matches = true;
            for (let i = 0; i < this.cheatCodeTarget.length; i++) {
                if (this.cheatCodeSequence[i] !== this.cheatCodeTarget[i]) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                this.activateCheatCode();
                this.cheatCodeSequence = [];
            }
        }
    }

    activateCheatCode() {
        this.log('CHEAT CODE ACTIVATED!');

        this.player.resources = 5000;
        this.player.science = 1000;
        this.player.food = 500;
        this.player.population = 200;

        this.player.techTree.techs['mining'].researched = true;
        this.player.techTree.techs['shelter'].researched = true;
        this.player.techTree.techs['farming'].researched = true;
        this.player.techTree.techs['deepMining'].researched = true;
        this.player.techTree.techs['reinforcedStructures'].researched = true;
        this.player.techTree.techs['hydroponics'].researched = true;
        this.player.techTree.techs['geothermalHarvesting'].researched = true;

        this.player.techTree.techs['exodusProtocol'].researched = true;

        this.player.techTree.techs['mining'].unlocks.forEach(unlock => {
            this.player.techTree.applyBonus(this.player.techTree.techs['mining'].bonus);
        });
        this.player.techTree.applyBonus(this.player.techTree.techs['mining'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['shelter'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['farming'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['deepMining'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['reinforcedStructures'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['hydroponics'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['geothermalHarvesting'].bonus);

        document.getElementById('galaxy-map-btn').style.display = 'block';

        this.log('Unlocked galaxy travel! Resources, science, food, and population boosted!');
        this.log('Click Galaxy Map to travel to the second planet.');

        setTimeout(() => {
            this.showGalaxyMap();
        }, 500);
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
            this.galaxy.planets[this.galaxy.currentPlanetIndex].difficulty
        );
        this.log('CONQUEST MODE: Hire units, hack nodes, destroy sentinels!');
        this.hiringMode = null;
    }

    endConquestTurn() {
        if (!this.conquestSystem) return;

        this.unitActionSystem.onTurnEnd();
        const result = this.conquestSystem.endPlayerTurn();

        if (result.victory) {
            const planetId = this.galaxy.currentPlanetIndex;
            this.galaxy.conqueredPlanet(planetId);
            this.log('PLANET CONQUERED! Returning to peaceful mode.');
            this.gameMode = 'building';
            this.conquestSystem = null;
            this.showGalaxyMap();
        } else if (result.defeat) {
            this.log('DEFEAT! Your spaceship was destroyed. Retreating...');
            this.galaxy.travelToPlanet(0);
            this.currentPlanet = this.galaxy.planets[0];
            this.gameMode = 'building';
            this.conquestSystem = null;
        } else {
            this.log(`Enemy turn complete. Turn ${this.conquestSystem.turn + 1} begins.`);
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

        if (this.eventSystem.activeEruption) {
            this.eventSystem.updateEruption();
        }
    }

    handleInput() {
        const moveSpeed = 8;
        const canvasTop = 75;
        const canvasBottom = window.innerHeight - 160;
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;

        if (this.input.keys['ArrowUp'] || this.input.keys['w']) {
            this.cameraY += moveSpeed;
        }
        if (this.input.keys['ArrowDown'] || this.input.keys['s']) {
            this.cameraY -= moveSpeed;
        }
        if (this.input.keys['ArrowLeft'] || this.input.keys['a']) {
            this.cameraX += moveSpeed;
        }
        if (this.input.keys['ArrowRight'] || this.input.keys['d']) {
            this.cameraX -= moveSpeed;
        }

        if (this.input.mouseJustPressed) {
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

                const gridX = Math.round((worldX / unitX + worldY / unitY) / 2);
                const gridY = Math.round((worldY / unitY - worldX / unitX) / 2);

                if (this.gameMode === 'conquest' && this.conquestSystem) {
                    if (this.conquestSystem.hackingMiniGame) {
                        return;
                    }

                    if (this.player.selectedBuilding) {
                        console.log('Building selected in conquest mode:', this.player.selectedBuilding, 'at', gridX, gridY);

                        const hasNearbyEnemy = this.conquestSystem && this.conquestSystem.sentinels.some(s => {
                            const dist = Math.abs(s.x - gridX) + Math.abs(s.y - gridY);
                            return dist <= s.range;
                        });

                        if (hasNearbyEnemy) {
                            this.log('Enemy nearby! Cannot send builders to this location.');
                            return;
                        }

                        const settlement = this.selectNearestSettlement(gridX, gridY);
                        if (!settlement) {
                            this.log('No settlement or spaceship nearby to send builders from!');
                            return;
                        }

                        const distance = Math.abs(settlement.x - gridX) + Math.abs(settlement.y - gridY);
                        const builderId = this.player.builders.length;
                        const buildingType = this.player.selectedBuilding;

                        const builder = new Builder(
                            builderId,
                            settlement.x,
                            settlement.y,
                            gridX,
                            gridY,
                            buildingType,
                            distance
                        );

                        this.player.builders.push(builder);
                        this.player.buildingQueue.push({
                            x: gridX,
                            y: gridY,
                            type: buildingType,
                            builderId: builderId,
                            hasEnemy: false
                        });

                        const tile = this.currentPlanet.tiles[gridY][gridX];
                        console.log('Creating frame at', gridX, gridY, 'buildingType:', buildingType);
                        if (tile && !tile.building) {
                            const tempBuilding = new Building(gridX, gridY, buildingType);
                            tempBuilding.isFrame = true;
                            tempBuilding.buildProgress = 0;
                            tile.building = tempBuilding;
                            this.currentPlanet.structures.push(tempBuilding);
                            console.log('Frame created on planet 2:', tempBuilding);
                        }

                        this.log(`Sending builders from ${settlement.type} to construct ${buildingType}`);
                        this.player.selectedBuilding = null;
                        const buildingsList = document.getElementById('buildings-list');
                        if (buildingsList) this._updateBuildingButtonsActive(buildingsList);
                    }
                } else if (this.gameMode === 'building' && this.player.selectedBuilding) {
                      const settlement = this.selectNearestSettlement(gridX, gridY);
                      if (!settlement) {
                          this.log('No settlement nearby to send builders from!');
                          return;
                      }

                      const distance = Math.abs(settlement.x - gridX) + Math.abs(settlement.y - gridY);
                      const builderId = this.player.builders.length;

                      const builder = new Builder(
                          builderId,
                          settlement.x,
                          settlement.y,
                          gridX,
                          gridY,
                          this.player.selectedBuilding,
                          distance
                      );

                      this.player.builders.push(builder);
                      this.player.buildingQueue.push({
                          x: gridX,
                          y: gridY,
                          type: this.player.selectedBuilding,
                          builderId: builderId,
                          hasEnemy: false
                      });

                      const tile = this.currentPlanet.tiles[gridY][gridX];
                      if (tile && !tile.building) {
                          const tempBuilding = new Building(gridX, gridY, this.player.selectedBuilding);
                          tempBuilding.isFrame = true;
                          tempBuilding.buildProgress = 0;
                          tile.building = tempBuilding;
                          this.currentPlanet.structures.push(tempBuilding);
                          console.log('Frame created on planet 2:', tempBuilding);
                      }

                      this.log(`Sending builders from ${settlement.type} to construct ${this.player.selectedBuilding}`);
                      this.player.selectedBuilding = null;
                      const buildingsList = document.getElementById('buildings-list');
                      if (buildingsList) this._updateBuildingButtonsActive(buildingsList);
                }

                if (!this.player.selectedBuilding && !this.hiringMode && !this.unitActionSystem.actionMode) {
                    const tile = this.currentPlanet.tiles[gridY][gridX];
                    if (tile) {
                        this.showTileInfo(tile, gridX, gridY);
                    }
                }
            }
        }
    }

    showTileInfo(tile, x, y) {
        const infoPanel = document.getElementById('building-info');
        if (!infoPanel) return;

        const tileNames = {
            lava: 'Lava',
            rock: 'Rock',
            ash: 'Volcanic Ash',
            darksoil: 'Dark Soil',
            grass: 'Grassland',
            water: 'Water',
            forest: 'Forest',
            ice: 'Ice',
            frozen: 'Frozen Ground',
            tundra: 'Tundra',
            sand: 'Sand',
            dunes: 'Sand Dunes',
            oasis: 'Oasis',
            island: 'Island',
            reef: 'Coral Reef',
            deepwater: 'Deep Water',
            jungle: 'Jungle',
            swamp: 'Swamp',
            canopy: 'Canopy',
            floating: 'Floating Island',
            void: 'Void',
            nebula: 'Nebula',
            stars: 'Starfield'
        };

        const tileName = tileNames[tile.type] || tile.type;

        let html = `
            <p style="font-size: 10px; color: #a8b8d8;"><strong>${tileName}</strong></p>
            <p style="font-size: 9px; color: #8fa3c8;">Position: (${x}, ${y})</p>
            <p style="font-size: 9px; color: #8fa3c8;">Food: +${tile.yields.food}</p>
            <p style="font-size: 9px; color: #8fa3c8;">Production: +${tile.yields.production}</p>
            <p style="font-size: 9px; color: #8fa3c8;">Science: +${tile.yields.science}</p>
        `;

        if (tile.hasGeothermal) {
            html += `<p style="font-size: 9px; color: #ff8800;">🔥 Geothermal Vent</p>`;
        }

        if (tile.isFloating) {
            html += `<p style="font-size: 9px; color: #88ccff;">☁️ Floating Terrain</p>`;
        }

        if (tile.type === 'lava') {
            html += `<p style="font-size: 9px; color: #ff4400;">⚠️ Impassable</p>`;
        }

        if (tile.building) {
            html += `<p style="font-size: 9px; color: #ffaa00; margin-top: 6px;">Building: ${tile.building.type}</p>`;
            if (tile.building.type !== 'ruins') {
                const healthPercent = Math.floor((tile.building.health / tile.building.maxHealth) * 100);
                let healthColor = '#88ff88';
                if (healthPercent < 30) healthColor = '#ff5555';
                else if (healthPercent < 60) healthColor = '#ffaa55';
                html += `<p style="font-size: 9px; color: ${healthColor};">HP: ${Math.floor(tile.building.health)}/${tile.building.maxHealth} (${healthPercent}%)</p>`;
            }
        }

        infoPanel.innerHTML = html;
    }

    selectNearestSettlement(targetX, targetY) {
        const settlements = this.currentPlanet.structures.filter(s =>
            s.type === 'settlement' || s.type === 'spaceship'
        );

        if (settlements.length === 0) return null;

        let nearest = settlements[0];
        let minDist = Math.abs(nearest.x - targetX) + Math.abs(nearest.y - targetY);

        for (let i = 1; i < settlements.length; i++) {
            const dist = Math.abs(settlements[i].x - targetX) + Math.abs(settlements[i].y - targetY);
            if (dist < minDist) {
                minDist = dist;
                nearest = settlements[i];
            }
        }

        return nearest;
    }

    updateBuilders() {
        for (let i = this.player.builders.length - 1; i >= 0; i--) {
            const builder = this.player.builders[i];

            if (!builder.path && !builder.arrived) {
                builder.path = builder.findPath(this.currentPlanet);
                if (!builder.path) {
                    this.log(`Cannot reach building site at (${builder.targetX}, ${builder.targetY}) - blocked by lava!`);
                    this.player.builders.splice(i, 1);
                    this.player.buildingQueue = this.player.buildingQueue.filter(b => b.builderId !== builder.id);

                    const tile = this.currentPlanet.tiles[builder.targetY][builder.targetX];
                    if (tile && tile.building && tile.building.isFrame) {
                        this.currentPlanet.structures = this.currentPlanet.structures.filter(s => s !== tile.building);
                        tile.building = null;
                    }
                    continue;
                }
            }

            const builderState = builder.update();
            const queuedBuilding = this.player.buildingQueue.find(b => b.builderId === builder.id);
            if (queuedBuilding) {
                queuedBuilding.builderProgress = builderState.progress;
            }

            if (builder.arrived) {
                const tile = this.currentPlanet.tiles[builder.targetY][builder.targetX];
                if (tile && tile.building && tile.building.type === builder.buildingType) {
                    tile.building.buildProgress = builderState.progress;
                }
            }

            if (builder.isComplete()) {
                const tile = this.currentPlanet.tiles[builder.targetY][builder.targetX];
                if (tile && tile.building && tile.building.type === builder.buildingType) {
                    tile.building.isFrame = false;
                    tile.building.buildProgress = 100;
                    this.player.addBuilding(tile.building);
                    this.log(`Building complete: ${builder.buildingType} at (${builder.targetX}, ${builder.targetY})`);
                } else if (tile && !tile.building) {
                    const completedBuilding = new Building(builder.targetX, builder.targetY, builder.buildingType);
                    completedBuilding.isFrame = false;
                    completedBuilding.buildProgress = 100;
                    tile.building = completedBuilding;
                    this.currentPlanet.structures.push(completedBuilding);
                    this.player.addBuilding(completedBuilding);
                    this.log(`Building complete: ${builder.buildingType} at (${builder.targetX}, ${builder.targetY})`);
                }

                this.player.builders.splice(i, 1);
                this.player.buildingQueue = this.player.buildingQueue.filter(b => b.builderId !== builder.id);
            }
        }

        this.player.buildingQueue.forEach(queuedBuilding => {
            const hasEnemy = this.conquestSystem && this.conquestSystem.sentinels.some(s => {
                const dist = Math.abs(s.x - queuedBuilding.x) + Math.abs(s.y - queuedBuilding.y);
                return dist <= s.range;
            });
            queuedBuilding.hasEnemy = hasEnemy;
        });
    }

    showBuildingInfo(building) {
        const infoPanel = document.getElementById('building-info');
        if (!infoPanel) return;

        if (building.type === 'spaceship') {
            infoPanel.innerHTML = `
                <p style="font-size: 10px; color: #a8b8d8;"><strong>Crashed Spaceship</strong></p>
                <p style="font-size: 9px; color: #8fa3c8;">HP: ${Math.floor(building.health)}/${building.maxHealth}</p>
                <p style="font-size: 9px; color: #8fa3c8;">Cryo: ${building.cryoPopulation}</p>
                <button id="unfreeze-btn" style="width: 100%; padding: 4px; font-size: 9px; margin-top: 4px;">
                    Unfreeze 50 Pop
                </button>
            `;

            const unfreezeBtn = document.getElementById('unfreeze-btn');
            if (unfreezeBtn) {
                unfreezeBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (this.conquestSystem.unfreezePopulation(50)) {
                        this.showBuildingInfo(building);
                    }
                };
                unfreezeBtn.disabled = building.cryoPopulation < 50;
            }
        } else if (building.type === 'defense_node') {
            infoPanel.innerHTML = `
                <p style="font-size: 10px; color: #ff8888;"><strong>Defense Node ${building.id}</strong></p>
                <p style="font-size: 9px; color: #ff6666;">HP: ${Math.floor(building.health)}/${building.maxHealth}</p>
                <p style="font-size: 9px; color: #ff6666;">Status: ${building.hacked ? 'HACKED' : 'ACTIVE'}</p>
                <p style="font-size: 9px; color: #ff6666;">Spawns: ${building.armyType}</p>
            `;
        } else {
            infoPanel.innerHTML = `
                <p style="font-size: 10px; color: #a8b8d8;"><strong>${building.type}</strong></p>
                <p style="font-size: 9px; color: #8fa3c8;">HP: ${Math.floor(building.health)}/${building.maxHealth}</p>
            `;
        }
    }

    showHackingMiniGame() {
        if (!this.conquestSystem.hackingMiniGame) return;

        const modal = document.createElement('div');
        modal.id = 'hacking-modal';
        modal.innerHTML = `
            <div class="hacking-modal-content">
                <h2>HACKING DEFENSE NODE</h2>
                <p id="hack-timer">Time: 30s</p>
                <p style="font-size: 11px; color: #8fa3c8; margin-bottom: 10px;">
                    Connect the green SOURCE to red TARGET by toggling wire segments
                </p>
                <canvas id="hacking-canvas" width="360" height="360"></canvas>
                <div style="margin-top: 10px;">
                    <button id="complete-hack-btn" disabled>Complete Hack</button>
                    <button id="cancel-hack-btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const canvas = document.getElementById('hacking-canvas');
        const ctx = canvas.getContext('2d');
        const cellSize = 60;

        const renderHackingGrid = () => {
            const pattern = this.conquestSystem.hackingMiniGame.pattern;
            ctx.fillStyle = '#0a0f1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let y = 0; y < pattern.length; y++) {
                for (let x = 0; x < pattern[y].length; x++) {
                    const cell = pattern[y][x];
                    const px = x * cellSize;
                    const py = y * cellSize;

                    ctx.strokeStyle = '#3a4a5a';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(px, py, cellSize, cellSize);

                    if (cell.type === 'source') {
                        ctx.fillStyle = '#00ff00';
                        ctx.fillRect(px + 5, py + 5, cellSize - 10, cellSize - 10);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 12px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('SRC', px + cellSize / 2, py + cellSize / 2 + 5);
                    } else if (cell.type === 'target') {
                        ctx.fillStyle = '#ff0000';
                        ctx.fillRect(px + 5, py + 5, cellSize - 10, cellSize - 10);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 12px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('TGT', px + cellSize / 2, py + cellSize / 2 + 5);
                    } else if (cell.type === 'wire') {
                        if (cell.reachable) {
                            ctx.fillStyle = '#00ffff';
                            ctx.fillRect(px + 5, py + 5, cellSize - 10, cellSize - 10);
                        } else if (cell.powered) {
                            ctx.fillStyle = '#4a6a8a';
                            ctx.fillRect(px + 5, py + 5, cellSize - 10, cellSize - 10);
                        } else {
                            ctx.fillStyle = '#2a3a4a';
                            ctx.fillRect(px + 5, py + 5, cellSize - 10, cellSize - 10);
                        }

                        ctx.strokeStyle = cell.powered ? '#ffffff' : '#5a6a7a';
                        ctx.lineWidth = 3;
                        ctx.strokeRect(px + 15, py + 15, cellSize - 30, cellSize - 30);
                    }
                }
            }

            document.getElementById('complete-hack-btn').disabled = !this.conquestSystem.hackingMiniGame.complete;
        };

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / cellSize);
            const y = Math.floor((e.clientY - rect.top) / cellSize);

            if (this.conquestSystem.toggleCircuitCell(x, y)) {
                renderHackingGrid();
            }
        });

        document.getElementById('complete-hack-btn').onclick = () => {
            if (this.conquestSystem.completeHacking()) {
                document.body.removeChild(modal);
            }
        };

        document.getElementById('cancel-hack-btn').onclick = () => {
            this.conquestSystem.cancelHacking();
            document.body.removeChild(modal);
        };

        const hackingInterval = setInterval(() => {
            if (!this.conquestSystem.hackingMiniGame) {
                clearInterval(hackingInterval);
                if (document.getElementById('hacking-modal')) {
                    document.body.removeChild(document.getElementById('hacking-modal'));
                }
                return;
            }

            this.conquestSystem.updateHackingTimer(0.1);
            const timeEl = document.getElementById('hack-timer');
            if (timeEl) {
                timeEl.textContent = `Time: ${Math.ceil(this.conquestSystem.hackingMiniGame.timeRemaining)}s`;
            }
        }, 100);

        renderHackingGrid();
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

        this.ctx.save();
        const topBarHeight = 75;
        let shakeX = 0;
        let shakeY = 0;
        if (this.shakeIntensity && this.shakeStartTime) {
            const elapsed = Date.now() - this.shakeStartTime;
            if (elapsed < this.shakeDuration) {
                const progress = elapsed / this.shakeDuration;
                const currentIntensity = this.shakeIntensity * (1 - progress);
                const time = Date.now() / 50;
                shakeX = Math.sin(time) * currentIntensity;
                shakeY = Math.cos(time * 1.3) * currentIntensity;
            } else {
                this.shakeIntensity = 0;
            }
        }
        this.ctx.translate(shakeX, topBarHeight + shakeY);
        this.ctx.scale(this.renderer.zoom, this.renderer.zoom);

        const centerGridX = this.currentPlanet.width / 2;
        const centerGridY = this.currentPlanet.height / 2;
        const centerScreenX = (centerGridX - centerGridY) * (this.renderer.tileWidth / 2);
        const centerScreenY = (centerGridX + centerGridY) * (this.renderer.tileHeight / 2);

        const targetX = (this.width / 2) / this.renderer.zoom + this.cameraX;
        const targetY = ((this.height - topBarHeight - 160) / 2) / this.renderer.zoom + this.cameraY;

        this.ctx.translate(
            targetX - centerScreenX,
            targetY - centerScreenY
        );

        for (let y = 0; y < this.currentPlanet.height; y++) {
            for (let x = 0; x < this.currentPlanet.width; x++) {
                this.renderer.drawTile(x, y, this.currentPlanet.tiles[y][x], this.cameraX, this.cameraY);
            }
        }

        if (Math.random() < 0.05) {
            for (let y = 0; y < this.currentPlanet.height; y++) {
                for (let x = 0; x < this.currentPlanet.width; x++) {
                    if (this.currentPlanet.tiles[y][x].type === 'lava' && Math.random() < 0.1) {
                        this.renderer.createLavaSpark(x, y);
                    }
                }
            }
        }

        this.renderer.updateLavaSparks();

        this.currentPlanet.structures.forEach(building => {
            this.renderer.drawBuilding(building, this.cameraX, this.cameraY);
        });

        if (this.conquestSystem) {
            this.conquestSystem.defenseNodes.forEach(node => {
                this.renderer.drawDefenseNode(node, this.cameraX, this.cameraY);
            });

            if (this.unitActionSystem.actionMode === 'move') {
                this.renderer.drawSentinelMovementRanges(this.conquestSystem.sentinels, this.cameraX, this.cameraY);
                this.renderer.drawSentinelAttackRanges(this.conquestSystem.sentinels, this.cameraX, this.cameraY);
            }

            if (this.unitActionSystem.actionMode === 'attack') {
                this.renderer.drawSentinelMovementRanges(this.conquestSystem.sentinels, this.cameraX, this.cameraY);
                this.renderer.drawSentinelAttackRanges(this.conquestSystem.sentinels, this.cameraX, this.cameraY);
            }

            if (this.selectedUnit && !this.unitActionSystem.actionMode) {
                this.renderer.drawMovementRange(this.selectedUnit, this.cameraX, this.cameraY);
            }

            if (this.unitActionSystem.actionMode === 'move' && this.unitActionSystem.selectedUnit) {
                this.renderer.drawMovementRange(this.unitActionSystem.selectedUnit, this.cameraX, this.cameraY);
            }

            if (this.unitActionSystem.actionMode === 'attack' && this.unitActionSystem.selectedUnit) {
                this.renderer.drawAttackRange(this.unitActionSystem.selectedUnit, this.cameraX, this.cameraY);
            }

            this.conquestSystem.sentinels.forEach(sentinel => {
                this.renderer.drawUnit(sentinel, this.cameraX, this.cameraY, '#ff0000', false);
            });

            this.conquestSystem.armies.forEach(army => {
                const isSelected = this.selectedUnit && this.selectedUnit.id === army.id;
                this.renderer.drawUnit(army, this.cameraX, this.cameraY, '#00ff00', isSelected);
            });
        }

        this.renderer.drawLavaSparks(this.cameraX, this.cameraY);

        this.player.builders.forEach(builder => {
            this.renderer.drawBuilder(builder, this.cameraX, this.cameraY);
        });

        this.renderer.drawBuildingQueue(this.player.buildingQueue);
        this.ctx.restore();

        if (this.player.selectedBuilding && this.gameMode === 'building') {
            this._drawBuildingPreview();
        }

        this.updateUI();
    }

    updateUI() {
        document.getElementById('resource-count').textContent = Math.floor(this.player.resources);
        document.getElementById('food-count').textContent = Math.floor(this.player.food);
        document.getElementById('population-count').textContent = Math.floor(this.player.population);
        document.getElementById('age-display').textContent = this.player.age.charAt(0).toUpperCase() + this.player.age.slice(1);
        document.getElementById('science-count').textContent = `+${Math.floor(this.player.sciencePerTurn)}`;
        document.getElementById('production-count').textContent = Math.floor(this.player.production);
        document.getElementById('turn-count').textContent = this.player.turn;
        document.getElementById('core-stability').textContent = Math.floor(this.eventSystem.coreStability) + '%';

        const isConquest = this.gameMode === 'conquest' && this.conquestSystem;

        document.getElementById('deploy-assault-btn').style.display = isConquest ? 'block' : 'none';
        document.getElementById('deploy-ranger-btn').style.display = isConquest ? 'block' : 'none';
        document.getElementById('deploy-tank-btn').style.display = isConquest ? 'block' : 'none';
        document.getElementById('deploy-hacker-btn').style.display = isConquest ? 'block' : 'none';

        if (isConquest) {
            document.getElementById('deploy-assault-btn').textContent = 'Hire Assault (80)';
            document.getElementById('deploy-ranger-btn').textContent = 'Hire Ranger (70)';
            document.getElementById('deploy-tank-btn').textContent = 'Hire Tank (120)';
            document.getElementById('deploy-hacker-btn').textContent = 'Hire Hacker (100)';
        }

        document.getElementById('buildings-list').style.display = 'block';

        if (isConquest) {
            document.getElementById('conquest-info').style.display = 'block';
            const nodesLeft = this.conquestSystem.defenseNodes.filter(n => !n.hacked).length;
            document.getElementById('conquest-progress').textContent = `Nodes: ${nodesLeft}/2`;
            document.getElementById('conquest-enemies').textContent = `Sentinels: ${this.conquestSystem.sentinels.length}`;

            document.getElementById('end-turn-btn').textContent = 'End Combat Turn';
        } else {
            document.getElementById('conquest-info').style.display = 'none';
            document.getElementById('end-turn-btn').textContent = 'End Turn';
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
                researchBtn.textContent = `${researchInfo.name} (${researchInfo.progress}/${this.player.techTree.techs[this.player.techTree.currentResearch].cost} turns)`;
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
                researchBtn.textContent = `${researchInfo.name} (${researchInfo.progress}/${this.player.techTree.techs[this.player.techTree.currentResearch].cost} turns)`;
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
            const canAfford = this.player.sciencePerTurn >= tech.cost;

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