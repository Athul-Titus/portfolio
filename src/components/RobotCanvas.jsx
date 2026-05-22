import { useRef, useMemo, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   Stylized Developer Workstation
   A premium 3D desk scene built from primitives,
   inspired by the ladunjexa desktop_pc style.
   ───────────────────────────────────────────── */

/* ─── Monitor ─── */
function Monitor({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Screen bezel */}
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[2.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Screen face (emissive) */}
      <mesh position={[0, 1.55, 0.045]}>
        <planeGeometry args={[1.95, 1.15]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#1a2d50"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Code lines on screen */}
      {[0.35, 0.2, 0.05, -0.1, -0.25, -0.4].map((y, i) => (
        <mesh key={i} position={[-0.3 + (i % 3) * 0.15, 1.55 + y, 0.05]}>
          <planeGeometry args={[0.5 + Math.random() * 0.6, 0.04]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#E63946' : i % 3 === 1 ? '#4fc1ff' : '#69db7c'}
            emissive={i % 3 === 0 ? '#E63946' : i % 3 === 1 ? '#4fc1ff' : '#69db7c'}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      {/* Monitor stand neck */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Monitor stand base */}
      <mesh position={[0, 0.35, 0.05]}>
        <boxGeometry args={[0.6, 0.04, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Keyboard ─── */
function Keyboard({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0.6]}>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Key rows */}
      {[-0.12, -0.02, 0.08].map((z, row) =>
        Array.from({ length: 10 }, (_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.4 + col * 0.09, 0.41, 0.52 + z]}
          >
            <boxGeometry args={[0.06, 0.015, 0.06]} />
            <meshStandardMaterial
              color={row === 1 && col === 4 ? '#E63946' : '#2a2a2a'}
              emissive={row === 1 && col === 4 ? '#E63946' : '#000000'}
              emissiveIntensity={row === 1 && col === 4 ? 0.5 : 0}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ─── Mouse ─── */
function Mouse({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0.85, 0.39, 0.65]}>
        <boxGeometry args={[0.15, 0.04, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0.85, 0.42, 0.62]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
        <meshStandardMaterial color="#E63946" emissive="#E63946" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Coffee Mug ─── */
function CoffeeMug({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[-1.1, 0.48, 0.5]}>
        <cylinderGeometry args={[0.09, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#E63946" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Coffee surface */}
      <mesh position={[-1.1, 0.56, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.075, 16]} />
        <meshStandardMaterial color="#3d1f0f" />
      </mesh>
      {/* Handle */}
      <mesh position={[-1.22, 0.48, 0.5]}>
        <torusGeometry args={[0.05, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#E63946" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Desk ─── */
function Desk({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Desk surface */}
      <mesh position={[0, 0.32, 0.4]}>
        <boxGeometry args={[3.2, 0.06, 1.4]} />
        <meshStandardMaterial color="#1c1108" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Front edge accent */}
      <mesh position={[0, 0.32, 1.09]}>
        <boxGeometry args={[3.2, 0.06, 0.02]} />
        <meshStandardMaterial color="#E63946" emissive="#E63946" emissiveIntensity={0.3} />
      </mesh>
      {/* Legs */}
      {[
        [-1.45, -0.45, -0.1],
        [1.45, -0.45, -0.1],
        [-1.45, -0.45, 0.9],
        [1.45, -0.45, 0.9],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Ambient Decoration: Small plant ─── */
function Plant({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[1.2, 0.44, 0.1]}>
        <cylinderGeometry args={[0.08, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Leaves (simple spheres) */}
      <mesh position={[1.2, 0.56, 0.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[1.16, 0.6, 0.07]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#3a7a33" />
      </mesh>
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 50 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FF6B6B"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Full Scene ─── */
function DeveloperScene({ mouse }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle mouse parallax
    const targetY = mouse.current.x * 0.15;
    const targetX = -mouse.current.y * 0.08;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      -0.2 + targetY,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.05 + targetX,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]} rotation={[-0.05, -0.2, -0.05]}>
      <Desk />
      <Monitor />
      <Keyboard />
      <Mouse />
      <CoffeeMug />
      <Plant />
    </group>
  );
}

/* ─── Suspense Fallback ─── */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="gradient-orb" style={{ width: 120, height: 120 }} />
    </div>
  );
}

/* ─── Error Boundary ─── */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ─── Main Export ─── */
export default function RobotCanvas() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  return (
    <div className="canvas-container" onMouseMove={handleMouseMove}>
      <ErrorBoundary fallback={<LoadingFallback />}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            camera={{ position: [0, 1, 5], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.3} />
            <pointLight
              position={[-3, 3, 2]}
              color="#E63946"
              intensity={3}
              castShadow
            />
            <pointLight
              position={[3, 2, 2]}
              color="#FF6B6B"
              intensity={1.5}
            />
            <pointLight
              position={[0, 4, -1]}
              color="#ffffff"
              intensity={0.5}
            />
            {/* Screen glow light */}
            <pointLight
              position={[0, 1.5, 0.5]}
              color="#4fc1ff"
              intensity={0.8}
              distance={3}
            />
            <DeveloperScene mouse={mouse} />
            <Particles count={50} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
