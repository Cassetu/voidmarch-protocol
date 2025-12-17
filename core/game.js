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
        this.targetCameraX = 0;
        this.targetCameraY = 0;
        this.cameraEasing = 0.15;
        this.cheatCodeSequence = [];
        this.cheatCodeTarget = ['q', 'w', 'e', 'r', 't', 'y', 'c', 'a', 's'];
        this.cheatCodeTimeout = null;
        this.eruptionSequence = [];
        this.eruptionTarget = ['e', 'r', 't', 'e'];
        this.scienceSequence = [];
        this.scienceTarget = ['s', 'c', 'i'];
        this.instantResearchMode = false;
        this.hiringMode = null;
        this.deployMode = null;
        this.viewMode = 'basic';
        this.selectedUnit = null;
        this.player = new Player();
        this.player.game = this;
        this.world = new World(this.player);
        this.orbitalView = false;
        this.orbitalRenderer = null;
        this.zoomThreshold = 0.3;
        this.transitionProgress = 0;
        this.isTransitioning = false;
        this.transitionDuration = 1.5;
        this.transitionStartTime = 0;
        this.pendingTransition = null;
        this.lastZoomDirection = 0;
        this.floatingNumbers = [];

        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.input = new Input();
        window.game = this;
        this.galaxy = new Galaxy(this);
        this.currentPlanet = this.galaxy.planetInstances.get(0);
        this.eventSystem = new EventSystem(this.currentPlanet, this.player, this);
        this.ecosystem = new Ecosystem(this.currentPlanet, this);
        this.environmentalObjectSystem = new EnvironmentalObjectSystem(this.currentPlanet, this.player, this);
        this.weatherSystem = new WeatherSystem(this.currentPlanet, this.player, this);
        this.turnBased = true;
        this.player.techTree = new TechTree(this.player);
        this.gameState = 'volcanic';
        this.renderer.zoom = 0.8;
        this.initializeStartingBuildings();
        this.running = true;
        this.conquestSystem = null;
        this.gameMode = 'building';
        this.cameraX = 0;
        this.cameraY = 0;
        this.shakeIntensity = 0;
        this.gameStarted = false;
        const menuPlaylist = [
            'sounds/music/titles.mp3'
        ];
        AudioManager.init(menuPlaylist);

        document.getElementById('game-container').style.display = 'none';

        const blackScreen = document.createElement('div');
        blackScreen.id = 'black-screen-intro';
        blackScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000000;
            z-index: 30000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        const clickText = document.createElement('div');
        clickText.textContent = 'click to begin...';
        clickText.style.cssText = `
            color: rgba(200, 200, 220, 0.6);
            font-family: 'Courier New', monospace;
            font-size: 18px;
            animation: pulse 2s ease-in-out infinite;
        `;

        blackScreen.appendChild(clickText);
        document.body.appendChild(blackScreen);

        blackScreen.addEventListener('click', () => {
            blackScreen.style.display = 'none';

            const seismicScreen = document.createElement('div');
            seismicScreen.id = 'seismic-intro';
            seismicScreen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #0a0a0a;
                z-index: 30000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;

            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 300;
            canvas.style.cssText = 'border: 2px solid #00ff00; background: #000000;';
            seismicScreen.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            let time = 0;
            let intensity = 0.5;
            const maxIntensity = 8;

            const drawSeismograph = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.beginPath();

                const centerY = canvas.height / 2;
                const amplitude = 20 * intensity;

                for (let x = 0; x < canvas.width; x++) {
                    const y = centerY + Math.sin((x + time) * 0.05) * amplitude * Math.random();
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.stroke();
                time += 5;
                intensity = Math.min(maxIntensity, intensity + 0.08);

                if (time < 500) {
                    requestAnimationFrame(drawSeismograph);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, centerY);
                    ctx.lineTo(canvas.width, centerY);
                    ctx.stroke();

                    setTimeout(() => {
                        const statusText = document.createElement('div');
                        statusText.style.cssText = `
                            color: #ff4444;
                            font-family: 'Courier New', monospace;
                            font-size: 20px;
                            margin-top: 30px;
                            text-align: center;
                            line-height: 1.8;
                        `;
                        statusText.innerHTML = `
                            PREVIOUS CIVILIZATION: EXTINCT<br>
                            <span style="color: #00ff00;">NEW ATTEMPT: AUTHORIZED</span>
                        `;
                        seismicScreen.appendChild(statusText);

                        setTimeout(() => {
                            seismicScreen.style.transition = 'opacity 1s ease';
                            seismicScreen.style.opacity = '0';

                            setTimeout(() => {
                                document.body.removeChild(seismicScreen);
                                document.body.removeChild(blackScreen);

                                const startMenu = document.getElementById('start-menu');
                                startMenu.style.display = 'flex';
                                startMenu.style.opacity = '0';
                                startMenu.style.transition = 'opacity 2s ease';

                                setTimeout(() => {
                                    startMenu.style.opacity = '1';
                                    AudioManager.playBGM();
                                }, 100);
                            }, 1000);
                        }, 2000);
                    }, 500);
                }
            };

            document.body.appendChild(seismicScreen);
            drawSeismograph();
        });

        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('view-toggle-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.cycleViewMode();
        });
        const iconPath = document.getElementById('view-icon-path');
        iconPath.setAttribute('d', 'M12 2L2 7v10l10 5 10-5V7L12 2z M12 4.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z');

        window.addEventListener('resize', () => this.handleResize());
        this.canvas.addEventListener('wheel', (e) => this.handleZoom(e));
        window.addEventListener('keypress', (e) => this.handleCheatCode(e));
        this.log('Voidmarch Protocol initialized');

        document.addEventListener('pointerdown', (e) => {
            console.log('GLOBAL pointerdown target:', e.target && e.target.id ? e.target.id : e.target);
        }, true);

        document.getElementById('galaxy-map-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showGalaxyMap();
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            this.showHowToPlay();
        });

        document.getElementById('credits-btn').addEventListener('click', () => {
            this.showCredits();
        });

        document.addEventListener('click', (e) => {
            console.log('GLOBAL click target:', e.target && e.target.id ? e.target.id : e.target);
        }, true);

        document.getElementById('end-turn-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.endTurn();
        });

        document.getElementById('open-military-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMilitaryMenu();
        });

        document.getElementById('military-back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeMilitaryMenu();
        });

        document.getElementById('open-buildings-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openBuildingsMenu();
        });

        document.getElementById('buildings-back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeBuildingsMenu();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('buildings-menu').style.display === 'block') {
                    this.closeBuildingsMenu();
                }
                if (document.getElementById('military-menu').style.display === 'block') {
                    this.closeMilitaryMenu();
                }
                if (this.unitActionSystem.actionMode) {
                    this.unitActionSystem.hideActionMenu();
                    this.unitActionSystem.actionMode = null;
                    this.unitActionSystem.selectedUnit = null;
                    this.selectedUnit = null;
                    this.log('Action cancelled');
                }
            }
        });
    }

    showCredits() {
        const modal = document.createElement('div');
        modal.id = 'credits-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 20001;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        `;

        modal.innerHTML = `
            <div style="background: #1a1f2e; border: 2px solid #5a6478; border-radius: 8px; padding: 30px; max-width: 500px; text-align: center;">
                <h2 style="color: #8fa3c8; margin-bottom: 20px;">Credits</h2>
                <div style="color: #a8b8d8; font-size: 14px; line-height: 1.8;">
                    <p><strong style="color: #c0d0e8;">Game Design & Development</strong></p>
                    <p>Cassetu</p>
                    <br>
                    <p><strong style="color: #c0d0e8;">Music</strong></p>
                    <p>Sean Garland • John Leonard French</p>
                    <p>Cassetu • AI generated (Placeholder)</p>
                    <br>
                    <p><strong style="color: #c0d0e8;">Special Thanks</strong></p>
                    <p>Community & Playtesters</p>
                </div>
                <button id="close-credits" style="width: 100%; padding: 10px; margin-top: 20px; background: #3a4a5a; border: 1px solid #5a6a7a; color: #c0d0e8; cursor: pointer; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('close-credits').onclick = () => {
            this.closeModal('credits-modal');
        };
    }

    initializeStartingBuildings() {
        if (!this.currentPlanet || !this.currentPlanet.tiles) {
            console.error('Cannot initialize buildings - planet not ready');
            return;
        }

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

        const hut = new Building(startX, startY, 'hut');
        hut.isFrame = false;
        hut.buildProgress = 100;

        const farm = new Building(startX + 1, startY + 1, 'farm');
        farm.isFrame = false;
        farm.buildProgress = 100;

        this.currentPlanet.tiles[startY][startX].building = hut;
        this.currentPlanet.tiles[startY + 1][startX + 1].building = farm;

        this.currentPlanet.structures.push(hut);
        this.player.addBuilding(hut);

        const newSettlement = this.player.addSettlement(startX, startY, 'hut');
        newSettlement.addBuilding('farm');
        this.log(`Starting hut "${newSettlement.name}" established`);

        this.currentPlanet.structures.push(farm);
        this.player.addBuilding(farm);

        this.log('Starting hut and farm placed');
    }

    startGame() {
        this.gameStarted = true;
        document.getElementById('start-menu').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';

        AudioManager.stopBGM();
        const gamePlaylist = [
            'sounds/music/exodus-protocol.mp3',
            'sounds/music/magma-layer.mp3',
            'sounds/music/retro-protocol.mp3',
            'sounds/music/core_ruin.mp3',
            'sounds/music/swarm_defense.mp3',
            'sounds/music/starlight_memory.mp3',
            'sounds/music/sundown_protocol.mp3'
        ];
        AudioManager.init(gamePlaylist);
        AudioManager.playBGM();

        this.start();
    }

    showHowToPlay() {
        const modal = document.createElement('div');
        modal.id = 'how-to-play-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 20001;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        `;

        modal.innerHTML = `
            <div style="background: #1a1f2e; border: 2px solid #5a6478; border-radius: 8px; padding: 30px; max-width: 700px; max-height: 85vh; overflow-y: auto;">
                <h2 style="color: #8fa3c8; margin-bottom: 20px; text-align: center;">How to Play Voidmarch Protocol</h2>
                <div style="color: #a8b8d8; font-size: 13px; line-height: 1.7;">
                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Goal</h3>
                    <p>Survive on a volatile volcanic planet and research technology to escape before the planetary core collapses! Advance through ages, manage settlements, and conquer hostile worlds.</p>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Controls</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li><strong>WASD / Arrow Keys</strong> - Pan camera around the map</li>
                        <li><strong>Mouse Wheel</strong> - Zoom in/out (when over map)</li>
                        <li><strong>Left Click</strong> - Select tiles, buildings, or units</li>
                        <li><strong>ESC</strong> - Cancel actions or close menus</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Building Mode</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li><strong>Settlements</strong> - Create new population centers with their own claim areas (green square). Cannot overlap with other settlements.</li>
                        <li><strong>Buildings</strong> - Click "Open Buildings Menu" to browse all available structures. Buildings must be placed within a settlement's claim area.</li>
                        <li><strong>Builders</strong> - When you place a building, builders automatically travel from the nearest settlement to construct it. Watch their progress!</li>
                        <li><strong>Ages</strong> - Unlock new buildings by researching technologies and advancing through Stone → Bronze → Iron → Medieval → Renaissance → Space ages.</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Settlements</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li>Click on a settlement to view its citizens, food production, and building limits</li>
                        <li>Citizens age, have children, and can die from starvation or old age</li>
                        <li>Each settlement has limited space for specific building types (farms, warehouses, etc.)</li>
                        <li>Keep food production above consumption to grow your population</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Research</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li>Click "Research Tech" to view available technologies</li>
                        <li>Research requires Science per turn and takes multiple turns to complete</li>
                        <li>Technologies unlock new buildings, bonuses, and age advancements</li>
                        <li>Plan your research path carefully - some techs have prerequisites!</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Volcanic Hazards</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li><strong>Core Stability</strong> - Decreases each turn. At 75% and 35%, massive eruptions damage all buildings!</li>
                        <li><strong>Eruptions</strong> - Random events that create lava and destroy nearby structures</li>
                        <li><strong>Research</strong> - Unlock technologies to resist eruptions, predict them, or stabilize the core</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Galaxy Conquest</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li>Research "Exodus Protocol" to unlock galaxy travel</li>
                        <li>Click "Galaxy Map" to travel to other planets and conquer them</li>
                        <li><strong>Combat</strong> - Deploy military units (Assault, Ranger, Tank, Hacker) adjacent to your buildings</li>
                        <li><strong>Objectives</strong> - Destroy or hack all Defense Nodes and eliminate Sentinels to conquer the planet</li>
                        <li><strong>Special Abilities</strong> - Each unit type has unique abilities: Tank Taunt, Assault Charge, Ranger Overwatch, Hacker EMP</li>
                        <li><strong>Guardian Boss</strong> - Defeat the powerful Guardian enemy to claim rare technology</li>
                    </ul>

                    <h3 style="color: #8fa3c8; font-size: 15px; margin-top: 15px; margin-bottom: 10px;">Tips</h3>
                    <ul style="margin-left: 20px; margin-top: 8px;">
                        <li>Balance food production with population growth</li>
                        <li>Build Observatories early for science generation</li>
                        <li>Spread settlements across the map for more building space</li>
                        <li>Research defensive technologies to protect against eruptions</li>
                        <li>In conquest mode, protect your spaceship at all costs!</li>
                    </ul>
                </div>
                <button id="close-how-to-play" style="width: 100%; padding: 10px; margin-top: 20px; background: #3a4a5a; border: 1px solid #5a6a7a; color: #c0d0e8; cursor: pointer; border-radius: 4px;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('close-how-to-play').onclick = () => {
            this.closeModal('how-to-play-modal');
        };
    }

    cycleViewMode() {
        const modes = ['basic', 'claims'];
        const currentIndex = modes.indexOf(this.viewMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.viewMode = modes[nextIndex];

        const iconPath = document.getElementById('view-icon-path');
        const btn = document.getElementById('view-toggle-btn');

        btn.style.transform = 'scale(0.9) rotate(180deg)';

        setTimeout(() => {
            if (this.viewMode === 'basic') {
                iconPath.setAttribute('d', 'M12 2L2 7v10l10 5 10-5V7L12 2z M12 4.5l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z');
            } else {
                iconPath.setAttribute('d', 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z');
            }
            btn.style.transform = 'scale(1) rotate(0deg)';
        }, 150);

        const displayNames = {
            'basic': 'Basic View',
            'claims': 'Settlement Claims View'
        };
        this.log(`View: ${displayNames[this.viewMode]}`);
    }

    endTurn() {
        this.player.nextTurn();
        this.player.processTurnForSettlements(this.currentPlanet);
        this.player.updateExpertCount();
        this.updateBuilders();
        this.updateRepairers();
        this.player.processShipyardConstruction();

        this.player.settlements.forEach(settlement => {
            settlement.recalculateBuildingCounts(this.currentPlanet);
        });

        if (this.galaxy.currentPlanetIndex === 0) {
            this.ecosystem.update();
            this.environmentalObjectSystem.update();
            this.weatherSystem.onTurnEnd();
            if (this.weatherSystem && this.galaxy.currentPlanetIndex === 0) {
                const currentWeather = this.weatherSystem.getCurrentWeather();

                if (currentWeather.collectible) {
                    this.currentPlanet.structures.forEach(building => {
                        if (building.type === 'weatherarray' && !building.isFrame) {
                            const collected = currentWeather.collectAmount || 10;
                            resourceYields[currentWeather.collectible] = (resourceYields[currentWeather.collectible] || 0) + collected;

                            this.createFloatingNumber(building.x, building.y, `+${collected} ${currentWeather.collectible}`, '#88ccff');
                        }
                    });
                }
            }
        }

        const totalPopulation = this.player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
        const hasSettlements = this.player.settlements.length > 0;
        const hasSpaceship = this.conquestSystem && this.conquestSystem.spaceship;

        if (totalPopulation === 0 || (!hasSettlements && !hasSpaceship)) {
            if (totalPopulation === 0) {
                this.log('All citizens have perished...');
            } else {
                this.log('No settlements remaining...');
            }
            setTimeout(() => {
                this.showGameOver();
            }, 100);
            return;
        }

        let totalFood = 0;
        let totalProduction = 0;
        let totalScience = 0;

        const resourceYields = {
            iron: 0,
            copper: 0,
            coal: 0,
            oil: 0,
            silicon: 0,
            rareMinerals: 0,
            gold: 0
        };

        this.currentPlanet.structures.forEach(building => {
            if (building.isFrame || building.type === 'ruins' || building.type === 'defense_node') return;

            if (building.type === 'mineshaft') {
                const tile = this.currentPlanet.tiles[building.y][building.x];
                const mineshaftYields = this.currentPlanet.getMineshaftYields(tile.type);

                for (const resource in mineshaftYields) {
                    if (mineshaftYields[resource] > 0) {
                        resourceYields[resource] = (resourceYields[resource] || 0) + mineshaftYields[resource];
                    }
                }

                const resourceSymbols = {
                    iron: 'Fe', copper: 'Cu', coal: 'C', oil: 'O',
                    silicon: 'Si', rareMinerals: 'RM', gold: 'Au'
                };

                let yieldParts = [];
                for (const resource in mineshaftYields) {
                    if (mineshaftYields[resource] > 0) {
                        yieldParts.push(`+${mineshaftYields[resource]} ${resourceSymbols[resource]}`);
                    }
                }
                if (yieldParts.length > 0) {
                    this.createFloatingNumber(building.x, building.y, yieldParts.join(', '), '#ffaa00');
                }
            }

            if (building.type === 'quarry') {
                resourceYields.iron = (resourceYields.iron || 0) + 2;
                resourceYields.gold = (resourceYields.gold || 0) + 1;
                let quarryText = '+2 Fe, +1 Au';
                if (Math.random() < 0.211) {
                    resourceYields.rareMinerals = (resourceYields.rareMinerals || 0) + 1;
                    quarryText = '+2 Fe, +1 Au, +1 RM';
                }
                this.createFloatingNumber(building.x, building.y, quarryText, '#ffaa00');
            }

            if (building.type === 'coredriller') {
                const lavaProximity = this.getLavaProximity(building.x, building.y);
                const baseYield = 5;
                const bonusYield = Math.floor(lavaProximity * 3);

                resourceYields.rareMinerals = (resourceYields.rareMinerals || 0) + baseYield + bonusYield;
                resourceYields.silicon = (resourceYields.silicon || 0) + 3;
                resourceYields.uranium = (resourceYields.uranium || 0) + 1;

                this.eventSystem.coreStability -= 0.15;

                this.createFloatingNumber(building.x, building.y, `+${baseYield + bonusYield} RM, -Core`, '#ff4400');
            }

            const foodBuildings = ['farm', 'aqueduct', 'greenhouse', 'hydroponicfarm', 'verticalfarm', 'bioreactor', 'synthesizer'];
            if (foodBuildings.includes(building.type)) {
                const tile = this.currentPlanet.tiles[building.y][building.x];
                const foodYield = tile.yields.food || 0;

                let bonusFood = 0;
                if (building.type === 'farm') bonusFood = 5;
                if (building.type === 'greenhouse') bonusFood = 5;
                if (building.type === 'hydroponicfarm') bonusFood = 8;
                if (building.type === 'verticalfarm') bonusFood = 15;
                if (building.type === 'bioreactor') bonusFood = 25;
                if (building.type === 'synthesizer') bonusFood = 50;
                if (building.type === 'aqueduct') bonusFood = 2;

                const totalFoodValue = foodYield + bonusFood;
                if (totalFoodValue > 0) {
                    this.createFloatingNumber(building.x, building.y, `+${totalFoodValue} Food`, '#88ff88');
                }
            }

            if (building.type === 'campfire') {
                totalScience += 1;
            }
            if (building.type === 'tent') {
                totalScience += 2;
            }
            if (building.type === 'temple') {
                totalScience += 5;
            }
            if (building.type === 'shrine') {
                totalScience += 3;
            }
            if (building.type === 'library') {
                totalScience += 8;
            }
            if (building.type === 'scriptorium') {
                totalScience += 7;
            }
            if (building.type === 'university') {
                totalScience += 12;
            }
            if (building.type === 'observatory') {
                totalScience += 25;
            }

            if (building.type === 'forge') {
                totalProduction += 5;
            }
        });

        totalScience += Math.floor(this.player.population / 10);

        totalScience += this.player.scienceBonus;
        totalProduction += this.player.productionBonus;
        totalFood += this.player.foodBonus;

        this.player.sciencePerTurn = totalScience;

        this.player.addProduction(totalProduction);

        this.currentPlanet.structures.forEach(building => {
            if (building.isFrame || building.type === 'ruins' || building.type === 'defense_node') return;

            if (building.type === 'mineshaft') {
                const tile = this.currentPlanet.tiles[building.y][building.x];
                const mineshaftYields = this.currentPlanet.getMineshaftYields(tile.type);

                for (const resource in mineshaftYields) {
                    if (mineshaftYields[resource] > 0) {
                        resourceYields[resource] = (resourceYields[resource] || 0) + mineshaftYields[resource];
                    }
                }
            }

            if (building.type === 'quarry') {
                resourceYields.iron = (resourceYields.iron || 0) + 2;
                resourceYields.gold = (resourceYields.gold || 0) + 1;
                if (Math.random() < 0.3) {
                    resourceYields.rareMinerals = (resourceYields.rareMinerals || 0) + 1;
                }
            }
        });

        this.player.settlements.forEach(settlement => {
            settlement.storageCapacity = settlement.getBaseStorageCapacity();

            for (const resource in resourceYields) {
                const amount = resourceYields[resource] / this.player.settlements.length;
                const stored = settlement.addResourcesToStorage(resource, amount);
                this.player.resources[resource] += stored;
            }
        });

        this.player.lastResourceGains = resourceYields;

        const researchResult = this.player.techTree.progressResearch();

        if (researchResult && researchResult.completed) {
            const techName = this.player.techTree.techs[researchResult.completed].name;

            if (researchResult.ageAdvanced) {
                this.log(`🎉 CIVILIZATION ADVANCED! Welcome to the ${researchResult.newAge.toUpperCase()} AGE!`);
                this.log(`Research complete: ${techName}`);
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSFX('sounds/sfx/complete.mp3', 0.0);
                }
            } else {
                this.log(`RESEARCH COMPLETE: ${techName}`);
            }

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

            this.log(`Turn ${this.player.turn} complete. Core Stability: ${Math.floor(this.eventSystem.coreStability)}%`);
        } else if (this.galaxy.currentPlanetIndex === 1 && this.gameMode === 'conquest') {
            if (Math.random() < 0.10) {
                const affected = this.eventSystem.triggerHailstorm();
                if (affected > 0) {
                    this.renderer.startHailstorm();
                }
            }
            this.log(`Turn ${this.player.turn} complete.`);
        } else {
            this.log(`Turn ${this.player.turn} complete.`);
        }

        const settlementPanel = document.getElementById('settlement-panel');
        if (settlementPanel && settlementPanel.style.display === 'block') {
            const title = document.getElementById('settlement-title');
            if (title) {
                const settlementName = title.textContent;
                const settlement = this.player.settlements.find(s => s.name === settlementName);
                if (settlement) {
                    this.showSettlementPanel(settlement.x, settlement.y);
                }
            }
        }

        if (this.gameMode === 'conquest') {
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
            }
        }
    }

    getLavaProximity(x, y) {
        let lavaCount = 0;
        const radius = 3;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.currentPlanet.width && ny >= 0 && ny < this.currentPlanet.height) {
                    if (this.currentPlanet.tiles[ny][nx].type === 'lava') {
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        lavaCount += Math.max(0, 1 - (dist / radius));
                    }
                }
            }
        }

        return Math.min(5, lavaCount);
    }

    openBuildingsMenu() {
        const menu = document.getElementById('buildings-menu');
        const sidePanel = document.getElementById('side-panel');
        const consoleEl = document.getElementById('console');

        menu.style.display = 'block';
        sidePanel.style.display = 'none';
        consoleEl.style.display = 'none';

        this.populateBuildingsMenu();
    }

    closeBuildingsMenu() {
        const menu = document.getElementById('buildings-menu');
        const sidePanel = document.getElementById('side-panel');
        const consoleEl = document.getElementById('console');

        menu.style.display = 'none';
        sidePanel.style.display = 'flex';
        consoleEl.style.display = 'block';
    }

    openMilitaryMenu() {
        const menu = document.getElementById('military-menu');
        const sidePanel = document.getElementById('side-panel');
        const consoleEl = document.getElementById('console');

        menu.style.display = 'block';
        sidePanel.style.display = 'none';
        consoleEl.style.display = 'none';

        this.populateMilitaryMenu();
    }

    closeMilitaryMenu() {
        const menu = document.getElementById('military-menu');
        const sidePanel = document.getElementById('side-panel');
        const consoleEl = document.getElementById('console');

        menu.style.display = 'none';
        sidePanel.style.display = 'flex';
        consoleEl.style.display = 'block';
    }

    populateMilitaryMenu() {
        const grid = document.getElementById('military-grid');
        grid.innerHTML = '';

        const units = [
            { type: 'assault', name: 'Assault Unit', cost: 80, icon: '⚔️', hp: 100, dmg: 25, range: 1, move: 4, desc: 'Fast melee with charge' },
            { type: 'ranger', name: 'Ranger Unit', cost: 70, icon: '🏹', hp: 60, dmg: 20, range: 4, move: 3, desc: 'Long-range overwatch' },
            { type: 'tank', name: 'Tank Unit', cost: 120, icon: '🛡️', hp: 200, dmg: 15, range: 1, move: 2, desc: 'Heavy tank with taunt' },
            { type: 'hacker', name: 'Hacker Unit', cost: 100, icon: '💻', hp: 50, dmg: 10, range: 2, move: 4, desc: 'Hacks nodes & EMP' }
        ];

        units.forEach(unit => {
            const canAfford = this.player.resources >= unit.cost;

            const card = document.createElement('div');
            card.className = 'unit-card';

            const btn = document.createElement('button');
            btn.className = 'unit-deploy-btn';
            btn.textContent = canAfford ? 'Deploy Unit' : 'Not Enough Resources';
            btn.disabled = !canAfford;

            if (canAfford) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    this.hiringMode = unit.type;
                    this.log(`Click adjacent to your buildings to deploy ${unit.name}`);
                };
            }

            card.innerHTML = `
                <div class="unit-icon">${unit.icon}</div>
                <div class="unit-name">${unit.name}</div>
                <div class="unit-cost">Cost: ${unit.cost} Resources</div>
                <div class="unit-stats">HP: ${unit.hp} | DMG: ${unit.dmg} | Range: ${unit.range} | Move: ${unit.move}</div>
            `;

            card.appendChild(btn);
            grid.appendChild(card);
        });

        console.log('Military menu populated with', units.length, 'units');
    }

    populateBuildingsMenu() {
        const grid = document.getElementById('buildings-grid');
        grid.innerHTML = '';

        const buildingData = BuildingInfo.getAllBuildingData();
        const availableBuildings = this.player.getAvailableBuildings();

        const allBuildings = Object.keys(buildingData);
        allBuildings.forEach(buildingType => {
            const info = buildingData[buildingType];
            const isAvailable = availableBuildings.includes(buildingType);

            const card = document.createElement('div');
            card.className = 'building-card' + (isAvailable ? '' : ' locked');

            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            canvas.style.margin = '0 auto 4px';
            canvas.style.display = 'block';

            const canAfford = BuildingInfo.canAfford(info.cost, this.player.resources);
            const costDisplay = BuildingInfo.formatCost(info.cost);

            card.innerHTML = `
                <div class="building-icon">
                    <span class="building-age-badge">${info.age}</span>
                </div>
                <div class="building-name">${info.name}</div>
                <div class="building-cost">${costDisplay}</div>
                <div class="building-desc">${info.desc}</div>
                <button class="building-build-btn" ${isAvailable ? '' : 'disabled'}>
                    ${isAvailable ? (canAfford ? 'Select to Build' : 'Cannot Afford') : 'Locked'}
                </button>
            `;

            const iconDiv = card.querySelector('.building-icon');
            iconDiv.innerHTML = '<span class="building-age-badge">' + info.age + '</span>';
            iconDiv.appendChild(canvas);

            this.renderer.drawBuildingToCanvas(buildingType, canvas);

            if (isAvailable) {
                const btn = card.querySelector('.building-build-btn');
                btn.onclick = (e) => {
                    e.stopPropagation();

                    if (!canAfford) {
                        btn.style.background = '#aa0000';
                        btn.style.borderColor = '#ff0000';
                        btn.style.animation = 'blink-red 0.5s';

                        setTimeout(() => {
                            btn.style.background = '#3a5a4a';
                            btn.style.borderColor = '#5a7a6a';
                            btn.style.animation = '';
                        }, 500);

                        this.log(`Cannot afford ${info.name} - Need: ${costDisplay}`);
                        return;
                    }

                    const canPlaceAnywhere = this.checkIfBuildingCanBePlaced(buildingType);

                    if (!canPlaceAnywhere) {
                        btn.style.background = '#aa0000';
                        btn.style.borderColor = '#ff0000';
                        btn.style.animation = 'blink-red 0.5s';

                        setTimeout(() => {
                            btn.style.background = '#3a5a4a';
                            btn.style.borderColor = '#5a7a6a';
                            btn.style.animation = '';
                        }, 500);

                        this.log(`Cannot place ${info.name} - all settlements at maximum capacity!`);
                        return;
                    }

                    this.player.selectedBuilding = buildingType;
                    this.log(`Selected: ${info.name} - Click on the map to place`);
                };
            }

            grid.appendChild(card);
        });
    }

    checkIfBuildingCanBePlaced(buildingType) {
        if (buildingType === 'settlement') {
            return true;
        }

        for (let settlement of this.player.settlements) {
            if (settlement.canBuildStructure(buildingType)) {
                return true;
            }
        }

        return false;
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
                    if (typeof AudioManager !== 'undefined') {
                        AudioManager.playSFX('sounds/sfx/major-eruption', 0.7);
                    }
                    this.eruptionSequence = [];
                    return;
                }
            }
        }

        this.scienceSequence.push(key);
        if (this.scienceSequence.length > this.scienceTarget.length) {
            this.scienceSequence.shift();
        }

        if (this.scienceSequence.length === this.scienceTarget.length) {
            let matches = true;
            for (let i = 0; i < this.scienceTarget.length; i++) {
                if (this.scienceSequence[i] !== this.scienceTarget[i]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                this.instantResearchMode = !this.instantResearchMode;
                this.player.sciencePerTurn = this.instantResearchMode ? 999999 : this.player.sciencePerTurn;
                this.log(this.instantResearchMode ?
                    'INSTANT RESEARCH MODE ON - Click any tech to research it instantly!' :
                    'INSTANT RESEARCH MODE OFF');
                this.scienceSequence = [];
                this.updateBuildingUI();
                return;
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

        this.player.advanceAge('space');
        console.log('Current age:', this.player.age);
        console.log('Available buildings:', this.player.getAvailableBuildings());

        this.player.techTree.applyBonus(this.player.techTree.techs['shelter'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['farming'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['deepMining'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['reinforcedStructures'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['hydroponics'].bonus);
        this.player.techTree.applyBonus(this.player.techTree.techs['geothermalHarvesting'].bonus);

        document.getElementById('galaxy-map-btn').style.display = 'block';

        this.log('Unlocked galaxy travel! Resources, science, food, and population boosted!');
        this.log('Advanced to SPACE AGE! All buildings unlocked!');
        this.log('Click Galaxy Map to travel to the second planet.');

        setTimeout(() => {
            this.showGalaxyMap();
        }, 500);
    }

    showGalaxyMap() {
        if (document.getElementById('galaxy-modal')) {
            return;
        }

        console.log('Current science:', this.player.sciencePerTurn);
        console.log('Science bonus:', this.player.scienceBonus);
        console.log('Current research:', this.player.techTree.currentResearch);

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
                if (planet.id === this.galaxy.currentPlanetIndex) {
                    planetDiv.style.opacity = '0.6';
                    planetDiv.style.cursor = 'not-allowed';
                    const currentLabel = document.createElement('div');
                    currentLabel.textContent = 'CURRENT LOCATION';
                    currentLabel.style.cssText = 'color: #88ff88; font-size: 10px; font-weight: 600; margin-top: 4px;';
                    planetDiv.appendChild(currentLabel);
                } else {
                    planetDiv.onclick = () => {
                        if (this.conquestSystem) {
                            this.conquestSystem.saveState();
                        }

                        const result = this.galaxy.travelToPlanet(planet.id);
                        if (result.success) {
                            const leavingConquestPlanet = this.gameMode === 'conquest' && result.mode !== 'conquest';
                            const enteringDifferentConquestPlanet = result.mode === 'conquest' &&
                                this.conquestSystem &&
                                this.conquestSystem.planet !== result.planet;

                            if (leavingConquestPlanet || enteringDifferentConquestPlanet) {
                                this.conquestSystem = null;
                            }

                            this.currentPlanet = result.planet;

                            if (result.mode === 'conquest') {
                                if (result.isFirstVisit || !this.conquestSystem || this.conquestSystem.planet !== result.planet) {
                                    this.startConquestMode(result);
                                } else {
                                    this.gameMode = 'conquest';
                                }
                            } else {
                                this.gameMode = 'building';
                            }

                            this.centerCamera();
                            this.log(`Traveled to ${planet.name}`);
                            this.closeModal('galaxy-modal');
                        }
                    };
                }
            }

            planetList.appendChild(planetDiv);
        });

        document.getElementById('close-galaxy-modal').onclick = () => {
            this.closeModal('galaxy-modal');
        };
    }

    startConquestMode(conquestData) {
        this.gameMode = 'conquest';
        const isFirstVisit = conquestData.isFirstVisit !== false;
        this.conquestSystem = new ConquestSystem(
            this,
            this.currentPlanet,
            this.galaxy.planets[this.galaxy.currentPlanetIndex].difficulty,
            isFirstVisit
        );
        this.conquestSystem.planet = this.currentPlanet;
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

        this.targetCameraX = (minX + maxX - viewW) / 2;
        this.targetCameraY = (minY + maxY - viewH) / 2;
    }

    getVisibleTiles() {
        const topBarHeight = 75;
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;

        const viewWidth = this.width / this.renderer.zoom;
        const viewHeight = (this.height - topBarHeight - 220) / this.renderer.zoom;

        const centerGridX = this.currentPlanet.width / 2;
        const centerGridY = this.currentPlanet.height / 2;
        const centerWorldX = (centerGridX - centerGridY) * unitX;
        const centerWorldY = (centerGridX + centerGridY) * unitY;

        const targetX = (this.width / 2) / this.renderer.zoom + this.cameraX;
        const targetY = ((this.height - topBarHeight - 220) / 2) / this.renderer.zoom + this.cameraY;

        const translateX = targetX - centerWorldX;
        const translateY = targetY - centerWorldY;

        const screenLeft = -translateX;
        const screenRight = screenLeft + viewWidth;
        const screenTop = -translateY;
        const screenBottom = screenTop + viewHeight;

        const padding = 10;

        const minX = Math.max(0, Math.floor((screenLeft / unitX + screenTop / unitY) / 2) - padding);
        const maxX = Math.min(this.currentPlanet.width - 1, Math.ceil((screenRight / unitX + screenBottom / unitY) / 2) + padding);
        const minY = Math.max(0, Math.floor((screenTop / unitY - screenRight / unitX) / 2) - padding);
        const maxY = Math.min(this.currentPlanet.height - 1, Math.ceil((screenBottom / unitY - screenLeft / unitX) / 2) + padding);

        return { minX, maxX, minY, maxY };
    }

    handleZoom(e) {
        e.preventDefault();

        if (this.isTransitioning) return;

        const zoomSpeed = 0.1;
        const oldZoom = this.renderer.zoom;

        if (e.deltaY > 0) {
            this.renderer.zoom = Math.max(0.1, this.renderer.zoom - zoomSpeed);
            this.lastZoomDirection = -1;
        } else {
            this.renderer.zoom = Math.min(3, this.renderer.zoom + zoomSpeed);
            this.lastZoomDirection = 1;
        }

        if (!this.orbitalView && this.renderer.zoom <= this.zoomThreshold && this.lastZoomDirection === -1) {
            if (!this.pendingTransition) {
                this.renderer.zoom = this.zoomThreshold + 0.01;
                this.showTransitionPrompt('orbital');
            }
        } else if (this.orbitalView && this.renderer.zoom > this.zoomThreshold && this.lastZoomDirection === 1) {
            if (!this.pendingTransition) {
                this.renderer.zoom = this.zoomThreshold - 0.01;
                this.showTransitionPrompt('surface');
            }
        }

        const zoomRatio = this.renderer.zoom / oldZoom;
        this.cameraX *= zoomRatio;
        this.cameraY *= zoomRatio;

        this.updateCamera();
    }

    showTransitionPrompt(type) {
        this.pendingTransition = type;

        const modal = document.getElementById('view-transition-modal');
        const question = document.getElementById('transition-question');
        const description = document.getElementById('transition-description');

        if (type === 'orbital') {
            question.textContent = 'Transfer to Orbital View?';
            description.textContent = 'View your planet from space and manage orbital structures.';
        } else {
            question.textContent = 'Return to Surface?';
            description.textContent = 'Return to the planetary surface map view.';
        }

        modal.style.display = 'flex';

        const confirmBtn = document.getElementById('transition-confirm');
        const cancelBtn = document.getElementById('transition-cancel');

        const handleConfirm = () => {
            this.confirmTransition();
            cleanup();
        };

        const handleCancel = () => {
            this.cancelTransition();
            cleanup();
        };

        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        };

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
    }

    confirmTransition() {
        const modal = document.getElementById('view-transition-modal');
        modal.style.display = 'none';

        if (this.pendingTransition === 'orbital') {
            this.enterOrbitalView();
        } else if (this.pendingTransition === 'surface') {
            this.exitOrbitalView();
        }

        this.pendingTransition = null;
    }

    cancelTransition() {
        const modal = document.getElementById('view-transition-modal');
        modal.style.display = 'none';
        this.pendingTransition = null;
    }

    enterOrbitalView() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        this.transitionProgress = 0;

        this.log('Entering orbital view...');

        if (!this.orbitalRenderer) {
            const orbitalCanvas = document.createElement('canvas');
            orbitalCanvas.id = 'orbital-canvas';
            orbitalCanvas.width = window.innerWidth;
            orbitalCanvas.height = window.innerHeight;
            orbitalCanvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 5;
                opacity: 0;
                transition: opacity 1.5s ease-in-out;
            `;
            document.body.appendChild(orbitalCanvas);

            this.orbitalRenderer = new OrbitalRenderer(orbitalCanvas, this.currentPlanet);
        } else {
            const orbitalCanvas = document.getElementById('orbital-canvas');
            orbitalCanvas.style.display = 'block';
            orbitalCanvas.style.opacity = '0';
        }

        setTimeout(() => {
            document.getElementById('orbital-canvas').style.opacity = '1';
        }, 50);

        setTimeout(() => {
            this.canvas.style.opacity = '0';
            this.canvas.style.transition = 'opacity 1.5s ease-in-out';
        }, 100);

        setTimeout(() => {
            this.orbitalView = true;
            this.isTransitioning = false;
            this.canvas.style.display = 'none';
            document.getElementById('bottom-panel').style.display = 'none';
            document.getElementById('view-toggle-container').style.display = 'none';
            document.getElementById('top-bar').style.opacity = '0.3';
        }, 1500);
    }

    exitOrbitalView() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.transitionStartTime = Date.now();
        this.transitionProgress = 0;

        this.log('Returning to surface...');

        if (this.orbitalRenderer) {
            this.orbitalRenderer.targetZoom = 7;
        }

        setTimeout(() => {
            const orbitalCanvas = document.getElementById('orbital-canvas');
            if (orbitalCanvas) {
                orbitalCanvas.style.opacity = '0';
                orbitalCanvas.style.transition = 'opacity 1.5s ease-in-out';
            }

            this.canvas.style.display = 'block';
            this.canvas.style.opacity = '0';

            setTimeout(() => {
                this.canvas.style.opacity = '1';
                this.canvas.style.transition = 'opacity 1.5s ease-in-out';
            }, 100);
        }, 500);

        setTimeout(() => {
            this.orbitalView = false;
            this.isTransitioning = false;
            const orbitalCanvas = document.getElementById('orbital-canvas');
            if (orbitalCanvas) {
                orbitalCanvas.style.display = 'none';
            }
            if (this.orbitalRenderer) {
                this.orbitalRenderer.currentZoom = 5;
                this.orbitalRenderer.targetZoom = 3.5;
            }
            document.getElementById('bottom-panel').style.display = 'flex';
            document.getElementById('view-toggle-container').style.display = 'block';
            document.getElementById('top-bar').style.opacity = '1';
        }, 2000);
    }

    handleResize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;

        if (this.orbitalRenderer) {
            const orbitalCanvas = document.getElementById('orbital-canvas');
            if (orbitalCanvas) {
                orbitalCanvas.width = window.innerWidth;
                orbitalCanvas.height = window.innerHeight;
                this.orbitalRenderer.resize(window.innerWidth, window.innerHeight);
            }
        }
    }

    update(deltaTime) {
        this.handleInput();
        this.input.update();
        this.updateCamera();
        this.updateFloatingNumbers();

        if (this.eventSystem.activeEruption) {
            this.eventSystem.updateEruption();
        }

        this.renderer.updateSnowParticles();
        this.renderer.updateAcidRainParticles();
        this.renderer.updateVoxelDebris();
    }

    handleInput() {
        const baseSpeed = 8;
        const shiftMultiplier = this.input.keys['Shift'] ? 1.9 : 1.0;
        const moveSpeed = Math.min(baseSpeed * 3, baseSpeed / this.renderer.zoom) * shiftMultiplier;
        const canvasTop = 75;
        const canvasBottom = window.innerHeight - 220;
        const unitX = this.renderer.tileWidth / 2;
        const unitY = this.renderer.tileHeight / 2;

        if (this.input.keys['ArrowUp'] || this.input.keys['w']) {
            this.targetCameraY += moveSpeed;
        }
        if (this.input.keys['ArrowDown'] || this.input.keys['s']) {
            this.targetCameraY -= moveSpeed;
        }
        if (this.input.keys['ArrowLeft'] || this.input.keys['a']) {
            this.targetCameraX += moveSpeed;
        }
        if (this.input.keys['ArrowRight'] || this.input.keys['d']) {
            this.targetCameraX -= moveSpeed;
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
                const targetY = ((this.height - 220 - 75) / 2) / this.renderer.zoom + this.cameraY;

                const translateX = targetX - centerWorldX;
                const translateY = targetY - centerWorldY;

                const worldX = (mouseX / this.renderer.zoom) - translateX;
                const worldY = (mouseY / this.renderer.zoom) - translateY;

                let gridX = Math.round((worldX / unitX + worldY / unitY) / 2);
                let gridY = Math.round((worldY / unitY - worldX / unitX) / 2);

                if (gridX >= 0 && gridX < this.currentPlanet.width &&
                    gridY >= 0 && gridY < this.currentPlanet.height) {

                    const tile = this.currentPlanet.tiles[gridY][gridX];
                    const elevation = tile.elevation || 0;
                    const elevationHeight = 8;
                    let elevationOffset = elevation * elevationHeight;

                    if (tile.isFloating) {
                        const floatAmplitude = 6;
                        const floatSpeed = 0.8;
                        const floatOffset = Math.sin(Date.now() / 1000 * floatSpeed) * floatAmplitude;
                        elevationOffset += floatOffset - 20;
                    }

                    const adjustedWorldY = worldY + elevationOffset;

                    gridX = Math.round((worldX / unitX + adjustedWorldY / unitY) / 2);
                    gridY = Math.round((adjustedWorldY / unitY - worldX / unitX) / 2);

                    gridX = Math.max(0, Math.min(this.currentPlanet.width - 1, gridX));
                    gridY = Math.max(0, Math.min(this.currentPlanet.height - 1, gridY));
                }

                if (this.gameMode === 'conquest' && this.conquestSystem) {
                    if (this.conquestSystem.hackingMiniGame) {
                        return;
                    }

                    if (this.player.selectedBuilding === 'exodus_shipyard') {
                        if (this.player.shipyards.length >= 3) {
                            this.log('Maximum 3 shipyards allowed!');
                            this.player.selectedBuilding = null;
                            return;
                        }
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

                        const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

                        if (settlementTypes.includes(this.player.selectedBuilding)) {
                            const inAnyClaim = this.player.settlements.some(settlement => {
                                const dx = Math.abs(settlement.x - gridX);
                                const dy = Math.abs(settlement.y - gridY);
                                return dx <= settlement.claimRadius && dy <= settlement.claimRadius;
                            });

                            if (inAnyClaim) {
                                this.log('Cannot build settlement within another settlement\'s claim!');
                                return;
                            }
                        } else {
                            const nearestSettlement = this.player.findNearestSettlement(gridX, gridY);
                            if (!nearestSettlement || !nearestSettlement.isWithinClaim(gridX, gridY)) {
                                this.log('Must build within settlement claim area!');
                                return;
                            }

                            if (!nearestSettlement.canBuildStructure(this.player.selectedBuilding)) {
                                this.log(`Settlement already has maximum ${this.player.selectedBuilding}s!`);
                                return;
                            }
                        }
                    }
                } else if (this.gameMode === 'building' && this.player.selectedBuilding) {
                    const size = this.currentPlanet.getBuildingSize(this.player.selectedBuilding);
                    const canPlace = this.currentPlanet.canPlaceBuildingOfSize(gridX, gridY, size.w, size.h);

                    if (!canPlace) {
                        this.log('Cannot place building here - check terrain and space!');
                        return;
                    }

                    const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

                    if (settlementTypes.includes(this.player.selectedBuilding)) {
                        const inAnyClaim = this.player.settlements.some(settlement => {
                            const dx = Math.abs(settlement.x - gridX);
                            const dy = Math.abs(settlement.y - gridY);
                            return dx <= settlement.claimRadius && dy <= settlement.claimRadius;
                        });

                        if (inAnyClaim) {
                            this.log('Cannot build settlement within another settlement\'s claim!');
                            return;
                        }
                    } else {
                        const possibleSettlements = this.player.settlements.filter(settlement =>
                            settlement.isWithinClaim(gridX, gridY)
                        );

                        if (possibleSettlements.length === 0) {
                            this.log('Must build within settlement claim area!');
                            return;
                        }

                        const nearestSettlement = possibleSettlements.reduce((closest, settlement) => {
                            const distCurrent = Math.abs(settlement.x - gridX) + Math.abs(settlement.y - gridY);
                            const distClosest = Math.abs(closest.x - gridX) + Math.abs(closest.y - gridY);
                            return distCurrent < distClosest ? settlement : closest;
                        });

                        if (!nearestSettlement.canBuildStructure(this.player.selectedBuilding)) {
                            this.log(`Settlement "${nearestSettlement.name}" already has maximum ${this.player.selectedBuilding}s!`);
                            return;
                        }
                    }

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
                    const controllingSettlement = this.player.getControllingSettlement(gridX, gridY);

                    if (tile && !tile.building && tile.type !== 'lava' && tile.type !== 'water' && tile.type !== 'void') {
                        const tempBuilding = new Building(gridX, gridY, this.player.selectedBuilding);
                        tempBuilding.isFrame = true;
                        tempBuilding.buildProgress = 0;
                        tempBuilding.elevation = tile.elevation || 0;
                        if (controllingSettlement) {
                            tempBuilding.settlementIds = [controllingSettlement.id];
                            tempBuilding.isShared = false;
                        }
                        tile.building = tempBuilding;
                        this.currentPlanet.structures.push(tempBuilding);

                        if (this.player.selectedBuilding !== 'settlement' && controllingSettlement) {
                            const currentCount = controllingSettlement.buildings.get(this.player.selectedBuilding) || 0;
                            controllingSettlement.buildings.set(this.player.selectedBuilding, currentCount + 1);
                        }

                        const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

                        if (settlementTypes.includes(this.player.selectedBuilding)) {
                            const newSettlement = this.player.addSettlement(gridX, gridY, this.player.selectedBuilding);
                            this.log(`New ${this.player.selectedBuilding} "${newSettlement.name}" established`);
                        }
                    }

                    this.log(`Sending builders from ${settlement.type} to construct ${this.player.selectedBuilding}`);
                    this.player.selectedBuilding = null;
                    }

                if (this.gameMode === 'conquest' && this.hiringMode) {
                    const tile = this.currentPlanet.tiles[gridY][gridX];
                    if (tile && (tile.type === 'water' || tile.type === 'lava' || tile.type === 'void')) {
                        this.log('Cannot hire units on impassable terrain!');
                        return;
                    }

                    if (this.conquestSystem.hireUnit(this.hiringMode, gridX, gridY)) {
                        this.hiringMode = null;
                    }
                    return;
                }

                if (this.gameMode === 'conquest' && this.conquestSystem) {
                    if (this.unitActionSystem.actionMode === 'move' && this.unitActionSystem.selectedUnit) {
                        const unit = this.unitActionSystem.selectedUnit;
                        if (this.conquestSystem.moveUnit(unit.id, gridX, gridY)) {
                            this.unitActionSystem.actionMode = null;
                            this.unitActionSystem.selectedUnit = null;
                            this.selectedUnit = null;
                        }
                        return;
                    }

                    if (this.unitActionSystem.actionMode === 'attack' && this.unitActionSystem.selectedUnit) {
                        const unit = this.unitActionSystem.selectedUnit;
                        const damage = unit.chargeDamage || unit.damage;

                        const sentinel = this.conquestSystem.sentinels.find(s => s.x === gridX && s.y === gridY);
                        if (sentinel) {
                            const distance = Math.abs(unit.x - gridX) + Math.abs(unit.y - gridY);
                            if (distance <= unit.range) {
                                sentinel.health -= damage;
                                unit.attacked = true;
                                unit.chargeDamage = null;
                                this.log(`${unit.type} attacked sentinel for ${damage} damage!`);



                                if (sentinel.health <= 0) {
                                    this.sentinels.forEach(s => {
                                        if (s.aggroTarget === sentinel.id) {
                                            delete s.aggroTarget;
                                        }
                                    });
                                    this.conquestSystem.sentinels = this.conquestSystem.sentinels.filter(s => s.id !== sentinel.id);
                                    this.log('Sentinel destroyed!');
                                }
                            } else {
                                this.log('Target out of range!');
                            }
                        }

                        this.unitActionSystem.actionMode = null;
                        this.unitActionSystem.selectedUnit = null;
                        this.selectedUnit = null;
                        return;
                    }

                    const clickedUnit = this.conquestSystem.armies.find(a => a.x === gridX && a.y === gridY);
                    if (clickedUnit) {
                        this.selectedUnit = clickedUnit;
                        this.unitActionSystem.showActionMenu(clickedUnit);
                        return;
                    }

                    const clickedBuilding = this.currentPlanet.structures.find(s => s.x === gridX && s.y === gridY);
                    if (clickedBuilding) {
                        this.showBuildingInfo(clickedBuilding);

                        if (clickedBuilding.type === 'defense_node' && !clickedBuilding.hacked) {
                            const nearbyHacker = this.conquestSystem.armies.find(a => {
                                if (a.type !== 'hacker' || a.attacked) return false;
                                const dist = Math.abs(a.x - gridX) + Math.abs(a.y - gridY);
                                return dist <= 2;
                            });

                            if (nearbyHacker) {
                                this.log('Hacker nearby! Use Hack Node action from unit menu.');
                            }
                        }
                        return;
                    }
                }

                if (!this.player.selectedBuilding && !this.hiringMode && !this.unitActionSystem.actionMode) {
                    if (gridX >= 0 && gridX < this.currentPlanet.width &&
                        gridY >= 0 && gridY < this.currentPlanet.height) {
                        const tile = this.currentPlanet.tiles[gridY][gridX];
                        if (tile) {
                            const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

                            if (tile.building && settlementTypes.includes(tile.building.type) && !tile.building.isFrame) {
                                this.showSettlementPanel(gridX, gridY);
                            }

                            if (this.environmentalObjectSystem) {
                                const envObj = this.environmentalObjectSystem.getObjectAt(gridX, gridY);
                                if (envObj) {
                                    this.showEnvironmentalObjectInfo(envObj);
                                    return;
                                }
                            }
                            this.showTileInfo(tile, gridX, gridY);
                        }
                    }
                }
            }
        }
    }

    createFloatingNumber(x, y, text, color) {
        this.floatingNumbers.push({
            worldX: x,
            worldY: y,
            text: text,
            color: color,
            opacity: 1,
            offsetY: 0,
            duration: 60
        });
    }

    updateFloatingNumbers() {
        for (let i = this.floatingNumbers.length - 1; i >= 0; i--) {
            const float = this.floatingNumbers[i];
            float.offsetY -= 1;
            float.opacity -= 0.016;
            float.duration--;

            if (float.duration <= 0) {
                this.floatingNumbers.splice(i, 1);
            }
        }
    }

    showEnvironmentalObjectInfo(obj) {
        const infoPanel = document.getElementById('building-info');
        if (!infoPanel) return;

        const healthPercent = obj.getHealthPercent();
        let healthColor = '#88ff88';
        if (healthPercent < 30) healthColor = '#ff5555';
        else if (healthPercent < 60) healthColor = '#ffaa55';

        let rewardsHTML = '';
        for (const [resource, amount] of Object.entries(obj.rewards)) {
            rewardsHTML += `<p style="font-size: 9px; color: #88cc88;">+${amount} ${resource}</p>`;
        }

        let buttonHTML = '';
        if (!obj.beingDestroyed) {
            buttonHTML = `
                <button id="destroy-object-btn" style="width: 100%; padding: 4px; font-size: 9px; margin-top: 6px; background: #5a3a3a; border: 1px solid #7a5a5a; color: #ffaa88; cursor: pointer; border-radius: 3px;">
                    Send Worker to Destroy
                </button>
            `;
        } else {
            buttonHTML = `
                <p style="font-size: 9px; color: #ffaa00; margin-top: 6px;">Being destroyed...</p>
            `;
        }

        infoPanel.innerHTML = `
            <p style="font-size: 11px; color: #ff8844; margin-bottom: 6px;"><strong>${obj.icon} ${obj.name}</strong></p>
            <p style="font-size: 9px; color: ${healthColor};">HP: ${Math.floor(obj.health)}/${obj.maxHealth} (${healthPercent}%)</p>
            <p style="font-size: 9px; color: #8fa3c8; margin-top: 8px; margin-bottom: 4px;"><strong>Rewards:</strong></p>
            ${rewardsHTML}
            ${buttonHTML}
        `;

        const destroyBtn = document.getElementById('destroy-object-btn');
        if (destroyBtn) {
            destroyBtn.onclick = (e) => {
                e.stopPropagation();
                const nearest = this.player.findNearestSettlement(obj.x, obj.y);
                if (!nearest) {
                    this.log('No settlement nearby to send workers from!');
                    return;
                }

                if (this.environmentalObjectSystem.sendDestroyerTo(obj.x, obj.y, nearest)) {
                    this.showEnvironmentalObjectInfo(obj);
                }
            };
        }
    }

    showGameOver() {
        this.running = false;

        if (typeof AudioManager !== 'undefined') {
            AudioManager.stopBGM();
        }

        const overlay = document.createElement('div');
        overlay.id = 'game-over-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            z-index: 20000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: background 3s ease;
            pointer-events: auto;
        `;

        const gameOverText = document.createElement('h1');
        gameOverText.textContent = 'GAME OVER';
        gameOverText.style.cssText = `
            font-size: 120px;
            font-weight: 900;
            background: linear-gradient(180deg, #ff8800 0%, #ff0000 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            opacity: 0;
            transition: opacity 2s ease 1s;
            text-shadow: 0 0 30px rgba(255, 100, 0, 0.5);
            margin-bottom: 40px;
            letter-spacing: 8px;
        `;

        const message = document.createElement('p');
        message.textContent = 'Your civilization has fallen...';
        message.style.cssText = `
            font-size: 24px;
            color: #ff8888;
            opacity: 0;
            transition: opacity 2s ease 2s;
            margin-bottom: 40px;
        `;

        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart Game';
        restartBtn.style.cssText = `
            padding: 12px 30px;
            font-size: 14px;
            font-weight: 600;
            background: #3a4a5a;
            border: 2px solid #5a6a7a;
            color: #c0d0e8;
            cursor: pointer;
            border-radius: 4px;
            opacity: 0;
            transition: all 0.2s ease, opacity 2s ease 3s;
        `;
        restartBtn.onmouseenter = () => {
            restartBtn.style.background = '#4a5a6a';
            restartBtn.style.borderColor = '#7a8a9a';
        };
        restartBtn.onmouseleave = () => {
            restartBtn.style.background = '#3a4a5a';
            restartBtn.style.borderColor = '#5a6a7a';
        };
        restartBtn.onclick = () => {
            location.reload();
        };

        overlay.appendChild(gameOverText);
        overlay.appendChild(message);
        overlay.appendChild(restartBtn);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.background = 'rgba(0, 0, 0, 0.95)';
            gameOverText.style.opacity = '1';
            message.style.opacity = '1';
            restartBtn.style.opacity = '1';
        }, 100);

        if (typeof AudioManager !== 'undefined') {
            AudioManager.playSFX('sounds/sfx/gameover.mp3', 0.4);
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

        let html = '';

        if (this.gameMode === 'conquest' && this.conquestSystem) {
            const playerUnit = this.conquestSystem.armies.find(a => a.x === x && a.y === y);
            const sentinel = this.conquestSystem.sentinels.find(s => s.x === x && s.y === y);

            if (playerUnit) {
                const healthPercent = Math.floor((playerUnit.health / playerUnit.maxHealth) * 100);
                let healthColor = '#88ff88';
                if (healthPercent < 30) healthColor = '#ff5555';
                else if (healthPercent < 60) healthColor = '#ffaa55';

                html += `<p style="font-size: 11px; color: #88ff88; margin-bottom: 6px;"><strong> ${playerUnit.type.toUpperCase()}</strong></p>`;
                html += `<p style="font-size: 9px; color: ${healthColor};">HP: ${Math.floor(playerUnit.health)}/${playerUnit.maxHealth} (${healthPercent}%)</p>`;
                html += `<p style="font-size: 9px; color: #8fa3c8;">Damage: ${playerUnit.damage}</p>`;
                html += `<p style="font-size: 9px; color: #8fa3c8;">Range: ${playerUnit.range}</p>`;
                html += `<p style="font-size: 9px; color: #8fa3c8;">Move: ${playerUnit.moveRange}</p>`;

                if (playerUnit.moved) {
                    html += `<p style="font-size: 9px; color: #999;">✓ Moved</p>`;
                }
                if (playerUnit.attacked) {
                    html += `<p style="font-size: 9px; color: #999;">✓ Attacked</p>`;
                }
                if (playerUnit.overwatchActive) {
                    html += `<p style="font-size: 9px; color: #ffaa00;">Overwatch Active</p>`;
                }
                if (playerUnit.tauntTurns) {
                    html += `<p style="font-size: 9px; color: #ffaa00;">Taunt (${playerUnit.tauntTurns} turns)</p>`;
                }

                html += `<hr style="border: 0; border-top: 1px solid #3a4a5a; margin: 6px 0;">`;
            }

            if (sentinel) {
                const healthPercent = Math.floor((sentinel.health / sentinel.maxHealth) * 100);
                let healthColor = '#ff8888';
                if (healthPercent < 30) healthColor = '#ff3333';
                else if (healthPercent < 60) healthColor = '#ff6666';

                html += `<p style="font-size: 11px; color: #ff8888; margin-bottom: 6px;"><strong>SENTINEL ${sentinel.type.toUpperCase()}</strong></p>`;
                html += `<p style="font-size: 9px; color: ${healthColor};">HP: ${Math.floor(sentinel.health)}/${sentinel.maxHealth} (${healthPercent}%)</p>`;
                html += `<p style="font-size: 9px; color: #ff9999;">Damage: ${sentinel.damage}</p>`;
                html += `<p style="font-size: 9px; color: #ff9999;">Range: ${sentinel.range}</p>`;
                html += `<p style="font-size: 9px; color: #ff9999;">Move: ${sentinel.moveRange}</p>`;

                if (sentinel.empStunned) {
                    html += `<p style="font-size: 9px; color: #00ffff;">⚡ EMP Stunned (${sentinel.empStunTurns} turn)</p>`;
                }
                if (sentinel.aggroTarget !== undefined) {
                    const targetUnit = this.conquestSystem.armies.find(a => a.id === sentinel.aggroTarget);
                    if (targetUnit) {
                        html += `<p style="font-size: 9px; color: #ffaa00;">Chasing ${targetUnit.type}</p>`;
                    }
                }

                html += `<hr style="border: 0; border-top: 1px solid #3a4a5a; margin: 6px 0;">`;
            }
        }

        html += `
            <p style="font-size: 10px; color: #a8b8d8;"><strong>${tileName}</strong></p>
            <p style="font-size: 9px; color: #8fa3c8;">Position: (${x}, ${y})</p>
            <p style="font-size: 9px; color: #8fa3c8;">Food: +${tile.yields.food}</p>
            <p style="font-size: 9px; color: #8fa3c8;">Production: +${tile.yields.production}</p>
            <p style="font-size: 9px; color: #8fa3c8;">Science: +${tile.yields.science}</p>
        `;

        if (tile.hasGeothermal) {
            html += `<p style="font-size: 9px; color: #ff8800;">Geothermal Vent</p>`;
        }

        if (tile.isFloating) {
            html += `<p style="font-size: 9px; color: #88ccff;">Floating Terrain</p>`;
        }

        if (tile.type === 'lava') {
            html += `<p style="font-size: 9px; color: #ff4400;">Impassable</p>`;
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

        if (this.ecosystem && this.galaxy.currentPlanetIndex === 0) {
            const creatures = [];
            if (this.ecosystem.creatures.ashworms.some(w => w.x === x && w.y === y)) {
                creatures.push({ type: 'ashworms', name: 'Ashworm' });
            }
            if (this.ecosystem.creatures.magmabeetles.some(b => b.x === x && b.y === y)) {
                creatures.push({ type: 'magmabeetles', name: 'Magma Beetle' });
            }
            if (this.ecosystem.creatures.emberbirds.some(b => b.x === x && b.y === y)) {
                creatures.push({ type: 'emberbirds', name: 'Emberbird' });
            }

            if (creatures.length > 0) {
                const contract = this.ecosystem.getContractAt(x, y);

                let contractHtml = `<hr style="border: 0; border-top: 1px solid #3a4a5a; margin: 6px 0;">`;

                if (contract) {
                    contractHtml += `<p style="font-size: 10px; color: #ffaa00; font-weight: 600;">Active Contract</p>`;
                    contractHtml += `<p style="font-size: 9px; color: #88ff88;">Progress: ${contract.progress}/${contract.duration} turns</p>`;
                    contractHtml += `<p style="font-size: 9px; color: #88ccff;">Producing: ${contract.produces}</p>`;
                } else {
                    contractHtml += `<p style="font-size: 10px; color: #88cc88; font-weight: 600;">${creatures[0].name} present</p>`;
                    contractHtml += `<button id="contract-creature-btn" style="width: 100%; padding: 4px; font-size: 9px; margin-top: 4px; background: #3a4a3a; border: 1px solid #5a6a5a; color: #a8d888; cursor: pointer; border-radius: 3px;">
                        Start Contract
                    </button>`;
                }

                infoPanel.innerHTML += contractHtml;
            }
        }

        const contractBtn = document.getElementById('contract-creature-btn');
        if (contractBtn) {
            contractBtn.onclick = (e) => {
                e.stopPropagation();
                this.startCreatureContract(x, y);
            };
        }
    }

    startCreatureContract(x, y) {
        if (!this.ecosystem) return;

        let creatureType = null;
        if (this.ecosystem.creatures.ashworms.some(w => w.x === x && w.y === y)) {
            creatureType = 'ashworms';
        } else if (this.ecosystem.creatures.magmabeetles.some(b => b.x === x && b.y === y)) {
            creatureType = 'magmabeetles';
        } else if (this.ecosystem.creatures.emberbirds.some(b => b.x === x && b.y === y)) {
            creatureType = 'emberbirds';
        }

        if (!creatureType) {
            this.log('No creature at this location!');
            return;
        }

        this.ecosystem.startContract(x, y, creatureType);
        this.showTileInfo(this.currentPlanet.tiles[y][x], x, y);
    }

    selectNearestSettlement(targetX, targetY) {
        const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven', 'spaceship'];
        const settlements = this.currentPlanet.structures.filter(s =>
            settlementTypes.includes(s.type) && !s.isFrame
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
                    const nearestSettlement = this.player.findNearestSettlement(builder.targetX, builder.targetY);
                    if (nearestSettlement) {
                        nearestSettlement.removeBuilding(this.player.selectedBuilding);
                    }
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

                    const controllingSettlement = this.player.getControllingSettlement(builder.targetX, builder.targetY);
                    if (controllingSettlement && builder.buildingType !== 'settlement') {
                        controllingSettlement.addBuilding(builder.buildingType);
                    }

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

    updateRepairers() {
        for (let i = this.player.repairers.length - 1; i >= 0; i--) {
            const repairer = this.player.repairers[i];

            if (!repairer.path && !repairer.arrived) {
                repairer.path = repairer.findPath(this.currentPlanet);
                if (!repairer.path) {
                    this.log(`Cannot reach building at (${repairer.targetX}, ${repairer.targetY}) - blocked!`);
                    this.player.repairers.splice(i, 1);
                    this.player.repairQueue = this.player.repairQueue.filter(r => r.repairerId !== repairer.id);
                    continue;
                }
            }

            const repairerState = repairer.update();
            const queuedRepair = this.player.repairQueue.find(r => r.repairerId === repairer.id);
            if (queuedRepair) {
                queuedRepair.repairerProgress = repairerState.progress;
            }

            if (repairer.arrived) {
                const tile = this.currentPlanet.tiles[repairer.targetY][repairer.targetX];
                if (tile && tile.building && tile.building.type === repairer.buildingType) {
                    const repairPerTick = repairer.repairAmount / repairer.totalRepairTime;
                    tile.building.health = Math.min(
                        tile.building.maxHealth,
                        tile.building.health + repairPerTick
                    );
                }
            }

            if (repairer.isComplete()) {
                const tile = this.currentPlanet.tiles[repairer.targetY][repairer.targetX];
                if (tile && tile.building) {
                    tile.building.health = tile.building.maxHealth;
                    this.log(`Repair complete: ${repairer.buildingType} at (${repairer.targetX}, ${repairer.targetY})`);
                }

                this.player.repairers.splice(i, 1);
                this.player.repairQueue = this.player.repairQueue.filter(r => r.repairerId !== repairer.id);
            }
        }
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
        } else if (building.type === 'fusionreactor') {
            const turnsSinceUse = this.player.turn - this.player.lastReactorUse;
            const canUse = turnsSinceUse >= 25;
            const hasResources = this.player.resources.iron >= 50 && this.player.resources.rareMinerals >= 20;

            infoPanel.innerHTML = `
                <p style="font-size: 10px; color: #a8b8d8;"><strong>Fusion Reactor</strong></p>
                <p style="font-size: 9px; color: #8fa3c8;">HP: ${Math.floor(building.health)}/${building.maxHealth}</p>
                <p style="font-size: 9px; color: #8fa3c8; margin-top: 6px;">Convert: 50 Fe + 20 RM → Uranium</p>
                <p style="font-size: 9px; color: ${canUse ? '#88cc88' : '#cc8888'};">
                    ${canUse ? 'Ready!' : `Cooldown: ${25 - turnsSinceUse} turns`}
                </p>
                ${canUse && hasResources ? `
                    <button id="reactor-convert-btn" style="width: 100%; padding: 6px; font-size: 9px; margin-top: 6px; background: #3a5a4a; border: 1px solid #5a7a6a; color: #a8d888; cursor: pointer; border-radius: 3px;">
                        Activate Reactor
                    </button>
                ` : ''}
            `;

            const reactorBtn = document.getElementById('reactor-convert-btn');
            if (reactorBtn) {
                reactorBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.startReactorMinigame(building);
                };
            }
        } else if (building.type === 'settlement') {
            this.showSettlementPanel(building.x, building.y);
        } else {
            const healthPercent = Math.floor((building.health / building.maxHealth) * 100);
            let healthColor = '#88ff88';
            if (healthPercent < 30) healthColor = '#ff5555';
            else if (healthPercent < 60) healthColor = '#ffaa55';

            const isDamaged = building.health < building.maxHealth;
            const isBeingRepaired = this.player.repairQueue.some(r => r.x === building.x && r.y === building.y);

            let repairButtonHTML = '';
            if (isDamaged && !isBeingRepaired && !building.isFrame) {
                const repairCost = this.player.getRepairCost(building.type, building.health, building.maxHealth);
                const canAfford = this.player.canAffordRepair(building.type, building.health, building.maxHealth);

                repairButtonHTML = `
                    <button id="repair-building-btn"
                        style="width: 100%; padding: 4px; font-size: 9px; margin-top: 6px;
                        background: ${canAfford ? '#3a5a4a' : '#5a3a3a'};
                        border: 1px solid ${canAfford ? '#5a7a6a' : '#7a4a4a'};
                        color: ${canAfford ? '#a8d888' : '#d88888'};
                        cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                        border-radius: 3px;">
                        Repair (${repairCost.resources} Resources)
                    </button>
                `;
            } else if (isBeingRepaired) {
                const repairJob = this.player.repairQueue.find(r => r.x === building.x && r.y === building.y);
                const repairer = this.player.repairers.find(r => r.id === repairJob.repairerId);
                const progress = repairer ? repairer.progress : 0;

                repairButtonHTML = `
                    <div style="margin-top: 6px; padding: 4px; background: rgba(58, 90, 74, 0.3); border-radius: 3px;">
                        <p style="font-size: 9px; color: #88cc88; margin-bottom: 2px;">Repairing... ${Math.floor(progress)}%</p>
                        <div style="width: 100%; height: 4px; background: #2a3a4a; border-radius: 2px; overflow: hidden;">
                            <div style="width: ${progress}%; height: 100%; background: #88cc88; transition: width 0.3s;"></div>
                        </div>
                    </div>
                `;
            }

            infoPanel.innerHTML = `
                <p style="font-size: 10px; color: #a8b8d8;"><strong>${building.type.charAt(0).toUpperCase() + building.type.slice(1)}</strong></p>
                <p style="font-size: 9px; color: ${healthColor};">HP: ${Math.floor(building.health)}/${building.maxHealth} (${healthPercent}%)</p>
                ${repairButtonHTML}
            `;

            const repairBtn = document.getElementById('repair-building-btn');
            if (repairBtn) {
                repairBtn.onclick = (e) => {
                    e.stopPropagation();

                    const canAfford = this.player.canAffordRepair(building.type, building.health, building.maxHealth);
                    if (!canAfford) {
                        const cost = this.player.getRepairCost(building.type, building.health, building.maxHealth);
                        this.log(`Cannot afford repair - Need: ${cost.resources} Resources`);
                        return;
                    }

                    const nearest = this.player.findNearestSettlement(building.x, building.y);
                    if (!nearest) {
                        this.log('No settlement nearby to send repairer from!');
                        return;
                    }

                    if (this.player.startRepair(building, nearest)) {
                        this.log(`Sending repairer to fix ${building.type} at (${building.x}, ${building.y})`);
                        this.showBuildingInfo(building);
                    } else {
                        this.log('Failed to start repair!');
                    }
                };
            }
        }
    }

    startReactorMinigame(building) {
        if (this.player.resources.iron < 50 || this.player.resources.rareMinerals < 20) {
            this.log('Insufficient resources for reactor!');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'reactor-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        `;

        modal.innerHTML = `
            <div style="background: #1a2a3a; border: 3px solid #4a6a8a; border-radius: 8px; padding: 30px; text-align: center;">
                <h2 style="color: #88ccff; margin-bottom: 15px;">REACTOR TIMING</h2>
                <p style="color: #aabbcc; font-size: 12px; margin-bottom: 20px;">Press SPACE when the bar reaches the center!</p>
                <div style="width: 400px; height: 60px; background: #0a1a2a; border: 2px solid #3a5a7a; border-radius: 4px; position: relative; overflow: hidden;">
                    <div id="reactor-target" style="position: absolute; left: 45%; width: 10%; height: 100%; background: linear-gradient(90deg, transparent, #00ff00, transparent);"></div>
                    <div id="reactor-bar" style="position: absolute; left: 0%; width: 4%; height: 100%; background: #ff8800; transition: left 0.05s linear;"></div>
                </div>
                <button id="reactor-cancel" style="margin-top: 20px; padding: 8px 20px; background: #3a4a5a; border: 1px solid #5a6a7a; color: #c0d0e8; cursor: pointer; border-radius: 4px;">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);

        const bar = document.getElementById('reactor-bar');
        let position = 0;
        let direction = 1;
        let active = true;

        const updateBar = () => {
            if (!active) return;

            position += direction * 2;

            if (position >= 96) direction = -1;
            if (position <= 0) direction = 1;

            bar.style.left = position + '%';
            requestAnimationFrame(updateBar);
        };

        updateBar();

        const attemptReaction = () => {
            if (!active) return;
            active = false;

            const distance = Math.abs(position - 50);

            this.player.resources.iron -= 50;
            this.player.resources.rareMinerals -= 20;
            this.player.lastReactorUse = this.player.turn;

            document.body.removeChild(modal);

            if (distance <= 5) {
                this.player.resources.uranium += 100;
                this.log('PERFECT! +100 Uranium generated!');
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSFX('sounds/sfx/complete.mp3', 0.8);
                }
            } else if (distance <= 10) {
                this.player.resources.uranium += 50;
                this.log('Success! +50 Uranium generated.');
            } else {
                this.player.resources.uranium += 15;
                this.log('Timing off... only +15 Uranium produced.');
            }

            this.showBuildingInfo(building);
        };

        const keyHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                attemptReaction();
                document.removeEventListener('keydown', keyHandler);
            }
        };

        document.addEventListener('keydown', keyHandler);

        document.getElementById('reactor-cancel').onclick = () => {
            active = false;
            document.body.removeChild(modal);
            document.removeEventListener('keydown', keyHandler);
        };
    }

    showSettlementPanel(x, y) {
        const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

        const tile = this.currentPlanet.tiles[y][x];
        if (!tile || !tile.building) return;

        if (!settlementTypes.includes(tile.building.type)) return;

        const settlement = this.player.getSettlementAt(x, y);
        if (!settlement) return;

        settlement.recalculateBuildingCounts(this.currentPlanet);

        const panel = document.getElementById('settlement-panel');
        panel.style.display = 'block';

        const controlIcon = settlement.priority === Math.max(...this.player.settlements.map(s => s.priority)) ? '[|' : '';
        document.getElementById('settlement-title').textContent = settlement.name + controlIcon;
        document.getElementById('settlement-population').textContent = settlement.getPopulation();
        document.getElementById('settlement-food').textContent = Math.floor(settlement.food);

        const foodRate = settlement.foodPerTurn - settlement.foodConsumption;
        const rateEl = document.getElementById('settlement-food-rate');
        rateEl.textContent = `(${foodRate >= 0 ? '+' : ''}${foodRate}/turn)`;
        rateEl.style.color = foodRate >= 0 ? '#88cc88' : '#cc8888';

        const growthPercent = Math.floor((settlement.growthProgress / settlement.growthRequired) * 100);
        document.getElementById('settlement-growth').textContent = `${growthPercent}%`;

        const storage = settlement.getStorageCapacity();
        document.getElementById('settlement-storage').textContent = `${Math.floor(settlement.food)}/${storage}`;

        const buildingsList = document.getElementById('settlement-buildings-list');
        buildingsList.innerHTML = '';

        Object.entries(settlement.buildingLimits).forEach(([type, limit]) => {
            const current = settlement.buildings.get(type) || 0;
            const isShared = current % 1 !== 0;
            const item = document.createElement('div');
            item.className = 'building-limit-item' + (current >= limit ? ' at-limit' : '');
            item.innerHTML = `
                <span>${type.charAt(0).toUpperCase() + type.slice(1)}${isShared ? ' 🔗' : ''}</span>
                <span>${isShared ? current.toFixed(1) : Math.floor(current)}/${limit}</span>
            `;
            buildingsList.appendChild(item);
        });

        let educationDiv = document.getElementById('settlement-education');
        if (!educationDiv) {
            educationDiv = document.createElement('div');
            educationDiv.id = 'settlement-education';
            educationDiv.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #3a4454;';
            document.getElementById('settlement-buildings-list').parentElement.insertAdjacentElement('afterend', educationDiv);
        }

        educationDiv.innerHTML = '';

        const educationTitle = document.createElement('h3');
        educationTitle.textContent = 'EDUCATION';
        educationTitle.style.cssText = 'color: #8fa3c8; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; font-weight: 600;';
        educationDiv.appendChild(educationTitle);

        const educationStats = settlement.getEducationStats();
        const totalEducatable = educationStats.uneducated + educationStats.basic + educationStats.advanced + educationStats.expert;

        if (totalEducatable > 0) {
            const statsContainer = document.createElement('div');
            statsContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 9px;';

            const createStatItem = (label, count, color) => {
                const item = document.createElement('div');
                item.style.cssText = `background: rgba(58, 74, 90, 0.3); padding: 3px 6px; border-radius: 3px; border-left: 3px solid ${color};`;
                item.innerHTML = `<span style="color: #a8b8d8;">${label}:</span> <strong style="color: ${color};">${count}</strong>`;
                return item;
            };

            statsContainer.appendChild(createStatItem('Uneducated', educationStats.uneducated, '#888888'));
            statsContainer.appendChild(createStatItem('Basic', educationStats.basic, '#88cc88'));
            statsContainer.appendChild(createStatItem('Advanced', educationStats.advanced, '#88aaff'));
            statsContainer.appendChild(createStatItem('Expert', educationStats.expert, '#ffaa00'));

            educationDiv.appendChild(statsContainer);

            const schoolCount = settlement.buildings.get('school') || 0;
            const universityCount = settlement.buildings.get('university') || 0;
            const academyCount = settlement.buildings.get('academy') || 0;

            if (schoolCount + universityCount + academyCount > 0) {
                const facilitiesDiv = document.createElement('div');
                facilitiesDiv.style.cssText = 'margin-top: 6px; font-size: 8px; color: #7a8a9a;';
                facilitiesDiv.innerHTML = `Facilities: ${schoolCount > 0 ? `${schoolCount} School(s)` : ''} ${universityCount > 0 ? `${universityCount} University` : ''} ${academyCount > 0 ? `${academyCount} Academy` : ''}`.trim();
                educationDiv.appendChild(facilitiesDiv);
            } else {
                const noFacilitiesDiv = document.createElement('div');
                noFacilitiesDiv.style.cssText = 'margin-top: 6px; font-size: 8px; color: #aa6666; font-style: italic;';
                noFacilitiesDiv.textContent = 'No education facilities - citizens learning slowly';
                educationDiv.appendChild(noFacilitiesDiv);
            }
        } else {
            const noPopDiv = document.createElement('div');
            noPopDiv.style.cssText = 'font-size: 9px; color: #7a8a9a; font-style: italic;';
            noPopDiv.textContent = 'No citizens of school age';
            educationDiv.appendChild(noPopDiv);
        }

        const citizensList = document.getElementById('settlement-citizens-list');
        citizensList.innerHTML = '';



        let demographicsDiv = document.getElementById('settlement-demographics');
        if (!demographicsDiv) {
            demographicsDiv = document.createElement('div');
            demographicsDiv.id = 'settlement-demographics';
            demographicsDiv.style.cssText = 'margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #3a4454;';

            const insertAfter = document.getElementById('settlement-education') || document.getElementById('settlement-buildings-list').parentElement;
            insertAfter.insertAdjacentElement('afterend', demographicsDiv);
        }

        demographicsDiv.innerHTML = '';

        const demographicsTitle = document.createElement('h3');
        demographicsTitle.textContent = 'DEMOGRAPHICS';
        demographicsTitle.style.cssText = 'color: #8fa3c8; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; font-weight: 600;';
        demographicsDiv.appendChild(demographicsTitle);

        const children = settlement.children.length;
        const adults = settlement.citizens.filter(c => c.age < 65).length;
        const elders = settlement.citizens.filter(c => c.age >= 65).length;
        const total = children + adults + elders;

        const childPercent = total > 0 ? Math.round((children / total) * 100) : 0;
        const adultPercent = total > 0 ? Math.round((adults / total) * 100) : 0;
        const elderPercent = total > 0 ? Math.round((elders / total) * 100) : 0;

        const demographicsContent = document.createElement('div');
        demographicsContent.style.cssText = 'font-size: 9px; color: #a8b8d8;';
        demographicsContent.innerHTML = `
            <div style="margin: 3px 0;">Children (0-17): ${children} (${childPercent}%)</div>
            <div style="margin: 3px 0;">Adults (18-64): ${adults} (${adultPercent}%)</div>
            <div style="margin: 3px 0;">Elders (65+): ${elders} (${elderPercent}%)</div>
            <div style="margin: 6px 0 3px 0; padding-top: 6px; border-top: 1px solid #3a4454;">Birth Rate: 0/turn</div>
            <div style="margin: 3px 0;">Death Rate: 0/turn</div>
            <div style="margin: 3px 0;">Life Expectancy: 65 years</div>
        `;
        demographicsDiv.appendChild(demographicsContent);

        const maxPop = settlement.getMaxPopulation();
        const totalPop = settlement.citizens.length + settlement.children.length;

        const capacityDiv = document.createElement('div');
        capacityDiv.style.cssText = 'margin-bottom: 8px; padding: 4px; background: rgba(74, 90, 106, 0.3); border-radius: 3px;';
        capacityDiv.innerHTML = `<strong>Population: ${totalPop}/${maxPop}</strong>`;
        citizensList.appendChild(capacityDiv);

        settlement.citizens.forEach(citizen => {
            const item = document.createElement('div');
            item.className = 'citizen-item';

            const educationColors = {
                uneducated: '#888888',
                basic: '#88cc88',
                advanced: '#88aaff',
                expert: '#ffaa00'
            };

            const educationLabels = {
                uneducated: 'Uneducated',
                basic: 'Basic Ed.',
                advanced: 'Advanced Ed.',
                expert: 'Expert'
            };

            const eduColor = educationColors[citizen.education] || '#888888';
            const eduLabel = educationLabels[citizen.education] || 'Unknown';

            const childrenInfo = citizen.hasChildren ? ` | ${citizen.childrenCount} children` : '';

            item.innerHTML = `
                <div class="citizen-name">${citizen.name}</div>
                <div class="citizen-details">
                    Age: ${citizen.age} | ${citizen.job}${childrenInfo}
                    <span style="color: ${eduColor}; margin-left: 4px;">| ${eduLabel}</span>
                </div>
            `;
            citizensList.appendChild(item);
        });

        if (settlement.children.length > 0) {
            const childHeader = document.createElement('div');
            childHeader.style.cssText = 'margin-top: 8px; margin-bottom: 4px; font-weight: 600; color: #8fa3c8; font-size: 10px;';
            childHeader.textContent = 'CHILDREN:';
            citizensList.appendChild(childHeader);

            settlement.children.forEach(child => {
                const item = document.createElement('div');
                item.className = 'citizen-item';
                item.style.background = 'rgba(90, 120, 150, 0.2)';

                const educationColors = {
                    uneducated: '#888888',
                    basic: '#88cc88',
                    advanced: '#88aaff',
                    expert: '#ffaa00'
                };

                const educationLabels = {
                    uneducated: 'Uneducated',
                    basic: 'Basic Ed.',
                    advanced: 'Advanced Ed.',
                    expert: 'Expert'
                };

                const eduColor = educationColors[child.education] || '#888888';
                const eduLabel = educationLabels[child.education] || 'Unknown';

                const progressInfo = child.age >= 6 && child.educationProgress > 0 ?
                    ` (${Math.floor(child.educationProgress)}%)` : '';

                item.innerHTML = `
                    <div class="citizen-name">${child.name}</div>
                    <div class="citizen-details">
                        Age: ${child.age} | ${child.job}
                        <span style="color: ${eduColor}; margin-left: 4px;">| ${eduLabel}${progressInfo}</span>
                    </div>
                `;
                citizensList.appendChild(item);
            });
        }

        document.getElementById('settlement-close-btn').onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        };
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
        const elevationHeight = 8;

        const mouseX = this.input.mouseX;
        const mouseY = this.input.mouseY - canvasTop;

        const centerGridX = this.currentPlanet.width / 2;
        const centerGridY = this.currentPlanet.height / 2;
        const centerWorldX = (centerGridX - centerGridY) * unitX;
        const centerWorldY = (centerGridX + centerGridY) * unitY;

        const targetX = (this.width / 2) / this.renderer.zoom + this.cameraX;
        const targetY = ((this.height - 220 - 75) / 2) / this.renderer.zoom + this.cameraY;

        const translateX = targetX - centerWorldX;
        const translateY = targetY - centerWorldY;

        const worldX = (mouseX / this.renderer.zoom) - translateX;
        const worldY = (mouseY / this.renderer.zoom) - translateY;

        let gridX = Math.round((worldX / unitX + worldY / unitY) / 2);
        let gridY = Math.round((worldY / unitY - worldX / unitX) / 2);

        if (gridX >= 0 && gridX < this.currentPlanet.width &&
            gridY >= 0 && gridY < this.currentPlanet.height) {

            const tile = this.currentPlanet.tiles[gridY][gridX];
            const elevation = tile.elevation || 0;
            const elevationHeight = 8;
            const elevationOffset = elevation * elevationHeight;

            const adjustedWorldY = worldY + elevationOffset;

            gridX = Math.round((worldX / unitX + adjustedWorldY / unitY) / 2);
            gridY = Math.round((adjustedWorldY / unitY - worldX / unitX) / 2);

            gridX = Math.max(0, Math.min(this.currentPlanet.width - 1, gridX));
            gridY = Math.max(0, Math.min(this.currentPlanet.height - 1, gridY));
        }

        const size = this.currentPlanet.getBuildingSize(this.player.selectedBuilding);
        let canPlace = this.currentPlanet.canPlaceBuildingOfSize(gridX, gridY, size.w, size.h);

        if (canPlace) {
            const settlementTypes = ['hut', 'settlement', 'township', 'feudaltown', 'citystate', 'factorytown', 'steamcity', 'metropolis', 'powercity', 'technopolis', 'megacity', 'triworldhub', 'haven'];

            if (settlementTypes.includes(this.player.selectedBuilding)) {
                const inAnyClaim = this.player.settlements.some(settlement => {
                    const dx = Math.abs(settlement.x - gridX);
                    const dy = Math.abs(settlement.y - gridY);
                    return dx <= settlement.claimRadius && dy <= settlement.claimRadius;
                });

                if (inAnyClaim) {
                    canPlace = false;
                }
            } else {
                const controllingSettlement = this.player.getControllingSettlement(gridX, gridY);

                if (!controllingSettlement) {
                    canPlace = false;
                } else {
                    controllingSettlement.recalculateBuildingCounts(this.currentPlanet);

                    if (!controllingSettlement.canBuildStructure(this.player.selectedBuilding)) {
                        canPlace = false;
                    }
                }
            }
        }

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;

        for (let dy = 0; dy < size.h; dy++) {
            for (let dx = 0; dx < size.w; dx++) {
                const tileGridX = gridX + dx;
                const tileGridY = gridY + dy;

                if (tileGridX >= 0 && tileGridX < this.currentPlanet.width &&
                    tileGridY >= 0 && tileGridY < this.currentPlanet.height) {

                    const tile = this.currentPlanet.tiles[tileGridY][tileGridX];
                    const elevation = tile.elevation || 0;
                    const yOffset = -elevation * elevationHeight;

                    const tileWorldX = (tileGridX - tileGridY) * unitX;
                    const tileWorldY = (tileGridX + tileGridY) * unitY + yOffset;

                    const sx = (tileWorldX + translateX) * this.renderer.zoom;
                    const sy = (tileWorldY + translateY) * this.renderer.zoom + canvasTop;

                    const sxOffset = unitX * this.renderer.zoom;
                    const syOffset = unitY * this.renderer.zoom;

                    this.ctx.fillStyle = canPlace ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)';
                    this.ctx.beginPath();
                    this.ctx.moveTo(sx, sy - syOffset);
                    this.ctx.lineTo(sx - sxOffset, sy);
                    this.ctx.lineTo(sx, sy + syOffset);
                    this.ctx.lineTo(sx + sxOffset, sy);
                    this.ctx.closePath();
                    this.ctx.fill();

                    this.ctx.globalAlpha = 1;
                    this.ctx.strokeStyle = canPlace ? 'rgba(100, 255, 100, 1)' : 'rgba(255, 100, 100, 1)';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 0.5;
                }
            }
        }

        if (canPlace) {
            this.ctx.fillStyle = '#88ff88';
        } else {
            this.ctx.fillStyle = '#ff8888';
        }
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.globalAlpha = 1;
        this.ctx.fillText(`Building: ${this.player.selectedBuilding} | Location: (${gridX}, ${gridY})`, 650, this.height - 240);

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

        const viewW = this.width / this.renderer.zoom;
        const viewH = (this.height - 160 - 75) / this.renderer.zoom;

        const padding = 400;

        const minCameraX = minX - viewW - padding;
        const maxCameraX = maxX + padding;
        const minCameraY = minY - viewH - padding;
        const maxCameraY = maxY + padding;

        this.targetCameraX = Math.max(minCameraX, Math.min(this.targetCameraX, maxCameraX));
        this.targetCameraY = Math.max(minCameraY, Math.min(this.targetCameraY, maxCameraY));

        this.cameraX += (this.targetCameraX - this.cameraX) * this.cameraEasing;
        this.cameraY += (this.targetCameraY - this.cameraY) * this.cameraEasing;
    }

    render() {
        if (this.orbitalView) {
            if (this.orbitalRenderer) {
                this.orbitalRenderer.updateOrbitalBuildings(this.player);
                this.orbitalRenderer.animate();
            }
            return;
        }

        this.renderer.backgroundRenderer.draw(this.cameraX, this.cameraY, this.renderer.zoom);

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
        const targetY = ((this.height - topBarHeight - 220) / 2) / this.renderer.zoom + this.cameraY;


        this.ctx.translate(
            targetX - centerScreenX,
            targetY - centerScreenY
        );

        const visibleTiles = this.getVisibleTiles();

        const tilesToRender = [];
        for (let y = visibleTiles.minY; y <= visibleTiles.maxY; y++) {
            for (let x = visibleTiles.minX; x <= visibleTiles.maxX; x++) {
                tilesToRender.push({ x, y, tile: this.currentPlanet.tiles[y][x] });
            }
        }

        tilesToRender.sort((a, b) => {
            const sumA = a.x + a.y;
            const sumB = b.x + b.y;
            if (sumA !== sumB) return sumA - sumB;
            return a.x - b.x;
        });

        tilesToRender.forEach(({ x, y, tile }) => {
            this.renderer.drawTile(x, y, tile, this.cameraX, this.cameraY);
            this.renderer.terrainRenderer.drawCliffFace(x, y, tile, this.currentPlanet);

            if (this.environmentalObjectSystem && this.galaxy.currentPlanetIndex === 0) {
                const envObj = this.environmentalObjectSystem.getObjectAt(x, y);
                if (envObj) {
                    this.renderer.environmentalRenderer.drawEnvironmentalObject(envObj, this.cameraX, this.cameraY);
                }
            }

            const building = tile.building;
            if (building && building.x === x && building.y === y) {
                this.renderer.drawBuilding(building, this.cameraX, this.cameraY);
            }
        });

        if (this.ecosystem && this.galaxy.currentPlanetIndex === 0) {
            for (let y = visibleTiles.minY; y <= visibleTiles.maxY; y++) {
                for (let x = visibleTiles.minX; x <= visibleTiles.maxX; x++) {
                    this.renderer.drawTileEnrichment(x, y, this.currentPlanet.tiles[y][x], this.cameraX, this.cameraY);
                }
            }
        }

        if (Math.random() < 0.02 && this.renderer.lavaSparks.length < 50) {
            const visibleTiles = this.getVisibleTiles();
            for (let y = visibleTiles.minY; y <= visibleTiles.maxY; y += 3) {
                for (let x = visibleTiles.minX; x <= visibleTiles.maxX; x += 3) {
                    if (this.currentPlanet.tiles[y][x].type === 'lava' && Math.random() < 0.05) {
                        this.renderer.createLavaSpark(x, y);
                    }
                }
            }
        }

        this.renderer.updateLavaSparks();

        if (this.viewMode === 'claims') {
            this.player.settlements.forEach(settlement => {
                this.renderer.drawSettlementClaim(settlement, this.cameraX, this.cameraY);
            });
        } else {
            const settlementPanel = document.getElementById('settlement-panel');
            if (settlementPanel && settlementPanel.style.display === 'block') {
                const title = document.getElementById('settlement-title');
                if (title) {
                    const settlementName = title.textContent;
                    const settlement = this.player.settlements.find(s => s.name === settlementName);
                    if (settlement) {
                        this.renderer.drawSettlementClaim(settlement, this.cameraX, this.cameraY);
                    }
                }
            }
        }

        if (this.conquestSystem && this.gameMode === 'conquest') {
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

            if (this.gameMode === 'conquest' && this.conquestSystem) {
                this.conquestSystem.sentinels.forEach(sentinel => {
                    this.renderer.drawUnit(sentinel, this.cameraX, this.cameraY, '#ff0000', false);
                });

                this.conquestSystem.armies.forEach(army => {
                    const isSelected = this.selectedUnit && this.selectedUnit.id === army.id;
                    this.renderer.drawUnit(army, this.cameraX, this.cameraY, '#00ff00', isSelected);
                });
            }
        }

        this.renderer.drawLavaSparks(this.cameraX, this.cameraY);
        this.renderer.drawVoxelDebris(this.cameraX, this.cameraY);

        const builderGroups = {};
        this.player.builders.forEach(builder => {
            const key = `${builder.currentX},${builder.currentY}`;
            if (!builderGroups[key]) {
                builderGroups[key] = [];
            }
            builderGroups[key].push(builder);
        });

        Object.values(builderGroups).forEach(group => {
            this.renderer.drawBuilder(group[0], this.cameraX, this.cameraY);
            if (group.length > 1) {
                const screenX = (group[0].currentX - group[0].currentY) * (this.renderer.tileWidth / 2);
                const screenY = (group[0].currentX + group[0].currentY) * (this.renderer.tileHeight / 2);
                this.renderer.drawBuilderCount(screenX, screenY, group.length);
            }
        });

        const repairerGroups = {};
        this.player.repairers.forEach(repairer => {
            const key = `${repairer.currentX},${repairer.currentY}`;
            if (!repairerGroups[key]) {
                repairerGroups[key] = [];
            }
            repairerGroups[key].push(repairer);
        });

        Object.values(repairerGroups).forEach(group => {
            this.renderer.drawRepairer(group[0], this.cameraX, this.cameraY);
            if (group.length > 1) {
                const screenX = (group[0].currentX - group[0].currentY) * (this.renderer.tileWidth / 2);
                const screenY = (group[0].currentX + group[0].currentY) * (this.renderer.tileHeight / 2);
                this.renderer.drawRepairerCount(screenX, screenY, group.length);
            }
        });

        this.renderer.drawBuildingQueue(this.player.buildingQueue);

        if (this.ecosystem && this.galaxy.currentPlanetIndex === 0) {
            this.renderer.drawCreatures(this.ecosystem, this.cameraX, this.cameraY);
        }

        if (this.environmentalObjectSystem && this.galaxy.currentPlanetIndex === 0) {
            this.renderer.drawDestroyers(
                this.environmentalObjectSystem.destroyers,
                this.cameraX,
                this.cameraY
            );
        }

        this.floatingNumbers.forEach(float => {
            const screenX = (float.worldX - float.worldY) * (this.renderer.tileWidth / 2);
            const screenY = (float.worldX + float.worldY) * (this.renderer.tileHeight / 2) + float.offsetY;

            this.ctx.save();
            this.ctx.globalAlpha = float.opacity;
            this.ctx.fillStyle = float.color;
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(float.text, screenX, screenY);
            this.ctx.restore();
        });

        this.ctx.restore();

        if (this.player.selectedBuilding && this.gameMode === 'building') {
            this._drawBuildingPreview();
        }

        this.renderer.drawSnowParticles();
        this.renderer.drawAcidRainParticles();

        this.updateUI();
    }

    updateUI() {
        this.updateResourceDisplay();

        const totalFood = this.player.settlements.reduce((sum, s) => sum + s.food, 0);
        document.getElementById('food-count').textContent = Math.floor(totalFood);
        const totalPop = this.player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
        document.getElementById('population-count').textContent = totalPop;

        const totalExperts = this.player.settlements.reduce((sum, s) => {
            const eduStats = s.getEducationStats();
            return sum + (eduStats.expert || 0);
        }, 0);
        document.getElementById('experts-count').textContent = totalExperts;

        const ageNames = {
            stone: 'Stone Age',
            bronze: 'Bronze Age',
            iron: 'Iron Age',
            medieval: 'Medieval Era',
            renaissance: 'Renaissance',
            industrial: 'Industrial Age',
            earlymodern: 'Early Modern',
            victorian: 'Victorian Age',
            modernization: 'Modernization',
            digital: 'Digital Age',
            space: 'Space Age',
            multiworld: 'Multi-World Age',
            zenith: 'Zenith Age'
        };
        document.getElementById('age-display').textContent = ageNames[this.player.age] || this.player.age;

        document.getElementById('science-count').textContent = `+${Math.floor(this.player.sciencePerTurn)}`;
        document.getElementById('production-count').textContent = Math.floor(this.player.production);
        document.getElementById('turn-count').textContent = this.player.turn;
        document.getElementById('core-stability').textContent = Math.floor(this.eventSystem.coreStability) + '%';

        if (this.ecosystem && this.galaxy.currentPlanetIndex === 0) {
            const stats = this.ecosystem.getPopulationStats();
            document.getElementById('ecosystem-health').textContent = Math.floor(stats.health) + '%';
            document.getElementById('ashworm-count').textContent = stats.ashworms;
            document.getElementById('beetle-count').textContent = stats.magmabeetles;
            document.getElementById('bird-count').textContent = stats.emberbirds;

            const healthEl = document.getElementById('ecosystem-health');
            if (stats.health >= 70) {
                healthEl.style.color = '#88cc88';
            } else if (stats.health >= 40) {
                healthEl.style.color = '#ccaa66';
            } else {
                healthEl.style.color = '#cc6666';
            }
        }

        if (this.weatherSystem && this.galaxy.currentPlanetIndex === 0) {
            const weather = this.weatherSystem.getCurrentWeather();
            document.getElementById('current-weather').textContent = `${weather.icon} ${weather.name} (${weather.duration} turns)`;
        }

        const isConquest = this.gameMode === 'conquest' && this.conquestSystem;
        document.getElementById('open-military-btn').style.display = isConquest ? 'block' : 'none';

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

    updateResourceDisplay() {
        const pinnedContainer = document.getElementById('pinned-resources');
        const hoverPanel = document.getElementById('resource-hover-panel');

        const resourceNames = {
            iron: 'Iron', copper: 'Copper', coal: 'Coal', oil: 'Oil',
            silicon: 'Silicon', rareMinerals: 'Rare Minerals', gold: 'Gold',
            silver: 'Silver', titanium: 'Titanium', uranium: 'Uranium',
            platinum: 'Platinum', aluminum: 'Aluminum', lithium: 'Lithium',
            cobalt: 'Cobalt', nickel: 'Nickel', zinc: 'Zinc',
            tungsten: 'Tungsten', chromium: 'Chromium', manganese: 'Manganese',
            lead: 'Lead', tin: 'Tin', magnesium: 'Magnesium',
            thorium: 'Thorium', palladium: 'Palladium', neodymium: 'Neodymium'
        };

        const resourceSymbols = {
            iron: 'Fe', copper: 'Cu', coal: 'C', oil: 'O',
            silicon: 'Si', rareMinerals: 'RM', gold: 'Au',
            silver: 'Ag', titanium: 'Ti', uranium: 'U',
            platinum: 'Pt', aluminum: 'Al', lithium: 'Li',
            cobalt: 'Co', nickel: 'Ni', zinc: 'Zn',
            tungsten: 'W', chromium: 'Cr', manganese: 'Mn',
            lead: 'Pb', tin: 'Sn', magnesium: 'Mg',
            thorium: 'Th', palladium: 'Pd', neodymium: 'Nd'
        };

        const lastGains = this.player.lastResourceGains || {};
        pinnedContainer.innerHTML = this.player.pinnedResources
            .map(key => {
                const current = Math.floor(this.player.resources[key]);
                const gain = Math.floor(lastGains[key] || 0);
                const gainStr = gain > 0 ? ` (+${gain})` : '';
                return `${resourceSymbols[key]}: ${current}${gainStr}`;
            })
            .join(' | ');

        pinnedContainer.onmouseenter = () => {
            hoverPanel.style.display = 'block';
            this.populateResourcePanel(hoverPanel, resourceNames, resourceSymbols);
        };

        pinnedContainer.onmouseleave = () => {
            setTimeout(() => {
                if (!hoverPanel.matches(':hover')) {
                    hoverPanel.style.display = 'none';
                }
            }, 100);
        };

        hoverPanel.onmouseleave = () => {
            hoverPanel.style.display = 'none';
        };
    }

    populateResourcePanel(panel, resourceNames, resourceSymbols) {
        const grid = document.createElement('div');
        grid.className = 'resource-grid';

        const lastGains = this.player.lastResourceGains || {};

        Object.keys(this.player.resources).forEach(key => {
            const item = document.createElement('div');
            item.className = 'resource-item';

            const isPinned = this.player.pinnedResources.includes(key);
            const isAtMax = this.player.pinnedResources.length >= 3 && !isPinned;

            if (isPinned) {
                item.classList.add('pinned');
            }

            if (isAtMax) {
                item.classList.add('disabled');
                item.style.opacity = '0.5';
                item.style.cursor = 'not-allowed';
            }

            const current = Math.floor(this.player.resources[key]);
            const gain = Math.floor(lastGains[key] || 0);
            const gainColor = gain > 0 ? '#88cc88' : '#7a8a9a';
            const gainStr = gain > 0 ? ` <span style="color: ${gainColor};">(+${gain}/turn)</span>` : '';

            item.innerHTML = `
                <div class="resource-name">${resourceNames[key]} <span class="resource-symbol">(${resourceSymbols[key]})</span></div>
                <div class="resource-amount">${current}${gainStr}</div>
            `;

            item.onclick = (e) => {
                e.stopPropagation();
                if (!isAtMax || isPinned) {
                    this.togglePinnedResource(key);
                    this.populateResourcePanel(panel, resourceNames, resourceSymbols);
                }
            };

            grid.appendChild(item);
        });

        panel.innerHTML = '';
        panel.appendChild(grid);
    }

    togglePinnedResource(resourceKey) {
        const index = this.player.pinnedResources.indexOf(resourceKey);

        if (index !== -1) {
            if (this.player.pinnedResources.length <= 1) {
                this.log('Must have at least one resource pinned!');
                return;
            }
            this.player.pinnedResources.splice(index, 1);
        } else {
            if (this.player.pinnedResources.length >= 3) {
                this.log('Maximum 3 resources can be pinned! Unpin one first.');
                return;
            }
            this.player.pinnedResources.push(resourceKey);
        }

        document.getElementById('pinned-resources').innerHTML = this.getPinnedResourcesHTML();
    }

    getPinnedResourcesHTML() {
        const resourceSymbols = {
            iron: 'Fe', copper: 'Cu', coal: 'C', oil: 'O',
            silicon: 'Si', rareMinerals: 'RM', gold: 'Au',
            silver: 'Ag', titanium: 'Ti', uranium: 'U',
            platinum: 'Pt', aluminum: 'Al', lithium: 'Li',
            cobalt: 'Co', nickel: 'Ni', zinc: 'Zn',
            tungsten: 'W', chromium: 'Cr', manganese: 'Mn',
            lead: 'Pb', tin: 'Sn', magnesium: 'Mg',
            thorium: 'Th', palladium: 'Pd', neodymium: 'Nd'
        };

        return this.player.pinnedResources
            .map(key => `${resourceSymbols[key]}: ${Math.floor(this.player.resources[key])}`)
            .join(' | ');
    }

    updateBuildingUI() {
        const researchBtn = document.getElementById('research-btn');
        if (researchBtn) {
            const researchInfo = this.player.techTree.getResearchInfo();
            const availableTechs = this.player.techTree.getAvailableTechs();

            researchBtn.onclick = null;

            if (researchInfo) {
                const efficiency = researchInfo.sciencePerTurn >= researchInfo.optimalScience ? '[|' : '[|';
                researchBtn.textContent = `${researchInfo.name} (${Math.floor(researchInfo.progress)}%, ~${researchInfo.turnsRemaining}t ${efficiency})`;
                researchBtn.disabled = true;
            } else if (availableTechs.length > 0) {
                researchBtn.textContent = 'Choose Research';
                researchBtn.disabled = false;
                researchBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.showTechTreeUI();
                };
            } else {
                researchBtn.textContent = 'No Available Research';
                researchBtn.disabled = true;
            }
        }

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

                const handler = (e) => {
                    e.stopPropagation();

                    const wasSelected = this.player.selectedBuilding === buildingType;
                    this.player.selectedBuilding = wasSelected ? null : buildingType;

                    const msg = this.player.selectedBuilding ? `Selected: ${buildingType}` : 'Deselected building';
                    this.log(msg);

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
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const detailPanel = document.getElementById('tech-detail-panel');
            if (detailPanel) {
                detailPanel.classList.remove('visible');
            }
            document.body.removeChild(modal);
        }
    }

    showTechTreeUI() {
        if (document.getElementById('tech-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'tech-modal';
        modal.innerHTML = `
            <div class="tech-modal-content">
                <h2>Research Technology</h2>
                <div style="background: rgba(90, 122, 138, 0.2); padding: 8px; border-radius: 4px; margin-bottom: 15px; font-size: 11px;">
                    <strong>Science/Turn:</strong> ${Math.floor(this.player.sciencePerTurn + this.player.getEducatedCitizenScienceBonus())}
                    (${Math.floor(this.player.sciencePerTurn)} base + ${Math.floor(this.player.getEducatedCitizenScienceBonus())} from educated citizens)<br>
                    <strong>Experts:</strong> ${this.player.totalExperts} (Productivity: +${this.player.totalExperts * 3}x)
                </div>
                <div id="tech-list"></div>
                <button id="close-tech-modal">Close</button>
            </div>
            <div id="tech-detail-panel" class="tech-detail-panel"></div>
        `;
        document.body.appendChild(modal);

        const techList = document.getElementById('tech-list');
        const detailPanel = document.getElementById('tech-detail-panel');
        const availableTechs = this.player.techTree.getAvailableTechs();

        let currentDetailTech = null;

        const showTechDetail = (techId) => {
            const details = this.player.techTree.getTechDetails(techId);
            if (!details) return;

            currentDetailTech = techId;
            const tech = this.player.techTree.techs[techId];

            const optimalScience = tech.cost / 10;
            const currentScience = this.player.sciencePerTurn + this.player.getEducatedCitizenScienceBonus();

            let timeEstimate;
            if (currentScience >= optimalScience) {
                timeEstimate = '~50 turns (optimal speed)';
            } else if (currentScience > 0) {
                const efficiency = currentScience / optimalScience;
                const adjustedTurns = Math.ceil(50 / Math.pow(efficiency, 0.7));
                timeEstimate = `~${adjustedTurns} turns (${Math.floor(efficiency * 100)}% efficiency)`;
            } else {
                timeEstimate = '~250 turns (minimal progress - need more science!)';
            }

            let bonusHTML = '<div class="tech-detail-stats">';
            bonusHTML += `
                <div class="tech-detail-stat" style="grid-column: 1/-1;">
                    <div class="tech-detail-stat-label">Research Time</div>
                    <div class="tech-detail-stat-value" style="color: ${currentScience >= optimalScience ? '#88ff88' : '#ffaa44'};">
                        ${timeEstimate}
                    </div>
                </div>
            `;

            if (tech.bonus.production) {
                bonusHTML += `
                    <div class="tech-detail-stat">
                        <div class="tech-detail-stat-label">Production</div>
                        <div class="tech-detail-stat-value ${tech.bonus.production < 0 ? 'negative' : ''}">
                            ${tech.bonus.production > 0 ? '+' : ''}${tech.bonus.production}
                        </div>
                    </div>
                `;
            }
            if (tech.bonus.science) {
                bonusHTML += `
                    <div class="tech-detail-stat">
                        <div class="tech-detail-stat-label">Science</div>
                        <div class="tech-detail-stat-value ${tech.bonus.science < 0 ? 'negative' : ''}">
                            ${tech.bonus.science > 0 ? '+' : ''}${tech.bonus.science}
                        </div>
                    </div>
                `;
            }
            bonusHTML += '</div>';

            let choiceHTML = '';
            if (details.choiceConsequence) {
                choiceHTML = `
                    <div class="tech-detail-choice">
                        <div class="tech-detail-choice-title">⚠️ Path Choice Consequences</div>
                        <div class="tech-detail-section-content">${details.choiceConsequence}</div>
                    </div>
                `;
            }

            detailPanel.innerHTML = `
                <button class="tech-detail-close" id="close-detail">×</button>
                <div class="tech-detail-header">
                    <div class="tech-detail-title">${details.name}</div>
                    <div class="tech-detail-era">${details.era}</div>
                    <div class="tech-detail-year">${details.year}</div>
                </div>

                <div class="tech-detail-inventor">
                    ${details.inventor}
                </div>

                <div class="tech-detail-section">
                    <div class="tech-detail-section-title">📜 Historical Context</div>
                    <div class="tech-detail-section-content">${details.description}</div>
                </div>

                <div class="tech-detail-section">
                    <div class="tech-detail-section-title">⚡ Historical Impact</div>
                    <div class="tech-detail-section-content">${details.impact}</div>
                </div>

                <div class="tech-detail-section tech-detail-volcano">
                    <div class="tech-detail-section-title">🌋 Volcanic World Connection</div>
                    <div class="tech-detail-section-content">${details.volcanoConnection}</div>
                </div>

                ${choiceHTML}
                ${bonusHTML}
            `;

            detailPanel.classList.add('visible');

            document.getElementById('close-detail').onclick = () => {
                detailPanel.classList.remove('visible');
                currentDetailTech = null;
            };
        };

        availableTechs.forEach(techId => {
            const tech = this.player.techTree.techs[techId];
            const isLocked = this.player.techTree.lockedPaths.has(techId);

            const techDiv = document.createElement('div');
            techDiv.className = 'tech-item tech-item-enhanced';

            if (isLocked) {
                techDiv.style.borderColor = '#aa3333';
                techDiv.style.opacity = '0.3';
            }

            if (tech.type === 'divergent') {
                techDiv.style.borderColor = '#ff8800';
                techDiv.style.boxShadow = '0 0 10px rgba(255, 136, 0, 0.3)';
            }

            if (tech.type === 'age') {
                techDiv.style.borderColor = '#8888ff';
                techDiv.style.boxShadow = '0 0 10px rgba(136, 136, 255, 0.3)';
            }

            const optimalScience = tech.cost / 10;
            const currentScience = this.player.sciencePerTurn + this.player.getEducatedCitizenScienceBonus();
            const efficiencyPercent = Math.min(100, Math.floor((currentScience / optimalScience) * 100));

            techDiv.innerHTML = `
                <div class="tech-name">${tech.name}${tech.type === 'divergent' ? ' ⚡' : ''}${tech.type === 'age' ? ' 👑' : ''}</div>
                <div class="tech-cost">Optimal: ${Math.floor(optimalScience)} Science/turn</div>
                <div class="tech-cost" style="color: ${efficiencyPercent >= 100 ? '#88ff88' : '#ffaa44'};">Your Rate: ${Math.floor(currentScience)} (${efficiencyPercent}%)</div>
                <div class="tech-desc">${tech.description}</div>
                <div class="tech-type">${tech.type.toUpperCase()}</div>
                ${isLocked ? '<div style="color: #ff5555; font-size: 9px; margin-top: 4px;">LOCKED BY CHOICE</div>' : ''}
                ${tech.locksOut ? '<div style="color: #ff8800; font-size: 9px; margin-top: 4px;">⚠ Locks other paths</div>' : ''}
                ${tech.historicalContext ? '<div style="color: #88aaff; font-size: 9px; margin-top: 4px;">📖 Click for history</div>' : ''}
            `;

            techDiv.onmouseenter = () => {
                if (tech.historicalContext && !isLocked) {
                    showTechDetail(techId);
                }
            };

            if (!isLocked) {
                techDiv.onclick = (e) => {
                    e.stopPropagation();

                    if (tech.type === 'divergent' && tech.locksOut) {
                        const lockedTechNames = tech.locksOut
                            .filter(id => this.player.techTree.techs[id])
                            .map(id => this.player.techTree.techs[id].name);

                        if (lockedTechNames.length > 0) {
                            const confirmMsg = `⚠️ PERMANENT CHOICE\n\nResearching "${tech.name}" will LOCK:\n• ${lockedTechNames.join('\n• ')}\n\nThis cannot be undone. Continue?`;
                            if (!confirm(confirmMsg)) return;
                        }
                    }

                    if (this.player.techTree.startResearch(techId)) {
                        this.log(`Started researching: ${tech.name}`);
                        if (tech.historicalContext) {
                            this.log(`"${tech.historicalContext.inventor}"`);
                        }
                        this.closeModal('tech-modal');
                        this.updateBuildingUI();
                    }
                };
            }

            techList.appendChild(techDiv);
        });

        document.getElementById('close-tech-modal').onclick = () => {
            this.closeModal('tech-modal');
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                detailPanel.classList.remove('visible');
            }
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

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});