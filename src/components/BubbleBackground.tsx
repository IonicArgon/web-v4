"use client";

import React, { useRef, useEffect } from "react";

interface Bubble {
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  growth: number;
}

const randomGaussian = (mean: number, sd: number): number => {
  let y1, x1, x2, w;
  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    w = x1 * x1 + x2 * x2;
  } while (w >= 1);
  w = Math.sqrt((-2 * Math.log(w)) / w);
  y1 = x1 * w;
  return mean + y1 * sd;
};

const sigmoid = (x: number): number => {
  return 1 / (1 + Math.exp(-x));
};

const BubbleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleCount = 25;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = (
      canvas: HTMLCanvasElement,
    ): CanvasRenderingContext2D | null => {
      let dpr = window.devicePixelRatio || 1;
      let rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const context = canvas.getContext("2d");

      // guarantee the context is not null
      if (!context) return null;

      context.scale(dpr, dpr);
      return context;
    };

    let context = setupCanvas(canvas);
    if (!context) return;

    const bubbles: Bubble[] = [];

    const createBubble = () => {
      const baseRadius = Math.min(canvas.width, canvas.height) / 25;
      const baseSpeed = Math.min(canvas.width, canvas.height) / 5000;

      let radius = randomGaussian(baseRadius, baseRadius / 1.5);
      radius = Math.abs(radius);
      const x = randomGaussian(canvas.width / 2, canvas.width / 4);
      const y = randomGaussian(canvas.height / 2, canvas.height / 4);
      const vx = randomGaussian(0, baseSpeed / 1.5);
      const vy = randomGaussian(0, baseSpeed / 1.5);

      const hueBlock = Math.random() < 0.5 ? [200, 220] : [290, 310];
      const hue = Math.random() * (hueBlock[0] - hueBlock[1]) + hueBlock[0];
      const color = `hsla(${hue}, 100%, 95%, 0.5)`;

      bubbles.push({ radius, x, y, vx, vy, color, growth: 0 });
    };

    const drawBubble = (bubble: Bubble) => {
      const currentRadius = Math.min(bubble.growth, bubble.radius);
      const gradient = context!.createRadialGradient(
        bubble.x,
        bubble.y,
        0,
        bubble.x,
        bubble.y,
        currentRadius,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, bubble.color);

      context!.beginPath();
      context!.arc(bubble.x, bubble.y, currentRadius, 0, 2 * Math.PI);
      context!.fillStyle = gradient;
      context!.fill();

      context!.strokeStyle = "rgba(0, 0, 0, 0.75)";
      context!.lineWidth = 1;
      context!.stroke();

      context!.shadowOffsetX = 2;
      context!.shadowOffsetY = 2;
      context!.shadowBlur = 4;
      context!.shadowColor = "rgba(0, 0, 0, 0.2)";

      context!.closePath();
    };

    const shouldPop = (bubble: Bubble) => {
      const touchingEdge =
        bubble.x - bubble.radius <= 0 ||
        bubble.x + bubble.radius >= canvas.width ||
        bubble.y - bubble.radius <= 0 ||
        bubble.y + bubble.radius >= canvas.height;

      const randomChance = Math.random() < 0.0001;

      return touchingEdge || randomChance;
    };

    const updateBubble = (bubble: Bubble) => {
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      if (bubble.growth < bubble.radius) {
        const x = (bubble.growth / bubble.radius) * 12 - 6;
        const growthRate = sigmoid(x) * 2.0;
        bubble.growth += growthRate;

        if (bubble.growth > bubble.radius) {
          bubble.growth = bubble.radius;
        }
      }

      if (shouldPop(bubble)) {
        const index = bubbles.indexOf(bubble);
        bubbles.splice(index, 1);
        createBubble();
      }

      if (bubble.x - bubble.radius > canvas.width) {
        bubble.x = -bubble.radius;
      } else if (bubble.x + bubble.radius < 0) {
        bubble.x = canvas.width + bubble.radius;
      }

      if (bubble.y - bubble.radius > canvas.height) {
        bubble.y = -bubble.radius;
      } else if (bubble.y + bubble.radius < 0) {
        bubble.y = canvas.height + bubble.radius;
      }
    };

    const redrawCanvas = () => {
      context!.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => drawBubble(bubble));
    };

    const handleResize = () => {
      context = setupCanvas(canvas);
      if (!context) return;

      redrawCanvas();
    };

    window.addEventListener("resize", handleResize);

    for (let i = 0; i < bubbleCount; i++) {
      createBubble();
    }

    const render = () => {
      bubbles.forEach((bubble) => updateBubble(bubble));
      context!.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => drawBubble(bubble));

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, bubbleCount]);

  return (
    <div className="absolute inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="bg-gradient-to-br from-blue-300 to-pink-300 h-full w-full"
      />
      <div className="absolute inset-0 bg-transparent backdrop-blur-lg"></div>
    </div>
  );
};

export default BubbleBackground;
