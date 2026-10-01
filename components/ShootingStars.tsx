"use client";

import { useEffect, useRef } from "react";

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Star {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speed: number = 0;
      opacity: number = 0;
      thickness: number = 0;
      delay: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        if (Math.random() > 0.5) {
          // start top
          this.x = Math.random() * width * 1.5;
          this.y = initial ? Math.random() * height : -50;
        } else {
          // start right
          this.x = width + 50;
          this.y = initial ? Math.random() * height : Math.random() * height * 0.5;
        }
        
        this.length = Math.random() * 100 + 40; // 40 to 140px length
        this.speed = Math.random() * 5 + 3;  // Slower speed for 1-2 per sec
        this.opacity = Math.random() * 0.6 + 0.4; 
        this.thickness = Math.random() * 2 + 1;
        this.delay = initial ? Math.random() * 150 : Math.random() * 80; // More delay between spawns
      }

      update() {
        if (this.delay > 0) {
          this.delay--;
          return;
        }
        // move bottom left (-x, +y)
        this.x -= this.speed;
        this.y += this.speed;

        if (this.x < -this.length || this.y > height + this.length) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.delay > 0) return;

        ctx.beginPath();
        // gradient for the tail
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y - this.length);
        // Light green brand color
        gradient.addColorStop(0, `rgba(0, 204, 122, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(0, 204, 122, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y - this.length); // tail extends up-right
        ctx.stroke();
      }
    }

    // ~7 stars on screen yields about 1-2 passing per second
    const stars: Star[] = Array.from({ length: 7 }, () => new Star());
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.update();
        star.draw(ctx);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 opacity-70"
    />
  );
}
