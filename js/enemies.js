/* ═══════════════════════════════════════════════════════════════════════════
   VOID PROTOCOL — js/enemies.js
   Inteligencia Artificial y modelado 3D de variantes infectadas y el Vacío
   ═══════════════════════════════════════════════════════════════════════════ */

class Enemy {
  constructor(position, type) {
    this.type = type;
    this.spawnPos = position.clone();
    this.speed = 0.02;
    this.damageValue = 5;
    this.detectionRadius = 12;
    this.attackCooldown = 1500; // ms
    this.lastAttackTime = 0;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    this.currentState = 'WANDER'; // WANDER, CHASE, ATTACK, SCREAM
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.wanderTimer = 0;
    this.alertSoundPlayed = false;
    this.bobPhase = Math.random() * Math.PI * 2;

    this.build3DModel();

    // Habilitar sombras en todos los componentes del enemigo
    this.mesh.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Vectores pre-asignados para evitar GC por frame
    this._proposedPos = new THREE.Vector3();
    this._diffVec     = new THREE.Vector3();
  }

  // Crea la estructura visual 3D (a base de primitivas encajadas)
  build3DModel() {
    // Sobrescribir en subclases
  }

  // Comportamiento de patrulla aleatoria
  wander() {
    this.wanderTimer--;
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = UTILS.randInt(100, 250);
    }

    const dirX = Math.cos(this.wanderAngle);
    const dirZ = Math.sin(this.wanderAngle);

    const proposedPos = this._proposedPos.copy(this.mesh.position);
    proposedPos.x += dirX * this.speed;
    proposedPos.z += dirZ * this.speed;

    if (!MAP.checkCollision(proposedPos, 0.5)) {
      this.mesh.position.copy(proposedPos);
      this.mesh.rotation.y = -this.wanderAngle + Math.PI / 2;
    } else {
      this.wanderAngle += Math.PI; // Dar la vuelta si hay pared
      this.wanderTimer = 0;
    }
  }

  // Persecución hacia el jugador
  chase(playerPos) {
    const diff = this._diffVec.subVectors(playerPos, this.mesh.position);
    diff.y = 0; // Mantener a nivel del suelo
    const dist = diff.length();

    diff.normalize();

    const proposedPos = this._proposedPos.copy(this.mesh.position);
    proposedPos.addScaledVector(diff, this.speed);

    if (!MAP.checkCollision(proposedPos, 0.5)) {
      this.mesh.position.copy(proposedPos);
      const angle = Math.atan2(diff.x, diff.z);
      this.mesh.rotation.y = angle;
    }

    // Si está en rango de ataque
    if (dist < 1.4) {
      this.attack();
    }
  }

  // Ejecuta el ataque al jugador
  attack() {
    const now = Date.now();
    if (now - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = now;
      
      // Reproducir diferentes sonidos de ataque de forma aleatoria
      const soundType = UTILS.randInt(0, 3);
      if (soundType === 0) {
        AUDIO.playZombieGrowl();
      } else if (soundType === 1) {
        AUDIO.playZombieScream();
      } else if (soundType === 2) {
        AUDIO.playZombieHiss();
      } else {
        AUDIO.playZombieGrowl();
      }
      
      PLAYER.damage(this.damageValue);
    }
  }

  // Loop de actualización
  update(playerPos) {
    if (!PLAYER.alive) {
      this.wander();
      return;
    }

    this.bobPhase += 0.06;
    const baseY = this.type === 'void_entity' ? 1.3 : (this.type === 'crawler' ? 0.45 : 0);
    if (this.type !== 'void_entity') {
      this.mesh.position.y = baseY + Math.sin(this.bobPhase) * 0.06;
    }

    const distToPlayer = this.mesh.position.distanceTo(playerPos);

    if (this.type === 'screamer') {
      // Los screamers se quedan quietos y gritan para alertar a otros
      if (distToPlayer < this.detectionRadius) {
        this.scream();
      }
      return;
    }

    // Logica de transicion de estados
    if (distToPlayer < this.detectionRadius) {
      if (this.currentState !== 'CHASE') {
        // Reproducir sonido de alerta al detectar jugador
        if (!this.alertSoundPlayed) {
          AUDIO.playZombieScream();
          this.alertSoundPlayed = true;
        }
      }
      this.currentState = 'CHASE';
      this.chase(playerPos);
    } else {
      if (this.currentState === 'CHASE') {
        this.currentState = 'WANDER';
        this.wanderTimer = 0;
        this.alertSoundPlayed = false;
      }
      this.wander();
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 1. SPORE WALKER (Zombi estándar)
// ───────────────────────────────────────────────────────────────────────────
class SporeWalker extends Enemy {
  constructor(position) {
    super(position, 'spore_walker');
    this.speed = 0.024;
    this.damageValue = 10;
  }

  build3DModel() {
    const mycoTex = UTILS.createMycoTexture();
    const mat = new THREE.MeshStandardMaterial({
      map: mycoTex,
      roughness: 0.85,
      metalness: 0.1,
      emissive: 0x113311,
      emissiveIntensity: 0.15
    });

    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 1.0; // Elevamos el centro
    this.mesh.add(bodyGroup);

    // Torso ligeramente inclinado
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.4);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.2;
    torso.rotation.x = 0.15; // Inclinado hacia adelante
    bodyGroup.add(torso);

    // Cabeza
    const headGeo = new THREE.BoxGeometry(0.45, 0.5, 0.45);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, 0.8, 0.1);
    head.rotation.x = -0.1;
    bodyGroup.add(head);

    // Ojos
    const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 0.85, 0.32);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 0.85, 0.32);
    bodyGroup.add(eyeL);
    bodyGroup.add(eyeR);

    // Piernas articuladas
    const legGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.55, 8);
    // Pierna Izquierda
    const legL = new THREE.Group();
    legL.position.set(-0.2, -0.25, 0);
    const thighL = new THREE.Mesh(legGeo, mat);
    thighL.position.y = -0.25;
    thighL.rotation.x = -0.1;
    const calfL = new THREE.Mesh(legGeo, mat);
    calfL.position.set(0, -0.7, 0.05);
    calfL.rotation.x = 0.1;
    legL.add(thighL);
    legL.add(calfL);
    bodyGroup.add(legL);

    // Pierna Derecha
    const legR = new THREE.Group();
    legR.position.set(0.2, -0.25, 0);
    const thighR = new THREE.Mesh(legGeo, mat);
    thighR.position.y = -0.25;
    thighR.rotation.x = 0.2; // Camina chueco
    const calfR = new THREE.Mesh(legGeo, mat);
    calfR.position.set(0, -0.7, -0.05);
    calfR.rotation.x = -0.1;
    legR.add(thighR);
    legR.add(calfR);
    bodyGroup.add(legR);

    // Brazos asimétricos
    const armGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.6, 8);
    const armL = new THREE.Group();
    armL.position.set(-0.45, 0.5, 0);
    armL.rotation.x = Math.PI / 2.5; // Apuntando al frente
    armL.rotation.z = 0.2;
    const bicepL = new THREE.Mesh(armGeo, mat);
    bicepL.position.y = -0.3;
    armL.add(bicepL);
    bodyGroup.add(armL);

    const armR = new THREE.Group();
    armR.position.set(0.45, 0.5, 0);
    armR.rotation.x = Math.PI / 3; // Roto/colgando
    armR.rotation.z = -0.4;
    const bicepR = new THREE.Mesh(armGeo, mat);
    bicepR.position.y = -0.3;
    armR.add(bicepR);
    bodyGroup.add(armR);

    // Tumores fúngicos
    const fungMat = new THREE.MeshStandardMaterial({ color: 0x55ff55, emissive: 0x22ff22, emissiveIntensity: 0.8 });
    const fung1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), fungMat);
    fung1.position.set(0.3, 0.6, -0.1);
    bodyGroup.add(fung1);
    const fung2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), fungMat);
    fung2.position.set(-0.25, 0.4, -0.2);
    bodyGroup.add(fung2);

    this.sporeLight = new THREE.PointLight(0x44ff44, 0.8, 4);
    this.sporeLight.position.set(0.3, 0.6, 0);
    bodyGroup.add(this.sporeLight);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 2. CRAWLER (Mutante rápido en cuatro patas)
// ───────────────────────────────────────────────────────────────────────────
class Crawler extends Enemy {
  constructor(position) {
    super(position, 'crawler');
    this.speed = 0.045; // Más rápido
    this.damageValue = 15;
    this.attackCooldown = 1000;
  }

  build3DModel() {
    const mycoTex = UTILS.createMycoTexture();
    const mat = new THREE.MeshStandardMaterial({ map: mycoTex });
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });

    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.5;
    this.mesh.add(bodyGroup);

    // Cuerpo encorvado simulando columna
    const spineGeo = new THREE.BoxGeometry(0.5, 0.4, 0.6);
    const torsoFront = new THREE.Mesh(spineGeo, mat);
    torsoFront.position.set(0, 0, 0.3);
    bodyGroup.add(torsoFront);

    const torsoBack = new THREE.Mesh(spineGeo, mat);
    torsoBack.position.set(0, 0.1, -0.3);
    torsoBack.rotation.x = -0.2;
    bodyGroup.add(torsoBack);

    // Cabeza baja y mandíbula
    const headGeo = new THREE.BoxGeometry(0.4, 0.35, 0.5);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, -0.1, 0.7);
    bodyGroup.add(head);

    // Ojos rojos
    const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, -0.05, 0.96);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, -0.05, 0.96);
    bodyGroup.add(eyeL);
    bodyGroup.add(eyeR);

    // Colmillos
    const fangGeo = new THREE.ConeGeometry(0.03, 0.15, 4);
    const fangL = new THREE.Mesh(fangGeo, boneMat);
    fangL.position.set(-0.1, -0.25, 0.9);
    fangL.rotation.x = Math.PI;
    const fangR = new THREE.Mesh(fangGeo, boneMat);
    fangR.position.set(0.1, -0.25, 0.9);
    fangR.rotation.x = Math.PI;
    bodyGroup.add(fangL);
    bodyGroup.add(fangR);

    // Función para crear patas de araña (dos segmentos)
    const createSpiderLeg = (isFront, isLeft) => {
      const leg = new THREE.Group();
      const signX = isLeft ? -1 : 1;
      
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.5, 8), mat);
      femur.position.set(signX * 0.25, 0.2, 0);
      femur.rotation.z = signX * -0.6; // Hacia arriba y afuera
      
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 0.6, 8), mat);
      tibia.position.set(signX * 0.55, -0.1, 0);
      tibia.rotation.z = signX * 0.3; // Hacia abajo
      
      leg.add(femur);
      leg.add(tibia);
      return leg;
    };

    const legFL = createSpiderLeg(true, true);
    legFL.position.set(0, 0, 0.4);
    legFL.rotation.y = 0.3;
    bodyGroup.add(legFL);

    const legFR = createSpiderLeg(true, false);
    legFR.position.set(0, 0, 0.4);
    legFR.rotation.y = -0.3;
    bodyGroup.add(legFR);

    const legBL = createSpiderLeg(false, true);
    legBL.position.set(0, 0, -0.4);
    legBL.rotation.y = -0.4;
    bodyGroup.add(legBL);

    const legBR = createSpiderLeg(false, false);
    legBR.position.set(0, 0, -0.4);
    legBR.rotation.y = 0.4;
    bodyGroup.add(legBR);
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 3. SCREAMER (Estático, emite chillidos)
// ───────────────────────────────────────────────────────────────────────────
class Screamer extends Enemy {
  constructor(position) {
    super(position, 'screamer');
    this.speed = 0;
    this.detectionRadius = 8;
    this.lastScreamTime = 0;
  }

  build3DModel() {
    const sgtTex = UTILS.createSgtTexture(); // Uniforme militar desgarrado
    const mat = new THREE.MeshStandardMaterial({ map: sgtTex });

    const bodyGroup = new THREE.Group();
    this.mesh.add(bodyGroup);

    // Raíces/Micelio anclando la base
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x331122, roughness: 0.9 });
    const rootGeo = new THREE.CylinderGeometry(0.02, 0.15, 0.8, 5);
    for(let i=0; i<6; i++) {
      const root = new THREE.Mesh(rootGeo, rootMat);
      root.position.set(Math.cos(i) * 0.4, 0.4, Math.sin(i) * 0.4);
      root.rotation.x = Math.PI / 4;
      root.rotation.y = -i;
      bodyGroup.add(root);
    }

    // Cuerpo vertical
    const torsoGeo = new THREE.BoxGeometry(0.7, 1.2, 0.5);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.8;
    bodyGroup.add(torso);

    // Cabeza dividida (flor de hongo) más detallada
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.5;

    // Centro brillante rojo pulsante
    const coreGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    headGroup.add(core);

    // Pétalos fúngicos dentados
    const petalGeo = new THREE.ConeGeometry(0.15, 0.6, 3);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xaa2266, roughness: 0.8 });
    for (let i = 0; i < 6; i++) { // 6 pétalos en vez de 4
      const petal = new THREE.Mesh(petalGeo, petalMat);
      const angle = (i / 6) * Math.PI * 2;
      petal.position.set(Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0.1);
      petal.rotation.z = angle - Math.PI/2;
      petal.rotation.x = 0.3; // Abiertos hacia adelante
      headGroup.add(petal);
    }

    bodyGroup.add(headGroup);

    // Luz roja ambiental
    const redLight = new THREE.PointLight(0xff0055, 2.0, 5);
    redLight.position.set(0, 1.6, 0.3);
    this.mesh.add(redLight);
  }

  scream() {
    const now = Date.now();
    if (now - this.lastScreamTime > 3500) {
      this.lastScreamTime = now;
      AUDIO.playZombieGrowl();

      // Alertar y acelerar temporalmente a todos los enemigos de la sala
      window.GAME.enemies.forEach(e => {
        if (e.type !== 'screamer') {
          e.speed *= 1.5;
          e.currentState = 'CHASE';
          setTimeout(() => e.speed /= 1.5, 3000);
        }
      });

      // Distorsión visual rápida en el HUD simulando el grito
      HUD.triggerRedFlash();
    }
  }
}

// ───────────────────────────────────────────────────────────────────────────
// 4. THE VOID ENTITY (NXVL-0 - Entidad flotante distorsionada)
// ───────────────────────────────────────────────────────────────────────────
class VoidEntity extends Enemy {
  constructor(position) {
    super(position, 'void_entity');
    this.speed = 0.038;
    this.damageValue = 18;
    this.detectionRadius = 25; // Detección enorme
    this.ringOuter = null;
    this.ringInner = null;
  }

  build3DModel() {
    // Núcleo: Icosaedro oscuro en lugar de esfera
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 0); // 0 detail = polígonos marcados
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x010005, roughness: 0.2, metalness: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.mesh.add(core);

    // Múltiples anillos orbitales caóticos
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x9900ff,
      emissive: 0x9900ff,
      emissiveIntensity: 2.0,
      wireframe: true // Da un aspecto digital/cuántico
    });

    this.ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 8, 32), ringMat);
    this.mesh.add(this.ringOuter);

    this.ringInner = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 8, 32), ringMat);
    this.ringInner.rotation.x = Math.PI / 2;
    this.mesh.add(this.ringInner);

    this.ringThird = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.02, 4, 16), ringMat);
    this.ringThird.rotation.y = Math.PI / 4;
    this.mesh.add(this.ringThird);

    // Fragmentos orbitando el núcleo
    const fragGeo = new THREE.TetrahedronGeometry(0.1);
    for(let i=0; i<8; i++) {
      const frag = new THREE.Mesh(fragGeo, ringMat);
      frag.position.set(Math.cos(i)*0.6, Math.sin(i)*0.6, Math.cos(i*2)*0.6);
      core.add(frag);
    }

    // Luz violeta que emana la criatura
    const voidLight = new THREE.PointLight(0x8800ff, 3.5, 12);
    voidLight.position.set(0, 0, 0);
    this.mesh.add(voidLight);
  }

  attack() {
    const now = Date.now();
    if (now - this.lastAttackTime > this.attackCooldown) {
      this.lastAttackTime = now;
      AUDIO.playVoidWhisper();
      AUDIO.playImpact();
      PLAYER.damage(this.damageValue, 'void');
    }
  }

  // Loop de actualización extendido
  update(playerPos) {
    if (this.ringOuter) this.ringOuter.rotation.y += 0.03;
    if (this.ringInner) this.ringInner.rotation.x += 0.04;
    const t = performance.now() * 0.003;
    this.mesh.position.y = 1.3 + Math.sin(t) * 0.2;

    if (PLAYER.alive) {
      const dist = this.mesh.position.distanceTo(playerPos);
      if (dist < 12 && Math.random() < 0.003) AUDIO.playVoidWhisper();
    }

    super.update(playerPos);
  }
}

window.SporeWalker = SporeWalker;
window.Crawler = Crawler;
window.Screamer = Screamer;
window.VoidEntity = VoidEntity;
