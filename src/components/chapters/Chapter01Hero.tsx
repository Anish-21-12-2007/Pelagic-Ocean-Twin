import type { GyreProfile } from '../../types/ocean';

interface Chapter01HeroProps {
  activeGyre: GyreProfile;
  depthMeters: number;
  onExploreClick: () => void;
}

export function Chapter01Hero({
  activeGyre,
  depthMeters,
  onExploreClick,
}: Chapter01HeroProps) {
  return (
    <section
      id="chapter-01"
      className="relative z-20 flex min-h-screen flex-col justify-between px-5 pt-24 pb-10 md:px-12 lg:px-20"
    >
      {/* Top editorial metadata bar */}
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#788492]">
        <span>CHAPTER 01 // GLOBAL GYRE CRISIS</span>
        <span className="text-[#F2F5F8]/85">{activeGyre.coordinatesLabel}</span>
        <span className="hidden sm:inline">
          SURFACE CONVERGENCE TELEMETRY — LIVE
        </span>
      </div>

      {/* Oversized light-weight display title */}
      <div className="mx-auto my-auto w-full max-w-[1320px] py-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-[#22D3EE]">
          DEEP-OCEAN MICROPLASTIC &amp; GYRE INTERCEPTOR
        </p>

        <h1 className="font-display text-[clamp(4.2rem,14vw,12.5rem)] font-light leading-[0.88] tracking-[-0.045em] text-[#F2F5F8]">
          PELAGIC
        </h1>

        <div className="mt-8 grid max-w-4xl grid-cols-1 gap-6 border-t border-white/12 pt-6 md:grid-cols-12">
          <p className="font-display text-base font-light leading-relaxed text-[#F2F5F8]/85 md:col-span-7 md:text-lg">
            Autonomous solar-electric catamaran fleets engineered to intercept
            sub-5mm microplastic plumes across Earth&apos;s subtropical
            convergence gyres before vertical fragmentation reaches the
            mesopelagic zone.
          </p>

          <div className="flex flex-col justify-between gap-4 border-l border-white/12 pl-0 md:col-span-5 md:pl-6">
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                  ACTIVE GYRE MASS
                </div>
                <div className="mt-1 text-lg text-[#F59E0B]">
                  {activeGyre.plasticTonnageKt.toFixed(1)} kt
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                  SENSOR DEPTH
                </div>
                <div className="mt-1 text-lg text-[#F2F5F8]">
                  {depthMeters} m
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
              MOVE CURSOR TO DISTURB CURRENT FIELD
            </div>
          </div>
        </div>
      </div>

      {/* Minimal bottom scroll indicator */}
      <div className="mx-auto flex w-full max-w-[1320px] items-end justify-between border-t border-white/12 pt-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#788492]">
          STAGE 01 // SURFACE GYRE SWEEP (00%–35%)
        </div>

        <button
          type="button"
          onClick={onExploreClick}
          className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F2F5F8] transition-colors hover:text-[#22D3EE]"
        >
          <span>SCROLL TO DESCEND</span>
          <span className="relative block h-8 w-[1px] overflow-hidden bg-white/20">
            <span className="absolute top-0 left-0 h-3 w-full animate-pulse bg-[#22D3EE]" />
          </span>
        </button>
      </div>
    </section>
  );
}
