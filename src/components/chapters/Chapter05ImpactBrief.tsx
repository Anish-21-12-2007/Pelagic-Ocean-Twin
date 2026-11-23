import { IMPACT_METRICS } from '../../data/oceanData';
import type { GyreProfile, SweepTelemetry } from '../../types/ocean';

interface Chapter05ImpactBriefProps {
  activeGyre: GyreProfile;
  fleetCount: number;
  sweep: SweepTelemetry;
  onReturnTop: () => void;
}

const ACCENT_MAP = {
  pelagic: 'text-[#22D3EE]',
  convergence: 'text-[#F59E0B]',
  cleared: 'text-[#10B981]',
  bone: 'text-[#F2F5F8]',
} as const;

export function Chapter05ImpactBrief({
  activeGyre,
  fleetCount,
  sweep,
  onReturnTop,
}: Chapter05ImpactBriefProps) {
  return (
    <section
      id="chapter-05"
      className="relative z-20 flex min-h-screen flex-col justify-between px-5 pt-24 pb-12 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#10B981]">
              CHAPTER 05 // OCEAN CARBON &amp; MARINE IMPACT BRIEF
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-[-0.03em] text-[#F2F5F8] md:text-6xl">
              Restoring the Pelagic Carbon Pump
            </h2>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#788492]">
            ACTIVE MISSION: {activeGyre.name} · {fleetCount} UNITS
          </div>
        </div>

        {/* Swiss typographic hairline grid */}
        <div className="grid grid-cols-1 border-t border-l border-white/12 md:grid-cols-2">
          {IMPACT_METRICS.map((metric) => (
            <article
              key={metric.code}
              className="border-r border-b border-white/12 bg-[#03060A]/65 p-7 backdrop-blur-md md:p-10"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#788492]">
                <span>{metric.code}</span>
                <span>{metric.unit}</span>
              </div>

              <div
                className={`mt-5 font-display text-5xl font-light tracking-[-0.04em] md:text-6xl ${ACCENT_MAP[metric.accent]}`}
              >
                {metric.value}
              </div>

              <h3 className="mt-3 font-display text-lg font-normal text-[#F2F5F8]">
                {metric.label}
              </h3>

              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-[#788492]">
                {metric.detail}
              </p>
            </article>
          ))}
        </div>

        {/* Session telemetry summary strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-white/12 bg-[#03060A]/75 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <div className="text-[#788492]">
            SESSION SWEEP STATUS:{' '}
            <span className="text-[#10B981]">
              {Math.round(sweep.clearedRatio * 100)}% ZONE CLEARED
            </span>
          </div>
          <div className="text-[#788492]">
            THROUGHPUT:{' '}
            <span className="text-[#F2F5F8]">
              {sweep.recoveredTonsPerHr.toFixed(2)} TONS/HR
            </span>
          </div>
          <button
            type="button"
            onClick={onReturnTop}
            className="border border-white/20 px-4 py-1.5 text-[#F2F5F8] transition-colors hover:border-[#22D3EE] hover:text-[#22D3EE]"
          >
            RETURN TO SURFACE
          </button>
        </div>
      </div>

      {/* Editorial colophon footer */}
      <footer className="mx-auto mt-16 flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#788492]">
        <span>PELAGIC // DEEP-OCEAN MICROPLASTIC &amp; GYRE INTERCEPTOR</span>
        <span>COORDINATE DATUM WGS-84 · ZERO-EMISSION AUTONOMOUS FLEET</span>
      </footer>
    </section>
  );
}
