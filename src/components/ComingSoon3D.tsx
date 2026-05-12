"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

export default function ComingSoon3D() {
  const mountRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

  
  // Three.js scene setup
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Deep space gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, 2);
    gradient.addColorStop(0, '#000428');
    gradient.addColorStop(1, '#004e92');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 2);
    
    const spaceTexture = new THREE.CanvasTexture(canvas);
    scene.background = spaceTexture;

    // Starfield particles
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create torus knot geometry for latest 3D animation
    const geometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    
    // Reflective metal material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.1,
      reflectivity: 1.0,
      envMapIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
    });

    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);

    // Floating particle systems around the core
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      // Blue and purple particles
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        particleColors[i * 3] = 0.2;
        particleColors[i * 3 + 1] = 0.5;
        particleColors[i * 3 + 2] = 1.0;
      } else {
        particleColors[i * 3] = 0.8;
        particleColors[i * 3 + 1] = 0.2;
        particleColors[i * 3 + 2] = 1.0;
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Volumetric lighting
    const light = new THREE.PointLight(0x4080ff, 2, 100);
    light.position.set(10, 10, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);

    // Camera position
    camera.position.z = 15;
    camera.position.y = 5;

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.01;

      // Rotate torus knot
      torusKnot.rotation.x += 0.005;
      torusKnot.rotation.y += 0.01;

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Orbital motion
        const speed = 0.001 + Math.random() * 0.002;
        const radius = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(y, x) + speed;
        const phi = Math.acos(z / radius) + speed * 0.5;

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Cinematic camera orbit
      const cameraRadius = 15 + Math.sin(time * 0.1) * 3;
      const cameraAngle = time * 0.2;
      camera.position.x = Math.cos(cameraAngle) * cameraRadius;
      camera.position.z = Math.sin(cameraAngle) * cameraRadius;
      camera.position.y = 5 + Math.sin(time * 0.15) * 2;
      camera.lookAt(0, 0, 0);

      // Animate light
      light.position.x = Math.cos(time) * 10;
      light.position.z = Math.sin(time) * 10;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Set loaded state
    setTimeout(() => setIsLoaded(true), 1000);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      const currentRef = mountRef.current;
      if (currentRef && renderer.domElement) {
        currentRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Glassmorphism Countdown Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl max-w-4xl mx-auto pointer-events-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isLoaded ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              Coming Soon
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12">
              Something new
            </p>

            
            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                Notify Me
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
