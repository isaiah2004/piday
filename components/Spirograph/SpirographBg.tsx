"use client";
import React, { useEffect, useRef, useState } from "react";

const Spirograph: React.FC = () => {
  const patternCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const FPS = 60; // Limit to 60 frames per second
  const frameInterval = 1000 / FPS;

  const drawing = true;

  const baseSpeedRef = useRef(0.01); // Use a ref to dynamically update baseSpeed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clear, setClear] = useState<boolean>(false);

  // State to track angles
  const angleRef = useRef<{ outer: number; inner: number }>({
    outer: 0,
    inner: 0,
  });

  // State to track path points with age for fading
  const pointsRef = useRef<Array<{ x: number; y: number; age: number }>>([]);
  // All path points for continuous line with a maximum size
  const allPointsRef = useRef<Array<{ x: number; y: number }>>([]);
  // const maxAllPoints = 4526; // Limit total points to prevent memory issues
  const maxAllPoints = 4; // Limit total points to prevent memory issues


  // Point object pool to reduce garbage collection
  const pointPoolRef = useRef<Array<{ x: number; y: number; age: number }>>([]);
  const allPointPoolRef = useRef<Array<{ x: number; y: number }>>([]);

  // Function to get a point from the pool or create a new one if needed
  const getPointFromPool = (): { x: number; y: number; age: number } => {
    if (pointPoolRef.current.length > 0) {
      return pointPoolRef.current.pop()!;
    }
    return { x: 0, y: 0, age: 0 };
  };

  const getAllPointFromPool = (): { x: number; y: number } => {
    if (allPointPoolRef.current.length > 0) {
      return allPointPoolRef.current.pop()!;
    }
    return { x: 0, y: 0 };
  };

  // Return points to the pool when no longer needed
  const returnPointToPool = (point: { x: number; y: number; age: number }) => {
    pointPoolRef.current.push(point);
  };

  const returnAllPointToPool = (point: { x: number; y: number }) => {
    allPointPoolRef.current.push(point);
  };

  const maxTrailPoints = 800; // Maximum number of points to keep in the trail
  const trailFadeRate = 0.01; // How quickly the trail fades (0-1)

  // Draw just the spirograph pattern
  const drawSpirographPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    // Only clear when explicitly requested
    if (clear) {
      ctx.clearRect(0, 0, width, height);
    }

    // Draw the continuous line without clearing first
    ctx.beginPath();
    if (allPointsRef.current.length > 0) {
      ctx.moveTo(allPointsRef.current[0].x, allPointsRef.current[0].y);
      for (let i = 1; i < allPointsRef.current.length; i++) {
        ctx.lineTo(allPointsRef.current[i].x, allPointsRef.current[i].y);
      }
    }
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Draw the controls, arms, circles and trail
  const drawControlElements = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Adjust center coordinates for devicePixelRatio
    const centerX = width / 2 / devicePixelRatio;
    const centerY = height / 2 / devicePixelRatio;

    // Dynamically calculate radii based on display size
    const outerRadius = Math.min(width, height) * 0.2; // 20% of the smaller dimension
    const innerRadius = outerRadius * 0.5;

    // Calculate outer arm position
    const outerX = centerX + Math.cos(angleRef.current.outer) * outerRadius;
    const outerY = centerY + Math.sin(angleRef.current.outer) * outerRadius;

    // Calculate pen position (end of inner arm)
    const penX = outerX + Math.cos(angleRef.current.inner) * innerRadius;
    const penY = outerY + Math.sin(angleRef.current.inner) * innerRadius;

    // Get point from pool instead of creating new object
    const newPoint = getPointFromPool();
    newPoint.x = penX;
    newPoint.y = penY;
    newPoint.age = 0;
    pointsRef.current.push(newPoint);

    // Get all point from pool
    const newAllPoint = getAllPointFromPool();
    newAllPoint.x = penX;
    newAllPoint.y = penY;
    allPointsRef.current.push(newAllPoint);

    // Limit trail length for fading effect
    if (pointsRef.current.length > maxTrailPoints) {
      const removedPoint = pointsRef.current.shift();
      if (removedPoint) returnPointToPool(removedPoint);
    }

    // Limit total points to prevent memory issues
    if (allPointsRef.current.length > maxAllPoints) {
      const removedAllPoint = allPointsRef.current.shift();
      if (removedAllPoint) returnAllPointToPool(removedAllPoint);
    }

    // Age existing points
    pointsRef.current.forEach((point) => {
      point.age += trailFadeRate;
    });

    // Clear canvas if requested
    if (clear) {
      ctx.clearRect(0, 0, width, height);

      // Return all points to pool before clearing arrays
      pointsRef.current.forEach((point) => returnPointToPool(point));
      allPointsRef.current.forEach((point) => returnAllPointToPool(point));

      pointsRef.current = [];
      allPointsRef.current = [];
    }

    // Clear the controls canvas
    ctx.clearRect(0, 0, width, height);

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

        const color = `rgba(200, 200, 255, ${opacity})`;
        const glowColor = `rgba(255, 255, 250, ${opacity * 0.8})`;

        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2 + (1 - currentPoint.age) * 3; // Thicker for newer points
        ctx.stroke();
      }
    }

    const circleStrokeColor = "#ffffff4f";
    const circleFillColor = "#ffffff0f";

    // outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = circleStrokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    // outer circle fill
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = circleFillColor;
    ctx.fill();
    //inner circle
    ctx.beginPath();
    ctx.arc(outerX, outerY, innerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = circleStrokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    //inner circle fill
    ctx.beginPath();
    ctx.arc(outerX, outerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = circleFillColor;
    ctx.fill();

    const armStrokeColor = "#ffffff88";
    // Draw outer arm
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(outerX, outerY);
    ctx.strokeStyle = armStrokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner arm
    ctx.beginPath();
    ctx.moveTo(outerX, outerY);
    ctx.lineTo(penX, penY);
    ctx.strokeStyle = armStrokeColor;
    ctx.stroke();

    // join size radius
    const pointRadius = 10;
    const fillColor = "#efe7";

    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw outer joint
    ctx.beginPath();
    ctx.arc(outerX, outerY, pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw pen point
    ctx.beginPath();
    ctx.arc(penX, penY, 3, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
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

  const animate = (timestamp: number): void => {
    if (!patternCanvasRef.current || !controlsCanvasRef.current) return;

    // Implement frame rate control
    const elapsed = timestamp - lastFrameTimeRef.current;
    if (elapsed < frameInterval) {
      requestIdRef.current = requestAnimationFrame(animate);
      return;
    }

    // Calculate actual FPS and adjust for dropped frames
    lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

    const patternCanvas = patternCanvasRef.current;
    const controlsCanvas = controlsCanvasRef.current;
    const patternCtx = patternCanvas.getContext("2d");
    const controlsCtx = controlsCanvas.getContext("2d");

    if (!patternCtx || !controlsCtx) return;

    // Define frequency to control the wavelength of the sine function
    const frequency = 0.5; // Adjust this value to control the wavelength (higher = faster oscillations)

    // Update baseSpeed dynamically using a sine function
    const time = timestamp / 1000; // Time in seconds
    baseSpeedRef.current = 0.04 + 0.01 * Math.sin(time * frequency); // Base speed oscillates based on frequency

    const outerArmSpeed = baseSpeedRef.current;
    const innerArmSpeed = baseSpeedRef.current * Math.PI;

    // Update angles based on dynamic speeds
    angleRef.current.outer += outerArmSpeed;
    angleRef.current.inner += innerArmSpeed;

    // Draw on both canvases
    drawSpirographPattern(patternCtx, patternCanvas.width, patternCanvas.height);
    drawControlElements(controlsCtx, controlsCanvas.width, controlsCanvas.height);

    if (drawing) {
      requestIdRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    // Pre-populate point pools to avoid allocations during animation
    for (let i = 0; i < 1000; i++) {
      pointPoolRef.current.push({ x: 0, y: 0, age: 0 });
      allPointPoolRef.current.push({ x: 0, y: 0 });
    }

    if (!patternCanvasRef.current || !controlsCanvasRef.current) return;

    const patternCanvas = patternCanvasRef.current;
    const controlsCanvas = controlsCanvasRef.current;
    const patternCtx = patternCanvas.getContext("2d");
    const controlsCtx = controlsCanvas.getContext("2d");
    
    if (!patternCtx || !controlsCtx) return;

    // Adjust canvas size for high-resolution displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth; // Use window dimensions for centering
    const height = window.innerHeight;

    // Set size for both canvases
    [patternCanvas, controlsCanvas].forEach(canvas => {
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(devicePixelRatio, devicePixelRatio);
      canvas.style.width = `${width}px`; // Ensure proper scaling
      canvas.style.height = `${height}px`;
    });

    if (drawing) {
      lastFrameTimeRef.current = performance.now();
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

  return (
    <div className="relative h-screen w-screen">
      <canvas 
        ref={patternCanvasRef} 
        className="absolute inset-0 h-full w-full" 
      />
      <canvas 
        ref={controlsCanvasRef} 
        className="absolute inset-0 h-full w-full" 
      />
    </div>
  );
};

export default Spirograph;