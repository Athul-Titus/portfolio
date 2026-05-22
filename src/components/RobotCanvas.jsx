import { useRef, useMemo, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL =
  'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

/* ─── Robot Model ─── */
function Robot({ mouse }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  // Play idle or wave animation on mount
  useEffect(() => {
    const idle = actions['Idle'] || actions['Wave'] || Object.values(actions)[0];
    if (idle) {
      idle.reset().fadeIn(0.5).play();
    }
    return () => {
      if (idle) idle.fadeOut(0.5);
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow auto-rotate on Y
    groupRef.current.rotation.y += delta * 0.3;

    // Mouse parallax tilt (max ±15 degrees = ±0.26 rad)
    const maxTilt = 0.26;
    const targetX = -mouse.current.y * maxTilt;
    const targetZ = mouse.current.x * maxTilt * 0.5; // subtle Z lean

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetZ,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]} scale={2.5}>
      <primitive object={scene} />
    </group>
  );
}

/* ─── Floating Particles ─── */
function Particles({ count = 50 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5; // radius up to 4
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.04;
    }
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
        size={0.05}
        color="#FF6B6B"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
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
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.3} />
            <pointLight
              position={[-3, 2, 2]}
              color="#E63946"
              intensity={2}
              castShadow
            />
            <pointLight
              position={[3, -1, 2]}
              color="#FF6B6B"
              intensity={1}
            />
            <Robot mouse={mouse} />
            <Particles count={50} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Pre-load the model
useGLTF.preload(MODEL_URL);
