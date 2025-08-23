'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DAYMAP_URL =
  'https://upload.wikimedia.org/wikipedia/commons/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg';
const CLOUDS_URL =
  'https://upload.wikimedia.org/wikipedia/commons/e/ed/Solarsystemscope_texture_2k_earth_clouds.jpg';

const SPACE_BG_URL = 'https://removal.ai/wp-content/uploads/2021/05/image1.png'; // rename your uploaded file to "space-bg.png" and put inside public/


function useTexture(url: string) {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const tex = loader.load(
      url,
      (t) => {
        // modern three uses colorSpace instead of encoding
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
      },
      undefined,
      (err) => console.error('Texture load error:', err)
    );
    // sane defaults to avoid GPU memory spikes
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [url]);
}

const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const dayMap = useTexture(DAYMAP_URL);
  const cloudsMap = useTexture(CLOUDS_URL);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.002;
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0025; // slightly faster than the ground
  });

  return (
    <>
      {/* Ground */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Clouds as a transparent shell */}
      <mesh ref={cloudsRef} renderOrder={1}>
        <sphereGeometry args={[1.003, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

       





    </>
  );
};

const Map: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          preserveDrawingBuffer: false
        }}
        dpr={[1, 1.75]} // cap DPR to avoid "WebGL context lost"
        camera={{ position: [0, 0, 2.6], fov: 45, near: 0.1, far: 100 }}

        
      >


          





        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 1]} intensity={1.1} />
        <directionalLight position={[-3, -2, -1]} intensity={0.25} />

        <Earth />

        {/* Allow zoom/pan, keep auto-rotation authoritative */}
        <OrbitControls
          enableRotate={true}
          enablePan={true}
          enableZoom={true}
          minDistance={1.4}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default Map;