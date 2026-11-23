import { useEffect } from 'react';
import type { GyreProfile, SweepTelemetry } from '../../types/ocean';

interface Chapter03InterceptorSweepProps {
  activeGyre: GyreProfile;
  sweep: SweepTelemetry;
  fleetCount: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onResetSweep: () => void;
}

export function Chapter03InterceptorSweep({
  activeGyre,
  sweep,
  fleetCount,
  onHoldStart,
  onHoldEnd,
  onResetSweep,
}: Chapter03InterceptorSweepProps) {
  // Support Spacebar hold for tactile deployment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
        e.preventDefault();
        onHoldStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        onHoldEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onHoldStart, onHoldEnd]);

  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - sweep.clearedRatio);

  const remainingDensity = Math.max(
    2.4,
    activeGyre.densityKgKm2 * (1 - sweep.clearedRatio * 0.72)
  );

  return (
    <section
      id="chapter-03"
      className="relative z-20 flex min-h-screen items-center px-5 py-24 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#22D3EE]">
              CHAPTER 03 // SUB-SURFACE MICROPLASTIC COLUMN
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-[-0.03em] text-[#F2F5F8] md:text-5xl">
              Autonomous Interceptor Sweep
            </h2>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#788492]">
            STAGE 02 // SUB-SURFACE TRANSITION (35%–70%)
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left: Tactile circular orbital dial */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <button
              type="button"
              onPointerDown={onHoldStart}
              onPointerUp={onHoldEnd}
              onPointerLeave={onHoldEnd}
              onPointerCancel={onHoldEnd}
              aria-label="Hold to deploy interceptor sweep"
              className="group relative flex h-64 w-64 select-none items-center justify-center rounded-full focus:outline-none touch-none"
            >
              <svg
                viewBox="0 0 220 220"
                className="h-full w-full -rotate-90"
                aria-hidden="true"
              >
                {/* Outer reference orbit */}
                <circle
                  cx="110"
                  cy="110"
                  r="104"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
                {/* Base progress track */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1.5"
                />
                {/* Live sweep clearance arc */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={sweep.isHolding || sweep.clearedRatio > 0.65 ? '#10B981' : '#22D3EE'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke] duration-200"
                />
              </svg>

              {/* Center orbital hub */}
              <div
                className={`absolute flex h-44 w-44 flex-col items-center justify-center rounded-full border text-center transition-all duration-300 ${
                  sweep.isHolding
                    ? 'scale-95 border-[#10B981]/80 bg-[#10B981]/10'
                    : 'border-white/15 bg-[#03060A]/75 group-hover:border-[#22D3EE]/60'
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                    sweep.isHolding ? 'text-[#10B981]' : 'text-[#22D3EE]'
                  }`}
                >
                  {sweep.isHolding
                    ? 'SWEEP ACTIVE'
                    : sweep.clearedRatio >= 0.99
                      ? 'ZONE CLEARED'
                      : 'ORBITAL TRIGGER'}
                </span>
                <span className="mt-2 px-4 font-display text-sm font-medium uppercase tracking-[0.14em] text-[#F2F5F8]">
                  HOLD TO DEPLOY INTERCEPTOR SWEEP
                </span>
                <span className="mt-2 font-mono text-[10px] tracking-[0.16em] text-[#788492]">
                  MOUSE HOLD OR [SPACE]
                </span>
              </div>
            </button>

            <div className="mt-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
              <span>CLEARED: {Math.round(sweep.clearedRatio * 100)}%</span>
              {sweep.clearedRatio > 0.05 && (
                <button
                  type="button"
                  onClick={onResetSweep}
                  className="border-b border-white/25 text-[#F2F5F8] transition-colors hover:border-[#22D3EE] hover:text-[#22D3EE]"
                >
                  RESET PLUME
                </button>
              )}
            </div>
          </div>

          {/* Right: Live extraction telemetry readout */}
          <div className="lg:col-span-7">
            <div className="hairline-panel p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-white/12 pb-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="text-[#788492]">
                  REAL-TIME VORTEX EXTRACTION // {activeGyre.name}
                </span>
                <span
                  className={
                    sweep.isHolding
                      ? 'text-[#10B981]'
                      : 'text-[#F59E0B]'
                  }
                >
                  {sweep.isHolding ? 'VACUUMING MICROPLASTICS' : 'STANDBY'}
                </span>
              </div>

              <p className="mt-5 font-display text-base font-light leading-relaxed text-[#F2F5F8]/85">
                Holding the orbital trigger engages synchronized hydro-foil
                skimmers across {fleetCount} autonomous units, drawing suspended
                amber polymer clusters into the 120 µm filtration vortex in the
                live WebGL water column.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-6 border-t border-white/12 pt-6 sm:grid-cols-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                    RECOVERED TONNAGE
                  </div>
                  <div className="mt-2 font-display text-3xl font-light text-[#10B981]">
                    {sweep.recoveredTonsPerHr.toFixed(2)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    TONS / HR ({fleetCount} UNITS)
                  </div>
                </div>

                <div className="sm:border-l sm:border-white/12 sm:pl-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                    FUEL SAVED VS TRAWLER
                  </div>
                  <div className="mt-2 font-display text-3xl font-light text-[#22D3EE]">
                    {sweep.fuelSavedPct.toFixed(1)}%
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    SOLAR-ELECTRIC DRIFT
                  </div>
                </div>

                <div className="sm:border-l sm:border-white/12 sm:pl-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                    COLUMN DENSITY
                  </div>
                  <div className="mt-2 font-display text-3xl font-light text-[#F59E0B]">
                    {remainingDensity.toFixed(1)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    KG / KM² REMAINING
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
