class RailwaySystem {
    constructor(game, planet) {
        this.game = game;
        this.planet = planet;
        this.tracks = new Map();
        this.stations = [];
        this.routes = [];
        this.trains = [];
        this.nextTrainId = 0;
        this.selectedStation = null;
        this.stationMenuOpen = false;
    }

    hasRailwayTech() {
        return this.game.player.techTree.techs['railwayEngineering'].researched;
    }

    getTrainSpeed() {
        const tech = this.game.player.techTree;
        if (tech.techs['maglevTransit'].researched) return 12;
        if (tech.techs['electrifiedRail'].researched) return 8;
        if (tech.techs['dieselLocomotives'].researched) return 6;
        return 4;
    }

    getTrainType() {
        const tech = this.game.player.techTree;
        if (tech.techs['maglevTransit'].researched) return 'maglev';
        if (tech.techs['electrifiedRail'].researched) return 'electric';
        if (tech.techs['dieselLocomotives'].researched) return 'diesel';
        return 'steam';
    }

    canPlaceStation(x, y) {
        const settlement = this.game.player.settlements.find(s => {
            const dist = Math.abs(s.x - x) + Math.abs(s.y - y);
            return dist === 1;
        });
        return settlement !== null;
    }

    registerStation(building) {
        if (building.type === 'trainstation' && !this.stations.find(s => s.x === building.x && s.y === building.y)) {
            this.stations.push({
                x: building.x,
                y: building.y,
                building: building,
                connectedStations: [],
                settlement: this.findNearbySettlement(building.x, building.y)
            });
        }
    }

    findNearbySettlement(x, y) {
        return this.game.player.settlements.find(s => {
            const dist = Math.abs(s.x - x) + Math.abs(s.y - y);
            return dist === 1;
        });
    }

    connectStations(stationA, stationB) {
        if (stationA.connectedStations.includes(stationB)) {
            this.game.log('Stations already connected!');
            return false;
        }

        const path = this.findTrackPath(stationA.x, stationA.y, stationB.x, stationB.y);

        if (!path) {
            this.game.log('Cannot build track - no valid path!');
            return false;
        }

        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            const key = `${from.x},${from.y}-${to.x},${to.y}`;
            const reverseKey = `${to.x},${to.y}-${from.x},${from.y}`;

            if (!this.tracks.has(key) && !this.tracks.has(reverseKey)) {
                this.tracks.set(key, {
                    from: from,
                    to: to,
                    durability: 100,
                    maxDurability: 100
                });
            }
        }

        stationA.connectedStations.push(stationB);
        stationB.connectedStations.push(stationA);

        const settlementA = stationA.settlement;
        const settlementB = stationB.settlement;
        if (settlementA && settlementB) {
            this.updateNetworkBonus(settlementA);
            this.updateNetworkBonus(settlementB);
        }

        this.game.log(`Railway constructed: ${settlementA.name} ↔ ${settlementB.name}`);
        return true;
    }

    findTrackPath(startX, startY, endX, endY) {
        const openSet = [];
        const closedSet = new Set();

        const start = { x: startX, y: startY, g: 0, h: 0, f: 0, parent: null };
        openSet.push(start);

        const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        const goal = { x: endX, y: endY };

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();

            if (current.x === goal.x && current.y === goal.y) {
                const path = [];
                let node = current;
                while (node) {
                    path.unshift({ x: node.x, y: node.y });
                    node = node.parent;
                }
                return path;
            }

            closedSet.add(`${current.x},${current.y}`);

            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x < 0 || neighbor.x >= this.planet.width ||
                    neighbor.y < 0 || neighbor.y >= this.planet.height) continue;

                const tile = this.planet.tiles[neighbor.y][neighbor.x];
                if (tile.type === 'lava' || tile.type === 'water' || tile.type === 'void') {
                    continue;
                }

                if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

                let cost = 1;
                if (tile.building && tile.building.type !== 'trainstation') {
                    cost = 10;
                }
                if (tile.elevation > 2) {
                    cost += tile.elevation;
                }

                const g = current.g + cost;
                const h = heuristic(neighbor, goal);
                const f = g + h;

                const existing = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (existing && g >= existing.g) continue;

                if (existing) {
                    existing.g = g;
                    existing.f = f;
                    existing.parent = current;
                } else {
                    openSet.push({ x: neighbor.x, y: neighbor.y, g, h, f, parent: current });
                }
            }
        }

        return null;
    }

    updateNetworkBonus(settlement) {
        const station = this.stations.find(s => s.settlement && s.settlement.id === settlement.id);
        if (!station) return;

        const connections = station.connectedStations.length;
        const bonus = 1 + (connections * 0.1);

        settlement.railNetworkBonus = bonus;
    }

    createTrain(route) {
        const train = {
            id: this.nextTrainId++,
            type: this.getTrainType(),
            speed: this.getTrainSpeed(),
            route: route,
            position: 0,
            currentSegment: 0,
            cargo: {},
            status: 'idle'
        };

        this.trains.push(train);
        return train;
    }

    updateTrains() {
        this.trains.forEach(train => {
            if (train.status !== 'moving') return;

            train.position += train.speed;

            const routeLength = train.route.path.length;
            if (train.position >= routeLength) {
                train.position = 0;
                this.transferCargo(train);
            }
        });
    }

    transferCargo(train) {
        const destStation = train.route.destination;
        const settlement = destStation.settlement;

        if (settlement && train.cargo) {
            Object.keys(train.cargo).forEach(resource => {
                const amount = train.cargo[resource];
                settlement.addResourcesToStorage(resource, amount);
                this.game.player.resources[resource] += amount;
            });

            train.cargo = {};
        }
    }

    damageTracksNearEruption(eruptionX, eruptionY, radius) {
        const isMaglev = this.game.player.techTree.techs['maglevTransit'].researched;
        if (isMaglev) return;

        let damaged = 0;
        this.tracks.forEach((track, key) => {
            const distFrom = Math.abs(track.from.x - eruptionX) + Math.abs(track.from.y - eruptionY);
            const distTo = Math.abs(track.to.x - eruptionX) + Math.abs(track.to.y - eruptionY);

            if (distFrom <= radius || distTo <= radius) {
                track.durability -= 40;
                damaged++;

                if (track.durability <= 0) {
                    this.tracks.delete(key);
                    this.game.log(`Railway track destroyed by eruption!`);
                }
            }
        });

        if (damaged > 0) {
            this.game.log(`${damaged} track segments damaged by eruption`);
        }
    }

    degradeTracks() {
        const isElectric = this.game.player.techTree.techs['electrifiedRail'].researched;
        const isMaglev = this.game.player.techTree.techs['maglevTransit'].researched;

        if (isMaglev) return;

        const degradeRate = isElectric ? 0.3 : 0.5;

        this.tracks.forEach((track, key) => {
            track.durability -= degradeRate;

            if (track.durability <= 0) {
                this.tracks.delete(key);
            }
        });
    }
}