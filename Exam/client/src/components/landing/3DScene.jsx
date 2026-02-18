import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, Stars, Sparkles } from '@react-three/drei';

function FloatingCube(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.2;
            mesh.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float floatIntensity={2} rotationIntensity={1}>
            <mesh ref={mesh} {...props}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color="#4f46e5"
                    emissive="#4338ca"
                    emissiveIntensity={0.8}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
}

function FloatingSphere(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x -= delta * 0.1;
            mesh.current.rotation.y -= delta * 0.2;
        }
    });

    return (
        <Float floatIntensity={3} rotationIntensity={2}>
            <mesh ref={mesh} {...props}>
                <sphereGeometry args={[0.7, 64, 64]} />
                <meshStandardMaterial
                    color="#db2777"
                    emissive="#be185d"
                    emissiveIntensity={0.8}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
}

function FloatingTorus(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.3;
            mesh.current.rotation.z += delta * 0.2;
        }
    });

    return (
        <Float floatIntensity={2.5} rotationIntensity={1.5}>
            <mesh ref={mesh} {...props}>
                <torusGeometry args={[0.6, 0.2, 32, 100]} />
                <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#0284c7"
                    emissiveIntensity={0.8}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
}

function FloatingIcosahedron(props) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta * 0.1;
            mesh.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <Float floatIntensity={1.5} rotationIntensity={1.2}>
            <mesh ref={mesh} {...props}>
                <icosahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                    color="#7c3aed"
                    emissive="#6d28d9"
                    emissiveIntensity={0.8}
                    roughness={0.1}
                    metalness={1.0}
                />
            </mesh>
        </Float>
    );
}


export default function GeometricScene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas style={{ background: 'transparent' }} dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#db2777" />

                <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} />

                {/* Left Cluster */}
                <FloatingCube position={[-5, 2, -5]} />
                <FloatingTorus position={[-3, -3, -4]} />
                <FloatingSphere position={[-6, 0, -8]} scale={0.5} />

                {/* Right Cluster */}
                <FloatingSphere position={[5, 2, -3]} />
                <FloatingIcosahedron position={[3, -2, -4]} />
                <FloatingCube position={[6, -1, -10]} scale={0.6} />

                {/* Center Background */}
                <FloatingTorus position={[0, 4, -12]} scale={0.8} />
                <FloatingIcosahedron position={[0, -5, -8]} scale={0.8} />

                {/* Tiny particles */}
                <FloatingSphere position={[2, 4, -6]} scale={0.3} />
                <FloatingCube position={[-2, -4, -5]} scale={0.2} />

                <Environment preset="night" />
            </Canvas>
        </div>
    );
}
