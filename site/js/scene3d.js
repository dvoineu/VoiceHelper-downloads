import * as THREE from '../vendor/three.module.min.js';

/**
 * VoiceHelper — Spatial Acoustic Caret Observatory (Three.js 3D Engine)
 * Features:
 * 1. Real-time vertex-displaced Acoustic Ferrofluid Core + Wireframe Geodesic Shell
 * 2. 5 Sculptural 3D VoiceHelper Wave Pillars (matching AppIcon.png proportions)
 * 3. Raycast-interactive 3D macOS Keycaps (⌥ Option + Space) with spring physics
 * 4. 3D I-Beam Text Caret & Gyroscopic Reticle Rings
 * 5. 2,400-Particle Morphing Cloud across 5 scroll/interactive formations:
 *    [0: Resonance, 1: Caret Lock, 2: Metal GPU Lattice, 3: AES-GCM Vault, 4: 14-Language Globe]
 */
export class VoiceHelperScene3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.onKeycapClick = options.onKeycapClick || (() => {});
    this.onFormationChange = options.onFormationChange || (() => {});

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isPaused = false;
    this.isRecording = false;
    this.audioEnergy = 0.08;
    this.audioBands = new Float32Array(24).fill(0.08);
    this.scrollProgress = 0;
    this.activeFormation = 0;
    this.manualFormationOverride = null;
    this.keyPressSpring = 0;
    this.shockwaveProgress = 0;

    this.pointer = new THREE.Vector2(0, 0);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    if (!this.canvas) return;

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0.2, 9.2);

    // Master offset group (shifts slightly right on desktop so hero copy on left breathes)
    this.stageRoot = new THREE.Group();
    this.updateStageOffset();
    this.scene.add(this.stageRoot);

    this.setupLights();
    this.buildAcousticCore();
    this.buildHarmonicPillars();
    this.buildOrbitalReticle();
    this.buildCaretSculpture();
    this.buildTactileKeycaps();
    this.buildMorphingParticles();
    this.bindEvents();

    this.renderFrame();
    if (!this.reducedMotion) {
      this.startLoop();
    }
  }

  updateStageOffset() {
    if (!this.stageRoot) return;
    const isWide = window.innerWidth > 1024;
    this.stageRoot.position.x = isWide ? 2.15 : 0;
    this.stageRoot.position.y = isWide ? 0.15 : -0.4;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0x1e293b, 1.8);
    this.scene.add(ambient);

    this.cyanLight = new THREE.PointLight(0x1f94fa, 18, 22, 1.6);
    this.cyanLight.position.set(4.5, 3.8, 5.0);
    this.stageRoot.add(this.cyanLight);

    this.indigoLight = new THREE.PointLight(0x4f33d6, 16, 22, 1.6);
    this.indigoLight.position.set(-4.5, -3.2, 4.2);
    this.stageRoot.add(this.indigoLight);

    this.emeraldLight = new THREE.PointLight(0x22c55e, 0, 18, 1.5);
    this.emeraldLight.position.set(0, 0.5, 4.8);
    this.stageRoot.add(this.emeraldLight);
  }

  buildAcousticCore() {
    this.coreGroup = new THREE.Group();
    this.stageRoot.add(this.coreGroup);

    const geom = new THREE.IcosahedronGeometry(1.38, 12);
    const posAttr = geom.attributes.position;
    this.baseCorePositions = new Float32Array(posAttr.array.length);
    this.baseCorePositions.set(posAttr.array);

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0d1b38,
      emissive: 0x102a5c,
      emissiveIntensity: 0.55,
      metalness: 0.35,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      iridescence: 0.85,
      iridescenceIOR: 1.4,
      transparent: true,
      opacity: 0.72,
    });

    this.coreMesh = new THREE.Mesh(geom, mat);
    this.coreGroup.add(this.coreMesh);

    const wireGeom = new THREE.IcosahedronGeometry(1.52, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    this.coreWireframe = new THREE.Mesh(wireGeom, wireMat);
    this.coreGroup.add(this.coreWireframe);
  }

  buildHarmonicPillars() {
    // Proportions from Scripts/generate-icon.swift: [126, 242, 358, 242, 126]
    this.pillarsGroup = new THREE.Group();
    this.stageRoot.add(this.pillarsGroup);

    const baseHeights = [0.52, 0.96, 1.42, 0.96, 0.52];
    const spacing = 0.36;
    this.pillars = [];

    const pillarMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    baseHeights.forEach((h, idx) => {
      const geom = new THREE.CapsuleGeometry(0.085, h, 12, 20);
      const mesh = new THREE.Mesh(geom, pillarMat.clone());
      mesh.position.x = (idx - 2) * spacing;
      mesh.position.z = 0.25;
      mesh.userData = { baseHeight: h, index: idx };
      this.pillarsGroup.add(mesh);
      this.pillars.push(mesh);
    });
  }

  buildOrbitalReticle() {
    this.reticleGroup = new THREE.Group();
    this.stageRoot.add(this.reticleGroup);

    const ringSpecs = [
      { radius: 2.15, tube: 0.012, color: 0x38bdf8, opacity: 0.42, rot: [0.35, 0.2, 0] },
      { radius: 2.55, tube: 0.009, color: 0x818cf8, opacity: 0.28, rot: [-0.45, 0.5, 0.2] },
      { radius: 2.95, tube: 0.007, color: 0x22c55e, opacity: 0.18, rot: [0.2, -0.4, 0.6] },
    ];

    this.rings = ringSpecs.map((spec) => {
      const geom = new THREE.TorusGeometry(spec.radius, spec.tube, 12, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.set(...spec.rot);
      this.reticleGroup.add(mesh);
      return mesh;
    });

    // Expanding shockwave ring on ⌥Space press
    const shockGeom = new THREE.TorusGeometry(1.4, 0.025, 16, 120);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
    });
    this.shockwaveRing = new THREE.Mesh(shockGeom, shockMat);
    this.stageRoot.add(this.shockwaveRing);
  }

  buildCaretSculpture() {
    this.caretGroup = new THREE.Group();
    this.stageRoot.add(this.caretGroup);

    const caretMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
    });

    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.5, 0.09), caretMat);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.09), caretMat);
    topBar.position.y = 1.25;
    const botBar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.09), caretMat);
    botBar.position.y = -1.25;

    this.caretGroup.add(stem, topBar, botBar);
    this.caretMat = caretMat;
    this.caretGroup.position.set(1.9, 0.1, 0.7);
  }

  createKeycapTexture(topText, mainText, width = 256, height = 256) {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(topText, 26, 52);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 44px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(mainText, 26, height - 34);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  buildTactileKeycaps() {
    this.keycapsGroup = new THREE.Group();
    this.keycapsGroup.position.set(0, -2.18, 1.15);
    this.keycapsGroup.rotation.x = 0.42;
    this.stageRoot.add(this.keycapsGroup);

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.4,
      metalness: 0.5,
    });

    const optTex = this.createKeycapTexture('alt', '⌥ Option', 256, 256);
    const spaceTex = this.createKeycapTexture('dictate', 'Space · Голос', 512, 256);

    const optMaterials = [
      sideMat, sideMat,
      new THREE.MeshStandardMaterial({ map: optTex, roughness: 0.25, metalness: 0.2 }),
      sideMat, sideMat, sideMat,
    ];
    const spaceMaterials = [
      sideMat, sideMat,
      new THREE.MeshStandardMaterial({ map: spaceTex, roughness: 0.25, metalness: 0.2 }),
      sideMat, sideMat, sideMat,
    ];

    this.optKeyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.28, 0.85), optMaterials);
    this.optKeyMesh.position.set(-0.98, 0, 0);
    this.optKeyMesh.userData.isKeycap = true;

    this.spaceKeyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.28, 0.85), spaceMaterials);
    this.spaceKeyMesh.position.set(0.58, 0, 0);
    this.spaceKeyMesh.userData.isKeycap = true;

    this.keycapsGroup.add(this.optKeyMesh, this.spaceKeyMesh);
  }

  buildMorphingParticles() {
    const count = 2400;
    this.particleCount = count;

    this.formations = [
      new Float32Array(count * 3), // 0: Acoustic Resonance Sphere/Wave
      new Float32Array(count * 3), // 1: Caret & HUD Capsule Lock
      new Float32Array(count * 3), // 2: Apple Silicon Metal Tensor Lattice
      new Float32Array(count * 3), // 3: AES-GCM Cryptographic Octahedron Vault
      new Float32Array(count * 3), // 4: 14-Language Planetary Globe
    ];

    const currentPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorIndigo = new THREE.Color(0x818cf8);
    const colorEmerald = new THREE.Color(0x22c55e);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = i / count;

      // Formation 0: Fibonacci Acoustic Wave Sphere + Spiral Disc
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r0 = 2.1 + 0.55 * Math.sin(t * Math.PI * 12);
      this.formations[0][i3] = r0 * Math.sin(phi) * Math.cos(theta);
      this.formations[0][i3 + 1] = r0 * Math.sin(phi) * Math.sin(theta);
      this.formations[0][i3 + 2] = r0 * Math.cos(phi);

      // Formation 1: Giant I-Beam Caret + Floating HUD Frame
      if (i < count * 0.45) {
        // Vertical I-Beam Caret
        const u = (i / (count * 0.45)) * 2 - 1;
        this.formations[1][i3] = (Math.random() - 0.5) * 0.24 - 1.45;
        this.formations[1][i3 + 1] = u * 2.35;
        this.formations[1][i3 + 2] = (Math.random() - 0.5) * 0.24;
      } else {
        // Floating HUD Capsule next to Caret
        const u = (i - count * 0.45) / (count * 0.55);
        const angle = u * Math.PI * 2;
        const rx = 1.65;
        const ry = 0.65;
        this.formations[1][i3] = 0.65 + Math.cos(angle) * rx + (Math.random() - 0.5) * 0.15;
        this.formations[1][i3 + 1] = Math.sin(angle) * ry + (Math.random() - 0.5) * 0.15;
        this.formations[1][i3 + 2] = (Math.random() - 0.5) * 0.4;
      }

      // Formation 2: Apple Silicon Metal 3D Tensor Grid (16x15x10 matrix)
      const gx = (i % 16) - 7.5;
      const gy = (Math.floor(i / 16) % 15) - 7.0;
      const gz = Math.floor(i / 240) - 4.5;
      this.formations[2][i3] = gx * 0.28;
      this.formations[2][i3 + 1] = gy * 0.24;
      this.formations[2][i3 + 2] = gz * 0.28;

      // Formation 3: AES-GCM Cryptographic Octahedron Shield
      const octAngle = theta;
      const octV = (i % 120) / 120;
      const octR = 2.45 * (1 - Math.abs(octV * 2 - 1));
      this.formations[3][i3] = octR * Math.cos(octAngle);
      this.formations[3][i3 + 1] = (octV * 2 - 1) * 2.45;
      this.formations[3][i3 + 2] = octR * Math.sin(octAngle);

      // Formation 4: 14-Language Globe with Latitude/Longitude Bands
      const latBand = (Math.floor(i / 40) / 60) * Math.PI;
      const lonBand = ((i % 40) / 40) * Math.PI * 2;
      const globeR = 2.35;
      this.formations[4][i3] = globeR * Math.sin(latBand) * Math.cos(lonBand);
      this.formations[4][i3 + 1] = globeR * Math.cos(latBand);
      this.formations[4][i3 + 2] = globeR * Math.sin(latBand) * Math.sin(lonBand);

      // Copy initial positions
      currentPositions[i3] = this.formations[0][i3];
      currentPositions[i3 + 1] = this.formations[0][i3 + 1];
      currentPositions[i3 + 2] = this.formations[0][i3 + 2];

      // Color gradient
      const mixed = colorCyan.clone().lerp(colorIndigo, (i % 100) / 100);
      if (i % 17 === 0) mixed.lerp(colorEmerald, 0.7);
      colors[i3] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.84,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(particleGeom, particleMat);
    this.stageRoot.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.updateStageOffset();
      if (this.reducedMotion) this.renderFrame();
    });

    window.addEventListener('pointermove', (e) => {
      this.targetPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Click on 3D keycaps
    this.canvas.addEventListener('pointerdown', (e) => {
      if (!this.camera || !this.keycapsGroup) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(mouse, this.camera);
      const hits = this.raycaster.intersectObjects([this.optKeyMesh, this.spaceKeyMesh], false);
      if (hits.length > 0) {
        this.triggerKeycapPulse();
        this.onKeycapClick();
      }
    });

    // Pause background WebGL loop when document is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (!this.reducedMotion) {
        this.resume();
      }
    });

    // Listen to contentvisibilityautostatechange on canvas wrapper if applied
    const wrapper = this.canvas.parentElement;
    if (wrapper) {
      wrapper.addEventListener('contentvisibilityautostatechange', (event) => {
        if (event.skipped) {
          this.pause();
        } else if (!this.reducedMotion) {
          this.resume();
        }
      });
    }
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    if (this.manualFormationOverride === null) {
      const nextFormation = Math.min(4, Math.floor(this.scrollProgress * 5));
      if (nextFormation !== this.activeFormation) {
        this.activeFormation = nextFormation;
        this.onFormationChange(this.activeFormation);
      }
    }
    if (this.reducedMotion) {
      this.renderFrame();
    }
  }

  setFormation(index, isManual = true) {
    const clamped = Math.max(0, Math.min(4, index));
    this.activeFormation = clamped;
    this.manualFormationOverride = isManual ? clamped : null;
    this.onFormationChange(clamped);
    if (this.reducedMotion) {
      this.renderFrame();
    }
  }

  setRecordingState(isRecording) {
    this.isRecording = Boolean(isRecording);
    this.triggerKeycapPulse();
    if (this.reducedMotion) {
      this.renderFrame();
    }
  }

  updateAudioSpectrum(bandsArray, overallEnergy) {
    if (bandsArray && bandsArray.length) {
      for (let i = 0; i < Math.min(24, bandsArray.length); i++) {
        this.audioBands[i] = bandsArray[i];
      }
    }
    this.audioEnergy = Math.max(0.05, Math.min(1.5, overallEnergy || 0.08));
  }

  triggerKeycapPulse() {
    this.keyPressSpring = 1.0;
    this.shockwaveProgress = 0.01;
  }

  pause() {
    this.isPaused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.clock.getDelta();
    this.startLoop();
  }

  startLoop() {
    if (this.rafId) return;
    const tick = () => {
      if (this.isPaused) return;
      this.renderFrame();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  renderFrame() {
    if (!this.renderer || !this.scene || !this.camera) return;

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsedTime();

    // Smooth pointer interpolation
    this.pointer.x += (this.targetPointer.x - this.pointer.x) * 0.08;
    this.pointer.y += (this.targetPointer.y - this.pointer.y) * 0.08;

    // 1. Deform Acoustic Ferrofluid Core
    if (this.coreMesh && this.baseCorePositions) {
      const posAttr = this.coreMesh.geometry.attributes.position;
      const arr = posAttr.array;
      const base = this.baseCorePositions;
      const energy = this.isRecording ? Math.max(0.42, this.audioEnergy * 1.35) : this.audioEnergy;

      for (let i = 0; i < arr.length; i += 3) {
        const bx = base[i];
        const by = base[i + 1];
        const bz = base[i + 2];
        const wave =
          Math.sin(bx * 2.6 + elapsed * 2.4) *
          Math.cos(by * 2.6 - elapsed * 1.9) *
          Math.sin(bz * 2.2 + elapsed * 1.5);
        const scale = 1 + wave * (0.09 + energy * 0.28);
        arr[i] = bx * scale;
        arr[i + 1] = by * scale;
        arr[i + 2] = bz * scale;
      }
      posAttr.needsUpdate = true;

      this.coreGroup.rotation.y = elapsed * 0.18 + this.pointer.x * 0.35;
      this.coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.12 - this.pointer.y * 0.25;
      this.coreWireframe.rotation.y = -elapsed * 0.24;
    }

    // 2. Animate 5 VoiceHelper Harmonic Wave Pillars
    if (this.pillars) {
      this.pillars.forEach((pillar, idx) => {
        const bandIdx = idx * 4 + 2;
        const bandVal = this.audioBands[bandIdx] || 0.1;
        const idlePulse = Math.sin(elapsed * 3.2 + idx * 0.85) * 0.16 + 0.18;
        const boost = this.isRecording ? bandVal * 1.25 : bandVal * 0.55 + idlePulse;
        const targetScaleY = Math.max(0.45, Math.min(2.1, 0.72 + boost));
        pillar.scale.y += (targetScaleY - pillar.scale.y) * 0.18;
        pillar.material.emissiveIntensity = this.isRecording ? 1.15 : 0.55 + boost * 0.4;
      });
      this.pillarsGroup.rotation.y = this.pointer.x * 0.28;
      this.pillarsGroup.rotation.x = -this.pointer.y * 0.18;
    }

    // 3. Animate Orbital Gyroscope Reticle & Shockwave
    if (this.rings) {
      this.rings[0].rotation.z = elapsed * 0.22;
      this.rings[1].rotation.x = -0.45 + Math.sin(elapsed * 0.4) * 0.2;
      this.rings[1].rotation.y = elapsed * 0.16;
      this.rings[2].rotation.z = -elapsed * 0.14;
    }

    if (this.shockwaveProgress > 0) {
      this.shockwaveProgress += dt * 1.85;
      const s = 1 + this.shockwaveProgress * 2.2;
      this.shockwaveRing.scale.set(s, s, 1);
      this.shockwaveRing.material.opacity = Math.max(0, (1 - this.shockwaveProgress) * 0.65);
      if (this.shockwaveProgress >= 1) {
        this.shockwaveProgress = 0;
        this.shockwaveRing.material.opacity = 0;
      }
    }

    // 4. Caret Sculpture Visibility
    if (this.caretMat) {
      const showCaret = this.activeFormation === 1 || this.isRecording;
      const targetOpacity = showCaret ? (0.45 + 0.45 * Math.sin(elapsed * 6.0) * 0.5 + 0.25) : 0.04;
      this.caretMat.opacity += (targetOpacity - this.caretMat.opacity) * 0.12;
      this.caretGroup.position.y = 0.1 + Math.sin(elapsed * 2.0) * 0.08;
    }

    // 5. Keycap Spring Physics
    if (this.keycapsGroup) {
      this.keyPressSpring *= 0.84;
      const pressY = -this.keyPressSpring * 0.16;
      this.optKeyMesh.position.y = pressY;
      this.spaceKeyMesh.position.y = pressY;
      this.keycapsGroup.rotation.y = this.pointer.x * 0.2;
    }

    // 6. Morph 2,400 Particles toward Active Formation
    if (this.particles && this.formations[this.activeFormation]) {
      const target = this.formations[this.activeFormation];
      const posAttr = this.particles.geometry.attributes.position;
      const arr = posAttr.array;
      const lerpFactor = 0.07;
      const radialBoost = this.isRecording ? 1 + this.audioEnergy * 0.22 : 1;

      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const tx = target[i3] * radialBoost;
        const ty = target[i3 + 1] * radialBoost;
        const tz = target[i3 + 2] * radialBoost;

        arr[i3] += (tx - arr[i3]) * lerpFactor;
        arr[i3 + 1] += (ty - arr[i3 + 1]) * lerpFactor;
        arr[i3 + 2] += (tz - arr[i3 + 2]) * lerpFactor;
      }
      posAttr.needsUpdate = true;
      this.particles.rotation.y = elapsed * 0.08 + this.pointer.x * 0.22;
      this.particles.rotation.x = -this.pointer.y * 0.15;
    }

    // 7. Dynamic Lighting when recording
    if (this.emeraldLight) {
      const targetEmerald = this.isRecording ? 22 : 0;
      this.emeraldLight.intensity += (targetEmerald - this.emeraldLight.intensity) * 0.12;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
