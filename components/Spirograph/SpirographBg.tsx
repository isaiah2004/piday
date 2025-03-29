"use client";
import { useRef, useEffect } from "react";

const Spirograph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    let t = 0;
    // let tArms = 0; // Separate time variable for arms
    // const armSpeedMultiplier = 2; // Control the arm's speed relative to spirograph

    const R = 250; // Fixed circle radius
    const r = 50; // Rolling circle radius
    const d = 100; // Pen distance from rolling circle center

    ctx.translate(width / 2, height / 2);

    // Separate canvas for persistent spirograph lines
    const spirographCanvas = document.createElement("canvas");
    const spiroCtx = spirographCanvas.getContext("2d");
    if (!spiroCtx) return;

    spirographCanvas.width = width;
    spirographCanvas.height = height;
    spiroCtx.translate(width / 2, height / 2);

    const lastPoint = { x: 0, y: 0 };

    function drawSpirograph() {
      if (spiroCtx === null) return;
      spiroCtx.beginPath();
      for (let i = 0; i <= 1; i++) {
        const angle = 0.01 * i + t;
        const x =
          (R - r) * Math.cos(angle) + d * Math.cos(((R - r) / r) * angle);
        const y =
          (R - r) * Math.sin(angle) - d * Math.sin(((R - r) / r) * angle);
        spiroCtx.lineTo(x, y);
      }
      spiroCtx.strokeStyle = `hsl(60, 80%, 60%)`;
      spiroCtx.lineWidth = 1;
      spiroCtx.stroke();

      // Store last calculated point for arms
      const lastAngle = 0.01 * 500 + t;
      lastPoint.x =
        (R - r) * Math.cos(lastAngle) + d * Math.cos(((R - r) / r) * lastAngle);
      lastPoint.y =
        (R - r) * Math.sin(lastAngle) - d * Math.sin(((R - r) / r) * lastAngle);
    }

    function fadeArms(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Faster fade for arms
      ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    function drawArms() {
      const angle = t;
      const armX =
        (R - r) * Math.cos(angle) + d * Math.cos(((R - r) / r) * angle);
      const armY =
        (R - r) * Math.sin(angle) - d * Math.sin(((R - r) / r) * angle);

      if (ctx === null) return;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((R - r) * Math.cos(angle), (R - r) * Math.sin(angle));
      ctx.strokeStyle = "rgba(128, 128, 128, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo((R - r) * Math.cos(angle), (R - r) * Math.sin(angle));
      ctx.lineTo(armX, armY);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.stroke();
    }

    function animate() {
      fadeArms(ctx!);
      ctx!.drawImage(spirographCanvas, -width / 2, -height / 2);
      drawSpirograph();
      drawArms();

      t += 0.01; // Base speed

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
  );
};

export default Spirograph;
