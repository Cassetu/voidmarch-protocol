class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.tileWidth = 64;
        this.tileHeight = 32;
        this.zoom = 1;
        this.lavaSparks = [];
        this.snowParticles = [];
        this.hailstormActive = false;
        this.hailstormEndTime = 0;

        this.voxelDebris = new VoxelDebrisSystem(ctx, this.tileWidth, this.tileHeight);

        this.colorMap = {
            grass: '#3d4f5c',
            rock: '#4a5a6a',
            ash: '#5a6a7a',
            darksoil: '#2a3a4a',
            lava: '#ff4500',
            water: '#3a5a7a',
            forest: '#3a5a3a',
            nebula: '#4a3a6a',
            void: '#1a2a3a',
            stars: '#5a6a7a',
            floating: '#6a7a9a',
            ice: '#a0d0ff',
            frozen: '#80b0e0',
            tundra: '#c0e0ff',
            sand: '#c2b280',
            dunes: '#d0b070',
            oasis: '#60a060',
            island: '#70b070',
            reef: '#40a0a0',
            deepwater: '#2060a0',
            jungle: '#208040',
            swamp: '#406050',
            canopy: '#308030'
        };
        this.buildingColors = {
            settlement: '#6a7a8a',
            farm: '#5a7a4a',
            warehouse: '#6a6a5a',
            barracks: '#7a5a5a',
            temple: '#7a6a5a',
            forge: '#6a5a4a',
            market: '#6a7a6a',
            castle: '#5a6a7a',
            library: '#5a5a7a',
            university: '#5a6a7a',
            observatory: '#6a6a7a'
        };
            this.terrainRenderer = new TerrainRenderer(ctx, this.tileWidth, this.tileHeight, this.colorMap);
            this.buildingRenderer = new BuildingRenderer(ctx, this.tileWidth, this.tileHeight, this.buildingColors);
            this.unitRenderer = new UnitRenderer(ctx, this.tileWidth, this.tileHeight);
            this.effectsRenderer = new EffectsRenderer(ctx, width, height);
            this.overlayRenderer = new OverlayRenderer(ctx, this.tileWidth, this.tileHeight);
            this.creatureRenderer = new CreatureRenderer(ctx, this.tileWidth, this.tileHeight);
            this.environmentalRenderer = new EnvironmentalRenderer(ctx, this.tileWidth, this.tileHeight);
            this.backgroundRenderer = new BackgroundRenderer(ctx, width, height);
    }

    drawRepairer(repairer, cameraX, cameraY) {
        this.unitRenderer.drawRepairer(repairer, cameraX, cameraY);
    }

    drawRepairerCount(screenX, screenY, count) {
        this.unitRenderer.drawBuilderCount(screenX, screenY, count);
    }

    drawRailwayTrack(track, cameraX, cameraY) {
        this.buildingRenderer.drawRailwayTrack(track, cameraX, cameraY);
    }

    updateVoxelDebris() {
        this.voxelDebris.update();
    }

    drawVoxelDebris(cameraX, cameraY) {
        this.voxelDebris.draw(cameraX, cameraY);
    }

    drawTrains(trains, cameraX, cameraY) {
        trains.forEach(train => {
            this.buildingRenderer.drawTrain(train, cameraX, cameraY);
        });
    }

    createBuildingDebris(x, y, buildingType) {
        const colorMap = {
            'hut': '#6a5a4a',
            'settlement': '#7a6a5a',
            'farm': '#8a6a4a',
            'warehouse': '#5a5a4a',
            'forge': '#4a3a3a'
        };

        const color = colorMap[buildingType] || '#6a6a6a';
        this.voxelDebris.createDebris(x, y, color, 12);
    }

    drawEnvironmentalObjects(objects, cameraX, cameraY) {
        objects.forEach(obj => {
            this.environmentalRenderer.drawEnvironmentalObject(obj, cameraX, cameraY);
        });
    }

    drawDestroyers(destroyers, cameraX, cameraY) {
        destroyers.forEach(destroyer => {
            this.environmentalRenderer.drawDestroyer(destroyer, cameraX, cameraY);
        });
    }

    drawTile(gridX, gridY, tile, cameraX, cameraY) {
        this.terrainRenderer.floatingTime = Date.now() / 1000;
        this.terrainRenderer.drawTile(gridX, gridY, tile, cameraX, cameraY);

        if (tile.type === 'lava') {
            this.terrainRenderer.drawLavaGlow(gridX, gridY, tile, cameraX, cameraY);
        }
    }

    drawBuilding(building, cameraX, cameraY) {
        this.buildingRenderer.drawBuilding(building, cameraX, cameraY);
    }

    drawBuildingToCanvas(buildingType, canvas) {
        this.buildingRenderer.drawBuildingToCanvas(buildingType, canvas);
    }

    drawUnit(unit, cameraX, cameraY, color, isSelected) {
        this.unitRenderer.drawUnit(unit, cameraX, cameraY, color, isSelected);
    }

    drawBuilder(builder, cameraX, cameraY) {
        this.unitRenderer.drawBuilder(builder, cameraX, cameraY);
    }

    drawBuilderCount(screenX, screenY, count) {
        this.unitRenderer.drawBuilderCount(screenX, screenY, count);
    }

    drawDefenseNode(node, cameraX, cameraY) {
        this.unitRenderer.drawDefenseNode(node, cameraX, cameraY);
    }

    createLavaSpark(gridX, gridY) {
        this.effectsRenderer.createLavaSpark(gridX, gridY, this.tileWidth, this.tileHeight);
    }

    updateLavaSparks() {
        this.effectsRenderer.updateLavaSparks();
    }

    drawLavaSparks(cameraX, cameraY) {
        this.effectsRenderer.drawLavaSparks(cameraX, cameraY);
    }

    startHailstorm() {
        this.effectsRenderer.startHailstorm();
    }

    updateSnowParticles() {
        this.effectsRenderer.updateSnowParticles();
    }

    drawSnowParticles() {
        this.effectsRenderer.drawSnowParticles();
    }

    drawSettlementClaim(settlement, cameraX, cameraY) {
        this.overlayRenderer.drawSettlementClaim(settlement, cameraX, cameraY);
    }

    drawMovementRange(unit, cameraX, cameraY) {
        this.overlayRenderer.drawMovementRange(unit, cameraX, cameraY);
    }

    drawAttackRange(unit, cameraX, cameraY) {
        this.overlayRenderer.drawAttackRange(unit, cameraX, cameraY);
    }

    drawSentinelMovementRanges(sentinels, cameraX, cameraY) {
        this.overlayRenderer.drawSentinelMovementRanges(sentinels, cameraX, cameraY);
    }

    drawSentinelAttackRanges(sentinels, cameraX, cameraY) {
        this.overlayRenderer.drawSentinelAttackRanges(sentinels, cameraX, cameraY);
    }

    drawBuildingQueue(buildingQueue) {
        this.overlayRenderer.drawBuildingQueue(buildingQueue);
    }

    drawTileEnrichment(gridX, gridY, tile, cameraX, cameraY) {
        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2);
        this.creatureRenderer.drawTileEnrichments(tile, screenX, screenY);
    }

    drawCreatures(ecosystem, cameraX, cameraY) {
        this.creatureRenderer.updateAnimation();
        this.creatureRenderer.drawCreatures(ecosystem, cameraX, cameraY);
    }

    startAcidRain() {
        this.effectsRenderer.startAcidRain();
    }

    updateAcidRainParticles() {
        this.effectsRenderer.updateAcidRainParticles();
    }

    drawAcidRainParticles() {
        this.effectsRenderer.drawAcidRainParticles();
    }
}