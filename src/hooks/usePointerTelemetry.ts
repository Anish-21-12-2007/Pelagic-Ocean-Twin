import { useEffect, useRef } from 'react';
import type { PointerRefState } from '../types/ocean';

export function usePointerTelemetry() {
  const pointerRef = useRef<PointerRefState>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 720,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 450,
    ndcX: 0,
    ndcY: 0,
    velocityX: 0,
    velocityY: 0,
    active: false,
  });

  useEffect(() => {
    let prevX = pointerRef.current.x;
    let prevY = pointerRef.current.y;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        pointerRef.current.active = false;
        return;
      }

      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      const x = e.clientX;
      const y = e.clientY;

      pointerRef.current.velocityX = (x - prevX) / w;
      pointerRef.current.velocityY = (y - prevY) / h;
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      pointerRef.current.ndcX = (x / w) * 2 - 1;
      pointerRef.current.ndcY = -(y / h) * 2 + 1;
      pointerRef.current.active = true;

      prevX = x;
      prevY = y;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.velocityX = 0;
      pointerRef.current.velocityY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return pointerRef;
}
