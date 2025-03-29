"use client";
import React, { useEffect, useRef, useState } from "react";

const Spirograph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);

  const baseSpeed=0.05;
  const outerArmSpeed = baseSpeed;
  const innerArmSpeed = baseSpeed * Math.PI;
  const drawing = true;
  const [clear, setClear] = useState<boolean>(false);

  // State to track angles
  const angleRef = useRef<{ outer: number; inner: number }>({
    outer: 0,
    inner: 0,
  });
  // State to track path points
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);

  const drawSpirograph = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    const centerX = width / 2;
    const centerY = height / 2;

    // const outerRadius = Math.min(width, height) * 0.2;
    const outerRadius = 150;
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

    // Add point to path
    pointsRef.current.push({ x: penX, y: penY });

    // Clear canvas if requested
    if (clear) {
      ctx.clearRect(0, 0, width, height);
      pointsRef.current = [];
      setClear(false);
    }

    // Draw the spirograph structure
    ctx.clearRect(0, 0, width, height);

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

    // Draw the path
    ctx.beginPath();
    if (pointsRef.current.length > 0) {
      ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
      for (let i = 1; i < pointsRef.current.length; i++) {
        ctx.lineTo(pointsRef.current[i].x, pointsRef.current[i].y);
      }
    }
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
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

  // const handleClearCanvas = (): void => {
  //   setClear(true);
  // };

  // const handleToggleDrawing = (): void => {
  //   setDrawing((prev) => !prev);
  // };

  return <canvas ref={canvasRef} className="h-screen w-screen bg-primary" />;
};

export default Spirograph;
