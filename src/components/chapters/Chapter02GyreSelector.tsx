import { GYRE_PROFILES } from '../../data/oceanData';
import type { GyreId, GyreProfile } from '../../types/ocean';

interface Chapter02GyreSelectorProps {
  activeGyre: GyreProfile;
  onSelectGyre: (id: GyreId) => void;
}

export function Chapter02GyreSelector({
  activeGyre,
  onSelectGyre,
}: Chapter02GyreSelectorProps) {
  return (
    <section
      id="chapter-02"
      className="relative z-20 flex min-h-screen items-center px-5 py-24 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#22D3EE]">
              CHAPTER 02 // INTERACTIVE GYRE SELECTOR
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-[-0.03em] text-[#F2F5F8] md:text-5xl">
              Subtropical Convergence Zones
            </h2>
          </div>
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-[#788492]">
            SELECT A BASIN TO RECALCULATE WEBGL CURL-NOISE CURRENT VELOCITY,
            CONVERGENCE BIAS, AND ACCUMULATED MICROPLASTIC TONNAGE.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column: Architectural gyre selector rows */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div className="divide-y divide-white/12 border-t border-b border-white/12">
              {GYRE_PROFILES.map((gyre) => {
                const selected = gyre.id === activeGyre.id;
                return (
                  <button
                    key={gyre.id}
                    type="button"
                    onClick={() => onSelectGyre(gyre.id)}
                    className={`group flex w-full flex-col gap-2 py-5 text-left transition-colors ${
                      selected
                        ? 'bg-white/[0.04] px-4'
                        : 'px-2 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span
                        className={
                          selected ? 'text-[#22D3EE]' : 'text-[#788492]'
                        }
                      >
                        {gyre.code}
                      </span>
                      <span
                        className={
                          selected ? 'text-[#F59E0B]' : 'text-[#788492]'
                        }
                      >
                        {gyre.plasticTonnageKt.toFixed(1)} KT
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`font-display text-xl font-light tracking-[-0.02em] transition-colors md:text-2xl ${
                          selected
                            ? 'text-[#F2F5F8]'
                            : 'text-[#F2F5F8]/65 group-hover:text-[#F2F5F8]'
                        }`}
                      >
                        {gyre.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#788492]">
                        {gyre.coordinatesLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active basin telemetry dossier */}
            <div className="hairline-panel mt-6 p-5">
              <p className="text-sm font-light leading-relaxed text-[#F2F5F8]/85">
                {activeGyre.editorialBrief}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/12 pt-4 font-mono">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    DENSITY
                  </div>
                  <div className="mt-1 text-base text-[#F59E0B]">
                    {activeGyre.densityKgKm2.toFixed(1)}{' '}
                    <span className="text-[10px] text-[#788492]">kg/km²</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    FLOW VEL
                  </div>
                  <div className="mt-1 text-base text-[#22D3EE]">
                    {activeGyre.flowSpeed.toFixed(2)}x
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                    DEPTH BAND
                  </div>
                  <div className="mt-1 text-base text-[#F2F5F8]">
                    {activeGyre.meanDepthBandM}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Bathymetry & convergence map in architectural inspection frame */}
          <div className="lg:col-span-7">
            <div className="hairline-panel relative overflow-hidden p-3">
              <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                <span>BATHYMETRIC VECTOR STREAMLINES // {activeGyre.basin}</span>
                <span className="text-[#F59E0B]">
                  AREA {activeGyre.convergenceAreaMKm2.toFixed(2)}M KM²
                </span>
              </div>

              <div className="frame-vignette relative aspect-[16/9] w-full overflow-hidden border border-white/12 bg-[#03060A]">
                <img
                  src={`${import.meta.env.BASE_URL}images/gyre-map.png`}
                  alt="Bathymetry and subtropical gyre current vector convergence map"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out"
                  style={{
                    transform: 'scale(1.07)',
                  }}
                />

                {/* Architectural coordinate grid overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '25% 25%',
                  }}
                />

                {/* Dynamic convergence focus beacon */}
                <div
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                  style={{
                    left: `${activeGyre.mapFocusX}%`,
                    top: `${activeGyre.mapFocusY}%`,
                  }}
                >
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full border border-[#F59E0B]/50" />
                    <span className="h-8 w-8 rounded-full border border-[#F59E0B]/90" />
                    <span className="absolute h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  </div>
                  <div className="mt-1 whitespace-nowrap bg-[#03060A]/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-[#F2F5F8] border border-white/15">
                    {activeGyre.coordinatesLabel}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
                <span>DOMINANT POLYMER: {activeGyre.dominantPolymer}</span>
                <span className="text-[#22D3EE]">
                  EKMAN CONVERGENCE INDEX {(activeGyre.convergenceBias * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
