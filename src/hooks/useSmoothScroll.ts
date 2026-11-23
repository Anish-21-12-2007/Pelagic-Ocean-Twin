import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollController {
  scrollProgressRef: RefObject<number>;
  scrollProgress: number;
  activeChapter: number;
  depthMeters: number;
  scrollToChapter: (sectionId: string) => void;
}

export function useSmoothScroll(): SmoothScrollController {
  const scrollProgressRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeChapter, setActiveChapter] = useState<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let lastUiUpdate = 0;

    const handleScroll = () => {
      ScrollTrigger.update();

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      scrollProgressRef.current = progress;

      const now = performance.now();
      if (now - lastUiUpdate > 50) {
        lastUiUpdate = now;
        setScrollProgress(progress);

        if (progress < 0.18) setActiveChapter(0);
        else if (progress < 0.4) setActiveChapter(1);
        else if (progress < 0.64) setActiveChapter(2);
        else if (progress < 0.85) setActiveChapter(3);
        else setActiveChapter(4);
      }
    };

    lenis.on('scroll', handleScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    handleScroll();

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToChapter = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.35 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const depthMeters = Math.round(scrollProgress * 1240);

  return {
    scrollProgressRef,
    scrollProgress,
    activeChapter,
    depthMeters,
    scrollToChapter,
  };
}
