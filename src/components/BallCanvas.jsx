import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SkillBall({ color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const initialY = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Bobbing
    meshRef.current.position.y =
      initialY.current + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    // Rotation
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x += 0.003;
    // Hover scale
    const targetScale = hovered ? 1.2 : 1.0;
    meshRef.current.scale.lerp(
      { x: targetScale, y: targetScale, z: targetScale },
      0.1
    );
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.4}
          flatShading
        />
      </mesh>
      {hovered && (
        <pointLight position={[0, 0, 2]} color="#E63946" intensity={2} distance={5} />
      )}
    </group>
  );
}

export default function BallCanvas({ color }) {
  return (
    <div className="ball-canvas">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <SkillBall color={color} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
