import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { GyreProfile, PointerRefState } from '../../types/ocean';

interface GyreParticleFieldProps {
  gyre: GyreProfile;
  pointerRef: RefObject<PointerRefState>;
  scrollProgressRef: RefObject<number>;
  sweepActive: boolean;
  clearedRatio: number;
  fleetCount: number;
}

const PARTICLE_COUNT = 3200;

const COLOR_CYAN = new THREE.Color('#22D3EE');
const COLOR_AMBER = new THREE.Color('#F59E0B');
const COLOR_EMERALD = new THREE.Color('#10B981');
const COLOR_BONE = new THREE.Color('#C8D6E5');

interface ParticleBuffers {
  positions: Float32Array;
  velocities: Float32Array;
  seeds: Float32Array;
  kinds: Uint8Array;
  baseScales: Float32Array;
  life: Float32Array;
}

export function GyreParticleField({
  gyre,
  pointerRef,
  scrollProgressRef,
  sweepActive,
  clearedRatio,
  fleetCount,
}: GyreParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const { camera, viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const buffers = useMemo<ParticleBuffers>(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const kinds = new Uint8Array(PARTICLE_COUNT);
    const baseScales = new Float32Array(PARTICLE_COUNT);
    const life = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.pow(Math.random(), 0.72) * 11.5;

      positions[i3] = Math.cos(angle) * radius * 1.45;
      positions[i3 + 1] = Math.sin(angle) * radius * 0.85;
      positions[i3 + 2] = (Math.random() - 0.5) * 9.0;

      seeds[i] = Math.random() * 100.0;
      kinds[i] = Math.random() < 0.34 ? 1 : 0;
      baseScales[i] =
        kinds[i] === 1
          ? 0.022 + Math.random() * 0.032
          : 0.014 + Math.random() * 0.024;
      life[i] = 1.0;
    }

    return { positions, velocities, seeds, kinds, baseScales, life };
  }, []);

  // Initialize and reset per-instance colors when switching gyres or resetting sweep
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (clearedRatio > 0.01) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (buffers.kinds[i] === 1) {
        tempColor.copy(COLOR_AMBER);
      } else {
        tempColor.copy(i % 5 === 0 ? COLOR_BONE : COLOR_CYAN);
      }
      mesh.setColorAt(i, tempColor);
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [buffers, tempColor, gyre.id, clearedRatio]);

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dt = Math.min(rawDelta, 0.045);
    const t = state.clock.elapsedTime;
    const ptr = pointerRef.current;
    const scrollP = scrollProgressRef.current;

    const targetCamX = ptr.active ? ptr.ndcX * 0.85 : Math.sin(t * 0.14) * 0.25;
    const targetCamY = ptr.active ? ptr.ndcY * 0.45 : Math.cos(t * 0.11) * 0.15;
    const targetCamZ = 10.5 - scrollP * 2.2;

    camera.position.x += (targetCamX - camera.position.x) * 0.045;
    camera.position.y += (targetCamY - camera.position.y) * 0.045;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, -1.5);

    const pointerWorldX = ptr.ndcX * (viewport.width * 0.55);
    const pointerWorldY = ptr.ndcY * (viewport.height * 0.55);

    const speed = gyre.flowSpeed * (0.85 + scrollP * 0.35);
    const turb = gyre.turbulence;
    const fleetBoost = 1 + (fleetCount / 24) * 0.65;

    const { positions, velocities, seeds, kinds, baseScales, life } = buffers;
    let colorDirty = false;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      let px = positions[i3];
      let py = positions[i3 + 1];
      let pz = positions[i3 + 2];

      const seed = seeds[i];
      const isPlastic = kinds[i] === 1;

      const radialDist = Math.sqrt(px * px * 0.48 + py * py) + 0.001;
      const swirlX = -py / radialDist;
      const swirlY = (px * 0.55) / radialDist;

      const curlX =
        Math.sin(py * 0.42 + t * 0.55 * speed + seed * 0.05) * 0.55 * turb +
        Math.cos(pz * 0.38 - t * 0.35) * 0.25;
      const curlY =
        Math.cos(px * 0.34 - t * 0.48 * speed + seed * 0.04) * 0.45 * turb +
        Math.sin(pz * 0.44 + t * 0.3) * 0.22;
      const curlZ = Math.sin((px + py) * 0.28 + t * 0.4 + seed) * 0.24;

      const convergePull = isPlastic ? -0.14 * gyre.convergenceBias : -0.04;
      let vx = (swirlX * 0.95 + curlX + (px / radialDist) * convergePull) * speed;
      let vy = (swirlY * 0.95 + curlY + (py / radialDist) * convergePull) * speed;
      let vz = curlZ * speed;

      if (ptr.active) {
        const dx = px - pointerWorldX;
        const dy = py - pointerWorldY;
        const distSq = dx * dx + dy * dy;
        const wakeRadiusSq = 11.5;
        if (distSq < wakeRadiusSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const falloff = 1.0 - dist / Math.sqrt(wakeRadiusSq);
          const strength = falloff * falloff * 5.2;
          vx +=
            (dx / dist) * strength +
            (-dy / dist) * strength * 0.72 +
            ptr.velocityX * 14 * falloff;
          vy +=
            (dy / dist) * strength +
            (dx / dist) * strength * 0.72 -
            ptr.velocityY * 14 * falloff;
          vz += falloff * 1.4;
        }
      }

      if (sweepActive && isPlastic) {
        const intakeX = ptr.active ? pointerWorldX * 0.35 : 0;
        const intakeY = ptr.active ? pointerWorldY * 0.35 : 0;
        const toX = intakeX - px;
        const toY = intakeY - py;
        const toZ = -pz;
        const d = Math.sqrt(toX * toX + toY * toY + toZ * toZ) + 0.01;
        const pull = (4.8 * fleetBoost) / (0.65 + d * 0.28);
        vx += (toX / d) * pull + (-toY / d) * pull * 0.45;
        vy += (toY / d) * pull + (toX / d) * pull * 0.45;
        vz += (toZ / d) * pull * 0.6;

        if (d < 1.2) {
          life[i] = Math.max(0.05, life[i] - dt * 2.8);
          if (life[i] <= 0.08) {
            const a = Math.random() * Math.PI * 2;
            const r = 9.5 + Math.random() * 4.5;
            px = Math.cos(a) * r * 1.4;
            py = Math.sin(a) * r * 0.82;
            pz = (Math.random() - 0.5) * 8.0;
            life[i] = 1.0;
          }
        }
      } else if (life[i] < 1.0) {
        life[i] = Math.min(1.0, life[i] + dt * 0.9);
      }

      velocities[i3] += (vx - velocities[i3]) * 0.09;
      velocities[i3 + 1] += (vy - velocities[i3 + 1]) * 0.09;
      velocities[i3 + 2] += (vz - velocities[i3 + 2]) * 0.09;

      px += velocities[i3] * dt;
      py += velocities[i3 + 1] * dt;
      pz += velocities[i3 + 2] * dt;

      if (px > 16.5) px = -16.5;
      else if (px < -16.5) px = 16.5;
      if (py > 10.5) py = -10.5;
      else if (py < -10.5) py = 10.5;
      if (pz > 5.2) pz = -5.2;
      else if (pz < -5.2) pz = 5.2;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;

      const speedMag = Math.min(
        2.8,
        Math.sqrt(
          velocities[i3] * velocities[i3] +
            velocities[i3 + 1] * velocities[i3 + 1]
        )
      );
      const s = baseScales[i] * life[i];
      dummy.position.set(px, py, pz);
      dummy.rotation.set(0, 0, Math.atan2(velocities[i3 + 1], velocities[i3]));
      dummy.scale.set(
        isPlastic ? s * 1.15 : s * (1.2 + speedMag * 1.65),
        isPlastic ? s * 1.15 : s * 0.65,
        s
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      if (isPlastic && (sweepActive || clearedRatio > 0.02)) {
        const blend = Math.min(1, clearedRatio * 1.15 + (sweepActive ? 0.25 : 0));
        tempColor.copy(COLOR_AMBER).lerp(COLOR_EMERALD, blend);
        mesh.setColorAt(i, tempColor);
        colorDirty = true;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (colorDirty && mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        toneMapped={false}
        transparent
        opacity={0.78}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
