interface TelemetryRailProps {
  scrollProgress: number;
  depthMeters: number;
  activeChapter: number;
  clearedRatio: number;
}

export function TelemetryRail({
  scrollProgress,
  depthMeters,
  activeChapter,
  clearedRatio,
}: TelemetryRailProps) {
  const stageLabel =
    scrollProgress < 0.35
      ? '01 SURFACE'
      : scrollProgress < 0.7
        ? '02 SUB-SURFACE'
        : '03 FLEET';

  return (
    <aside
      aria-label="Live depth telemetry"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 pointer-events-none select-none lg:flex"
    >
      <div className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-[#788492]">
        <div className="text-[#F2F5F8]">{stageLabel}</div>
        <div className="mt-0.5">CH 0{activeChapter + 1} / 05</div>
      </div>

      <div className="relative h-40 w-[1px] bg-white/15">
        <div
          className="absolute top-0 left-0 w-full bg-[#22D3EE]"
          style={{ height: `${Math.max(4, scrollProgress * 100)}%` }}
        />
        <div
          className="absolute -left-[3px] h-[7px] w-[7px] rounded-full border border-[#22D3EE] bg-[#03060A]"
          style={{ top: `calc(${scrollProgress * 100}% - 3px)` }}
        />
      </div>

      <div className="text-right font-mono text-[10px] uppercase tracking-[0.18em]">
        <div className="text-[#788492]">DEPTH</div>
        <div className="text-[#F2F5F8]">
          {String(depthMeters).padStart(4, '0')} M
        </div>
        {clearedRatio > 0.01 && (
          <div className="mt-2 text-[#10B981]">
            CLR {Math.round(clearedRatio * 100)}%
          </div>
        )}
      </div>
    </aside>
  );
}
