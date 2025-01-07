import { Suspense, useEffect, useRef, useMemo, useState } from "react";
import {
  Environment,
  MeshTransmissionMaterial,
  Stars,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const INITIAL_THICKNESS = 40;

const DiscoBall: React.FC<{ poem?: string[] }> = ({ poem }) => {
  const { size } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const [thickness, setThickness] = useState(INITIAL_THICKNESS);
  const targetThickness = useRef(INITIAL_THICKNESS);
  const isPointerDown = useRef(false);
  const holdStartTime = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | undefined>(undefined);

  // Use fixed size instead of viewport for scale calculation
  const scale = useMemo(() => {
    const minDimension = Math.min(size.width, size.height);
    // Adjust divisor based on viewport size
    const divisor = minDimension < 768 ? 340 : 500;
    return minDimension / divisor;
  }, [size.width, size.height]);

  useFrame(({ clock }) => {
    clockRef.current = clock;
    if (isPointerDown.current && holdStartTime.current !== null) {
      const holdDuration = clock.getElapsedTime() - holdStartTime.current;
      const progress = Math.min(holdDuration / 1, 1); // 1 seconds to complete
      targetThickness.current = THREE.MathUtils.lerp(
        INITIAL_THICKNESS,
        0.025,
        progress
      );
    }

    setThickness((current) =>
      THREE.MathUtils.lerp(current, targetThickness.current, 0.1)
    );
  });

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0001;
      mesh.current.rotation.y += 0.001;
      mesh.current.rotation.z -= 0.001;
      // stop rotation if thickness is less than 0.026 and interpolate to the nearest multiple of 360
      if (thickness < 0.026) {
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
      if (targetThickness.current > 0.026) {
        // If not fully compressed
        targetThickness.current = INITIAL_THICKNESS;
      }
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.set(0, 0, 0);
    }
  }, [mesh]);

  return (
    <mesh
      ref={mesh}
      scale={scale}
      onPointerDown={() => {
        isPointerDown.current = true;
        holdStartTime.current = clockRef.current?.getElapsedTime() ?? 0;
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
      >
        {poem?.join("\n")}
      </Text>
    </mesh>
  );
};

const Scene: React.FC<{ poem?: string[] }> = ({ poem }) => {
  const { camera } = useThree();

  // Add useEffect to set camera position only once on mount
  useEffect(() => {
    camera.position.set(0, 0, 4);
  }, [camera]);

  return (
    <Suspense fallback={null}>
      <Stars
        radius={10}
        depth={500}
        count={1000}
        factor={20}
        saturation={0}
        fade
        speed={0.5}
      />
      <DiscoBall poem={poem} />
    </Suspense>
  );
};

export const CrystallBall: React.FC<{
  className?: string;
  poem?: string[];
}> = ({ className, poem }) => {
  return (
    <Canvas className={className}>
      <directionalLight position={[10, 10, 10]} intensity={5} />
      <Environment preset="night" />
      <Scene poem={poem} />
    </Canvas>
  );
};
