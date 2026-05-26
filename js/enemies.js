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

    const proposedPos = this.mesh.position.clone();
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
    const diff = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
    diff.y = 0; // Mantener a nivel del suelo
    const dist = diff.length();

    diff.normalize();

    const proposedPos = this.mesh.position.clone();
    proposedPos.add(diff.multiplyScalar(this.speed));

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

    // Cuerpo
    const torsoGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.8;
    this.mesh.add(torso);

    // Cabeza
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 1.65;
    this.mesh.add(head);

    // Ojos brillantes (hongos MYCO-X)
    const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.15, 1.7, 0.26);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.15, 1.7, 0.26);
    this.mesh.add(eyeL);
    this.mesh.add(eyeR);

    // Brazos estirados al frente
    const armGeo = new THREE.BoxGeometry(0.2, 0.2, 0.8);
    const armL = new THREE.Mesh(armGeo, mat);
    armL.position.set(-0.5, 1.1, 0.35);
    const armR = new THREE.Mesh(armGeo, mat);
    armR.position.set(0.5, 1.1, 0.35);
    this.mesh.add(armL);
    this.mesh.add(armR);

    // Fungal growths (esferas brillantes verdes)
    const fungGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const fungMat = new THREE.MeshStandardMaterial({
      color: 0x55ff55,
      emissive: 0x22ff22,
      emissiveIntensity: 0.8
    });
    const fung = new THREE.Mesh(fungGeo, fungMat);
    fung.position.set(0.25, 1.9, -0.05);
    this.mesh.add(fung);
    this.sporeLight = new THREE.PointLight(0x44ff44, 0.6, 3);
    this.sporeLight.position.set(0.25, 1.9, 0);
    this.mesh.add(this.sporeLight);
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

    // Cuerpo horizontal bajo
    const torsoGeo = new THREE.BoxGeometry(0.6, 0.5, 1.2);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.45;
    this.mesh.add(torso);

    // Cabeza baja
    const headGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.set(0, 0.6, 0.65);
    this.mesh.add(head);

    // Ojos rojos acechantes
    const eyeGeo = new THREE.SphereGeometry(0.05, 4, 4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 0.65, 0.86);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 0.65, 0.86);
    this.mesh.add(eyeL);
    this.mesh.add(eyeR);

    // Patas delanteras/traseras anchas
    const legGeo = new THREE.BoxGeometry(0.18, 0.6, 0.18);
    const legFL = new THREE.Mesh(legGeo, mat);
    legFL.position.set(-0.45, 0.25, 0.4);
    const legFR = new THREE.Mesh(legGeo, mat);
    legFR.position.set(0.45, 0.25, 0.4);
    const legBL = new THREE.Mesh(legGeo, mat);
    legBL.position.set(-0.45, 0.25, -0.4);
    const legBR = new THREE.Mesh(legGeo, mat);
    legBR.position.set(0.45, 0.25, -0.4);
    this.mesh.add(legFL);
    this.mesh.add(legFR);
    this.mesh.add(legBL);
    this.mesh.add(legBR);
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

    // Cuerpo vertical
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.3, 0.5);
    const torso = new THREE.Mesh(torsoGeo, mat);
    torso.position.y = 0.75;
    this.mesh.add(torso);

    // Cabeza dividida (flor de hongo)
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.6;

    // Centro brillante rojo
    const coreGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    headGroup.add(core);

    // Pétalos fúngicos alrededor
    const petalGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xaa2266 });
    for (let i = 0; i < 4; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.rotation.z = (i % 2 === 0 ? 1.2 : -1.2) * (i < 2 ? 1 : -1);
      petal.position.set(Math.cos(i * Math.PI / 2) * 0.25, Math.sin(i * Math.PI / 2) * 0.25, 0);
      headGroup.add(petal);
    }

    this.mesh.add(headGroup);

    // Luz roja ambiental
    const redLight = new THREE.PointLight(0xff0055, 1.5, 4);
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
    // Núcleo: esfera negra opaca
    const coreGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x010005 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.mesh.add(core);

    // Anillo exterior brillante morado
    const ringOuterGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x9900ff,
      emissive: 0x9900ff,
      emissiveIntensity: 1.5
    });
    this.ringOuter = new THREE.Mesh(ringOuterGeo, ringMat);
    this.mesh.add(this.ringOuter);

    // Anillo interior cruzado
    const ringInnerGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 32);
    this.ringInner = new THREE.Mesh(ringInnerGeo, ringMat);
    this.ringInner.rotation.x = Math.PI / 2;
    this.mesh.add(this.ringInner);

    // Luz violeta que emana la criatura
    const voidLight = new THREE.PointLight(0x8800ff, 2.5, 8);
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
    this.mesh.position.y = 1.3 + Math.sin(Date.now() * 0.003) * 0.2;

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
