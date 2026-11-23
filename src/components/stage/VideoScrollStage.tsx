import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

interface VideoScrollStageProps {
  scrollProgressRef: RefObject<number>;
  onVideoReadyChange: (anyReady: boolean) => void;
}

const CLIPS = [
  { id: 'surface', src: '/media/clip-1-surface.mp4', label: 'Surface Gyre Sweep' },
  { id: 'subsurface', src: '/media/clip-2-subsurface.mp4', label: 'Sub-Surface Microplastic Column' },
  { id: 'interceptor', src: '/media/clip-3-interceptor.mp4', label: 'Autonomous Interceptor Fleet' },
] as const;

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function VideoScrollStage({
  scrollProgressRef,
  onVideoReadyChange,
}: VideoScrollStageProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const readyFlagsRef = useRef<boolean[]>([false, false, false]);
  const currentTimesRef = useRef<number[]>([0, 0, 0]);

  useEffect(() => {
    const notifyReady = () => {
      const anyReady = readyFlagsRef.current.some(Boolean);
      onVideoReadyChange(anyReady);
    };

    const listeners: Array<() => void> = [];

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      const markReady = () => {
        if (!readyFlagsRef.current[index]) {
          readyFlagsRef.current[index] = true;
          video.pause();
          notifyReady();
        }
      };

      if (video.readyState >= 2) {
        markReady();
      }

      video.addEventListener('loadeddata', markReady);
      video.addEventListener('canplay', markReady);

      listeners.push(() => {
        video.removeEventListener('loadeddata', markReady);
        video.removeEventListener('canplay', markReady);
      });
    });

    const updateStage = () => {
      const p = scrollProgressRef.current;

      const w1 = 1 - smoothstep(0.28, 0.39, p);
      const w2In = smoothstep(0.28, 0.39, p);
      const w2Out = 1 - smoothstep(0.64, 0.75, p);
      const w2 = w2In * w2Out;
      const w3 = smoothstep(0.64, 0.75, p);

      const weights = [w1, w2, w3];

      const localProgress = [
        clamp01(p / 0.38),
        clamp01((p - 0.3) / 0.44),
        clamp01((p - 0.65) / 0.35),
      ];

      const scales = [
        1.08 + localProgress[0] * 0.04,
        1.08 + localProgress[1] * 0.04,
        1.08 + localProgress[2] * 0.04,
      ];

      for (let i = 0; i < 3; i++) {
        const layer = layerRefs.current[i];
        const video = videoRefs.current[i];
        const opacity = weights[i];

        if (layer) {
          layer.style.opacity = opacity.toFixed(4);
          layer.style.transform = `scale(${scales[i].toFixed(4)})`;
          layer.style.visibility = opacity > 0.004 ? 'visible' : 'hidden';
        }

        if (
          video &&
          video.readyState >= 2 &&
          Number.isFinite(video.duration) &&
          video.duration > 0
        ) {
          const targetTime =
            localProgress[i] * Math.max(0.1, video.duration - 0.08);
          currentTimesRef.current[i] +=
            (targetTime - currentTimesRef.current[i]) * 0.14;

          if (
            opacity > 0.01 &&
            !video.seeking &&
            Math.abs(video.currentTime - currentTimesRef.current[i]) > 0.032
          ) {
            video.currentTime = currentTimesRef.current[i];
          }
        }
      }
    };

    gsap.ticker.add(updateStage);
    updateStage();

    return () => {
      gsap.ticker.remove(updateStage);
      listeners.forEach((cleanup) => cleanup());
    };
  }, [scrollProgressRef, onVideoReadyChange]);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-[#03060A] pointer-events-none select-none"
      aria-hidden="true"
    >
      {CLIPS.map((clip, idx) => (
        <div
          key={clip.id}
          ref={(el) => {
            layerRefs.current[idx] = el;
          }}
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: idx === 0 ? 1 : 0,
            transform: 'scale(1.08)',
          }}
        >
          <video
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={clip.src}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(3,6,10,0.18) 0%, rgba(3,6,10,0.68) 76%, rgba(3,6,10,0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,6,10,0.65) 0%, rgba(3,6,10,0.12) 28%, rgba(3,6,10,0.22) 72%, rgba(3,6,10,0.88) 100%)',
        }}
      />
    </div>
  );
}
