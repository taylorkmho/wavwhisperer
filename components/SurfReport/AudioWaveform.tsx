import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useAudio } from "./AudioContext";

const NUM_BARS = 32;
const BAR_WIDTH = 0.025;
const MAX_HEIGHT = 2.2; // Dramatically increased max height
const MIN_HEIGHT = 0.08; // Slightly lower minimum for more contrast
const CIRCLE_RADIUS = 1.5;
const FREQ_START = 1;
const FREQ_END = 40;
const SMOOTHING = 0.4; // Reduced smoothing for snappier response

export const AudioWaveform = () => {
  const { isPlaying, analyserNode } = useAudio();
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const prevHeightsRef = useRef<number[]>([]);

  // Initialize data array if needed
  if (analyserNode && !dataArrayRef.current) {
    analyserNode.smoothingTimeConstant = 0.4; // Reduced smoothing
    analyserNode.minDecibels = -75; // Increased range
    analyserNode.maxDecibels = -5; // Increased peak sensitivity
    dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);
    prevHeightsRef.current = new Array(NUM_BARS).fill(MIN_HEIGHT);
  }

  const bars = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    const geometry = new THREE.BoxGeometry(BAR_WIDTH, 0.1, BAR_WIDTH);
    const material = new THREE.MeshPhongMaterial({
      color: "#fff",
      transparent: true,
      opacity: 1,
      emissive: "#fff",
      emissiveIntensity: 1,
      shininess: 100,
    });

    for (let i = 0; i < NUM_BARS; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      const angle = (i / NUM_BARS) * Math.PI * 2;
      const x = Math.cos(angle) * CIRCLE_RADIUS;
      const z = Math.sin(angle) * CIRCLE_RADIUS;
      mesh.position.set(x, 0, z);
      mesh.rotation.y = angle + Math.PI / 2;
      meshes.push(mesh);
    }

    return meshes;
  }, []);

  useFrame(() => {
    if (!analyserNode || !dataArrayRef.current || !isPlaying) {
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
      const mesh = bars[i];
      if (!mesh) continue;

      // Exponential frequency distribution
      const freqIndex = Math.floor(
        FREQ_START + Math.pow(i / NUM_BARS, 2.2) * (FREQ_END - FREQ_START)
      );

      // Enhanced frequency averaging with weighted distribution
      let value = 0;
      let totalWeight = 0;
      const range = 2;

      for (let j = -range; j <= range; j++) {
        const weight = 1 - Math.abs(j) / (range + 1);
        const index = Math.max(0, Math.min(freqIndex + j, data.length - 1));
        value += data[index] * weight;
        totalWeight += weight;
      }
      value = (value / totalWeight) * 1.4; // Increased boost

      // More aggressive non-linear scaling for dramatic jumps
      const normalizedValue = Math.pow(value / 255, 1.1); // Less aggressive curve
      const amplifiedValue = Math.pow(normalizedValue * 1.2, 1.15); // Amplify mid-high values
      const targetHeight = Math.max(amplifiedValue * MAX_HEIGHT, MIN_HEIGHT);

      const currentHeight = prevHeightsRef.current[i] || MIN_HEIGHT;
      let newHeight =
        currentHeight * SMOOTHING + targetHeight * (1 - SMOOTHING);

      // Add extra boost for sudden peaks
      if (targetHeight > currentHeight * 1.5) {
        newHeight *= 1.2; // Extra boost for sudden jumps
      }

      // Dynamic variance based on frequency and amplitude
      const variance =
        1 +
        Math.sin(Date.now() * 0.005 + i * 0.1) *
          (0.05 + (i / NUM_BARS) * 0.15 + normalizedValue * 0.1);

      const finalHeight = newHeight * variance;
      mesh.scale.y = finalHeight;
      mesh.position.y = finalHeight / 2;

      prevHeightsRef.current[i] = newHeight;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.6, 0.8]}
      rotation={[0.3, 0, 0]}
      scale={1.5}
    >
      {bars.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
    </group>
  );
};
