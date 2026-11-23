import type { RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { GyreParticleField } from './GyreParticleField';
import { OceanWaveFallback } from './OceanWaveFallback';
import type { GyreProfile, PointerRefState } from '../../types/ocean';

interface OceanWebGLCanvasProps {
  gyre: GyreProfile;
  pointerRef: RefObject<PointerRefState>;
  scrollProgressRef: RefObject<number>;
  sweepActive: boolean;
  clearedRatio: number;
  fleetCount: number;
  showWaveFallback: boolean;
}

export function OceanWebGLCanvas({
  gyre,
  pointerRef,
  scrollProgressRef,
  sweepActive,
  clearedRatio,
  fleetCount,
  showWaveFallback,
}: OceanWebGLCanvasProps) {
  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none select-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10.5], fov: 46, near: 0.1, far: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <AdaptiveDpr pixelated />
        <OceanWaveFallback visible={showWaveFallback} />
        <GyreParticleField
          gyre={gyre}
          pointerRef={pointerRef}
          scrollProgressRef={scrollProgressRef}
          sweepActive={sweepActive}
          clearedRatio={clearedRatio}
          fleetCount={fleetCount}
        />
      </Canvas>
    </div>
  );
}
