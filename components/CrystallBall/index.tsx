import { Suspense, useEffect, useRef, useState } from "react";
import { Environment } from "@react-three/drei";
import {
  Canvas,
  Vector3,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  BallCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
} from "@react-three/rapier";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface DiscoBallProps {
  anchorPosition: Vector3;
  ballPosition: Vector3;
  ropeLength: number;
}

const DiscoBall: React.FC<DiscoBallProps> = ({
  anchorPosition,
  ballPosition,
  ropeLength,
}) => {
  // const { camera } = useThree();
  const anchor = useRef<RapierRigidBody>(null);
  const meshRef = useRef<RapierRigidBody>(null);
  const { scene } = useLoader(GLTFLoader, "/models/discoball.gltf");
  useRopeJoint(
    anchor as React.RefObject<RapierRigidBody>,
    meshRef as React.RefObject<RapierRigidBody>,
    [[0, 0, 0], [0, ropeLength, 0], ropeLength]
  );

  useEffect(() => {
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      transmission: 1.8,
      thickness: 1,
      roughness: 0,
      ior: 1.8,
    });
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = glassMaterial;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (meshRef.current) {
      const velocity = meshRef.current.linvel();
      meshRef.current.setAngvel({ x: 0, y: 0.5, z: 0 }, true);
      meshRef.current.setLinvel(
        { x: velocity.x * 0.99, y: velocity.y * 0.99, z: velocity.z * 0.99 },
        true
      );
    }
  });

  return (
    <group>
      <RigidBody ref={anchor} position={anchorPosition} type="fixed" />
      <RigidBody
        ref={meshRef}
        colliders="ball"
        position={ballPosition}
        restitution={1.2}
        density={100}
      >
        <primitive object={scene} />
        <BallCollider args={[1.05]} />
      </RigidBody>
    </group>
  );
};

const Scene: React.FC = () => {
  const { camera } = useThree();
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (isMobile) {
      camera.position.set(3, 2, 7);
    } else {
      camera.position.set(0, 0, 5);
    }
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }, [camera, isMobile]);

  useEffect(() => {
    const checkViewport = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };

    checkViewport();

    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <Suspense fallback={null}>
      <DiscoBall
        ropeLength={isMobile ? 5 : 10}
        anchorPosition={isMobile ? [0, 13, 0] : [0, 20, 0]}
        ballPosition={isMobile ? [0, 2, 0] : [0, 0, 0]}
      />
    </Suspense>
  );
};

export const CrystallBall: React.FC = () => {
  return (
    <Canvas className="size-full">
      <Environment
        // preset={discoOptions.world === DiscoWorld.Night ? "night" : "warehouse"}
        preset="warehouse"
      />
      <Physics gravity={[0, -40, 0]}>
        <Scene />
      </Physics>
    </Canvas>
  );
};
