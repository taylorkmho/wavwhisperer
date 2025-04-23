import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAudio } from "./AudioContext";

const FFT_SIZE = 128; // Power of 2: 32, 64, 128, 256, 512, etc.
const NUM_BARS = FFT_SIZE / 2; // Will be 64 bars
const BAR_WIDTH = 0.015; // Smaller bars
const BAR_SPACING = 0.01; // Closer spacing
const MAX_HEIGHT = 1.2; // Taller maximum height
const MIN_HEIGHT = 0.1; // Taller minimum height

export const AudioWaveform = () => {
  const { isPlaying, analyserNode } = useAudio();
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Initialize data array if needed
  if (analyserNode && !dataArrayRef.current) {
    dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);
  }

  const bars = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(BAR_WIDTH, 0.1, BAR_WIDTH);
    const material = new THREE.MeshPhongMaterial({
      color: "#2C1DFF",
      transparent: true,
      opacity: 1, // Full opacity
      emissive: "#2C1DFF",
      emissiveIntensity: 1, // Maximum glow
      shininess: 100,
    });

    for (let i = 0; i < NUM_BARS; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const x = (i - NUM_BARS / 2) * (BAR_WIDTH + BAR_SPACING);
      mesh.position.set(x, 0, 0);
      meshes.push(mesh);
    }

    return meshes;
  }, []);

  useFrame(() => {
    if (!analyserNode || !dataArrayRef.current || !isPlaying) {
      // When not playing, animate bars slightly
      bars.forEach((mesh, i) => {
        const idleHeight =
          MIN_HEIGHT + Math.sin(Date.now() * 0.003 + i * 0.2) * 0.05;
        mesh.scale.y = idleHeight;
        mesh.position.y = idleHeight / 2;
      });
      return;
    }

    analyserNode.getByteFrequencyData(dataArrayRef.current);
    const data = dataArrayRef.current;

    for (let i = 0; i < NUM_BARS; i++) {
      const value = data[i];
      const height = Math.max((value / 255) * MAX_HEIGHT, MIN_HEIGHT);
      const mesh = bars[i];

      if (mesh) {
        const variance = 1 + Math.sin(Date.now() * 0.005 + i * 0.1) * 0.1;
        mesh.scale.y = height * variance;
        mesh.position.y = (height * variance) / 2;
      }
    }
  });

  return (
    <group position={[0, -0.6, 0.8]} rotation={[0.3, 0, 0]} scale={1.5}>
      {bars.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
};
