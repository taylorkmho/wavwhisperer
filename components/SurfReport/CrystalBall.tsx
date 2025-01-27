import { cn } from "@/lib/utils";

import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  Text,
} from "@react-three/drei";
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

interface SceneProps {
  poem?: string[];
}

const Scene: React.FC<SceneProps> = ({ poem }) => {
  const { size, scene } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isPointerDown = useRef(false);
  const { camera } = useThree();
  const [pointerPosition, setPointerPosition] = useState<THREE.Vector2 | null>(
    null
  );
  const resistanceOffset = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetBgColor = useRef<THREE.Color>(new THREE.Color("#000000"));
  const currentBgColor = useRef<THREE.Color>(new THREE.Color("#000000"));
  const [targetThickness, setTargetThickness] = useState(INITIAL_THICKNESS);
  const isMobile = useMemo(() => size.width < 768, [size.width]);

  const { play, pause, isPlaying } = useAudio();

  const handleReveal = useCallback(() => {
    play();
    setTargetThickness(FINAL_THICKNESS);
    targetBgColor.current = new THREE.Color("#2C1DFF");
    setIsRevealed(true);
  }, [play]);

  const handleUnreveal = useCallback(() => {
    pause();
    setTargetThickness(INITIAL_THICKNESS);
    targetBgColor.current = new THREE.Color("#000000");
    setIsRevealed(false);
  }, [pause]);

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

  // Add useEffect to set camera position only once on mount
  useEffect(() => {
    camera.position.set(0, 0, 4);
  }, [camera]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Smoothly transition background color
    currentBgColor.current.lerp(targetBgColor.current, 0.05);
    scene.background = currentBgColor.current;

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

    // Rotate the ball
    if (isRevealed) {
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
    } else {
      mesh.current.rotation.x += 0.0025;
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.z -= 0.0025;
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
      <WavyGrid />
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
        <sphereGeometry args={[1, 100, 100]} />
        <MeshTransmissionMaterial
          transmission={0.99}
          thickness={targetThickness}
          roughness={0.1}
          metalness={0}
          chromaticAberration={0.5}
          ior={1.4}
          backside={false}
        />
        {[
          { position: -0.25, scale: 0.5, form: "ring" },
          { position: -0.5, scale: 0.75, form: "ring" },
          { position: -0.125, scale: 0.25, form: "ring" },
          { position: -0.0625, scale: 0.125, form: "circle" },
        ].map((light, index) => (
          <Lightformer
            key={index}
            position={[0, 0, light.position]}
            scale={light.scale}
            form={light.form}
            color="#2C1DFF"
            intensity={1}
          />
        ))}
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
