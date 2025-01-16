import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const WavyGrid = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create grid shader
  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#2C1DFF") },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          
          // Calculate distance from center
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create 10-second cycle
          float cycle = mod(uTime, 10.0);
          
          // Create single pulse wave effect
          float ringPosition = cycle * 0.05;
          float ringWidth = 0.02;
          float wave = exp(-pow((dist - ringPosition) / ringWidth, 2.0));
          
          // Fade wave amplitude based on cycle for perfect loop
          float amplitude = sin(cycle * 0.628318) * 0.5;
          wave *= amplitude;
          
          // Apply wave to position
          vec3 pos = position;
          pos.z += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        
        void main() {
          // Create thinner grid lines (approximately 1px)
          float gridX = step(0.99, fract(vUv.x * 40.0));
          float gridY = step(0.99, fract(vUv.y * 40.0));
          float grid = min(gridX + gridY, 1.0);
          
          // Create stronger vignette
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float vignette = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Output color with vignette
          vec3 color = uColor * grid * vignette;
          gl_FragColor = vec4(color, grid * 0.5 * vignette);
        }
      `,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[40, 40, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        args={[shader]}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};
