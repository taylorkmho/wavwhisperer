import { cn } from "@/lib/utils";
import {
  Environment,
  MeshTransmissionMaterial,
  Stars,
  Text,
} from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const INITIAL_THICKNESS = 4;
const FINAL_THICKNESS = 0.025;
const HOLD_DURATION_SECONDS = 2;
const FLOAT_SPEED = 0.25;
const FLOAT_HEIGHT = 0.1;

interface SceneProps {
  poem?: string[];
}

const Scene: React.FC<SceneProps> = ({ poem }) => {
  const { size } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const [thickness, setThickness] = useState(INITIAL_THICKNESS);
  const targetThickness = useRef(INITIAL_THICKNESS);
  const isPointerDown = useRef(false);
  const holdStartTime = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | undefined>(undefined);
  const { camera } = useThree();
  const [pointerPosition, setPointerPosition] = useState<THREE.Vector2 | null>(
    null
  );
  const lastPointerPosition = useRef<THREE.Vector2 | null>(null);
  const resistanceOffset = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isMobile = useMemo(() => size.width < 768, [size.width]);

  // Add push resistance calculation
  const pushResistance = useMemo(() => {
    return isMobile ? 0.2 : 0.1;
  }, [isMobile]);

  // Add useEffect to set camera position only once on mount
  useEffect(() => {
    camera.position.set(0, 0, 4);
  }, [camera]);

  // Use fixed size instead of viewport for scale calculation
  const scale = useMemo(() => {
    // Base scale calculations using both width and height
    const widthScale = size.width / 280;
    const heightScale = size.height / 280;
    const baseScale = Math.min(widthScale, heightScale);

    // Adjusted parameters for mobile vs desktop
    const maxScale = 2.2; // Same for both
    const minScale = isMobile ? 1.6 : 1.8;
    const minInset = isMobile ? 40 : 100;

    // Calculate scale with inset constraints
    const insetScale = (size.width - minInset * 2) / 280;

    // Apply a multiplier to width-based scales to maintain roundness
    const widthMultiplier = isMobile ? 1.2 : 1.0;
    const adjustedInsetScale = insetScale * widthMultiplier;

    // Return the constrained scale value
    return Math.max(
      minScale,
      Math.min(baseScale * widthMultiplier, adjustedInsetScale, maxScale)
    );
  }, [size.width, size.height, isMobile]);

  useFrame(({ clock }) => {
    clockRef.current = clock;
    if (isPointerDown.current && holdStartTime.current !== null) {
      if (isMobile) {
        // On mobile, immediately toggle to final thickness
        targetThickness.current =
          targetThickness.current === INITIAL_THICKNESS
            ? FINAL_THICKNESS
            : INITIAL_THICKNESS;
        // Reset hold start time to prevent multiple toggles
        holdStartTime.current = null;
      } else {
        // On desktop, keep the hold behavior
        const holdDuration = clock.getElapsedTime() - holdStartTime.current;
        const progress = Math.min(holdDuration / HOLD_DURATION_SECONDS, 1);
        targetThickness.current = THREE.MathUtils.lerp(
          INITIAL_THICKNESS,
          FINAL_THICKNESS,
          progress
        );
      }
    }

    setThickness((current) =>
      THREE.MathUtils.lerp(current, targetThickness.current, 0.1)
    );
  });

  useFrame((state) => {
    if (mesh.current) {
      if (isPointerDown.current && pointerPosition) {
        // Replace mouse.x/y with pointer.x/y
        const pointer = state.pointer;
        // Calculate resistance effect
        const targetOffset = new THREE.Vector3(
          (pointer.x - pointerPosition.x) * pushResistance,
          (pointer.y - pointerPosition.y) * pushResistance,
          -pushResistance // Update z-axis movement
        );

        // Apply spring-like behavior
        resistanceOffset.current.lerp(targetOffset, 0.1);
        mesh.current.position.copy(resistanceOffset.current);
      } else {
        // Only float if thickness is not at final value
        if (thickness > FINAL_THICKNESS + 0.01) {
          const time = state.clock.getElapsedTime();
          const floatY = Math.sin(time * FLOAT_SPEED) * FLOAT_HEIGHT;
          resistanceOffset.current.lerp(new THREE.Vector3(0, floatY, 0), 0.1);
        } else {
          // Return to center position when "tapped"
          resistanceOffset.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }
        mesh.current.position.copy(resistanceOffset.current);
      }

      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.z -= 0.005;
      // stop rotation if thickness is less than 0.026 and interpolate to the nearest multiple of 360
      if (thickness < FINAL_THICKNESS + 0.01) {
        mesh.current.rotation.y = THREE.MathUtils.lerp(
          mesh.current.rotation.y,
          THREE.MathUtils.degToRad(
            Math.round(
              THREE.MathUtils.radToDeg(mesh.current.rotation.y) / 360
            ) * 360
          ),
          0.1
        );
        mesh.current.rotation.x = THREE.MathUtils.lerp(
          mesh.current.rotation.x,
          THREE.MathUtils.degToRad(
            Math.round(
              THREE.MathUtils.radToDeg(mesh.current.rotation.x) / 360
            ) * 360
          ),
          0.1
        );
        mesh.current.rotation.z = THREE.MathUtils.lerp(
          mesh.current.rotation.z,
          THREE.MathUtils.degToRad(
            Math.round(
              THREE.MathUtils.radToDeg(mesh.current.rotation.z) / 360
            ) * 360
          ),
          0.1
        );
      }
    }
  });

  useEffect(() => {
    const handlePointerUp = () => {
      isPointerDown.current = false;
      holdStartTime.current = null;
      if (targetThickness.current > FINAL_THICKNESS + 0.01) {
        targetThickness.current = INITIAL_THICKNESS;
      }
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.set(0, 0, 0);
    }
  }, [mesh]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isPointerDown.current = true;
    holdStartTime.current = clockRef.current?.getElapsedTime() ?? 0;
    setPointerPosition(new THREE.Vector2(e.point.x, e.point.y));
  };

  return (
    <Suspense fallback={null}>
      <Stars
        radius={10}
        depth={250}
        count={1000}
        factor={5}
        saturation={0}
        speed={0.5}
        fade
      />
      <mesh
        ref={mesh}
        scale={scale}
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => {
          if (isPointerDown.current) {
            lastPointerPosition.current = pointerPosition;
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
          transmission={1}
          thickness={thickness}
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
