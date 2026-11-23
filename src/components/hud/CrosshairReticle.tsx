import { useEffect, useRef, type RefObject } from 'react';
import type { GyreProfile, PointerRefState } from '../../types/ocean';

interface CrosshairReticleProps {
  pointerRef: RefObject<PointerRefState>;
  scrollProgressRef: RefObject<number>;
  gyre: GyreProfile;
  clearedRatio: number;
  sweepActive: boolean;
}

export function CrosshairReticle({
  pointerRef,
  scrollProgressRef,
  gyre,
  clearedRatio,
  sweepActive,
}: CrosshairReticleProps) {
  const reticleRef = useRef<HTMLDivElement | null>(null);
  const coordsTextRef = useRef<HTMLSpanElement | null>(null);
  const depthTextRef = useRef<HTMLSpanElement | null>(null);
  const densityTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let rafId = 0;
    let smoothX = window.innerWidth * 0.5;
    let smoothY = window.innerHeight * 0.5;

    const update = () => {
      const ptr = pointerRef.current;
      const el = reticleRef.current;

      if (el) {
        if (ptr.active) {
          smoothX += (ptr.x - smoothX) * 0.24;
          smoothY += (ptr.y - smoothY) * 0.24;
          el.style.opacity = '1';
          el.style.transform = `translate3d(${smoothX.toFixed(1)}px, ${smoothY.toFixed(1)}px, 0)`;

          const lat = (gyre.latBase + ptr.ndcY * 3.8).toFixed(1);
          const lon = (gyre.lonBase - ptr.ndcX * 5.2).toFixed(1);
          const depth = Math.max(
            0,
            Math.round(scrollProgressRef.current * 1240 + (1 - ptr.ndcY) * 18)
          );
          const spatialPulse =
            1 + Math.sin(ptr.ndcX * 3.1) * 0.12 + Math.cos(ptr.ndcY * 2.4) * 0.08;
          const liveDensity = Math.max(
            2.4,
            gyre.densityKgKm2 * spatialPulse * (1 - clearedRatio * 0.72)
          ).toFixed(1);

          if (coordsTextRef.current) {
            coordsTextRef.current.textContent = `${lat}°${gyre.latHemisphere}, ${lon}°${gyre.lonHemisphere}`;
          }
          if (depthTextRef.current) {
            depthTextRef.current.textContent = `${depth}m`;
          }
          if (densityTextRef.current) {
            densityTextRef.current.textContent = `${liveDensity} kg/km²`;
          }
        } else {
          el.style.opacity = '0';
        }
      }

      rafId = window.requestAnimationFrame(update);
    };

    rafId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(rafId);
  }, [pointerRef, scrollProgressRef, gyre, clearedRatio]);

  return (
    <div
      ref={reticleRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 hidden pointer-events-none select-none transition-opacity duration-200 md:block"
      style={{ opacity: 0 }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          className={`h-7 w-7 rounded-full border transition-colors duration-200 ${
            sweepActive
              ? 'border-[#10B981]/80 scale-125'
              : 'border-[#22D3EE]/55'
          }`}
        />
        <div className="absolute left-1/2 top-[-6px] h-[10px] w-[1px] -translate-x-1/2 bg-[#F2F5F8]/60" />
        <div className="absolute left-1/2 bottom-[-6px] h-[10px] w-[1px] -translate-x-1/2 bg-[#F2F5F8]/60" />
        <div className="absolute top-1/2 left-[-6px] h-[1px] w-[10px] -translate-y-1/2 bg-[#F2F5F8]/60" />
        <div className="absolute top-1/2 right-[-6px] h-[1px] w-[10px] -translate-y-1/2 bg-[#F2F5F8]/60" />
        <div
          className={`absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            sweepActive ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
          }`}
        />
      </div>

      <div className="ml-5 -mt-2 border-l border-white/20 pl-2.5 font-mono text-[10px] leading-[1.35] tracking-[0.08em] text-[#F2F5F8]/90">
        <div className="whitespace-nowrap">
          <span ref={coordsTextRef}>{gyre.coordinatesLabel}</span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap text-[#788492]">
          <span>
            D <span ref={depthTextRef} className="text-[#22D3EE]">0m</span>
          </span>
          <span>/</span>
          <span>
            MP{' '}
            <span
              ref={densityTextRef}
              className={sweepActive ? 'text-[#10B981]' : 'text-[#F59E0B]'}
            >
              {gyre.densityKgKm2.toFixed(1)} kg/km²
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
