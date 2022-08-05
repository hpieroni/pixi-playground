import { useEffect, useRef } from "react";
import PixiRenderer from "../../pixi/PixiRenderer";
import { Box } from "@mui/material";
import Diagram from "./Example";
import data from "./data.json";

function PixiLayout() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new PixiRenderer({
      app: {
        view: canvasRef.current as HTMLCanvasElement,
        resizeTo: containerRef.current as HTMLElement,
        backgroundColor: 0x2c2c31,
      },
      viewport: {
        plugins: ["drag", "pinch", "wheel", "decelerate"],
      },
    });

    renderer.render(new Diagram(data));
    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default PixiLayout;
