"use client";
import { useRef, useEffect } from "react";

const Spirograph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for controlling the speed of the inner and outer arms
  //   const [innerSpeed, setInnerSpeed] = useState(0.01);
  //   const [outerSpeed, setOuterSpeed] = useState(0.005);
  const baseSpeed = 0.001;
  const innerSpeed = baseSpeed;
  const outerSpeed = baseSpeed * Math.PI;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    let tInner = 0; // Time variable for the inner arm
    let tOuter = 0; // Time variable for the outer arm

    const R = 250; // Fixed circle radius
    const r = 50; // Rolling circle radius
    const d = 100; // Pen distance from rolling circle center

    ctx.translate(width / 2, height / 2);

    const spirographCanvas = document.createElement("canvas");
    const spiroCtx = spirographCanvas.getContext("2d");
    if (!spiroCtx) return;

    spirographCanvas.width = width;
    spirographCanvas.height = height;
    spiroCtx.translate(width / 2, height / 2);

    function drawSpirograph() {
      if (spiroCtx === null) return;
      spiroCtx.beginPath();
      for (let i = 0; i <= 1; i++) {
        const angleInner = 0.01 * i + tInner; // Use tInner for the inner arm
        const angleOuter = 0.01 * i  + tOuter; // Use tOuter for the outer arm
        const x =
          (R - r) * Math.cos(angleOuter) +
          d * Math.cos(((R - r) / r) * angleInner);
        const y =
          (R - r) * Math.sin(angleOuter) -
          d * Math.sin(((R - r) / r) * angleInner);
        spiroCtx.lineTo(x, y);
      }
      spiroCtx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      spiroCtx.lineWidth = 1;
      spiroCtx.stroke();
    }

    function fadeArms(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    function drawArms() {
      const angleInner = tInner;
      const angleOuter = tOuter;
      const armX =
        (R - r) * Math.cos(angleOuter) +
        d * Math.cos(((R - r) / r) * angleInner);
      const armY =
        (R - r) * Math.sin(angleOuter) -
        d * Math.sin(((R - r) / r) * angleInner);

      if (ctx === null) return;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        (R - r) * Math.cos(angleOuter),
        (R - r) * Math.sin(angleOuter)
      );
      ctx.strokeStyle = "rgba(128, 128, 128, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(
        (R - r) * Math.cos(angleOuter),
        (R - r) * Math.sin(angleOuter)
      );
      ctx.lineTo(armX, armY);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.stroke();
    }

    function animate() {
      fadeArms(ctx!);
      ctx!.drawImage(spirographCanvas, -width / 2, -height / 2);
      drawSpirograph();
      drawArms();
      tInner += innerSpeed; // Increment inner arm speed
      tOuter += outerSpeed; // Increment outer arm speed

      requestAnimationFrame(animate);
    }

    animate();
  }, [innerSpeed, outerSpeed]); // Re-run effect when speeds change

  return (
    <div>
      <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />

    </div>
  );
};

export default Spirograph;
