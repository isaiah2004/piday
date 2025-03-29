"use client";
import React, { useEffect, useRef, useState } from "react";

const Spirograph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);

  const baseSpeed = 0.05;
  const outerArmSpeed = baseSpeed;
  const innerArmSpeed = baseSpeed * Math.PI;
  const drawing = true;
  const [clear, setClear] = useState<boolean>(false);

  // State to track angles
  const angleRef = useRef<{ outer: number; inner: number }>({
    outer: 0,
    inner: 0,
  });
  
  // State to track path points with age for fading
  const pointsRef = useRef<Array<{ x: number; y: number; age: number }>>([]);
  // All path points for continuous line
  const allPointsRef = useRef<Array<{ x: number; y: number }>>([]);
  
  const maxTrailPoints = 100; // Maximum number of points to keep in the trail
  const trailFadeRate = 0.02; // How quickly the trail fades (0-1)

  const drawSpirograph = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    const centerX = width / 2;
    const centerY = height / 2;

    // const outerRadius = Math.min(width, height) * 0.2;
    const outerRadius = 200;
    const innerRadius = outerRadius * 0.4;

    // Update angles
    angleRef.current.outer += outerArmSpeed;
    angleRef.current.inner += innerArmSpeed;

    // Calculate outer arm position
    const outerX = centerX + Math.cos(angleRef.current.outer) * outerRadius;
    const outerY = centerY + Math.sin(angleRef.current.outer) * outerRadius;

    // Calculate pen position (end of inner arm)
    const penX = outerX + Math.cos(angleRef.current.inner) * innerRadius;
    const penY = outerY + Math.sin(angleRef.current.inner) * innerRadius;

    // Add point to fading trail with age 0
    pointsRef.current.push({ x: penX, y: penY, age: 0 });
    
    // Add point to continuous line
    allPointsRef.current.push({ x: penX, y: penY });

    // Limit trail length for fading effect
    if (pointsRef.current.length > maxTrailPoints) {
      pointsRef.current.shift();
    }

    // Age existing points
    pointsRef.current.forEach((point) => {
      point.age += trailFadeRate;
    });

    // Clear canvas if requested
    if (clear) {
      ctx.clearRect(0, 0, width, height);
      pointsRef.current = [];
      allPointsRef.current = [];
      setClear(false);
    }

    // Draw the spirograph structure
    ctx.clearRect(0, 0, width, height);

    // Draw the continuous line first (background)
    ctx.beginPath();
    if (allPointsRef.current.length > 0) {
      ctx.moveTo(allPointsRef.current[0].x, allPointsRef.current[0].y);
      for (let i = 1; i < allPointsRef.current.length; i++) {
        ctx.lineTo(allPointsRef.current[i].x, allPointsRef.current[i].y);
      }
    }
    ctx.strokeStyle = "#fffb"; // Very transparent white
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw the trail with gradient opacity
    if (pointsRef.current.length > 1) {
      for (let i = 1; i < pointsRef.current.length; i++) {
        const prevPoint = pointsRef.current[i - 1];
        const currentPoint = pointsRef.current[i];

        // Calculate opacity based on age (newer points are more visible)
        const opacity = Math.max(0, 1 - currentPoint.age);

        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);

        // Create gradient for glow effect
        const gradient = ctx.createLinearGradient(
          prevPoint.x,
          prevPoint.y,
          currentPoint.x,
          currentPoint.y
        );

        const color = `rgba(255, 255, 255, ${opacity})`;
        const glowColor = `rgba(150, 200, 255, ${opacity * 0.8})`;

        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + (1 - currentPoint.age) * 3; // Thicker for newer points
        ctx.stroke();
      }
    }

    // Draw outer arm
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(outerX, outerY);
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner arm
    ctx.beginPath();
    ctx.moveTo(outerX, outerY);
    ctx.lineTo(penX, penY);
    ctx.strokeStyle = "#888";
    ctx.stroke();

    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();

    // Draw outer joint
    ctx.beginPath();
    ctx.arc(outerX, outerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#555";
    ctx.fill();

    // Draw pen point
    ctx.beginPath();
    ctx.arc(penX, penY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Add glow around the pen point
    ctx.beginPath();
    ctx.arc(penX, penY, 6, 0, Math.PI * 2);
    const glowGradient = ctx.createRadialGradient(
      penX,
      penY,
      2,
      penX,
      penY,
      10
    );
    glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glowGradient;
    ctx.fill();
  };

  const animate = (): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    drawSpirograph(ctx, canvas.width, canvas.height);

    if (drawing) {
      requestIdRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (drawing) {
      requestIdRef.current = requestAnimationFrame(animate);
    } else if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawing]);

  return <canvas ref={canvasRef} className="h-screen w-screen bg-primary" />;
};

export default Spirograph;