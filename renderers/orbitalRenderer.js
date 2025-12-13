class OrbitalRenderer {
    constructor(canvas, planet) {
        this.canvas = canvas;
        this.planet = planet;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planetMesh = null;
        this.atmosphereMesh = null;
        this.targetZoom = 5;
        this.currentZoom = 5;
        this.zoomSpeed = 0.05;
        this.orbitals = {
            ring: null,
            defense: null,
            spaceport: null
        };
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotation = { x: 0, y: 0 };
        this.autoRotate = true;
        this.initThreeJS();
        this.generationShips = [];
        setTimeout(() => {
            this.targetZoom = 3.5;
        }, 100);
    }

    initThreeJS() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0f1e);

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.canvas.width / this.canvas.height,
            0.1,
            1000
        );
        this.camera.position.z = this.currentZoom;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        this.createPlanet();
        this.createStarfield();
        this.setupControls();
    }

    createGenerationShip(shipData) {
        const group = new THREE.Group();
        const baseRadius = 1.9 + (shipData.id * 0.1);
        const angle = (shipData.id / 5) * Math.PI * 2;

        group.position.x = Math.cos(angle) * baseRadius;
        group.position.z = Math.sin(angle) * baseRadius;
        group.userData = { shipId: shipData.id, segments: [] };

        if (shipData.segment >= 1) {
            const frameGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 16);
            const frameMaterial = new THREE.MeshPhongMaterial({
                color: 0x666666,
                emissive: 0x222222,
                emissiveIntensity: 0.3
            });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.rotation.x = Math.PI / 2;
            group.add(frame);
            group.userData.segments.push(frame);
        }

        if (shipData.segment >= 2) {
            const engineGeometry = new THREE.CylinderGeometry(0.15, 0.08, 0.3, 8);
            const engineMaterial = new THREE.MeshPhongMaterial({
                color: 0x4488ff,
                emissive: 0x2244ff,
                emissiveIntensity: 0.7
            });
            const engine1 = new THREE.Mesh(engineGeometry, engineMaterial);
            engine1.rotation.x = Math.PI / 2;
            engine1.position.z = -0.5;
            group.add(engine1);

            const engine2 = engine1.clone();
            engine2.position.z = 0.5;
            group.add(engine2);

            group.userData.segments.push(engine1, engine2);
        }

        if (shipData.segment >= 3) {
            const ringGeometry = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0x88aacc,
                emissive: 0x4466aa,
                emissiveIntensity: 0.4
            });
            const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
            ring1.rotation.x = Math.PI / 2;
            ring1.position.x = -0.3;
            group.add(ring1);

            const ring2 = ring1.clone();
            ring2.position.x = 0.3;
            group.add(ring2);

            group.userData.segments.push(ring1, ring2);
            group.userData.rotatingRings = [ring1, ring2];
        }

        if (shipData.segment >= 4) {
            const domeGeometry = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            const domeMaterial = new THREE.MeshPhongMaterial({
                color: 0x44aa44,
                emissive: 0x22ff22,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.6
            });
            const dome = new THREE.Mesh(domeGeometry, domeMaterial);
            dome.position.y = 0.3;
            group.add(dome);
            group.userData.segments.push(dome);
        }

        if (shipData.segment >= 5) {
            const cryoGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.4);
            const cryoMaterial = new THREE.MeshPhongMaterial({
                color: 0x88ccff,
                emissive: 0x4488ff,
                emissiveIntensity: 0.6
            });
            const cryo1 = new THREE.Mesh(cryoGeometry, cryoMaterial);
            cryo1.position.y = -0.2;
            cryo1.position.x = -0.15;
            group.add(cryo1);

            const cryo2 = cryo1.clone();
            cryo2.position.x = 0.15;
            group.add(cryo2);

            group.userData.segments.push(cryo1, cryo2);
        }

        if (shipData.progress > 0 && shipData.segment < 5) {
            const glowGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.8
            });

            for (let i = 0; i < 3; i++) {
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.set(
                    (Math.random() - 0.5) * 0.6,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.6
                );
                group.add(glow);
                group.userData.constructionGlows = group.userData.constructionGlows || [];
                group.userData.constructionGlows.push(glow);
            }
        }

        this.scene.add(group);
        return group;
    }

    updateGenerationShips(player) {
        this.generationShips.forEach(shipMesh => {
            this.scene.remove(shipMesh);
        });
        this.generationShips = [];

        if (!player.shipConstructionActive) return;

        player.generationShips.forEach(shipData => {
            if (shipData.segment > 0 || shipData.progress > 0) {
                const shipMesh = this.createGenerationShip(shipData);
                this.generationShips.push(shipMesh);
            }
        });
    }

    updateCameraZoom() {
        const diff = this.targetZoom - this.currentZoom;
        if (Math.abs(diff) > 0.01) {
            this.currentZoom += diff * this.zoomSpeed;
            this.camera.position.z = this.currentZoom;
        }
    }

    createPlanet() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        const material = new THREE.MeshPhongMaterial({
            map: this.createVolcanicTexture(),
            bumpMap: this.createBumpTexture(),
            bumpScale: 0.15,
            emissive: 0xff4400,
            emissiveIntensity: 0.15,
            shininess: 5,
            specular: 0x222222
        });

        this.planetMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.planetMesh);

        const atmosphereGeometry = new THREE.SphereGeometry(1.08, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x665544,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        this.atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(this.atmosphereMesh);

        this.clouds = this.createClouds();

        this.createOrbitalSlots();
    }

    createClouds() {
        const cloudGroup = new THREE.Group();

        const cloudVertexShader = `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const cloudFragmentShader = `
            uniform float opacity;
            varying vec2 vUv;
            varying vec3 vNormal;

            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(vUv, center);
                float alpha = smoothstep(0.5, 0.2, dist) * opacity;

                float noise = fract(sin(dot(vUv * 10.0, vec2(12.9898, 78.233))) * 43758.5453);
                alpha *= 0.8 + noise * 0.2;

                vec3 color = vec3(0.6, 0.53, 0.47);
                gl_FragColor = vec4(color, alpha);
            }
        `;

        for (let i = 0; i < 50; i++) {
            const size = 0.15 + Math.random() * 0.25;
            const cloudGeometry = new THREE.PlaneGeometry(size, size * 0.7, 1, 1);

            const cloudMaterial = new THREE.ShaderMaterial({
                vertexShader: cloudVertexShader,
                fragmentShader: cloudFragmentShader,
                uniforms: {
                    opacity: { value: 0.3 + Math.random() * 0.2 }
                },
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide
            });

            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 1.068;

            cloud.position.x = radius * Math.sin(phi) * Math.cos(theta);
            cloud.position.y = radius * Math.sin(phi) * Math.sin(theta);
            cloud.position.z = radius * Math.cos(phi);

            cloud.lookAt(0, 0, 0);
            cloud.rotateZ(Math.random() * Math.PI * 2);

            cloud.userData = {
                speed: 0.00008 + Math.random() * 0.00015,
                theta: theta,
                phi: phi,
                radius: radius,
                rotation: Math.random() * Math.PI * 2
            };

            cloudGroup.add(cloud);
        }

        this.scene.add(cloudGroup);
        return cloudGroup;
    }

    createVolcanicTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        const continentNoise = [];
        const detailNoise = [];
        const microNoise = [];

        for (let y = 0; y < 512; y++) {
            continentNoise[y] = [];
            detailNoise[y] = [];
            microNoise[y] = [];
            for (let x = 0; x < 1024; x++) {
                const nx = x / 1024;
                const ny = y / 512;

                continentNoise[y][x] = this.perlinNoise(nx * 4, ny * 4);
                detailNoise[y][x] = this.perlinNoise(nx * 12, ny * 12);
                microNoise[y][x] = this.perlinNoise(nx * 32, ny * 32);
            }
        }

        for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 1024; x++) {
                const continent = continentNoise[y][x];
                const detail = detailNoise[y][x];
                const micro = microNoise[y][x];

                const combined = continent * 0.6 + detail * 0.3 + micro * 0.1;

                let r, g, b;

                if (combined < 0.28) {
                    const lavaVariation = micro * 0.3;
                    r = 220 + Math.floor(lavaVariation * 35);
                    g = Math.floor(30 + lavaVariation * 40);
                    b = Math.floor(lavaVariation * 20);
                } else if (combined < 0.35) {
                    const t = (combined - 0.28) / 0.07;
                    const lavaR = 220 + micro * 35;
                    const lavaG = 30 + micro * 40;
                    const lavaB = micro * 20;
                    const rockR = 55 + detail * 25;
                    const rockG = 45 + detail * 20;
                    const rockB = 35 + detail * 15;

                    r = Math.floor(lavaR * (1 - t) + rockR * t);
                    g = Math.floor(lavaG * (1 - t) + rockG * t);
                    b = Math.floor(lavaB * (1 - t) + rockB * t);
                } else if (combined < 0.48) {
                    const rockVariation = detail * 0.4 + micro * 0.2;
                    r = Math.floor(55 + rockVariation * 35);
                    g = Math.floor(45 + rockVariation * 30);
                    b = Math.floor(35 + rockVariation * 25);
                } else if (combined < 0.54) {
                    const t = (combined - 0.48) / 0.06;
                    const rockR = 55 + detail * 35;
                    const rockG = 45 + detail * 30;
                    const rockB = 35 + detail * 25;
                    const ashR = 90 + detail * 45;
                    const ashG = 95 + detail * 40;
                    const ashB = 105 + detail * 35;

                    r = Math.floor(rockR * (1 - t) + ashR * t);
                    g = Math.floor(rockG * (1 - t) + ashG * t);
                    b = Math.floor(rockB * (1 - t) + ashB * t);
                } else if (combined < 0.68) {
                    const ashVariation = detail * 0.4 + micro * 0.3;
                    r = Math.floor(90 + ashVariation * 45);
                    g = Math.floor(95 + ashVariation * 40);
                    b = Math.floor(105 + ashVariation * 35);
                } else if (combined < 0.74) {
                    const t = (combined - 0.68) / 0.06;
                    const ashR = 90 + detail * 45;
                    const ashG = 95 + detail * 40;
                    const ashB = 105 + detail * 35;
                    const darkR = 40 + detail * 35;
                    const darkG = 45 + detail * 30;
                    const darkB = 42 + detail * 28;

                    r = Math.floor(ashR * (1 - t) + darkR * t);
                    g = Math.floor(ashG * (1 - t) + darkG * t);
                    b = Math.floor(ashB * (1 - t) + darkB * t);
                } else {
                    const darkVariation = detail * 0.4 + micro * 0.2;
                    r = Math.floor(40 + darkVariation * 35);
                    g = Math.floor(45 + darkVariation * 30);
                    b = Math.floor(42 + darkVariation * 28);
                }

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 100, 0, 0.08)';
        ctx.fillRect(0, 0, 1024, 512);
        ctx.globalCompositeOperation = 'source-over';

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }

    perlinNoise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = x * x * (3.0 - 2.0 * x);
        const v = y * y * (3.0 - 2.0 * y);
        const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

        const hash = (i) => p[i % 256];
        const grad = (hash, x, y) => {
            const h = hash & 3;
            const u = h < 2 ? x : y;
            const v = h < 2 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
        };

        const a = grad(hash(X + hash(Y)), x, y);
        const b = grad(hash(X + 1 + hash(Y)), x - 1, y);
        const c = grad(hash(X + hash(Y + 1)), x, y - 1);
        const d = grad(hash(X + 1 + hash(Y + 1)), x - 1, y - 1);

        return (a + u * (b - a) + v * (c - a) + u * v * (a - b - c + d)) * 0.5 + 0.5;
    }

    createBumpTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgb(128, 128, 128)';
        ctx.fillRect(0, 0, 1024, 512);

        for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 1024; x++) {
                const nx = x / 1024;
                const ny = y / 512;

                const largeNoise = this.perlinNoise(nx * 4, ny * 4);
                const mediumNoise = this.perlinNoise(nx * 12, ny * 12);
                const smallNoise = this.perlinNoise(nx * 24, ny * 24);

                const combined = largeNoise * 0.5 + mediumNoise * 0.3 + smallNoise * 0.2;

                const brightness = Math.floor(128 + combined * 127);
                ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const radius = 25 + Math.random() * 50;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgb(240, 240, 240)');
            gradient.addColorStop(0.4, 'rgb(200, 200, 200)');
            gradient.addColorStop(0.7, 'rgb(160, 160, 160)');
            gradient.addColorStop(1, 'rgb(128, 128, 128)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    }

    createOrbitalSlots() {
        this.orbitalSlots = [];
        const slotGeometry = new THREE.TorusGeometry(1.3, 0.015, 16, 100);
        const slotMaterial = new THREE.MeshBasicMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.15
        });

        for (let i = 0; i < 3; i++) {
            const slot = new THREE.Mesh(slotGeometry, slotMaterial.clone());
            slot.rotation.x = Math.PI / 2;
            slot.rotation.z = (i * Math.PI * 2) / 3;
            slot.visible = false;
            this.orbitalSlots.push(slot);
            this.scene.add(slot);
        }
    }

    showOrbitalSlots(show) {
        this.orbitalSlots.forEach(slot => {
            slot.visible = show;
        });
    }

    createStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
    }

    setupControls() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.autoRotate = false;
            this.previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;

                this.rotation.y += deltaX * 0.005;
                this.rotation.x += deltaY * 0.005;

                this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));

                this.previousMousePosition = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (window.game && !window.game.isTransitioning && !window.game.pendingTransition) {
                window.game.handleZoom(e);
            }
        }, { passive: false });
    }

    updateOrbitalBuildings(player) {
        const hasRing = player.buildings.some(b => b.type === 'planetary_orbital_ring' && !b.isFrame);
        const hasDefense = player.buildings.some(b => b.type === 'planetary_defense_grid' && !b.isFrame);
        const hasSpaceport = player.buildings.some(b => b.type === 'orbital_spaceport' && !b.isFrame);

        if (hasRing && !this.orbitals.ring) {
            this.orbitals.ring = this.createOrbitalRing();
        } else if (!hasRing && this.orbitals.ring) {
            this.scene.remove(this.orbitals.ring);
            this.orbitals.ring = null;
        }

        if (hasDefense && !this.orbitals.defense) {
            this.orbitals.defense = this.createDefenseGrid();
        } else if (!hasDefense && this.orbitals.defense) {
            this.scene.remove(this.orbitals.defense);
            this.orbitals.defense = null;
        }

        if (hasSpaceport && !this.orbitals.spaceport) {
            this.orbitals.spaceport = this.createSpaceport();
        } else if (!hasSpaceport && this.orbitals.spaceport) {
            this.scene.remove(this.orbitals.spaceport);
            this.orbitals.spaceport = null;
        }
        this.updateGenerationShips(player);
    }

    createOrbitalRing() {
        const group = new THREE.Group();

        const ringGeometry = new THREE.TorusGeometry(1.4, 0.08, 16, 100);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0x88aaff,
            emissive: 0x4488ff,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const moduleGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.15);
            const moduleMaterial = new THREE.MeshPhongMaterial({
                color: 0xccddff,
                emissive: 0x6688ff,
                emissiveIntensity: 0.3
            });
            const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
            module.position.x = Math.cos(angle) * 1.4;
            module.position.z = Math.sin(angle) * 1.4;
            module.lookAt(0, 0, 0);
            group.add(module);
        }

        this.scene.add(group);
        return group;
    }

    createDefenseGrid() {
        const group = new THREE.Group();

        for (let lat = -60; lat <= 60; lat += 30) {
            const radius = 1.6 * Math.cos((lat * Math.PI) / 180);
            const y = 1.6 * Math.sin((lat * Math.PI) / 180);

            const points = [];
            for (let lon = 0; lon <= 360; lon += 10) {
                const angle = (lon * Math.PI) / 180;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * radius,
                    y,
                    Math.sin(angle) * radius
                ));
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff4400,
                transparent: true,
                opacity: 0.4
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            group.add(line);
        }

        for (let lon = 0; lon < 360; lon += 30) {
            const points = [];
            for (let lat = -90; lat <= 90; lat += 10) {
                const angle = (lon * Math.PI) / 180;
                const latRad = (lat * Math.PI) / 180;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * Math.cos(latRad) * 1.6,
                    Math.sin(latRad) * 1.6,
                    Math.sin(angle) * Math.cos(latRad) * 1.6
                ));
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff4400,
                transparent: true,
                opacity: 0.4
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            group.add(line);
        }

        this.scene.add(group);
        return group;
    }

    createSpaceport() {
        const group = new THREE.Group();

        const stationGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8);
        const stationMaterial = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa,
            emissive: 0x444444,
            emissiveIntensity: 0.3
        });
        const station = new THREE.Mesh(stationGeometry, stationMaterial);
        station.position.set(0, 1.8, 0);
        group.add(station);

        const diskGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16);
        const diskMaterial = new THREE.MeshPhongMaterial({
            color: 0x6688aa,
            emissive: 0x223344,
            emissiveIntensity: 0.5
        });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.position.set(0, 1.8, 0);
        group.add(disk);

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const armGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.05);
            const armMaterial = new THREE.MeshPhongMaterial({
                color: 0x888888
            });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.position.set(
                Math.cos(angle) * 0.25,
                1.8,
                Math.sin(angle) * 0.25
            );
            arm.rotation.y = angle;
            group.add(arm);
        }

        this.scene.add(group);
        return group;
    }

    animate() {
        this.updateCameraZoom();

        if (this.autoRotate) {
            this.rotation.y += 0.002;
        }

        this.planetMesh.rotation.x = this.rotation.x;
        this.planetMesh.rotation.y = this.rotation.y;
        this.atmosphereMesh.rotation.x = this.rotation.x;
        this.atmosphereMesh.rotation.y = this.rotation.y;

        if (this.clouds) {
            this.clouds.children.forEach(cloud => {
                cloud.userData.theta += cloud.userData.speed;

                if (cloud.userData.theta > Math.PI * 2) {
                    cloud.userData.theta -= Math.PI * 2;
                }

                const radius = cloud.userData.radius;
                const phi = cloud.userData.phi;
                const theta = cloud.userData.theta;

                cloud.position.x = radius * Math.sin(phi) * Math.cos(theta);
                cloud.position.y = radius * Math.sin(phi) * Math.sin(theta);
                cloud.position.z = radius * Math.cos(phi);

                cloud.lookAt(0, 0, 0);
                cloud.rotateZ(cloud.userData.rotation || 0);
            });

            this.clouds.rotation.x = this.rotation.x;
            this.clouds.rotation.y = this.rotation.y;
        }

        if (this.orbitals.ring) {
            this.orbitals.ring.rotation.y = this.rotation.y;
        }
        if (this.orbitals.defense) {
            this.orbitals.defense.rotation.x = this.rotation.x;
            this.orbitals.defense.rotation.y = this.rotation.y;
        }
        if (this.orbitals.spaceport) {
            this.orbitals.spaceport.rotation.x = this.rotation.x;
            this.orbitals.spaceport.rotation.y = this.rotation.y;
        }

        this.generationShips.forEach(shipMesh => {
            shipMesh.rotation.y += 0.001;

            if (shipMesh.userData.rotatingRings) {
                shipMesh.userData.rotatingRings.forEach(ring => {
                    ring.rotation.z += 0.02;
                });
            }

            if (shipMesh.userData.constructionGlows) {
                const time = Date.now() * 0.003;
                shipMesh.userData.constructionGlows.forEach((glow, i) => {
                    glow.material.opacity = 0.5 + Math.sin(time + i) * 0.3;
                });
            }

            shipMesh.rotation.x = this.rotation.x;
        });

        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }
}