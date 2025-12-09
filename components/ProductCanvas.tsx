import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying float vWave;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Calculate distance from mouse to vertex (UV space approximation)
  float dist = distance(uv, uMouse);
  
  // Create a bulge effect based on hover state and mouse distance
  float decay = clamp(1.0 - dist * 1.5, 0.0, 1.0);
  float bulge = sin(dist * 10.0 - uTime * 2.0) * 0.1 * decay * uHover;
  
  pos.z += bulge;
  vWave = bulge;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D tDiffuse;
uniform float uHover;
varying vec2 vUv;
varying float vWave;

void main() {
  vec2 uv = vUv;
  
  // Chromatic aberration based on wave
  float shift = vWave * 0.2 * uHover;
  
  float r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
  
  vec3 color = vec3(r, g, b);
  
  // Add sheen
  float sheen = smoothstep(0.0, 0.1, vWave) * 0.5;
  color += sheen;

  gl_FragColor = vec4(color, 1.0);
}
`;

const ImagePlane = ({ src }: { src: string }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const texture = useTexture(src);

    const uniforms = useMemo(
        () => ({
            tDiffuse: { value: texture },
            uTime: { value: 0 },
            uHover: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        }),
        [texture]
    );

    useFrame((state) => {
        if (!mesh.current) return;

        // Update time
        uniforms.uTime.value = state.clock.getElapsedTime();

        // Mouse interaction (raycasting is expensive, we can approximate with normalized coords if passed from parent, 
        // but here we can rely on R3F pointer if we want 3D picking. 
        // For simplicity in this demo, let's just animate hover intensity first)
        // Actually, R3F state.pointer gives normalized coordinates [-1, 1]

        const x = (state.pointer.x + 1) / 2;
        const y = (state.pointer.y + 1) / 2;
        uniforms.uMouse.value.lerp(new THREE.Vector2(x, y), 0.1);
    });

    return (
        <mesh
            ref={mesh}
            onPointerOver={() => {
                // We'll handle hover animation in useFrame if we want smooth transition
                // But we can also set a target Ref
            }}
        >
            <planeGeometry args={[3, 4, 32, 32]} /> {/* Aspect ratio 3:4 common for fashion */}
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// Wrapper to handle hover state animation cleanly
const Scene = ({ src }: { src: string }) => {
    const group = useRef<THREE.Group>(null);
    const planeRef = useRef<any>(null); // To access uniforms
    const hoverRef = useRef(0);
    const isHovered = useRef(false);

    useFrame((state, delta) => {
        const target = isHovered.current ? 1 : 0;
        hoverRef.current = THREE.MathUtils.lerp(hoverRef.current, target, delta * 5);
        if (planeRef.current) {
            planeRef.current.uniforms.uHover.value = hoverRef.current;
        }
    });

    return (
        <group ref={group}>
            <mesh
                onPointerEnter={() => (isHovered.current = true)}
                onPointerLeave={() => (isHovered.current = false)}
            >
                <planeGeometry args={[3, 4, 32, 32]} />
                <shaderMaterial
                    ref={planeRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        tDiffuse: { value: null }, // Will be set by TextureLoader but we strictly need useTexture inside Canvas
                        uTime: { value: 0 },
                        uHover: { value: 0 },
                        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
                    }}
                />
                {/* 
                   Wait, useTexture must be used inside a component. 
                   The previous ImagePlane was better structure. 
                   Let's refactor to combine them properly.
                 */}
            </mesh>
        </group>
    )
}

const DistortionImage = ({ src }: { src: string }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const texture = useTexture(src);
    texture.minFilter = THREE.LinearFilter;

    const uniforms = useMemo(
        () => ({
            tDiffuse: { value: texture },
            uTime: { value: 0 },
            uHover: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        }),
        [texture]
    );

    const isHovered = useRef(false);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // Time
        uniforms.uTime.value = state.clock.getElapsedTime();

        // Hover lerp
        const target = isHovered.current ? 1 : 0;
        uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, target, delta * 4);

        // Mouse lerp
        const x = (state.pointer.x + 1) / 2;
        const y = (state.pointer.y + 1) / 2;
        uniforms.uMouse.value.lerp(new THREE.Vector2(x, y), 0.1);
    });

    return (
        <mesh
            ref={mesh}
            onPointerOver={() => (isHovered.current = true)}
            onPointerOut={() => (isHovered.current = false)}
            scale={[1, 1, 1]} // Adjust scale to fit container via auto-resize?
        >
            <planeGeometry args={[2, 3, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export const ProductCanvas: React.FC<{ src: string, className?: string }> = ({ src, className }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
                <React.Suspense fallback={null}>
                    <DistortionImage src={src} />
                </React.Suspense>
            </Canvas>
        </div>
    );
};
