"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const SECTIONS = ["home", "projects", "about", "services", "process", "contact"];

class Particle {
  id: number;
  size: number;
  color: string;
  
  // Current Animated Position (3D space before rotation)
  cx: number;
  cy: number;
  cz: number;

  // Velocity for spring physics
  vx: number;
  vy: number;
  vz: number;

  // Final Screen Position (after rotation)
  x: number;
  y: number;
  z: number;

  // Pre-calculated shapes
  shapes: { [key: string]: { x: number, y: number, z: number } } = {};

  noiseOffsetX: number;
  noiseOffsetY: number;
  noiseOffsetZ: number;

  constructor(id: number, numParticles: number, maxRadius: number, baseColor: string, highlightColor: string) {
    this.id = id;
    this.size = Math.random() * 1.5 + 0.8;
    this.color = Math.random() > 0.95 ? highlightColor : baseColor;
    
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;
    this.noiseOffsetZ = Math.random() * 1000;

    // --- 1. Sphere (Home) ---
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const rSphere = Math.pow(Math.random(), 0.5) * maxRadius * 0.8; 
    
    this.shapes["home"] = {
      x: rSphere * Math.sin(phi) * Math.cos(theta),
      y: rSphere * Math.cos(phi),
      z: rSphere * Math.sin(phi) * Math.sin(theta)
    };

    // --- 2. Cube / Grid (Projects) ---
    // Distribute in a 3D grid
    const gridSize = Math.ceil(Math.pow(numParticles, 1/3));
    const gridX = (id % gridSize);
    const gridY = Math.floor(id / gridSize) % gridSize;
    const gridZ = Math.floor(id / (gridSize * gridSize));
    const spacing = (maxRadius * 1.5) / gridSize;
    
    this.shapes["projects"] = {
      x: (gridX - gridSize/2) * spacing + (Math.random() - 0.5) * 20,
      y: (gridY - gridSize/2) * spacing + (Math.random() - 0.5) * 20,
      z: (gridZ - gridSize/2) * spacing + (Math.random() - 0.5) * 20
    };

    // --- 3. Double Helix (About) ---
    const tHelix = (id % (numParticles / 2)) / (numParticles / 2); // 0 to 1
    const strand = id % 2 === 0 ? 0 : Math.PI;
    const helixRadius = maxRadius * 0.4;
    const helixY = (tHelix - 0.5) * maxRadius * 2.5; // Tall
    const helixAngle = tHelix * Math.PI * 12 + strand;
    
    this.shapes["about"] = {
      x: helixRadius * Math.cos(helixAngle),
      y: helixY,
      z: helixRadius * Math.sin(helixAngle)
    };

    // --- 4. Torus (Services) ---
    const torusR1 = maxRadius * 0.6; // Main ring radius
    const torusR2 = maxRadius * 0.25; // Tube radius
    const uTorus = Math.random() * Math.PI * 2;
    const vTorus = Math.random() * Math.PI * 2;
    
    this.shapes["services"] = {
      x: (torusR1 + torusR2 * Math.cos(vTorus)) * Math.cos(uTorus),
      y: torusR2 * Math.sin(vTorus),
      z: (torusR1 + torusR2 * Math.cos(vTorus)) * Math.sin(uTorus)
    };

    // --- 5. Cylinder / Tunnel (Process) ---
    const tCyl = Math.random();
    const cylAngle = Math.random() * Math.PI * 2;
    const cylRadius = maxRadius * 0.7;
    const cylY = (tCyl - 0.5) * maxRadius * 2.5;
    
    this.shapes["process"] = {
      x: cylRadius * Math.cos(cylAngle),
      y: cylY,
      z: cylRadius * Math.sin(cylAngle)
    };

    // --- 6. Wave Grid (Contact) ---
    const waveGridSize = Math.ceil(Math.sqrt(numParticles));
    const waveX = (id % waveGridSize);
    const waveZ = Math.floor(id / waveGridSize);
    const waveSpacing = (maxRadius * 2.5) / waveGridSize;
    
    this.shapes["contact"] = {
      x: (waveX - waveGridSize/2) * waveSpacing,
      y: 0, // Will be animated with a sine wave in the update loop
      z: (waveZ - waveGridSize/2) * waveSpacing
    };

    // Initialize position to the home shape
    this.cx = this.shapes["home"].x;
    this.cy = this.shapes["home"].y;
    this.cz = this.shapes["home"].z;
    
    this.x = this.cx;
    this.y = this.cy;
    this.z = this.cz;
    
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
  }

  update(activeSection: string, time: number, mouse: { x: number; y: number }, centerX: number, centerY: number) {
    // Get target shape based on current active section (default to home if missing)
    const target = this.shapes[activeSection] || this.shapes["home"];
    
    let targetX = target.x;
    let targetY = target.y;
    let targetZ = target.z;

    // Apply specific dynamic animations per section
    if (activeSection === "contact") {
      // Add wave motion to the flat grid
      const waveFreq = 0.005;
      const waveSpeed = time * 0.002;
      targetY += Math.sin(targetX * waveFreq + waveSpeed) * 100 + Math.cos(targetZ * waveFreq + waveSpeed) * 100;
    } else if (activeSection === "process") {
      // Rotate the cylinder
      const angleOffset = time * 0.0005;
      const radius = Math.sqrt(targetX*targetX + targetZ*targetZ);
      const currentAngle = Math.atan2(targetZ, targetX);
      targetX = radius * Math.cos(currentAngle + angleOffset);
      targetZ = radius * Math.sin(currentAngle + angleOffset);
    } else if (activeSection === "services") {
      // Rotate the torus slowly
      const angleOffset = time * 0.0003;
      const radius = Math.sqrt(targetX*targetX + targetZ*targetZ);
      const currentAngle = Math.atan2(targetZ, targetX);
      targetX = radius * Math.cos(currentAngle + angleOffset);
      targetZ = radius * Math.sin(currentAngle + angleOffset);
    } else if (activeSection === "home") {
      // Fluid wavy motion for the sphere
      targetX += Math.sin(time * 0.001 + this.noiseOffsetX) * 15;
      targetY += Math.cos(time * 0.0015 + this.noiseOffsetY) * 15;
      targetZ += Math.sin(time * 0.002 + this.noiseOffsetZ) * 15;
    }

    // Spring physics towards target shape
    // Different sections can have different tightness, but we'll use a unified smooth spring
    const spring = 0.02;
    const friction = 0.85;

    this.vx += (targetX - this.cx) * spring;
    this.vy += (targetY - this.cy) * spring;
    this.vz += (targetZ - this.cz) * spring;

    this.vx *= friction;
    this.vy *= friction;
    this.vz *= friction;

    this.cx += this.vx;
    this.cy += this.vy;
    this.cz += this.vz;

    // Global 3D Rotation (Slow continuous rotation of the entire cluster)
    // We can also tie the tilt (rotX) to which section we are in for better views
    let targetRotX = 0; // default side view
    if (activeSection === "contact") targetRotX = Math.PI * 0.35; // Look down at the wave
    if (activeSection === "process") targetRotX = Math.PI * 0.2; // Slight tilt for cylinder
    if (activeSection === "projects") targetRotX = Math.PI * 0.15; // Slight tilt for cube
    
    // Smoothly interpolate the global tilt (could be stored globally, but cheap to compute here)
    const rotX = targetRotX; // for simplicity, it snaps, but the particles spring anyway
    const rotY = time * 0.00015; // Continuous spin

    // Apply rotation
    let rx = this.cx * Math.cos(rotY) - this.cz * Math.sin(rotY);
    let rz = this.cx * Math.sin(rotY) + this.cz * Math.cos(rotY);

    let finalX = rx;
    let finalY = this.cy * Math.cos(rotX) - rz * Math.sin(rotX);
    let finalZ = this.cy * Math.sin(rotX) + rz * Math.cos(rotX);

    // Mouse Interaction
    let screenX = centerX + finalX;
    let screenY = centerY + finalY;
    
    let dx = mouse.x - screenX;
    let dy = mouse.y - screenY;
    let dist = Math.sqrt(dx*dx + dy*dy);
    let interactionRadius = 250;

    if (dist < interactionRadius && mouse.x > -1000) {
      let force = Math.pow((interactionRadius - dist) / interactionRadius, 2);
      // Push particles away in screen space, which translates to a push in finalX/finalY
      finalX -= (dx / dist) * force * 100;
      finalY -= (dy / dist) * force * 100;
    }

    // Save final projected 3D coordinates
    this.x = finalX;
    this.y = finalY;
    this.z = finalZ;
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    const fov = 1200;
    const scale = fov / (fov + this.z + 400); 
    
    if (scale < 0) return; // Behind camera

    const screenX = centerX + this.x * scale;
    const screenY = centerY + this.y * scale;

    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0.05, Math.min(1, scale * 1.5));
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.size * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function ParticleBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Track active section in a mutable ref so the requestAnimationFrame loop can read it instantly
  const activeSectionRef = useRef<string>("home");

  // Setup Intersection Observer to watch sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSectionRef.current = entry.target.id;
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px", // Triggers when section is roughly in the middle
        threshold: 0
      }
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;
    let maxRadius = 0;

    const mouse = { x: -1000, y: -1000 };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      maxRadius = Math.min(canvas.width, canvas.height) * 0.5;
    };
    
    const initParticles = () => {
      particlesArray = [];
      const numParticles = Math.min(window.innerWidth * 2, 3500); 
      
      const particleColor = theme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
      const highlightColor = "#00ff99"; 
      
      for (let i = 0; i < numParticles; i++) {
        particlesArray.push(new Particle(i, numParticles, maxRadius, particleColor, highlightColor));
      }
    };

    setCanvasSize();
    initParticles();
    
    let startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() - startTime;
      
      const activeSection = activeSectionRef.current;
      
      // Sort for correct 3D depth rendering
      particlesArray.sort((a, b) => b.z - a.z);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(activeSection, time, mouse, centerX, centerY);
        particlesArray[i].draw(ctx, centerX, centerY);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ display: "block" }}
    />
  );
}
