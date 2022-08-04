import { useEffect, useRef } from "react";
import PixiRenderer from "../../pixi/PixiRenderer";
import { Box } from "@mui/material";
import Diagram from "./Example";
import data from "./data.json";

function PixiLayout() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const app = new PixiRenderer({
      app: {
        view: canvasRef.current as HTMLCanvasElement,
        resizeTo: containerRef.current as HTMLElement,
      },
    });

    app.render(new Diagram(data));
    return () => app.destroy();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#2c2c31",
      }}
    >
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default PixiLayout;
