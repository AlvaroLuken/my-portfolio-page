"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const HOTSPOTS = [
  {
    title: "San Diego + Tijuana",
    lat: 32.6153,
    lng: -117.0996,
    color: 0x7ce8b5,
    flag: "🇺🇸 🇲🇽",
    lines: [
      "Cross-border home base between San Diego and Tijuana.",
    ],
  },
  {
    title: "Mexico City, Mexico",
    lat: 19.4326,
    lng: -99.1332,
    color: 0x7fe3d0,
    flag: "🇲🇽",
    lines: ["Major creative and cultural anchor.", "Frequent source of inspiration.", "Parents live here."],
  },
  {
    title: "Buenos Aires, Argentina",
    lat: -34.6037,
    lng: -58.3816,
    color: 0xff9fb6,
    flag: "🇦🇷",
    lines: ["My favorite city in the world!", "I love vacationing here and have really enjoyed learning about Argentinian culture and history."],
  },
  {
    title: "Wentzville, Missouri",
    lat: 38.8114,
    lng: -90.8529,
    color: 0xffcc7a,
    flag: "🇺🇸",
    lines: ["Spent 6 months here working on GM's largest assembly line."],
  },
  {
    title: "San Francisco, California",
    lat: 37.7749,
    lng: -122.4194,
    color: 0xc5b3ff,
    flag: "🇺🇸",
    lines: ["I lived here for 2 years while working at Alchemy. I absolutely loved living here."],
  },
  {
    title: "New York, New York",
    lat: 40.7128,
    lng: -74.006,
    color: 0xff8f95,
    flag: "🇺🇸",
    lines: ["I spent my college years in New York City. I love the city, the energy, and the people.", "I still keep a home base here."],
  },
  {
    title: "Phoenix, Arizona",
    lat: 33.4484,
    lng: -112.074,
    color: 0xffb56a,
    flag: "🇺🇸",
    lines: ["Spent 2 years living here while working at ChainShot.", "Scottsdale is a beautiful location."],
  },
] as const;

function createRadialGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255, 248, 220, 1)");
  gradient.addColorStop(0.24, "rgba(255, 210, 120, 0.95)");
  gradient.addColorStop(0.55, "rgba(255, 163, 74, 0.38)");
  gradient.addColorStop(1, "rgba(255, 130, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

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
  const controlsRef = useRef<OrbitControls | null>(null);
  const activeHotspotRef = useRef<{
    title: string;
    flag: string;
    lines: readonly string[];
  } | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<{
    title: string;
    flag: string;
    lines: readonly string[];
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.minDistance = 4.2;
    controls.maxDistance = 4.2;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.32;
    controls.rotateSpeed = 0.6;

    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const earthDayMap = textureLoader.load("/textures/earth_day.jpg");
    const earthNormalMap = textureLoader.load("/textures/earth_normal.jpg");
    const earthSpecularMap = textureLoader.load("/textures/earth_specular.jpg");
    const earthCloudMap = textureLoader.load("/textures/earth_clouds.png");
    const moonMap = textureLoader.load("/textures/moon.jpg");
    const sunGlowTexture = createRadialGlowTexture();

    earthDayMap.colorSpace = THREE.SRGBColorSpace;
    earthDayMap.anisotropy = maxAnisotropy;
    earthNormalMap.anisotropy = maxAnisotropy;
    earthSpecularMap.anisotropy = maxAnisotropy;
    earthCloudMap.colorSpace = THREE.SRGBColorSpace;
    earthCloudMap.anisotropy = maxAnisotropy;
    moonMap.colorSpace = THREE.SRGBColorSpace;
    moonMap.anisotropy = maxAnisotropy;

    const ambient = new THREE.AmbientLight(0xf1f5ff, 1.08);
    const directional = new THREE.DirectionalLight(0xffffff, 1.32);
    directional.position.set(3.4, 2.8, 2.4);
    const rim = new THREE.DirectionalLight(0x7ea5cc, 0.58);
    rim.position.set(-2.5, -0.7, -2.7);
    const fill = new THREE.DirectionalLight(0x8db1d3, 0.72);
    fill.position.set(-2.1, 0.2, 1.8);
    const hemi = new THREE.HemisphereLight(0xbdd8ff, 0x070b16, 0.32);
    const interactionSun = new THREE.DirectionalLight(0xffffff, 0.38);
    interactionSun.position.set(0, 0, 3.5);
    interactionSun.target.position.set(0, 0, 0);
    const sunPoint = new THREE.PointLight(0xffd79f, 2.5, 140, 2);
    sunPoint.position.set(-11.5, 3.8, -15.5);
    scene.add(
      ambient,
      directional,
      rim,
      fill,
      hemi,
      interactionSun,
      interactionSun.target,
      sunPoint,
    );

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 28, 28),
      new THREE.MeshBasicMaterial({ color: 0xffd38d }),
    );
    sun.position.copy(sunPoint.position);
    const sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunGlowTexture,
        color: 0xffd39f,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    sunGlow.position.copy(sun.position);
    sunGlow.scale.set(4.8, 4.8, 1);
    scene.add(sun, sunGlow);

    const planetA = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xc5a4e8,
        roughness: 0.95,
        metalness: 0.05,
      }),
    );
    planetA.position.set(3.8, 1.7, -6.4);
    scene.add(planetA);

    const planetB = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 28, 28),
      new THREE.MeshStandardMaterial({
        color: 0xd19a74,
        roughness: 0.96,
        metalness: 0.04,
      }),
    );
    planetB.position.set(-4.2, -1.5, -7.3);
    scene.add(planetB);

    const planetC = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x8ec0dd,
        roughness: 0.94,
        metalness: 0.06,
      }),
    );
    planetC.position.set(5.6, -2.1, -9.4);
    scene.add(planetC);

    const planetRing = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.17, 64),
      new THREE.MeshBasicMaterial({
        color: 0xe5d6c2,
        transparent: true,
        opacity: 0.52,
        side: THREE.DoubleSide,
      }),
    );
    planetRing.position.copy(planetB.position);
    planetRing.rotation.x = Math.PI * 0.35;
    planetRing.rotation.y = Math.PI * 0.2;
    scene.add(planetRing);

    const shootingStarA = new THREE.Mesh(
      new THREE.PlaneGeometry(0.28, 0.018),
      new THREE.MeshBasicMaterial({
        color: 0xe8f5ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    shootingStarA.position.set(-6, 3.3, -5.8);
    scene.add(shootingStarA);

    const shootingStarB = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.015),
      new THREE.MeshBasicMaterial({
        color: 0xdaf0ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    shootingStarB.position.set(6.2, 2.5, -6.3);
    scene.add(shootingStarB);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 4200;
    const starVertices = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 7 + Math.random() * 9.5;
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
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
      }),
    );
    scene.add(stars);

    const nearStarsGeometry = new THREE.BufferGeometry();
    const nearStarCount = 900;
    const nearVertices = new Float32Array(nearStarCount * 3);
    for (let i = 0; i < nearStarCount; i += 1) {
      const radius = 4 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const idx = i * 3;
      nearVertices[idx] = radius * Math.sin(phi) * Math.cos(theta);
      nearVertices[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nearVertices[idx + 2] = radius * Math.cos(phi);
    }
    nearStarsGeometry.setAttribute("position", new THREE.BufferAttribute(nearVertices, 3));
    const nearStars = new THREE.Points(
      nearStarsGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.032,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    scene.add(nearStars);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhongMaterial({
        map: earthDayMap,
        normalMap: earthNormalMap,
        normalScale: new THREE.Vector2(0.34, 0.34),
        specularMap: earthSpecularMap,
        specular: new THREE.Color(0x536f8d),
        shininess: 9,
        emissive: new THREE.Color(0x1a3f6a),
        emissiveIntensity: 0.15,
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
        color: 0x9cb6c9,
        wireframe: true,
        transparent: true,
        opacity: 0.02,
      }),
    );

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.065, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x6ea0cf,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    const backHalo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x2f5f96,
        transparent: true,
        opacity: 0.035,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );

    globeGroup.add(globe, cloudLayer, wire, atmosphere, backHalo);

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

    const hotspots = HOTSPOTS.map((hotspot) => {
      const markerPosition = latLngToVector3(hotspot.lat, hotspot.lng, 1.02);
      const normal = markerPosition.clone().normalize();
      const isPrimary = hotspot.title === "San Diego + Tijuana";
      const markerColor = new THREE.Color(hotspot.color);
      const markerEmissive = markerColor.clone().multiplyScalar(0.82);
      const markerLineColor = markerColor.clone().lerp(new THREE.Color(0xffffff), 0.28);
      const pulseColor = markerColor.clone().lerp(new THREE.Color(0xffffff), 0.42);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 20, 20),
        new THREE.MeshStandardMaterial({
          color: markerColor,
          emissive: markerEmissive,
          emissiveIntensity: isPrimary ? 0.45 : 0.2,
        }),
      );
      marker.position.copy(markerPosition);
      marker.userData.hotspot = hotspot;
      globeGroup.add(marker);

      const markerHitArea = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      markerHitArea.position.copy(markerPosition);
      markerHitArea.userData.hotspot = hotspot;
      globeGroup.add(markerHitArea);

      const markerLine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.23, 12),
        new THREE.MeshBasicMaterial({
          color: markerLineColor,
          transparent: true,
          opacity: isPrimary ? 0.2 : 0,
        }),
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
          color: pulseColor,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      const pulseB = new THREE.Mesh(
        new THREE.RingGeometry(0.03, 0.04, 48),
        new THREE.MeshBasicMaterial({
          color: pulseColor,
          transparent: true,
          opacity: 0,
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

      return {
        marker,
        markerHitArea,
        markerLine,
        pulseA,
        pulseB,
        data: hotspot,
        isPrimary,
        markerMaterial: marker.material as THREE.MeshStandardMaterial,
        markerLineMaterial: markerLine.material as THREE.MeshBasicMaterial,
        pulseAMaterial: pulseA.material as THREE.MeshBasicMaterial,
        pulseBMaterial: pulseB.material as THREE.MeshBasicMaterial,
        hoverMix: 0,
      };
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerStart = { x: 0, y: 0 };
    const hitAreas = hotspots.map((item) => item.markerHitArea);
    let hoveredHotspotMesh: THREE.Object3D | null = null;
    let isHotspotHovered = false;
    let dragDistance = 0;

    const pickHotspot = (clientX: number, clientY: number) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(hitAreas, false);
      hoveredHotspotMesh = intersections[0]?.object ?? null;
      return intersections.length > 0
        ? (intersections[0].object.userData.hotspot as (typeof HOTSPOTS)[number])
        : null;
    };

    const updateHoverState = (event: PointerEvent) => {
      const hotspot = pickHotspot(event.clientX, event.clientY);
      isHotspotHovered = hotspot !== null;
      renderer.domElement.style.cursor = isHotspotHovered ? "pointer" : "grab";
      return hotspot;
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
      dragDistance = 0;
      renderer.domElement.style.cursor = isHotspotHovered ? "pointer" : "grabbing";
    };

    const handlePointerMove = (event: PointerEvent) => {
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      dragDistance = Math.max(dragDistance, Math.hypot(dx, dy));
      updateHoverState(event);
    };

    const handlePointerLeave = () => {
      isHotspotHovered = false;
      renderer.domElement.style.cursor = "grab";
    };

    const handlePointerUp = () => {
      renderer.domElement.style.cursor = isHotspotHovered ? "pointer" : "grab";
    };

    const handleClick = (event: MouseEvent) => {
      if (dragDistance > 14) return;
      const hotspot = pickHotspot(event.clientX, event.clientY);
      setActiveHotspot(hotspot);
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("click", handleClick);
    renderer.domElement.style.cursor = "grab";
    let isUserInteracting = false;
    controls.addEventListener("start", () => {
      isUserInteracting = true;
    });
    controls.addEventListener("end", () => {
      isUserInteracting = false;
    });

    const clock = new THREE.Clock();
    let frame = 0;
    let interactionBoost = 0;
    const shootingA = {
      active: false,
      start: 0,
      duration: 0.8,
      nextAt: 2 + Math.random() * 5,
    };
    const shootingB = {
      active: false,
      start: 0,
      duration: 0.65,
      nextAt: 4 + Math.random() * 6,
    };

    const animate = () => {
      frame = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const pulse1 = (elapsed % 2) / 2;
      const pulse2 = ((elapsed + 1) % 2) / 2;

      const scaleA = 1 + pulse1 * 5.2;
      const scaleB = 1 + pulse2 * 5.2;
      interactionBoost += ((isUserInteracting ? 1 : 0) - interactionBoost) * 0.1;

      stars.rotation.y += 0.00008;
      nearStars.rotation.y -= 0.00017;
      moon.rotation.y += 0.0009;
      planetA.rotation.y += 0.001;
      planetB.rotation.y += 0.00078;
      planetC.rotation.y += 0.00082;
      planetRing.rotation.z += 0.00058;
      cloudLayer.rotation.y += 0.00072;
      atmosphere.rotation.y -= 0.00032;
      backHalo.rotation.y += 0.00022;
      sunGlow.material.rotation += 0.00115;

      if (!shootingA.active && elapsed > shootingA.nextAt) {
        shootingA.active = true;
        shootingA.start = elapsed;
        shootingA.nextAt = elapsed + 6 + Math.random() * 8;
      }
      if (shootingA.active) {
        const t = (elapsed - shootingA.start) / shootingA.duration;
        if (t >= 1) {
          shootingA.active = false;
          (shootingStarA.material as THREE.MeshBasicMaterial).opacity = 0;
        } else {
          shootingStarA.position.set(-6 + t * 6.7, 3.3 - t * 2.1, -5.8);
          shootingStarA.rotation.z = -0.45;
          (shootingStarA.material as THREE.MeshBasicMaterial).opacity =
            Math.sin(Math.PI * t) * 0.9;
        }
      }

      if (!shootingB.active && elapsed > shootingB.nextAt) {
        shootingB.active = true;
        shootingB.start = elapsed;
        shootingB.nextAt = elapsed + 7 + Math.random() * 9;
      }
      if (shootingB.active) {
        const t = (elapsed - shootingB.start) / shootingB.duration;
        if (t >= 1) {
          shootingB.active = false;
          (shootingStarB.material as THREE.MeshBasicMaterial).opacity = 0;
        } else {
          shootingStarB.position.set(6.2 - t * 6.1, 2.5 - t * 1.8, -6.3);
          shootingStarB.rotation.z = 0.4;
          (shootingStarB.material as THREE.MeshBasicMaterial).opacity =
            Math.sin(Math.PI * t) * 0.82;
        }
      }

      interactionSun.position.copy(camera.position.clone().normalize().multiplyScalar(3.6));
      interactionSun.intensity = 0.4 + interactionBoost * 0.72;
      hotspots.forEach((hotspot) => {
        const activeTitle = activeHotspotRef.current?.title;
        const isHovered = hoveredHotspotMesh === hotspot.markerHitArea;
        const isActive = activeTitle === hotspot.data.title;
        const targetEmphasis = isActive
          ? 1
          : isHovered
            ? 0.72
            : hotspot.isPrimary
              ? 0.28
              : 0.12;
        hotspot.hoverMix += (targetEmphasis - hotspot.hoverMix) * 0.12;
        hotspot.marker.scale.setScalar(0.95 + hotspot.hoverMix * 0.38);
        hotspot.markerMaterial.emissiveIntensity =
          (hotspot.isPrimary ? 0.45 : 0.2) + hotspot.hoverMix * 1.1;
        hotspot.markerLine.scale.setScalar(0.9 + hotspot.hoverMix * 0.22);
        hotspot.markerLineMaterial.opacity = hotspot.isPrimary
          ? 0.12 + hotspot.hoverMix * 0.7
          : hotspot.hoverMix * 0.72;
        hotspot.pulseA.scale.setScalar(scaleA);
        hotspot.pulseB.scale.setScalar(scaleB);
        hotspot.pulseAMaterial.opacity =
          Math.max(0, 0.6 - pulse1 * 0.56 + hotspot.hoverMix * 0.14) *
          Math.min(1, hotspot.hoverMix * 1.4);
        hotspot.pulseBMaterial.opacity =
          Math.max(0, 0.6 - pulse2 * 0.56 + hotspot.hoverMix * 0.14) *
          Math.min(1, hotspot.hoverMix * 1.4);
      });

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
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("click", handleClick);
      controls.dispose();
      controlsRef.current = null;
      renderer.dispose();
      globe.geometry.dispose();
      (globe.material as THREE.MeshPhongMaterial).dispose();
      cloudLayer.geometry.dispose();
      (cloudLayer.material as THREE.MeshPhongMaterial).dispose();
      wire.geometry.dispose();
      (wire.material as THREE.MeshBasicMaterial).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.MeshBasicMaterial).dispose();
      backHalo.geometry.dispose();
      (backHalo.material as THREE.MeshBasicMaterial).dispose();
      moon.geometry.dispose();
      (moon.material as THREE.MeshStandardMaterial).dispose();
      planetA.geometry.dispose();
      (planetA.material as THREE.MeshStandardMaterial).dispose();
      planetB.geometry.dispose();
      (planetB.material as THREE.MeshStandardMaterial).dispose();
      planetC.geometry.dispose();
      (planetC.material as THREE.MeshStandardMaterial).dispose();
      planetRing.geometry.dispose();
      (planetRing.material as THREE.MeshBasicMaterial).dispose();
      shootingStarA.geometry.dispose();
      (shootingStarA.material as THREE.MeshBasicMaterial).dispose();
      shootingStarB.geometry.dispose();
      (shootingStarB.material as THREE.MeshBasicMaterial).dispose();
      starsGeometry.dispose();
      (stars.material as THREE.PointsMaterial).dispose();
      nearStarsGeometry.dispose();
      (nearStars.material as THREE.PointsMaterial).dispose();
      sun.geometry.dispose();
      (sun.material as THREE.MeshBasicMaterial).dispose();
      (sunGlow.material as THREE.SpriteMaterial).dispose();
      sunGlowTexture.dispose();
      hotspots.forEach((hotspot) => {
        hotspot.marker.geometry.dispose();
        (hotspot.marker.material as THREE.MeshStandardMaterial).dispose();
        hotspot.markerHitArea.geometry.dispose();
        (hotspot.markerHitArea.material as THREE.MeshBasicMaterial).dispose();
        hotspot.markerLine.geometry.dispose();
        (hotspot.markerLine.material as THREE.MeshBasicMaterial).dispose();
        hotspot.pulseA.geometry.dispose();
        (hotspot.pulseA.material as THREE.MeshBasicMaterial).dispose();
        hotspot.pulseB.geometry.dispose();
        (hotspot.pulseB.material as THREE.MeshBasicMaterial).dispose();
      });
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

  useEffect(() => {
    activeHotspotRef.current = activeHotspot;
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = !activeHotspot;
  }, [activeHotspot]);

  return (
    <>
      <div ref={containerRef} className="terrain-globe" />
      {activeHotspot && (
        <div
          className="terrain-modal-backdrop"
          role="presentation"
          onClick={() => setActiveHotspot(null)}
        >
          <section
            className="terrain-modal"
            role="dialog"
            aria-label="Location details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="terrain-modal-header">
              <p>Location Details</p>
              <button
                type="button"
                className="terrain-modal-close"
                onClick={() => setActiveHotspot(null)}
              >
                Close
              </button>
            </div>
            <h3>
              <span>{activeHotspot.title}</span>
              <span className="terrain-modal-flag" aria-hidden="true">
                {activeHotspot.flag}
              </span>
            </h3>
            <ul>
              {activeHotspot.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </>
  );
}
