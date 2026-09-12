import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshReflectorMaterial, Stars as StarsDrei } from '@react-three/drei';
import * as THREE from 'three';

function Road() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a continuous motion effect
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const t = state.clock.getElapsedTime();
      // Animate the texture offset to simulate moving down the road
      (meshRef.current.material as any).userData = (meshRef.current.material as any).userData || {};
      (meshRef.current.material as any).userData.offset = (t * 0.5) % 1;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -10]}>
      {/* Main Road Surface */}
      <mesh ref={meshRef} receiveShadow>
        <planeGeometry args={[20, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={256}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.5}
          mirror={1}
        />
      </mesh>

      {/* Center Line Glow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.2, 100]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={0.8} />
      </mesh>

      {/* Side Lines Glow */}
      <mesh position={[-4, 0, 0.01]}>
        <planeGeometry args={[0.1, 100]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[4, 0, 0.01]}>
        <planeGeometry args={[0.1, 100]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[100, 50, 0x00f2ff, 0x101010]} 
      position={[0, -2.1, -10]} 
      rotation={[0, 0, 0]}
    />
  );
}

export default function Hero3D() {
  return (
    <div className="h-full w-full bg-[#050505]">
      <Canvas dpr={1}>
        <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={50} />
        
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 50]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, 10, 10]} intensity={0.5} color="#4f46e5" />

        <Road />
        <Grid />
        
        <StarsDrei 
          radius={100} 
          depth={50} 
          count={2000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.5} 
        />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[0, 3, -5]}>
            {/* Ambient floating elements could go here */}
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
