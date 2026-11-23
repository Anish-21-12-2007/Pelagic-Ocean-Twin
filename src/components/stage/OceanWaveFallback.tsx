import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OceanWaveFallbackProps {
  visible: boolean;
}

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float w1 = sin(pos.x * 0.42 + uTime * 0.75) * cos(pos.y * 0.35 + uTime * 0.45) * 0.48;
    float w2 = sin((pos.x * 0.85 - pos.y * 0.65) + uTime * 1.15) * 0.22;
    float w3 = cos(pos.y * 1.4 - uTime * 0.9) * 0.11;
    pos.z += w1 + w2 + w3;
    vElevation = w1 + w2 + w3;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vec3 abyss = vec3(0.012, 0.024, 0.039);
    vec3 midOcean = vec3(0.024, 0.085, 0.125);
    vec3 cyanCrest = vec3(0.133, 0.827, 0.933);

    float crest = smoothstep(0.18, 0.72, vElevation);
    vec3 col = mix(abyss, midOcean, smoothstep(-0.45, 0.45, vElevation));
    col = mix(col, cyanCrest, crest * 0.26);

    float radialFade = 1.0 - smoothstep(0.25, 0.78, distance(vUv, vec2(0.5)));
    gl_FragColor = vec4(col, uOpacity * (0.55 + radialFade * 0.45));
  }
`;

export function OceanWaveFallback({ visible }: OceanWaveFallbackProps) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const opacityRef = useRef<number>(visible ? 0.92 : 0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: visible ? 0.92 : 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += Math.min(delta, 0.05);
    const target = visible ? 0.92 : 0.0;
    opacityRef.current += (target - opacityRef.current) * 0.08;
    matRef.current.uniforms.uOpacity.value = opacityRef.current;
  });

  return (
    <mesh rotation={[-Math.PI * 0.36, 0, 0]} position={[0, -2.4, -5.5]}>
      <planeGeometry args={[32, 24, 72, 56]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
