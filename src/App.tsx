import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GYRE_PROFILES } from './data/oceanData';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { usePointerTelemetry } from './hooks/usePointerTelemetry';
import { VideoScrollStage } from './components/stage/VideoScrollStage';
import { OceanWebGLCanvas } from './components/stage/OceanWebGLCanvas';
import { TopNavigation } from './components/hud/TopNavigation';
import { TelemetryRail } from './components/hud/TelemetryRail';
import { CrosshairReticle } from './components/hud/CrosshairReticle';
import { Chapter01Hero } from './components/chapters/Chapter01Hero';
import { Chapter02GyreSelector } from './components/chapters/Chapter02GyreSelector';
import { Chapter03InterceptorSweep } from './components/chapters/Chapter03InterceptorSweep';
import { Chapter04DroneFleet } from './components/chapters/Chapter04DroneFleet';
import { Chapter05ImpactBrief } from './components/chapters/Chapter05ImpactBrief';
import type { GyreId, SweepTelemetry } from './types/ocean';

export default function App() {
  const {
    scrollProgressRef,
    scrollProgress,
    activeChapter,
    depthMeters,
    scrollToChapter,
  } = useSmoothScroll();

  const pointerRef = usePointerTelemetry();

  const [selectedGyreId, setSelectedGyreId] = useState<GyreId>('great-pacific');
  const [fleetCount, setFleetCount] = useState<number>(12);
  const [anyVideoReady, setAnyVideoReady] = useState<boolean>(false);

  const [sweep, setSweep] = useState<SweepTelemetry>({
    isHolding: false,
    sweepCharge: 0,
    clearedRatio: 0,
    recoveredTonsPerHr: 1.92,
    fuelSavedPct: 94.2,
    completedSweeps: 0,
  });

  const isHoldingRef = useRef<boolean>(false);

  const activeGyre = useMemo(
    () =>
      GYRE_PROFILES.find((g) => g.id === selectedGyreId) ?? GYRE_PROFILES[0],
    [selectedGyreId]
  );

  // Real-time sweep extraction loop while user holds orbital dial or Spacebar
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isHoldingRef.current) {
        setSweep((prev) => {
          const speedFactor = 0.24 + (fleetCount / 24) * 0.22;
          const nextCleared = Math.min(1, prev.clearedRatio + dt * speedFactor);
          const nextCharge = Math.min(1, prev.sweepCharge + dt * 0.9);
          const baseRate = (fleetCount * 0.16) * (0.9 + activeGyre.convergenceBias * 0.45);
          const liveRecovered = baseRate * (1.25 + nextCharge * 1.45);
          const fuelSaved = Math.min(98.8, 92.4 + (fleetCount / 24) * 4.2 + nextCleared * 2.2);

          return {
            ...prev,
            isHolding: true,
            sweepCharge: nextCharge,
            clearedRatio: nextCleared,
            recoveredTonsPerHr: liveRecovered,
            fuelSavedPct: fuelSaved,
            completedSweeps:
              nextCleared >= 1 && prev.clearedRatio < 1
                ? prev.completedSweeps + 1
                : prev.completedSweeps,
          };
        });
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [fleetCount, activeGyre.convergenceBias]);

  // Keep baseline recovery rate synced with fleet slider when idle
  useEffect(() => {
    if (!isHoldingRef.current) {
      setSweep((prev) => ({
        ...prev,
        recoveredTonsPerHr:
          fleetCount * 0.16 * (0.9 + activeGyre.convergenceBias * 0.45),
        fuelSavedPct: Math.min(
          98.8,
          92.4 + (fleetCount / 24) * 4.2 + prev.clearedRatio * 2.2
        ),
      }));
    }
  }, [fleetCount, activeGyre.convergenceBias]);

  const handleHoldStart = useCallback(() => {
    isHoldingRef.current = true;
    setSweep((prev) => ({ ...prev, isHolding: true }));
  }, []);

  const handleHoldEnd = useCallback(() => {
    isHoldingRef.current = false;
    setSweep((prev) => ({ ...prev, isHolding: false, sweepCharge: 0 }));
  }, []);

  const handleResetSweep = useCallback(() => {
    isHoldingRef.current = false;
    setSweep((prev) => ({
      ...prev,
      isHolding: false,
      sweepCharge: 0,
      clearedRatio: 0,
    }));
  }, []);

  const handleSelectGyre = useCallback((id: GyreId) => {
    setSelectedGyreId(id);
    setSweep((prev) => ({
      ...prev,
      clearedRatio: 0,
      sweepCharge: 0,
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#03060A] text-[#F2F5F8]">
      {/* Fixed 100vw x 100vh multi-video scroll-scrubbed crossfade stage */}
      <VideoScrollStage
        scrollProgressRef={scrollProgressRef}
        onVideoReadyChange={setAnyVideoReady}
      />

      {/* Transparent Three.js WebGL current & 3,200-particle field + ocean wave fallback */}
      <OceanWebGLCanvas
        gyre={activeGyre}
        pointerRef={pointerRef}
        scrollProgressRef={scrollProgressRef}
        sweepActive={sweep.isHolding}
        clearedRatio={sweep.clearedRatio}
        fleetCount={fleetCount}
        showWaveFallback={!anyVideoReady}
      />

      {/* Fixed architectural HUD layers */}
      <TopNavigation
        activeChapter={activeChapter}
        scrollProgress={scrollProgress}
        activeGyre={activeGyre}
        sweepActive={sweep.isHolding}
        onSelectChapter={scrollToChapter}
      />

      <TelemetryRail
        scrollProgress={scrollProgress}
        depthMeters={depthMeters}
        activeChapter={activeChapter}
        clearedRatio={sweep.clearedRatio}
      />

      <CrosshairReticle
        pointerRef={pointerRef}
        scrollProgressRef={scrollProgressRef}
        gyre={activeGyre}
        clearedRatio={sweep.clearedRatio}
        sweepActive={sweep.isHolding}
      />

      {/* 5 Scroll-choreographed interactive editorial chapters */}
      <main className="relative z-20">
        <Chapter01Hero
          activeGyre={activeGyre}
          depthMeters={depthMeters}
          onExploreClick={() => scrollToChapter('chapter-02')}
        />

        <Chapter02GyreSelector
          activeGyre={activeGyre}
          onSelectGyre={handleSelectGyre}
        />

        <Chapter03InterceptorSweep
          activeGyre={activeGyre}
          sweep={sweep}
          fleetCount={fleetCount}
          onHoldStart={handleHoldStart}
          onHoldEnd={handleHoldEnd}
          onResetSweep={handleResetSweep}
        />

        <Chapter04DroneFleet
          fleetCount={fleetCount}
          onFleetCountChange={setFleetCount}
        />

        <Chapter05ImpactBrief
          activeGyre={activeGyre}
          fleetCount={fleetCount}
          sweep={sweep}
          onReturnTop={() => scrollToChapter('chapter-01')}
        />
      </main>
    </div>
  );
}
