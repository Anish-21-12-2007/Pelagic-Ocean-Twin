import { useState } from 'react';
import { DRONE_HOTSPOTS } from '../../data/oceanData';

interface Chapter04DroneFleetProps {
  fleetCount: number;
  onFleetCountChange: (count: number) => void;
}

export function Chapter04DroneFleet({
  fleetCount,
  onFleetCountChange,
}: Chapter04DroneFleetProps) {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(
    DRONE_HOTSPOTS[0].id
  );

  const activeHotspot =
    DRONE_HOTSPOTS.find((h) => h.id === selectedHotspotId) ?? DRONE_HOTSPOTS[0];

  const swathWidthKm = (fleetCount * 0.42).toFixed(2);
  const dailyRecoveryTons = (fleetCount * 3.85).toFixed(1);
  const solarOutputKw = (fleetCount * 18.4).toFixed(1);

  return (
    <section
      id="chapter-04"
      className="relative z-20 flex min-h-screen items-center px-5 py-24 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#22D3EE]">
              CHAPTER 04 // AUTONOMOUS DRONE FLEET TELEMETRY
            </p>
            <h2 className="mt-2 font-display text-3xl font-light tracking-[-0.03em] text-[#F2F5F8] md:text-5xl">
              Pelagic MK-IV Interceptor
            </h2>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#788492]">
            STAGE 03 // FLEET DEPLOYMENT (70%–100%)
          </div>
        </div>

        {/* Editorial split-screen showcase */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Hardware render with interactive hotspot callouts */}
          <div className="lg:col-span-7">
            <div className="hairline-panel p-3">
              <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                <span>HARDWARE INSPECTION // CARBON CATAMARAN HULL</span>
                <span className="text-[#22D3EE]">CLICK HOTSPOTS</span>
              </div>

              <div className="frame-vignette relative aspect-[16/9] w-full overflow-hidden border border-white/12 bg-[#03060A]">
                <img
                  src={`${import.meta.env.BASE_URL}images/drone-render.png`}
                  alt="Pelagic MK-IV autonomous solar-winged catamaran interceptor render"
                  className="h-full w-full object-cover"
                  style={{ transform: 'scale(1.07)' }}
                />

                {DRONE_HOTSPOTS.map((spot) => {
                  const isSelected = spot.id === activeHotspot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(spot.id)}
                      aria-label={`Inspect ${spot.title}`}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      style={{
                        left: `${spot.xPercent}%`,
                        top: `${spot.yPercent}%`,
                      }}
                    >
                      <span
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                          isSelected
                            ? 'scale-110 border-[#22D3EE] bg-[#22D3EE]/20'
                            : 'border-white/45 bg-[#03060A]/70 hover:border-[#22D3EE]'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? 'bg-[#22D3EE]' : 'bg-[#F2F5F8]'
                          }`}
                        />
                      </span>
                      <span
                        className={`mt-1.5 hidden whitespace-nowrap border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] sm:inline-block ${
                          isSelected
                            ? 'border-[#22D3EE]/70 bg-[#03060A]/90 text-[#F2F5F8]'
                            : 'border-white/15 bg-[#03060A]/80 text-[#788492] group-hover:text-[#F2F5F8]'
                        }`}
                      >
                        {spot.code} · {spot.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile-friendly hotspot selector tabs */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {DRONE_HOTSPOTS.map((spot) => {
                  const isSelected = spot.id === activeHotspot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedHotspotId(spot.id)}
                      className={`border px-2.5 py-2 text-left font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                        isSelected
                          ? 'border-[#22D3EE]/70 bg-[#22D3EE]/10 text-[#F2F5F8]'
                          : 'border-white/12 text-[#788492] hover:border-white/30 hover:text-[#F2F5F8]'
                      }`}
                    >
                      <div className="text-[9px] text-[#22D3EE]">{spot.code}</div>
                      <div className="mt-0.5 truncate">{spot.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Subsystem specification & fleet-size slider (1 to 24 units) */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div className="hairline-panel p-6">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="text-[#22D3EE]">{activeHotspot.code}</span>
                <span className="text-[#788492]">{activeHotspot.subsystem}</span>
              </div>

              <h3 className="mt-3 font-display text-2xl font-light text-[#F2F5F8]">
                {activeHotspot.title}
              </h3>

              <p className="mt-3 text-sm font-light leading-relaxed text-[#F2F5F8]/80">
                {activeHotspot.description}
              </p>

              <div className="mt-5 flex items-baseline justify-between border-t border-white/12 pt-4 font-mono">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#788492]">
                  {activeHotspot.metricLabel}
                </span>
                <span className="text-xl text-[#22D3EE]">
                  {activeHotspot.metricValue}
                </span>
              </div>
            </div>

            {/* Fleet size slider (1 to 24 autonomous units) */}
            <div className="hairline-panel p-6">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="fleet-size-slider"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#788492]"
                >
                  DEPLOYED FLEET SCALE
                </label>
                <div className="font-display text-3xl font-light text-[#F2F5F8]">
                  {String(fleetCount).padStart(2, '0')}{' '}
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#22D3EE]">
                    UNITS
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <input
                  id="fleet-size-slider"
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={fleetCount}
                  onChange={(e) => onFleetCountChange(Number(e.target.value))}
                  className="pelagic-slider"
                />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-[#788492]">
                  <span>01 UNIT</span>
                  <span>12 SWARM</span>
                  <span>24 FLEET</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/12 pt-4 font-mono">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[#788492]">
                    SWATH WIDTH
                  </div>
                  <div className="mt-1 text-sm text-[#F2F5F8]">
                    {swathWidthKm} km
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[#788492]">
                    DAILY INTAKE
                  </div>
                  <div className="mt-1 text-sm text-[#10B981]">
                    {dailyRecoveryTons} t
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-[#788492]">
                    SOLAR ARRAY
                  </div>
                  <div className="mt-1 text-sm text-[#22D3EE]">
                    {solarOutputKw} kW
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
