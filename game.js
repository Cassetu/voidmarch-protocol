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
        this.eruptionTarget = ['e', 'r', 't', 'e'];
        this.hiringMode = null;
        this.deployMode = null;
        this.selectedUnit = null;
        this.player = new Player();
        this.player.game = this;
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
                if (this.unitActionSystem.actionMode) {
                    this.unitActionSystem.actionMode = null;
                    this.unitActionSystem.selectedUnit = null;
                    this.selectedUnit = null;
                    this.log('Action cancelled');
                }
            }
        });

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
        this.player.addBuilding(settlement);

        const newSettlement = this.player.addSettlement(startX, startY);
        newSettlement.addBuilding('farm');
        this.log(`Starting settlement "${newSettlement.name}" established`);

        this.currentPlanet.structures.push(farm);
        this.player.addBuilding(farm);

        this.log('Starting settlement and farm placed');
    }

    endTurn() {
        this.player.nextTurn();
        this.player.processTurnForSettlements(this.currentPlanet);
        this.updateBuilders();

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
            }, 1000);
            return;
        }

        let totalFood = 0;
        let totalProduction = 0;
        let totalScience = 0;

        this.currentPlanet.structures.forEach(building => {
            if (building.isFrame || building.type === 'ruins' || building.type === 'defense_node') return;

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

        this.player.addProduction(totalProduction);

        const researchResult = this.player.techTree.progressResearch();

        if (researchResult && researchResult.completed) {
            const techName = this.player.techTree.techs[researchResult.completed].name;

            if (researchResult.ageAdvanced) {
                this.log(`🎉 CIVILIZATION ADVANCED! Welcome to the ${researchResult.newAge.toUpperCase()} AGE!`);
                this.log(`Research complete: ${techName}`);
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSFX('sfx-success', 0.8);
                }
            } else {
                this.log(`RESEARCH COMPLETE: ${techName}`);
                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSFX('sfx-success', 0.5);
                }
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
                    if (typeof AudioManager !== 'undefined') {
                        AudioManager.playSFX('sfx-success', 0.3);
                    }
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

        const buildingInfo = {
            settlement: { name: 'Settlement', desc: 'Houses population and generates resources', age: 'Stone' },
            farm: { name: 'Farm', desc: 'Produces food from volcanic soil', age: 'Stone' },
            warehouse: { name: 'Warehouse', desc: 'Stores resources and materials', age: 'Stone' },
            observatory: { name: 'Observatory', desc: 'Generates science points', age: 'Stone' },
            barracks: { name: 'Barracks', desc: 'Trains military units', age: 'Bronze' },
            temple: { name: 'Temple', desc: 'Cultural and spiritual center', age: 'Iron' },
            forge: { name: 'Forge', desc: 'Crafts tools and weapons', age: 'Iron' },
            market: { name: 'Market', desc: 'Trade hub for resources', age: 'Medieval' },
            castle: { name: 'Castle', desc: 'Defensive stronghold (2x2)', age: 'Medieval' },
            library: { name: 'Library', desc: 'Stores knowledge', age: 'Renaissance' },
            university: { name: 'University', desc: 'Advanced research center (2x1)', age: 'Space' },
            campfire: { name: 'Campfire', desc: 'Basic warmth and light', age: 'Stone' },
            tent: { name: 'Tent', desc: 'Temporary shelter', age: 'Stone' },
            woodpile: { name: 'Wood Pile', desc: 'Stores fuel', age: 'Stone' },
            granary: { name: 'Granary', desc: 'Large food storage (2x1)', age: 'Bronze' },
            quarry: { name: 'Quarry', desc: 'Stone extraction site (2x2)', age: 'Bronze' },
            monument: { name: 'Monument', desc: 'Tall cultural marker (1x2)', age: 'Bronze' },
            workshop: { name: 'Workshop', desc: 'Crafting station', age: 'Iron' },
            aqueduct: { name: 'Aqueduct', desc: 'Water transport system (3x1)', age: 'Iron' },
            watchtower: { name: 'Watchtower', desc: 'Early warning system', age: 'Iron' },
            cathedral: { name: 'Cathedral', desc: 'Grand religious structure (2x2)', age: 'Medieval' },
            townhall: { name: 'Town Hall', desc: 'Administrative center (2x2)', age: 'Medieval' },
            arena: { name: 'Arena', desc: 'Entertainment complex (3x2)', age: 'Medieval' },
            hospital: { name: 'Hospital', desc: 'Medical facility (2x1)', age: 'Medieval' },
            academy: { name: 'Academy', desc: 'Learning institution (2x1)', age: 'Renaissance' },
            theater: { name: 'Theater', desc: 'Performance hall (2x1)', age: 'Renaissance' },
            mansion: { name: 'Mansion', desc: 'Luxury housing (2x2)', age: 'Renaissance' },
            spaceport: { name: 'Spaceport', desc: 'Launch facility (3x3)', age: 'Space' },
            laboratory: { name: 'Laboratory', desc: 'Research facility (2x1)', age: 'Space' },
            megafactory: { name: 'Mega Factory', desc: 'Mass production (3x2)', age: 'Space' }
        };

        const availableBuildings = this.player.getAvailableBuildings();
        const allBuildings = ['settlement', 'farm', 'warehouse', 'observatory', 'campfire', 'tent', 'woodpile', 'barracks', 'granary', 'quarry', 'monument', 'temple', 'forge', 'workshop', 'aqueduct', 'watchtower', 'market', 'castle', 'cathedral', 'townhall', 'arena', 'hospital', 'library', 'academy', 'theater', 'mansion', 'university', 'spaceport', 'laboratory', 'megafactory'];

        allBuildings.forEach(buildingType => {
            const info = buildingInfo[buildingType];
            const isAvailable = availableBuildings.includes(buildingType);

            const card = document.createElement('div');
            card.className = 'building-card' + (isAvailable ? '' : ' locked');

            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            canvas.style.margin = '0 auto 4px';
            canvas.style.display = 'block';

            card.innerHTML = `
                <div class="building-icon">
                    <span class="building-age-badge">${info.age}</span>
                </div>
                <div class="building-name">${info.name}</div>
                <div class="building-cost">Cost: Varies by distance</div>
                <div class="building-desc">${info.desc}</div>
                <button class="building-build-btn" ${isAvailable ? '' : 'disabled'}>
                    ${isAvailable ? 'Select to Build' : 'Locked'}
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
                    this.player.selectedBuilding = buildingType;
                    this.log(`Selected: ${info.name} - Click on the map to place`);
                    if (typeof AudioManager !== 'undefined') {
                        AudioManager.playSFX('sfx-success', 0.3);
                    }
                };
            }

            grid.appendChild(card);
        });
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
                        AudioManager.playSFX('sfx-eruption-major', 0.7);
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

        this.player.age = 'space';
        this.player.ageLevel = 5;

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
        this.log('Advanced to SPACE AGE! All buildings unlocked!');
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

        this.renderer.updateSnowParticles();
    }

    handleInput() {
        const moveSpeed = 8;
        const canvasTop = 75;
        const canvasBottom = window.innerHeight - 220;
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
                const targetY = ((this.height - 220 - 75) / 2) / this.renderer.zoom + this.cameraY;

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

                        if (this.player.selectedBuilding === 'settlement') {
                            if (!this.player.canPlaceSettlementAt(gridX, gridY)) {
                                this.log('Cannot build settlement within another settlement\'s claim!');
                                return;
                            }
                        } else {
                            const nearestSettlement = this.player.findNearestSettlement(gridX, gridY);
                            if (!nearestSettlement || !nearestSettlement.isWithinClaim(gridX, gridY)) {
                                this.log('Must build within settlement claim area!');
                                return;
                            }
                        }

                        if (!nearestSettlement.canBuildStructure(this.player.selectedBuilding)) {
                            this.log(`Settlement already has maximum ${this.player.selectedBuilding}s!`);
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
                        if (tile && !tile.building && tile.type !== 'lava' && tile.type !== 'water' && tile.type !== 'void') {
                            const tempBuilding = new Building(gridX, gridY, this.player.selectedBuilding);
                            tempBuilding.isFrame = true;
                            tempBuilding.buildProgress = 0;
                            tile.building = tempBuilding;
                            this.currentPlanet.structures.push(tempBuilding);
                            nearestSettlement.addBuilding(this.player.selectedBuilding);
                        }

                        this.log(`Sending builders from ${settlement.type} to construct ${this.player.selectedBuilding}`);
                        this.player.selectedBuilding = null;
                        const buildingsList = document.getElementById('buildings-list');
                        if (buildingsList) this._updateBuildingButtonsActive(buildingsList);
                    }
                } else if (this.gameMode === 'building' && this.player.selectedBuilding) {
                   const size = this.currentPlanet.getBuildingSize(this.player.selectedBuilding);
                   const canPlace = this.currentPlanet.canPlaceBuildingOfSize(gridX, gridY, size.w, size.h);

                   if (!canPlace) {
                       this.log('Cannot place building here - check terrain and space!');
                       return;
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
                   const nearestSettlement = this.player.findNearestSettlement(gridX, gridY);
                   if (tile && !tile.building && tile.type !== 'lava' && tile.type !== 'water' && tile.type !== 'void') {
                       const tempBuilding = new Building(gridX, gridY, this.player.selectedBuilding);
                       tempBuilding.isFrame = true;
                       tempBuilding.buildProgress = 0;
                       tile.building = tempBuilding;
                       this.currentPlanet.structures.push(tempBuilding);
                       nearestSettlement.addBuilding(this.player.selectedBuilding);

                       if (this.player.selectedBuilding === 'settlement') {
                           const newSettlement = this.player.addSettlement(gridX, gridY);
                           this.log(`New settlement "${newSettlement.name}" established`);
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
                            if (tile.building && tile.building.type === 'settlement' && !tile.building.isFrame) {
                                this.showSettlementPanel(gridX, gridY);
                            }
                            this.showTileInfo(tile, gridX, gridY);
                        }
                    }
                }
            }
        }
    }

    showGameOver() {
        this.running = false;

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

                html += `<p style="font-size: 11px; color: #88ff88; margin-bottom: 6px;"><strong>🎖️ ${playerUnit.type.toUpperCase()}</strong></p>`;
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
                    html += `<p style="font-size: 9px; color: #ffaa00;">⚠️ Overwatch Active</p>`;
                }
                if (playerUnit.tauntTurns) {
                    html += `<p style="font-size: 9px; color: #ffaa00;">🛡️ Taunt (${playerUnit.tauntTurns} turns)</p>`;
                }

                html += `<hr style="border: 0; border-top: 1px solid #3a4a5a; margin: 6px 0;">`;
            }

            if (sentinel) {
                const healthPercent = Math.floor((sentinel.health / sentinel.maxHealth) * 100);
                let healthColor = '#ff8888';
                if (healthPercent < 30) healthColor = '#ff3333';
                else if (healthPercent < 60) healthColor = '#ff6666';

                html += `<p style="font-size: 11px; color: #ff8888; margin-bottom: 6px;"><strong>⚠️ SENTINEL ${sentinel.type.toUpperCase()}</strong></p>`;
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
                        html += `<p style="font-size: 9px; color: #ffaa00;">🎯 Chasing ${targetUnit.type}</p>`;
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
            (s.type === 'settlement' || s.type === 'spaceship') && !s.isFrame
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

                    const nearestSettlement = this.player.findNearestSettlement(builder.targetX, builder.targetY);
                    if (nearestSettlement && nearestSettlement.isWithinClaim(builder.targetX, builder.targetY)) {
                        nearestSettlement.addBuilding(builder.buildingType);
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
            if (building.type === 'settlement') {
                this.showSettlementPanel(building.x, building.y);
            } else {
                infoPanel.innerHTML = `
                    <p style="font-size: 10px; color: #a8b8d8;"><strong>${building.type}</strong></p>
                    <p style="font-size: 9px; color: #8fa3c8;">HP: ${Math.floor(building.health)}/${building.maxHealth}</p>
                `;
            }
        }
    }

    showSettlementPanel(x, y) {
            const settlement = this.player.getSettlementAt(x, y);
            if (!settlement) return;

            const panel = document.getElementById('settlement-panel');
            panel.style.display = 'block';

            document.getElementById('settlement-title').textContent = settlement.name;
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
                const item = document.createElement('div');
                item.className = 'building-limit-item' + (current >= limit ? ' at-limit' : '');
                item.innerHTML = `
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span>${current}/${limit}</span>
                `;
                buildingsList.appendChild(item);
            });

            const citizensList = document.getElementById('settlement-citizens-list');
            citizensList.innerHTML = '';

            const maxPop = settlement.getMaxPopulation();
            const totalPop = settlement.citizens.length + settlement.children.length;

            const capacityDiv = document.createElement('div');
            capacityDiv.style.cssText = 'margin-bottom: 8px; padding: 4px; background: rgba(74, 90, 106, 0.3); border-radius: 3px;';
            capacityDiv.innerHTML = `<strong>Population: ${totalPop}/${maxPop}</strong>`;
            citizensList.appendChild(capacityDiv);

            settlement.citizens.forEach(citizen => {
                const item = document.createElement('div');
                item.className = 'citizen-item';
                const childrenInfo = citizen.hasChildren ? ` | ${citizen.childrenCount} children` : '';
                item.innerHTML = `
                    <div class="citizen-name">${citizen.name}</div>
                    <div class="citizen-details">Age: ${citizen.age} | ${citizen.job}${childrenInfo}</div>
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
                    item.innerHTML = `
                        <div class="citizen-name">${child.name}</div>
                        <div class="citizen-details">Age: ${child.age} | ${child.job}</div>
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

        const gridX = Math.round((worldX / unitX + worldY / unitY) / 2);
        const gridY = Math.round((worldY / unitY - worldX / unitX) / 2);

        const size = this.currentPlanet.getBuildingSize(this.player.selectedBuilding);
        const canPlace = this.currentPlanet.canPlaceBuildingOfSize(gridX, gridY, size.w, size.h);

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;

        for (let dy = 0; dy < size.h; dy++) {
            for (let dx = 0; dx < size.w; dx++) {
                const tileGridX = gridX + dx;
                const tileGridY = gridY + dy;

                const tileWorldX = (tileGridX - tileGridY) * unitX;
                const tileWorldY = (tileGridX + tileGridY) * unitY;

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

        const padding = 400;

        const viewW = this.width / this.renderer.zoom;
        const viewH = (this.height - 220 - 75) / this.renderer.zoom;

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const tilesOut = Math.ceil(Math.max(w, h) / 2);

        const extentX = tilesOut * (halfW * 2);
        const extentY = tilesOut * (halfH * 2);

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
        const targetY = ((this.height - topBarHeight - 220) / 2) / this.renderer.zoom + this.cameraY;


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

        this.renderer.drawBuildingQueue(this.player.buildingQueue);
        this.ctx.restore();

        if (this.player.selectedBuilding && this.gameMode === 'building') {
            this._drawBuildingPreview();
        }

        this.renderer.drawSnowParticles();

        this.updateUI();
    }

    updateUI() {
        document.getElementById('resource-count').textContent = Math.floor(this.player.resources);
        const totalFood = this.player.settlements.reduce((sum, s) => sum + s.food, 0);
        document.getElementById('food-count').textContent = Math.floor(totalFood);
        const totalPop = this.player.settlements.reduce((sum, s) => sum + s.getPopulation(), 0);
        document.getElementById('population-count').textContent = totalPop;

        const ageNames = {
            stone: 'Stone Age',
            bronze: 'Bronze Age',
            iron: 'Iron Age',
            medieval: 'Medieval Era',
            renaissance: 'Renaissance',
            space: 'Space Age'
        };
        document.getElementById('age-display').textContent = ageNames[this.player.age] || this.player.age;

        document.getElementById('science-count').textContent = `+${Math.floor(this.player.sciencePerTurn)}`;
        document.getElementById('production-count').textContent = Math.floor(this.player.production);
        document.getElementById('turn-count').textContent = this.player.turn;
        document.getElementById('core-stability').textContent = Math.floor(this.eventSystem.coreStability) + '%';

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

    updateBuildingUI() {
        const researchBtn = document.getElementById('research-btn');
        if (researchBtn) {
            const researchInfo = this.player.techTree.getResearchInfo();
            const availableTechs = this.player.techTree.getAvailableTechs();

            researchBtn.onclick = null;

            if (researchInfo) {
                researchBtn.textContent = `${researchInfo.name} (${Math.floor(researchInfo.progress)}/${researchInfo.totalTurns}, ~${researchInfo.turnsRemaining} turns)`;
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

    showTechTreeUI() {
        console.log('showTechTreeUI called');
        console.log('Player techTree:', this.player.techTree);

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

        console.log('Available techs:', availableTechs);
        console.log('Tech list element:', techList);

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

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});