/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/map.js
   Plano ISS Erebus alineado al lore — progresión Deck 04 → 03 → 01 → M-7
   ═══════════════════════════════════════════════════════════════════════════ */

class MapSystem {
  constructor() {
    this.tileSize = 4;
    this.wallHeight = 4.5;
    this.grid = [];
    this.width = 0;
    this.height = 0;

    this.colliders = [];
    this.terminals = [];
    this.doors = {};
    this.doorList = [];
    this.audioLogs = [];
    this.spawnPoints = { player: null, enemies: [] };
    this.escapeHatch = null;
    this.decorLights = [];

    // Progresión vertical: filas altas = Ingeniería (sur), filas bajas = Puente/Escape (norte)
    this.zones = {
      eng:     { label: 'DECK 04 — INGENIERÍA',       color: 0x44ff88, rows: [14, 17], cols: [1, 11] },
      medbay:  { label: 'DECK 03 — BAHÍA MÉDICA',     color: 0xff8800, rows: [6, 13],  cols: [4, 14] },
      bridge:  { label: 'DECK 01 — PUENTE DE MANDO', color: 0x00d4ff, rows: [1, 5],   cols: [10, 18] },
      escape:  { label: 'MÓDULO M-7 — ESCAPE',       color: 0x00ff88, rows: [1, 3],   cols: [1, 5] },
      lab:     { label: 'NIVEL 4 — LAB. M. OSCURA',  color: 0xff2244, rows: [6, 10],  cols: [15, 18] }
    };

    this.terminalLore = {
      T1: { name: 'Terminal Alpha', deck: 'Deck 04', role: 'Arranque HTML / Autenticación' },
      T2: { name: 'Terminal Beta',  deck: 'Deck 03', role: 'Paneles CSS / Diagnóstico' },
      T3: { name: 'Terminal Gamma', deck: 'Deck 01', role: 'Lanzamiento JS / Módulo M-7' }
    };
  }

  // 0=pasillo 1=pared S=spawn T/D/E/F/L1-L4=logs K=lab sellado
  init() {
    this.grid = [
      ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'],
      ['1','F','0','0','0','1','0','0','0','0','0','0','1','0','L3','0','T3','0','1'],
      ['1','1','1','1','D3','1','0','1','0','L4','0','1','0','1','1','1','D2','1','1'],
      ['1','0','0','0','0','0','0','1','0','0','0','0','0','0','0','0','0','0','1'],
      ['1','0','1','1','1','1','1','1','1','0','1','1','1','1','1','1','1','0','1'],
      ['1','0','1','0','0','0','0','0','0','0','0','0','0','0','0','0','1','0','1'],
      ['1','0','1','0','L2','0','1','1','D2','1','1','D2','1','1','1','K','1','0','1'],
      ['1','0','1','0','1','0','1','0','0','0','0','0','0','0','1','1','1','0','1'],
      ['1','0','0','0','1','0','1','1','1','T2','1','1','1','0','1','1','1','0','1'],
      ['1','1','1','D1','1','0','1','0','0','0','0','0','1','0','1','1','1','D1','1'],
      ['1','0','0','0','0','0','1','0','1','1','1','0','1','0','0','0','0','0','1'],
      ['1','0','1','1','1','1','1','0','1','0','1','0','1','1','1','1','1','0','1'],
      ['1','0','1','0','0','0','1','0','0','E2','0','0','1','0','0','0','1','0','1'],
      ['1','0','1','0','E1','0','1','1','1','0','1','1','1','0','E3','0','1','0','1'],
      ['1','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','1'],
      ['1','1','D1','1','1','0','1','1','1','D1','1','1','1','0','1','1','1','1','1'],
      ['1','0','0','0','1','0','1','0','0','0','0','0','1','0','1','0','L1','0','1'],
      ['1','T1','S','0','1','0','0','0','1','0','1','0','0','0','1','0','0','0','1'],
      ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']
    ];

    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }

  getZoneAt(r, c) {
    if (this.grid[r]?.[c] === 'K') return 'lab';
    for (const key of ['escape', 'bridge', 'medbay', 'eng', 'lab']) {
      const z = this.zones[key];
      if (r >= z.rows[0] && r <= z.rows[1] && c >= z.cols[0] && c <= z.cols[1]) {
        return key;
      }
    }
    return null;
  }

  getPlayerZone(pos) {
    const c = Math.round(pos.x / this.tileSize);
    const r = Math.round(pos.z / this.tileSize);
    return this.getZoneAt(r, c) || 'corridor';
  }

  getZoneColorHex(zoneKey) {
    const deck = window.LORE_DATA?.deckZones?.[zoneKey];
    if (deck?.color !== undefined) {
      return '#' + deck.color.toString(16).padStart(6, '0');
    }
    const fallback = { escape: '#00ff88', bridge: '#00d4ff', medbay: '#ff8800', eng: '#44ff88', lab: '#ff2244', corridor: '#888899' };
    return fallback[zoneKey] || '#111124';
  }

  buildMap(scene) {
    this.init();
    this.colliders = [];
    this.terminals = [];
    this.doors = {};
    this.doorList = [];
    this.audioLogs = [];
    this.spawnPoints = { player: null, enemies: [] };
    this.decorLights = [];

    const wallTex = UTILS.createMetalWallTexture();
    const wallBumpTex = UTILS.createMetalWallBumpTexture();
    const wallRoughTex = UTILS.createMetalWallRoughnessTexture();

    const floorTex = UTILS.createFloorTexture();
    const floorBumpTex = UTILS.createFloorBumpTexture();
    const floorRoughTex = UTILS.createFloorRoughnessTexture();

    const ceilingTex = UTILS.createCeilingTexture();
    const ceilingBumpTex = UTILS.createCeilingBumpTexture();

    [wallTex, wallBumpTex, wallRoughTex, floorTex, floorBumpTex, floorRoughTex, ceilingTex, ceilingBumpTex].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
    });

    const zoneFloorMats = {};
    for (const key of ['eng', 'medbay', 'bridge', 'escape', 'lab']) {
      const zTex = UTILS.createZoneFloorTexture(this.getZoneColorHex(key), key.toUpperCase());
      zoneFloorMats[key] = new THREE.MeshStandardMaterial({ 
        map: zTex, 
        bumpMap: floorBumpTex,
        bumpScale: 0.04,
        roughnessMap: floorRoughTex,
        roughness: 0.65, 
        metalness: 0.75 
      });
    }

    const wallMaterial = new THREE.MeshStandardMaterial({ 
      map: wallTex, 
      bumpMap: wallBumpTex,
      bumpScale: 0.07,
      roughnessMap: wallRoughTex,
      roughness: 0.8, 
      metalness: 0.65 
    });
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      map: floorTex, 
      bumpMap: floorBumpTex,
      bumpScale: 0.05,
      roughnessMap: floorRoughTex,
      roughness: 0.7, 
      metalness: 0.7 
    });
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      map: ceilingTex, 
      bumpMap: ceilingBumpTex,
      bumpScale: 0.05,
      roughness: 0.65, 
      metalness: 0.5 
    });
    const wallGeo = new THREE.BoxGeometry(this.tileSize, this.wallHeight, this.tileSize);
    const floorGeo = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
    const trimGeo = new THREE.BoxGeometry(this.tileSize, 0.15, this.tileSize);

    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        const val = this.grid[r][c];
        const x = c * this.tileSize;
        const z = r * this.tileSize;
        const zone = this.getZoneAt(r, c);

        if (val !== '1' && val !== 'K') {
          const mat = zone && zoneFloorMats[zone] ? zoneFloorMats[zone] : floorMaterial;
          const floorMesh = new THREE.Mesh(floorGeo, mat);
          floorMesh.rotation.x = -Math.PI / 2;
          floorMesh.position.set(x, 0, z);
          floorMesh.receiveShadow = true;
          scene.add(floorMesh);

          const ceilingMesh = new THREE.Mesh(floorGeo, ceilingMaterial);
          ceilingMesh.rotation.x = Math.PI / 2;
          ceilingMesh.position.set(x, this.wallHeight, z);
          ceilingMesh.receiveShadow = true;
          scene.add(ceilingMesh);

          if (zone && (c + r) % 4 === 0) this.createCeilingPipe(scene, x, z);
          if (val === '0' && (c + r) % 5 === 0) this.createCorridorLight(scene, x, z, zone);
        }

        if (val === '1' || val === 'K') {
          // Si es zona infectada, crear muro con textura de emisión bioluminiscente
          let mat = wallMaterial;
          if (zone === 'lab' || zone === 'eng') {
            const emissiveTex = UTILS.createWallEmissiveTexture(zone, zone === 'lab' ? 0xff2244 : 0x44ff88);
            emissiveTex.wrapS = emissiveTex.wrapT = THREE.RepeatWrapping;
            mat = new THREE.MeshStandardMaterial({
              map: wallTex,
              bumpMap: wallBumpTex,
              bumpScale: 0.07,
              roughnessMap: wallRoughTex,
              emissiveMap: emissiveTex,
              emissive: zone === 'lab' ? 0xff2244 : 0x44ff88,
              emissiveIntensity: 0.6,
              roughness: 0.8,
              metalness: 0.65
            });
          }
          const wallMesh = new THREE.Mesh(wallGeo, mat);
          wallMesh.position.set(x, this.wallHeight / 2, z);
          wallMesh.castShadow = true;
          wallMesh.receiveShadow = true;
          scene.add(wallMesh);
          this.colliders.push(new THREE.Box3().setFromObject(wallMesh));

          if (val === 'K') {
            this.createLabSealSign(scene, x, z);
          } else {
            const trimMat = new THREE.MeshStandardMaterial({
              color: zone ? this.zones[zone].color : 0x1a1a35,
              emissive: zone ? this.zones[zone].color : 0x000000,
              emissiveIntensity: 0.12,
              metalness: 0.9
            });
            const trim = new THREE.Mesh(trimGeo, trimMat);
            trim.position.set(x, 0.08, z);
            trim.castShadow = true;
            trim.receiveShadow = true;
            scene.add(trim);
          }
        } else if (val === 'S') {
          this.spawnPoints.player = new THREE.Vector3(x, 1.8, z);
        } else if (val.startsWith('E')) {
          this.spawnPoints.enemies.push({ type: val, pos: new THREE.Vector3(x, 0.8, z) });
        } else if (val.startsWith('T')) {
          this.createTerminal3D(scene, x, z, val, zone);
        } else if (val.startsWith('D')) {
          this.createDoor3D(scene, x, z, val);
        } else if (val === 'F') {
          this.createEscapeHatch3D(scene, x, z);
        } else if (val.startsWith('L')) {
          this.createAudioLog3D(scene, x, z, val);
        } else if (val === '0' && zone && this.isZoneEntry(r, c, zone)) {
          this.createZoneSign(scene, x, z, zone);
        }
      }
    }

    this.createEnvironmentProps(scene);
    this.setupLighting(scene);
  }

  isZoneEntry(r, c, zoneKey) {
    const z = this.zones[zoneKey];
    return r === z.rows[0] && c === Math.floor((z.cols[0] + z.cols[1]) / 2);
  }

  setupLighting(scene) {
    scene.add(new THREE.AmbientLight(0x0a0a20, 0.15)); // Antes 0.85 — muy oscuro ahora
    scene.add(new THREE.HemisphereLight(0x112244, 0x050508, 0.12)); // Antes 0.35 — apenas visible

    const lights = [
      { color: 0x44ff88, x: 5, z: 16, i: 1.2, d: 32 },
      { color: 0xff8800, x: 9, z: 9,  i: 1.0, d: 28 },
      { color: 0x00d4ff, x: 15, z: 3, i: 1.4, d: 26 },
      { color: 0x00ff88, x: 2, z: 2,  i: 2.0, d: 16 },
      { color: 0xff2244, x: 17, z: 8, i: 0.6, d: 12 }
    ];
    lights.forEach((l) => {
      const pl = new THREE.PointLight(l.color, l.i, l.d);
      pl.position.set(l.x * this.tileSize, 3.5, l.z * this.tileSize);
      pl.castShadow = true;
      pl.shadow.mapSize.width = 512;
      pl.shadow.mapSize.height = 512;
      pl.shadow.camera.near = 0.5;
      pl.shadow.camera.far = 30;
      pl.shadow.bias = -0.002;
      scene.add(pl);
    });
  }

  createLabSealSign(scene, x, z) {
    const sign = this.makeSignMesh('NIVEL 4 — SELLADO', 'FISURA CERRADA // NO REABRIR', '#ff2244');
    sign.position.set(x, 0, z - 1.8);
    scene.add(sign);
    const warn = new THREE.PointLight(0xff2244, 0.8, 6);
    warn.position.set(x, 2, z);
    scene.add(warn);
  }

  makeSignMesh(line1, line2, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = colorHex;
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(line1, 256, 48);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText(line2, 256, 88);
    const tex = new THREE.CanvasTexture(canvas);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 0.85),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    panel.position.y = 2.6;
    const g = new THREE.Group();
    g.add(panel);
    return g;
  }

  createAudioLog3D(scene, x, z, cellId) {
    const logId = window.LORE_DATA?.audioLogPlacements?.[cellId];
    if (!logId) return;

    const group = new THREE.Group();
    const recorder = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.2, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x2a3a4a, emissive: 0x00d4ff, emissiveIntensity: 0.3, metalness: 0.8 })
    );
    recorder.position.y = 1.1;
    group.add(recorder);

    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xff4400 })
    );
    led.position.set(0.12, 1.18, 0.2);
    group.add(led);

    const light = new THREE.PointLight(0x00d4ff, 0.5, 4);
    light.position.set(0, 1.2, 0);
    group.add(light);

    group.position.set(x, 0, z);
    scene.add(group);

    this.audioLogs.push({
      cellId,
      logId,
      pos: new THREE.Vector3(x, 1.1, z),
      mesh: group,
      led,
      collected: false
    });
  }

  createCorridorLight(scene, x, z, zoneKey) {
    const color = zoneKey ? this.zones[zoneKey].color : 0x00d4ff;
    const fixture = new THREE.Group();
    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.08, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.8 })
    );
    housing.position.y = this.wallHeight - 0.2;
    fixture.add(housing);
    const bulb = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1 })
    );
    bulb.position.y = this.wallHeight - 0.24;
    fixture.add(bulb);
    const light = new THREE.PointLight(color, 0.55, 8);
    light.position.set(0, this.wallHeight - 0.5, 0);
    fixture.add(light);
    fixture.position.set(x, 0, z);
    scene.add(fixture);
    this.decorLights.push({ light, baseIntensity: 0.55, phase: Math.random() * Math.PI * 2, zoneKey });
  }

  createCeilingPipe(scene, x, z) {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, this.tileSize * 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a2a45, metalness: 0.85, roughness: 0.35 })
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(x, this.wallHeight - 0.35, z);
    scene.add(pipe);
  }

  createZoneSign(scene, x, z, zoneKey) {
    const deck = window.LORE_DATA?.deckZones?.[zoneKey] || { label: this.zones[zoneKey].label, subtitle: '' };
    const color = this.getZoneColorHex(zoneKey);
    const sign = this.makeSignMesh(deck.label, deck.subtitle || '', color);
    sign.position.set(x, 0, z);
    scene.add(sign);
  }

  createEnvironmentProps(scene) {
    [[3, 16], [6, 11], [11, 7], [14, 4], [2, 3]].forEach(([c, r], i) => {
      if (this.grid[r]?.[c] === '0') this.createPropCrate(scene, c * this.tileSize, r * this.tileSize, i % 2 === 0);
    });

    const bioR = 7, bioC = 12;
    if (this.grid[bioR]?.[bioC] === '0') {
      const pod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.55, 1.8, 12),
        new THREE.MeshStandardMaterial({ color: 0x223322, emissive: 0x44ff44, emissiveIntensity: 0.3, transparent: true, opacity: 0.85 })
      );
      pod.position.set(bioC * this.tileSize, 0.9, bioR * this.tileSize);
      scene.add(pod);
      const bioLight = new THREE.PointLight(0x44ff44, 0.9, 6);
      bioLight.position.set(bioC * this.tileSize, 1.5, bioR * this.tileSize);
      scene.add(bioLight);
    }

    // Restos narrativos en el puente (Capitana)
    const capR = 4, capC = 13;
    if (this.grid[capR]?.[capC] === '0') {
      const stain = new THREE.Mesh(
        new THREE.CircleGeometry(0.6, 8),
        new THREE.MeshBasicMaterial({ color: 0x440000, transparent: true, opacity: 0.5 })
      );
      stain.rotation.x = -Math.PI / 2;
      stain.position.set(capC * this.tileSize, 0.02, capR * this.tileSize);
      scene.add(stain);
    }
  }

  createPropCrate(scene, x, z, damaged) {
    const crate = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.MeshStandardMaterial({ color: damaged ? 0x3a2a1a : 0x2a3a4a, metalness: 0.5, roughness: 0.7 })
    );
    crate.position.set(x + UTILS.rand(-0.4, 0.4), 0.55, z + UTILS.rand(-0.4, 0.4));
    crate.rotation.y = UTILS.rand(0, Math.PI);
    crate.castShadow = true;
    crate.receiveShadow = true;
    scene.add(crate);
    this.colliders.push(new THREE.Box3().setFromObject(crate));
  }

  createTerminal3D(scene, x, z, val, zoneKey) {
    const lore = this.terminalLore[val] || {};
    const accent = zoneKey ? this.zones[zoneKey].color : 0x00d4ff;
    const termGroup = new THREE.Group();

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.8), new THREE.MeshStandardMaterial({ color: 0x141428, metalness: 0.9 }));
    base.position.y = 0.12;
    termGroup.add(base);

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.0, 8), new THREE.MeshStandardMaterial({ color: 0x1e1e35, metalness: 0.8 }));
    stand.position.y = 0.75;
    termGroup.add(stand);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.48),
      new THREE.MeshStandardMaterial({ color: 0x050a10, emissive: accent, emissiveIntensity: 0.55 })
    );
    screen.position.set(0, 1.35, 0.15);
    screen.rotation.x = -Math.PI / 7;
    termGroup.add(screen);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(lore.name || val, 128, 26);
    ctx.fillStyle = '#88aabb';
    ctx.font = '11px monospace';
    ctx.fillText(lore.role || '', 128, 48);
    const idTex = new THREE.CanvasTexture(canvas);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.24), new THREE.MeshBasicMaterial({ map: idTex, transparent: true }));
    label.position.set(0, 1.72, 0.18);
    label.rotation.x = -Math.PI / 7;
    termGroup.add(label);

    termGroup.add(new THREE.PointLight(accent, 2.5, 7).translateY(1.5));
    termGroup.position.set(x, 0, z);
    termGroup.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(termGroup);

    this.terminals.push({
      id: val,
      lore,
      pos: new THREE.Vector3(x, 1.2, z),
      box: new THREE.Box3(new THREE.Vector3(x - 1, 0, z - 1), new THREE.Vector3(x + 1, 2.2, z + 1)),
      mesh: termGroup,
      screenMesh: screen,
      solved: false
    });
  }

  createDoor3D(scene, x, z, val) {
    const doorLabels = { D1: 'NORTE → MEDBAY', D2: 'PUENTE DE MANDO', D3: 'MÓDULO M-7' };
    const colorHex  = { D1: '#44ff88', D2: '#ff8800', D3: '#cc44ff' };
    const colorInt  = { D1: 0x44ff88,  D2: 0xff8800,  D3: 0xcc44ff  };
    const col = colorInt[val]  || 0x00d4ff;
    const hex = colorHex[val]  || '#00d4ff';

    const doorGroup = new THREE.Group();

    /* ── Paneles de la puerta ── */
    const panelGeo = new THREE.BoxGeometry(1.9, this.wallHeight, 0.3);
    const panelMat = new THREE.MeshStandardMaterial({
      map: UTILS.createDoorTexture(hex),
      metalness: 0.85,
      roughness: 0.3,
      emissive: col,
      emissiveIntensity: 0.08
    });

    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.set(-0.95, this.wallHeight / 2, 0);
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    doorGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.set(0.95, this.wallHeight / 2, 0);
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    doorGroup.add(rightPanel);

    /* ── Tiras de neón verticales en los bordes ── */
    const neonGeo = new THREE.BoxGeometry(0.06, this.wallHeight, 0.06);
    const neonMat = new THREE.MeshStandardMaterial({
      color: col, emissive: col, emissiveIntensity: 3.5, metalness: 0
    });
    [-1.92, -0.02, 0.02, 1.92].forEach(nx => {
      const strip = new THREE.Mesh(neonGeo, neonMat);
      strip.position.set(nx, this.wallHeight / 2, 0);
      doorGroup.add(strip);
    });

    /* ── Luz de estado (roja = cerrada, verde = abierta) ── */
    const statusGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const statusMat = new THREE.MeshStandardMaterial({
      color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.5
    });
    const statusLight3D = new THREE.Mesh(statusGeo, statusMat);
    statusLight3D.position.set(0, this.wallHeight - 0.3, 0.22);
    doorGroup.add(statusLight3D);

    /* ── Cartel grande y legible ── */
    const signCanvas = document.createElement('canvas');
    signCanvas.width  = 512;
    signCanvas.height = 160;
    const sctx = signCanvas.getContext('2d');

    // Fondo
    sctx.fillStyle = '#05050f';
    sctx.fillRect(0, 0, 512, 160);

    // Borde neón
    sctx.strokeStyle = hex;
    sctx.lineWidth   = 5;
    sctx.strokeRect(5, 5, 502, 150);

    // Línea separadora
    sctx.strokeStyle = hex;
    sctx.lineWidth   = 2;
    sctx.beginPath();
    sctx.moveTo(10, 90); sctx.lineTo(502, 90);
    sctx.stroke();

    // Texto principal
    sctx.fillStyle = hex;
    sctx.font      = 'bold 36px monospace';
    sctx.textAlign = 'center';
    sctx.fillText(doorLabels[val] || val, 256, 68);

    // Estado: BLOQUEADO
    sctx.fillStyle = '#ff3333';
    sctx.font      = 'bold 26px monospace';
    sctx.fillText('● BLOQUEADO — COMPLETA TERMINAL', 256, 130);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 1.2),
      new THREE.MeshBasicMaterial({ map: signTex, transparent: true })
    );
    signMesh.position.set(0, 3.5, 0.22);
    doorGroup.add(signMesh);

    /* ── Flechas en el suelo apuntando a la puerta ── */
    const arrowCanvas = document.createElement('canvas');
    arrowCanvas.width  = 128;
    arrowCanvas.height = 128;
    const actx = arrowCanvas.getContext('2d');
    actx.fillStyle = 'transparent';
    actx.clearRect(0, 0, 128, 128);
    actx.fillStyle = hex;
    actx.globalAlpha = 0.7;
    // Triángulo apuntando al norte
    actx.beginPath();
    actx.moveTo(64, 8);
    actx.lineTo(110, 120);
    actx.lineTo(18, 120);
    actx.closePath();
    actx.fill();
    const arrowTex = new THREE.CanvasTexture(arrowCanvas);

    // Tres flechas en el suelo delante de la puerta
    [2.5, 4.5, 6.5].forEach(offset => {
      const arrow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.9, 0.9),
        new THREE.MeshBasicMaterial({ map: arrowTex, transparent: true, depthWrite: false })
      );
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.set(0, 0.02, offset);
      doorGroup.add(arrow);
    });

    /* ── Luces ambiente potentes ── */
    const mainLight = new THREE.PointLight(col, 3.5, 12);
    mainLight.position.set(0, 3, 0.5);
    doorGroup.add(mainLight);

    const floorLight = new THREE.PointLight(col, 1.8, 8);
    floorLight.position.set(0, 0.5, 3);
    doorGroup.add(floorLight);

    /* ── Posicionar y orientar ── */
    doorGroup.position.set(x, 0, z);
    const tileLeft  = this.getTileAtCoords(x - this.tileSize, z);
    const tileRight = this.getTileAtCoords(x + this.tileSize, z);
    if (!(tileLeft === '1' && tileRight === '1')) doorGroup.rotation.y = Math.PI / 2;

    scene.add(doorGroup);
    const doorBox = new THREE.Box3().setFromObject(doorGroup);
    this.colliders.push(doorBox);

    // Pulso neón — guardado para animarlo en updateLights
    this.decorLights.push({ light: mainLight, baseIntensity: 3.5, phase: Math.random() * Math.PI * 2, isDoorLight: true });
    this.decorLights.push({ light: floorLight, baseIntensity: 1.8, phase: Math.random() * Math.PI * 2, isDoorLight: true });

    const doorObj = {
      id: val, mesh: doorGroup,
      left: leftPanel, right: rightPanel,
      box: doorBox, open: false,
      statusMesh: statusLight3D, statusMat,
      signMesh, signTex, signCanvas, sctx,
      neonMat, col, hex
    };
    this.doorList.push(doorObj);
    this.doors[val] = doorObj;
  }

  createEscapeHatch3D(scene, x, z) {
    const hatchGroup = new THREE.Group();

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.5, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a2a1a, metalness: 0.8 })
    );
    platform.position.y = 0.1;
    hatchGroup.add(platform);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.15, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.9 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    hatchGroup.add(ring);

    const portal = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x00aacc, transparent: true, opacity: 0.45, wireframe: true })
    );
    hatchGroup.add(portal);

    const m7sign = this.makeSignMesh('MÓDULO M-7', 'ÚLTIMA CÁPSULA OPERATIVA', '#00ff88');
    m7sign.position.set(0, 0, -2);
    hatchGroup.add(m7sign);

    const escapeLight = new THREE.PointLight(0x00ff88, 4, 12);
    escapeLight.position.set(0, 1.2, 0);
    hatchGroup.add(escapeLight);
    hatchGroup.position.set(x, 0, z);
    hatchGroup.traverse(child => {
      if (child.isMesh && child !== portal) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(hatchGroup);

    this.escapeHatch = {
      pos: new THREE.Vector3(x, 0, z),
      box: new THREE.Box3(new THREE.Vector3(x - 1.4, 0, z - 1.4), new THREE.Vector3(x + 1.4, 3, z + 1.4)),
      mesh: hatchGroup,
      portal
    };
  }

  openDoor(doorId) {
    const targets = this.doorList.filter((d) => d.id === doorId && !d.open);
    targets.forEach((door) => {
      door.open = true;

      /* Actualizar cartel a ABIERTO */
      if (door.sctx && door.signCanvas) {
        const sctx = door.sctx;
        const hex  = door.hex;
        sctx.fillStyle = '#05050f';
        sctx.fillRect(0, 0, 512, 160);
        sctx.strokeStyle = hex;
        sctx.lineWidth   = 5;
        sctx.strokeRect(5, 5, 502, 150);
        sctx.strokeStyle = hex;
        sctx.lineWidth   = 2;
        sctx.beginPath();
        sctx.moveTo(10, 90); sctx.lineTo(502, 90);
        sctx.stroke();
        sctx.fillStyle = hex;
        sctx.font      = 'bold 36px monospace';
        sctx.textAlign = 'center';
        sctx.fillText({ D1:'NORTE → MEDBAY', D2:'PUENTE DE MANDO', D3:'MÓDULO M-7' }[doorId] || doorId, 256, 68);
        sctx.fillStyle = '#00ff88';
        sctx.font      = 'bold 26px monospace';
        sctx.fillText('✅ ACCESO AUTORIZADO — AVANZA', 256, 130);
        door.signTex.needsUpdate = true;
      }

      /* Luz de estado → verde */
      if (door.statusMesh) {
        door.statusMesh.material.color.setHex(0x00ff44);
        door.statusMesh.material.emissive.setHex(0x00ff44);
      }

      /* Neón → blanco brillante durante apertura */
      if (door.neonMat) {
        door.neonMat.emissive.setHex(0xffffff);
        door.neonMat.emissiveIntensity = 6;
        setTimeout(() => {
          door.neonMat.emissive.setHex(door.col);
          door.neonMat.emissiveIntensity = 3.5;
        }, 600);
      }

      /* Animación de deslizamiento (80 frames, más suave) */
      let t = 0;
      const anim = () => {
        t++;
        const ease = 1 - Math.pow(1 - t / 80, 3); // ease-out cúbico
        const offset = ease * 2.1;
        door.left.position.x  = -0.95 - offset;
        door.right.position.x =  0.95 + offset;
        if (t < 80) requestAnimationFrame(anim);
        else        this.removeCollider(door.box);
      };
      anim();
    });
    if (targets.length) AUDIO.playDoorOpen();
  }

  updateLights(time) {
    this.decorLights.forEach((e) => {
      if (e.isDoorLight) {
        // Pulso intenso para las luces de puertas — fácil de ver desde lejos
        e.light.intensity = e.baseIntensity * (0.75 + Math.sin(time * 4 + e.phase) * 0.4);
        return;
      }
      if (e.zoneKey === 'lab' || e.zoneKey === 'medbay') {
        // Alerta parpadeante roja/naranja rápida y tensa para zonas críticas
        const pulse = Math.sin(time * 8 + e.phase);
        e.light.intensity = e.baseIntensity * (0.6 + (pulse > 0 ? 0.75 : -0.55));
        
        // Efecto estroboscópico de interferencia eléctrica
        if (Math.random() < 0.015) {
          e.light.intensity = 0.05;
        }
      } else {
        // Oscilación ambiental suave en zonas seguras
        e.light.intensity = e.baseIntensity * (0.85 + Math.sin(time * 3 + e.phase) * 0.1);
        
        // Tubos fluorescentes que parpadean erráticamente
        if (Math.random() < 0.0025) {
          e.light.intensity = 0.05;
        }
      }
    });
    if (this.escapeHatch?.portal) this.escapeHatch.portal.rotation.y = time * 0.5;
  }

  getTileAtCoords(x, z) {
    const c = Math.round(x / this.tileSize);
    const r = Math.round(z / this.tileSize);
    if (r >= 0 && r < this.height && c >= 0 && c < this.width) return this.grid[r][c];
    return '1';
  }

  removeCollider(box) {
    const idx = this.colliders.indexOf(box);
    if (idx !== -1) this.colliders.splice(idx, 1);
  }

  checkCollision(position, radius = 0.6) {
    const playerBox = new THREE.Box3(
      new THREE.Vector3(position.x - radius, 0.1, position.z - radius),
      new THREE.Vector3(position.x + radius, this.wallHeight - 0.1, position.z + radius)
    );
    return this.colliders.some((c) => playerBox.intersectsBox(c));
  }
}

window.MAP = new MapSystem();
