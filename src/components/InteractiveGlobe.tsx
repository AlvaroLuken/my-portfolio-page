"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const SAN_DIEGO = {
  lat: 32.7157,
  lng: -117.1611,
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 2.85);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 1.9;
    controls.maxDistance = 4.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;

    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const earthDayMap = textureLoader.load("/textures/earth_day.jpg");
    const earthNormalMap = textureLoader.load("/textures/earth_normal.jpg");
    const earthSpecularMap = textureLoader.load("/textures/earth_specular.jpg");
    const earthCloudMap = textureLoader.load("/textures/earth_clouds.png");
    const moonMap = textureLoader.load("/textures/moon.jpg");

    earthDayMap.colorSpace = THREE.SRGBColorSpace;
    earthDayMap.anisotropy = maxAnisotropy;
    earthNormalMap.anisotropy = maxAnisotropy;
    earthSpecularMap.anisotropy = maxAnisotropy;
    earthCloudMap.colorSpace = THREE.SRGBColorSpace;
    earthCloudMap.anisotropy = maxAnisotropy;
    moonMap.colorSpace = THREE.SRGBColorSpace;
    moonMap.anisotropy = maxAnisotropy;

    const ambient = new THREE.AmbientLight(0xb8ccc2, 0.95);
    const directional = new THREE.DirectionalLight(0xf2f0de, 1.3);
    directional.position.set(2.6, 2.4, 2);
    const rim = new THREE.DirectionalLight(0x5a8f7f, 0.8);
    rim.position.set(-3, -1, -2);
    scene.add(ambient, directional, rim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1800;
    const starVertices = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 6 + Math.random() * 7.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const idx = i * 3;
      starVertices[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starVertices[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starVertices[idx + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: 0xe8f1ff,
        size: 0.028,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    scene.add(stars);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhongMaterial({
        map: earthDayMap,
        normalMap: earthNormalMap,
        normalScale: new THREE.Vector2(0.85, 0.85),
        specularMap: earthSpecularMap,
        specular: new THREE.Color(0x5b7087),
        shininess: 12,
      }),
    );

    const cloudLayer = new THREE.Mesh(
      new THREE.SphereGeometry(1.015, 96, 96),
      new THREE.MeshPhongMaterial({
        map: earthCloudMap,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.003, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7ea292,
        wireframe: true,
        transparent: true,
        opacity: 0.04,
      }),
    );

    globeGroup.add(globe, cloudLayer, wire);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 48, 48),
      new THREE.MeshStandardMaterial({
        map: moonMap,
        roughness: 1,
        metalness: 0,
      }),
    );
    moon.position.set(1.9, 0.78, -1.8);
    scene.add(moon);

    const markerPosition = latLngToVector3(SAN_DIEGO.lat, SAN_DIEGO.lng, 1.02);
    const normal = markerPosition.clone().normalize();

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xd8f2df,
        emissive: 0x83f2bf,
        emissiveIntensity: 1.4,
      }),
    );
    marker.position.copy(markerPosition);
    globeGroup.add(marker);

    const markerLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.23, 12),
      new THREE.MeshBasicMaterial({ color: 0xa5d8c2 }),
    );
    markerLine.position.copy(markerPosition.clone().add(normal.clone().multiplyScalar(0.11)));
    markerLine.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      normal.clone().normalize(),
    );
    globeGroup.add(markerLine);

    const pulseA = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.04, 48),
      new THREE.MeshBasicMaterial({
        color: 0xc9edd9,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    const pulseB = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.04, 48),
      new THREE.MeshBasicMaterial({
        color: 0xc9edd9,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    pulseA.position.copy(markerPosition.clone().add(normal.clone().multiplyScalar(0.002)));
    pulseB.position.copy(markerPosition.clone().add(normal.clone().multiplyScalar(0.003)));
    const ringQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal,
    );
    pulseA.quaternion.copy(ringQuat);
    pulseB.quaternion.copy(ringQuat);
    globeGroup.add(pulseA, pulseB);

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const pulse1 = (elapsed % 2) / 2;
      const pulse2 = ((elapsed + 1) % 2) / 2;

      const scaleA = 1 + pulse1 * 5.2;
      const scaleB = 1 + pulse2 * 5.2;

      stars.rotation.y += 0.00008;
      moon.rotation.y += 0.0009;
      cloudLayer.rotation.y += 0.0005;
      pulseA.scale.setScalar(scaleA);
      pulseB.scale.setScalar(scaleB);
      (pulseA.material as THREE.MeshBasicMaterial).opacity = 0.74 - pulse1 * 0.7;
      (pulseB.material as THREE.MeshBasicMaterial).opacity = 0.74 - pulse2 * 0.7;

      controls.update();
      renderer.render(scene, camera);
    };

    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.MeshPhongMaterial).dispose();
      cloudLayer.geometry.dispose();
      (cloudLayer.material as THREE.MeshPhongMaterial).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.MeshBasicMaterial).dispose();
      moon.geometry.dispose();
      (moon.material as THREE.MeshStandardMaterial).dispose();
      starsGeometry.dispose();
      (stars.material as THREE.PointsMaterial).dispose();
      marker.geometry.dispose();
      (marker.material as THREE.MeshStandardMaterial).dispose();
      markerLine.geometry.dispose();
      (markerLine.material as THREE.MeshBasicMaterial).dispose();
      pulseA.geometry.dispose();
      (pulseA.material as THREE.MeshBasicMaterial).dispose();
      pulseB.geometry.dispose();
      (pulseB.material as THREE.MeshBasicMaterial).dispose();
      earthDayMap.dispose();
      earthNormalMap.dispose();
      earthSpecularMap.dispose();
      earthCloudMap.dispose();
      moonMap.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="terrain-globe" />;
}
