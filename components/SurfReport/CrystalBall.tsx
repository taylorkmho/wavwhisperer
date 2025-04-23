import { cn } from "@/lib/utils";

import { Environment, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useAudio } from "./AudioContext";
import { WavyGrid } from "./WavyGrid";

const INITIAL_THICKNESS = 4;
const FINAL_THICKNESS = 0.025;
const DEFORM_STRENGTH = 0.0025; // Slightly increased for more wave motion
const SMOOTH_FACTOR = 0.085; // Slightly smoother transitions
const WAVE_SPEED = 0.005; // Increased for more wave movement
const RIPPLE_SCALE = 3.2; // Larger waves

interface SceneProps {
  poem?: string[];
}

const Scene: React.FC<SceneProps> = ({ poem }) => {
  const { size, scene } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.SphereGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isPointerDown = useRef(false);
  const { camera } = useThree();
  const [pointerPosition, setPointerPosition] = useState<THREE.Vector2 | null>(
    null
  );
  const resistanceOffset = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetBgColor = useRef<THREE.Color>(new THREE.Color("#000000"));
  const currentBgColor = useRef<THREE.Color>(new THREE.Color("#000000"));
  const [targetThickness, setTargetThickness] = useState(INITIAL_THICKNESS);
  const currentThickness = useRef(INITIAL_THICKNESS);
  const isMobile = useMemo(() => size.width < 768, [size.width]);
  const materialRef =
    useRef<JSX.IntrinsicElements["meshTransmissionMaterial"]>(null);

  const { play, pause, isPlaying, analyserNode } = useAudio();
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Initialize geometry and audio on mount
  useEffect(() => {
    if (sphereRef.current && !originalPositions.current) {
      originalPositions.current = new Float32Array(
        sphereRef.current.attributes.position.array
      );
    }
    if (analyserNode) {
      analyserNode.fftSize = 64;
      analyserNode.smoothingTimeConstant = 0.6;
    }
    setIsInitialized(true);
  }, [analyserNode]);

  // Set initial camera position and scene color
  useEffect(() => {
    camera.position.set(0, 0, 4);
    scene.background = currentBgColor.current;
  }, [camera, scene]);

  const handleReveal = useCallback(() => {
    if (!isInitialized) return;
    play();
    setTargetThickness(FINAL_THICKNESS);
    targetBgColor.current = new THREE.Color("#2C1DFF");
    setIsRevealed(true);
  }, [play, isInitialized]);

  const handleUnreveal = useCallback(() => {
    if (!isInitialized) return;
    pause();
    setTargetThickness(INITIAL_THICKNESS);
    targetBgColor.current = new THREE.Color("#000000");
    setIsRevealed(false);
  }, [pause, isInitialized]);

  // Initialize audio analyzer
  useEffect(() => {
    if (analyserNode && !dataArrayRef.current) {
      analyserNode.fftSize = 64; // Smaller FFT size for broader frequency bands
      analyserNode.smoothingTimeConstant = 0.6;
      dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);
    }
  }, [analyserNode]);

  // Store original vertex positions
  useEffect(() => {
    if (sphereRef.current && !originalPositions.current) {
      originalPositions.current = new Float32Array(
        sphereRef.current.attributes.position.array
      );
    }
  }, []);

  // Add push resistance calculation
  const pushResistance = useMemo(() => {
    return isMobile ? 0.2 : 0.1;
  }, [isMobile]);

  // Calculate scale based on screen size
  const scale = useMemo(() => {
    const widthScale = size.width / 280;
    const heightScale = size.height / 280;
    const baseScale = Math.min(widthScale, heightScale);

    const maxScale = 2.2;
    const minScale = isMobile ? 1.6 : 1.8;
    const minInset = isMobile ? 40 : 100;

    const insetScale = (size.width - minInset * 2) / 280;

    const widthMultiplier = isMobile ? 1.2 : 1.0;
    const adjustedInsetScale = insetScale * widthMultiplier;

    return Math.max(
      minScale,
      Math.min(baseScale * widthMultiplier, adjustedInsetScale, maxScale)
    );
  }, [size.width, size.height, isMobile]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Handle rotation based on revealed state
    if (isRevealed) {
      // Lerp to zero rotation when revealed
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        THREE.MathUtils.degToRad(
          Math.round(THREE.MathUtils.radToDeg(mesh.current.rotation.y) / 360) *
            360
        ),
        0.1
      );
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        THREE.MathUtils.degToRad(
          Math.round(THREE.MathUtils.radToDeg(mesh.current.rotation.x) / 360) *
            360
        ),
        0.1
      );
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        THREE.MathUtils.degToRad(
          Math.round(THREE.MathUtils.radToDeg(mesh.current.rotation.z) / 360) *
            360
        ),
        0.1
      );

      // Smoothly transition thickness when revealed
      if (materialRef.current) {
        currentThickness.current = THREE.MathUtils.lerp(
          currentThickness.current,
          targetThickness,
          0.1
        );
        materialRef.current.thickness = currentThickness.current;
      }
    } else {
      // Continue constant rotation when not revealed
      mesh.current.rotation.x += 0.0025;
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.z -= 0.0025;

      // Smoothly transition thickness when not revealed
      if (materialRef.current) {
        currentThickness.current = THREE.MathUtils.lerp(
          currentThickness.current,
          targetThickness,
          0.1
        );
        materialRef.current.thickness = currentThickness.current;
      }
    }

    // Rest of the frame updates for deformation etc.
    if (!sphereRef.current || !originalPositions.current) return;

    // Smoothly transition background color
    currentBgColor.current.lerp(targetBgColor.current, 0.05);
    scene.background = currentBgColor.current;

    // Audio-reactive deformation
    if (isPlaying && analyserNode && dataArrayRef.current) {
      analyserNode.getByteFrequencyData(dataArrayRef.current);
      const data = dataArrayRef.current;
      const positions = sphereRef.current.attributes.position
        .array as Float32Array;
      const originalPos = originalPositions.current;

      // Calculate average amplitude for material effects
      let totalAmplitude = 0;

      // Deform the sphere based on audio data
      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPos[i];
        const originalY = originalPos[i + 1];
        const originalZ = originalPos[i + 2];

        // Calculate spherical coordinates for better wave patterns
        const radius = Math.sqrt(
          originalX * originalX + originalY * originalY + originalZ * originalZ
        );
        const theta = Math.atan2(originalY, originalX);
        const phi = Math.acos(originalZ / radius);

        // Create wave patterns based on audio
        let waveValue = 0;
        const numWaves = 4;

        for (let w = 0; w < numWaves; w++) {
          const freqIndex = Math.floor((w / numWaves) * data.length);
          const amplitude = data[freqIndex] / 255.0;

          // Enhanced wave pattern
          const wave =
            Math.sin(
              theta * RIPPLE_SCALE +
                phi * RIPPLE_SCALE +
                Date.now() * WAVE_SPEED * (w + 1.2) // Slightly faster for higher frequencies
            ) *
            amplitude *
            (1.15 + amplitude); // Increased wave amplitude

          waveValue += wave * (1.15 - w / numWaves); // More emphasis on wave patterns
        }

        waveValue /= numWaves * 0.85; // Stronger wave effect
        totalAmplitude += Math.abs(waveValue);

        // Calculate wave-like deformation with more movement
        const deformAmount =
          waveValue * DEFORM_STRENGTH * (1 + Math.abs(waveValue));
        const direction = new THREE.Vector3(
          originalX,
          originalY,
          originalZ
        ).normalize();

        // Enhanced circular motion
        const time = Date.now() * WAVE_SPEED;
        const motionScale = 0.007 * (1 + Math.abs(waveValue));
        const circularMotion = new THREE.Vector3(
          Math.sin(theta + time * 1.2) * motionScale,
          Math.cos(phi + time) * motionScale,
          Math.sin(theta + phi + time * 0.8) * motionScale
        );

        // Apply smooth wave deformation
        positions[i] = THREE.MathUtils.lerp(
          positions[i],
          originalX + direction.x * deformAmount + circularMotion.x,
          SMOOTH_FACTOR
        );
        positions[i + 1] = THREE.MathUtils.lerp(
          positions[i + 1],
          originalY + direction.y * deformAmount + circularMotion.y,
          SMOOTH_FACTOR
        );
        positions[i + 2] = THREE.MathUtils.lerp(
          positions[i + 2],
          originalZ + direction.z * deformAmount + circularMotion.z,
          SMOOTH_FACTOR
        );
      }

      // Update geometry
      sphereRef.current.attributes.position.needsUpdate = true;

      // Update material properties with balanced changes
      if (materialRef.current) {
        const avgAmplitude = totalAmplitude / (data.length * 3);
        const currentThickness =
          materialRef.current.thickness ?? targetThickness;
        materialRef.current.thickness = THREE.MathUtils.lerp(
          currentThickness,
          targetThickness * (1 + avgAmplitude * 0.1), // Moderate variation
          0.1 // Slower lerp for smoother transition
        );
        materialRef.current.chromaticAberration = THREE.MathUtils.lerp(
          0.5,
          0.5 * (1 + avgAmplitude * 0.2), // Moderate variation
          0.5 // Balanced response speed
        );
      }
    } else {
      // Reset to original shape when not playing
      const positions = sphereRef.current.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = THREE.MathUtils.lerp(
          positions[i],
          originalPositions.current[i],
          SMOOTH_FACTOR
        );
      }
      sphereRef.current.attributes.position.needsUpdate = true;

      // Lerp thickness back to initial value when not playing
      if (materialRef.current) {
        const currentThickness =
          materialRef.current.thickness ?? targetThickness;
        materialRef.current.thickness = THREE.MathUtils.lerp(
          currentThickness,
          targetThickness,
          0.1 // Same lerp speed for consistency
        );
      }
    }

    // Add resistance effect
    if (isPointerDown.current && pointerPosition) {
      const pointer = state.pointer;

      const targetOffset = new THREE.Vector3(
        (pointer.x - pointerPosition.x) * pushResistance,
        (pointer.y - pointerPosition.y) * pushResistance,
        -pushResistance
      );

      resistanceOffset.current.lerp(targetOffset, 0.1);
      mesh.current.position.copy(resistanceOffset.current);
    } else {
      resistanceOffset.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      mesh.current.position.copy(resistanceOffset.current);
    }
  });

  useEffect(() => {
    if (isPlaying) {
      handleReveal();
    } else {
      handleUnreveal();
    }
  }, [isPlaying, handleReveal, handleUnreveal]);

  useEffect(() => {
    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isInitialized) return;
    isPointerDown.current = true;
    setPointerPosition(new THREE.Vector2(e.point.x, e.point.y));

    if (isRevealed) {
      handleUnreveal();
    } else {
      handleReveal();
    }
  };

  return (
    <Suspense fallback={null}>
      <WavyGrid animate={!isMobile} />
      <mesh
        ref={mesh}
        scale={scale}
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => {
          if (isPointerDown.current) {
            setPointerPosition(new THREE.Vector2(e.point.x, e.point.y));
          }
        }}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry ref={sphereRef} args={[1, 100, 100]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          transmission={0.99}
          thickness={targetThickness}
          roughness={0.1}
          metalness={0}
          chromaticAberration={0.5}
          ior={1.4}
          backside={false}
        />
        <Text
          position={[0, 0, 0]}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          fontSize={0.08}
          textAlign="center"
          maxWidth={1.95}
          lineHeight={1.5}
        >
          {poem?.join("\n")}
        </Text>
      </mesh>
    </Suspense>
  );
};

export const CrystalBall: React.FC<{
  className?: string;
  poem?: string[];
}> = ({ className, poem }) => {
  return (
    <Canvas className={cn("select-none", className)}>
      <directionalLight position={[10, 10, 10]} intensity={5} />
      <Environment preset="night" />
      <Scene poem={poem} />
    </Canvas>
  );
};
