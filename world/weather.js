class WeatherSystem {
    constructor(planet, player, game) {
        this.planet = planet;
        this.player = player;
        this.game = game;

        this.currentWeather = 'clear';
        this.weatherDuration = 0;
        this.weatherIntensity = 0;
        this.forecastedWeather = [];

        this.ashCloudCoverage = 0;
        this.acidRainActive = false;
        this.geothermalVents = [];

        this.turnsSinceLastWeatherChange = 0;
        this.minTurnsBetweenChanges = 3;
        this.maxTurnsBetweenChanges = 8;
        this.nextWeatherChangeTurn = this.getRandomWeatherChangeTurn();

        this.weatherTypes = {
            clear: {
                name: 'Clear',
                color: '#88aaff',
                icon: '',
                collectible: null,
                collectAmount: 0
            },
            ashcloud: {
                name: 'Ash Cloud',
                color: '#665555',
                icon: '',
                collectible: 'silicon',
                collectAmount: 15
            },
            acidrain: {
                name: 'Acid Rain',
                color: '#66aa66',
                icon: '',
                collectible: 'coal',
                collectAmount: 12
            },
            heatwave: {
                name: 'Heat Wave',
                color: '#ff8844',
                icon: '',
                collectible: 'copper',
                collectAmount: 10
            },
            volcanicwinter: {
                name: 'Volcanic Winter',
                color: '#4455aa',
                icon: '',
                collectible: 'iron',
                collectAmount: 8
            }
        };

        this.initializeGeothermalVents();
        this.generateForecast();
    }

    initializeGeothermalVents() {
        for (let y = 0; y < this.planet.height; y++) {
            for (let x = 0; x < this.planet.width; x++) {
                const tile = this.planet.tiles[y][x];
                if (tile.hasGeothermal) {
                    this.geothermalVents.push({
                        x: x,
                        y: y,
                        radius: 3,
                        warmth: 15
                    });
                }
            }
        }
    }

    getRandomWeatherChangeTurn() {
        return Math.floor(Math.random() * (this.maxTurnsBetweenChanges - this.minTurnsBetweenChanges + 1)) + this.minTurnsBetweenChanges;
    }

    generateForecast() {
        this.forecastedWeather = [];
        const types = ['clear', 'clear', 'ashcloud', 'acidrain', 'heatwave', 'volcanicwinter'];

        for (let i = 0; i < 5; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const duration = Math.floor(Math.random() * 4) + 2;
            this.forecastedWeather.push({
                type: type,
                duration: duration,
                intensity: Math.random() * 0.5 + 0.5
            });
        }
    }

    isNearGeothermalVent(x, y) {
        for (const vent of this.geothermalVents) {
            const dist = Math.sqrt(Math.pow(x - vent.x, 2) + Math.pow(y - vent.y, 2));
            if (dist <= vent.radius) {
                return { near: true, warmth: vent.warmth * (1 - dist / vent.radius) };
            }
        }
        return { near: false, warmth: 0 };
    }

    onTurnEnd() {
        this.turnsSinceLastWeatherChange++;

        if (this.weatherDuration > 0) {
            this.weatherDuration--;
        }

        if (this.turnsSinceLastWeatherChange >= this.nextWeatherChangeTurn || this.weatherDuration <= 0) {
            this.changeWeather();
            this.turnsSinceLastWeatherChange = 0;
            this.nextWeatherChangeTurn = this.getRandomWeatherChangeTurn();
        }

        this.applyWeatherEffects();
    }

    changeWeather() {
        if (this.forecastedWeather.length > 0) {
            const nextWeather = this.forecastedWeather.shift();
            this.currentWeather = nextWeather.type;
            this.weatherDuration = nextWeather.duration;
            this.weatherIntensity = nextWeather.intensity;

            this.forecastedWeather.push({
                type: ['clear', 'clear', 'ashcloud', 'acidrain', 'heatwave', 'volcanicwinter'][Math.floor(Math.random() * 6)],
                duration: Math.floor(Math.random() * 4) + 2,
                intensity: Math.random() * 0.5 + 0.5
            });

            const weather = this.weatherTypes[this.currentWeather];
            this.game.log(`${weather.icon} Weather Changed: ${weather.name} for ${this.weatherDuration} turns`);

            if (this.currentWeather === 'acidrain') {
                this.acidRainActive = true;
                this.game.renderer.startAcidRain();
            } else {
                this.acidRainActive = false;
            }

            if (this.currentWeather === 'ashcloud') {
                this.ashCloudCoverage = this.weatherIntensity;
            } else {
                this.ashCloudCoverage = 0;
            }
        }
    }

    applyWeatherEffects() {
        let foodPenalty = 0;
        let solarPenalty = 0;
        let buildingDamage = 0;

        switch (this.currentWeather) {
            case 'ashcloud':
                foodPenalty = Math.floor(this.weatherIntensity * 10);
                solarPenalty = Math.floor(this.weatherIntensity * 15);
                this.player.foodBonus = Math.max(-50, (this.player.foodBonus || 0) - foodPenalty);
                this.game.log(`Ash cloud blocks sunlight! Food -${foodPenalty}, Solar reduced by ${solarPenalty}%`);
                break;

            case 'acidrain':
                buildingDamage = Math.floor(this.weatherIntensity * 5);
                this.damageAllBuildings(buildingDamage);
                break;

            case 'heatwave':
                this.player.settlements.forEach(settlement => {
                    settlement.foodConsumption = Math.floor(settlement.foodConsumption * 1.3);
                });
                this.game.log('Heat wave! Citizens need 30% more food for cooling');
                break;

            case 'volcanicwinter':
                this.player.settlements.forEach(settlement => {
                    settlement.foodConsumption = Math.floor(settlement.foodConsumption * 1.5);
                });
                this.game.log('Volcanic winter! Citizens need 50% more food for warmth');
                break;
        }

        this.applyGeothermalBonuses();
    }

    applyGeothermalBonuses() {
        this.planet.structures.forEach(building => {
            if (building.type === 'farm' && !building.isFrame) {
                const ventData = this.isNearGeothermalVent(building.x, building.y);
                if (ventData.near) {
                    const tile = this.planet.tiles[building.y][building.x];
                    const bonus = Math.floor(ventData.warmth / 5);
                    tile.yields.food += bonus;

                    if (!building.geothermalBonusApplied) {
                        building.geothermalBonusApplied = true;
                    }
                }
            }
        });
    }

    damageAllBuildings(damage) {
        let buildingsDamaged = 0;

        this.planet.structures.forEach(building => {
            if (building.type !== 'ruins' && !building.isFrame) {
                const ventData = this.isNearGeothermalVent(building.x, building.y);
                const actualDamage = ventData.near ? Math.floor(damage * 0.5) : damage;

                building.health -= actualDamage;
                buildingsDamaged++;

                if (building.health <= 0) {
                    const oldType = building.type;
                    this.player.removeBuilding(building);

                    const ruins = {
                        x: building.x,
                        y: building.y,
                        type: 'ruins',
                        health: 0,
                        maxHealth: 0,
                        originalType: oldType
                    };

                    const tile = this.planet.tiles[building.y][building.x];
                    tile.building = ruins;
                    this.planet.structures = this.planet.structures.filter(s => s !== building);
                    this.planet.structures.push(ruins);

                    this.game.log(`${oldType} destroyed by acid rain!`);
                }
            }
        });

        if (buildingsDamaged > 0) {
            this.game.log(`🌧️ Acid rain damages ${buildingsDamaged} buildings for ${damage} HP!`);
        }
    }

    getCurrentWeather() {
        const weatherData = this.weatherTypes[this.currentWeather];
        return {
            type: this.currentWeather,
            name: weatherData.name,
            icon: weatherData.icon,
            duration: this.weatherDuration,
            intensity: this.weatherIntensity,
            forecast: this.forecastedWeather.slice(0, 3),
            collectible: weatherData.collectible,
            collectAmount: weatherData.collectAmount
        };
    }
}