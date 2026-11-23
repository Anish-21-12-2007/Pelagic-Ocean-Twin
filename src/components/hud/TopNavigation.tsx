import { CHAPTER_NAV } from '../../data/oceanData';
import type { GyreProfile } from '../../types/ocean';

interface TopNavigationProps {
  activeChapter: number;
  scrollProgress: number;
  activeGyre: GyreProfile;
  sweepActive: boolean;
  onSelectChapter: (sectionId: string) => void;
}

export function TopNavigation({
  activeChapter,
  scrollProgress,
  activeGyre,
  sweepActive,
  onSelectChapter,
}: TopNavigationProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-auto">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
        <button
          type="button"
          onClick={() => onSelectChapter('chapter-01')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <span
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              sweepActive ? 'bg-[#10B981]' : 'bg-[#22D3EE]'
            }`}
          />
          <span className="font-display text-sm font-medium tracking-[0.28em] text-[#F2F5F8]">
            PELAGIC
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.18em] text-[#788492] sm:inline">
            // GYRE INTERCEPTOR
          </span>
        </button>

        <nav
          aria-label="Mission chapters"
          className="hidden items-center gap-6 md:flex"
        >
          {CHAPTER_NAV.map((item, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectChapter(item.id)}
                className={`group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? 'text-[#F2F5F8]'
                    : 'text-[#788492] hover:text-[#F2F5F8]'
                }`}
              >
                <span
                  className={
                    isActive ? 'text-[#22D3EE]' : 'text-[#788492]/70'
                  }
                >
                  {item.number}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#788492]">
          <span className="hidden text-[#F2F5F8]/80 sm:inline">
            {activeGyre.code}
          </span>
          <span className="border border-white/15 px-2 py-0.5 text-[#22D3EE]">
            {String(Math.round(scrollProgress * 100)).padStart(2, '0')}%
          </span>
        </div>
      </div>

      {/* 1px architectural scroll progress hairline */}
      <div className="h-[1px] w-full bg-white/10">
        <div
          className="h-full bg-[#22D3EE] transition-[width] duration-100 ease-out"
          style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
        />
      </div>
    </header>
  );
}
