"use client";
import { useEffect, useState, useRef } from "react";

export default function TenKDigitsBg() {
  const [colors, setColors] = useState<string[]>([]);
  const [transform, setTransform] = useState("translate(0px, 0px)");
  const [isMobile, setIsMobile] = useState(false);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const COLS = 40;
  const ROWS = 40;

  // Check if device is mobile based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard breakpoint for mobile
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Fetch the file containing the hex digits of Pi
    fetch("/pi_hex_10k.txt")
      .then((response) => response.text())
      .then((data) => {
        const hexValues =
          data
            .split("\n") // Split into lines
            .map((line) => line.split(":")[0]) // Remove everything after ':'
            .join("") // Combine all lines
            .replace(/[^0-9a-fA-F]/g, "") // Remove non-hex characters
            .match(/.{1,6}/g) || []; // Group into 6-character chunks

        const valueArray = (hexValues || []).slice(0, 1600);
        setColors(valueArray.map((hex) => `#${hex.padEnd(6, "0")}`)); // Ensure valid hex colors
      });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Skip parallax effect on mobile devices
      if (isMobile || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to container
      const newPosition = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      mousePositionRef.current = newPosition;

      // Apply parallax directly to container div
      const parallaxX = (0.5 - newPosition.x) * 30;
      const parallaxY = (0.5 - newPosition.y) * 30;
      setTransform(`translate(${parallaxX}px, ${parallaxY}px)`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  // Draw canvas once when colors change
  useEffect(() => {
    if (colors.length > 0 && canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Set canvas dimensions to match container with device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Apply scaling for high DPI screens
      ctx.scale(dpr, dpr);

      // Draw the circles
      const ratio = (rect.width / rect.height)*5 ;
      const circleWidth = rect.width / (ratio* 20);
      const circleHeight = rect.height / (ratio * 20);

      for (let i = 0; i < colors.length; i++) {
        const row = Math.floor(i / COLS);
        const col = i % COLS;

        const x = (col * rect.width) / COLS + circleWidth / 2;
        const y = (row * rect.height) / ROWS + circleHeight / 2;

        // Draw the circle
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          Math.min(circleWidth, circleHeight) / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = "#fff4";
        ctx.stroke();
      }
    }
  }, [colors]);

  // Handle window resize - redraw canvas when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Update canvas dimensions
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Redraw the canvas (need to trigger the colors useEffect)
        setColors([...colors]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [colors]);

  return (
    <div
      ref={containerRef}
      className="z-0 h-full w-full relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-full h-full scale-87"
        style={{
          transform: isMobile ? "translate(0px, 0px)" : transform,
          transition: "transform 0.05s ease-out",
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
