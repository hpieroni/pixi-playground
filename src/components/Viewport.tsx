import { useEffect, useRef, useState } from "react";
import { Sprite } from "pixi.js";
import PixiRenderer from "../pixi/PixiRenderer";
import { Box, Checkbox, FormControlLabel, Toolbar } from "@mui/material";

function ViewportExample() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<PixiRenderer>();
  const [plugins, setPlugins] = useState({ drag: true, wheel: true });

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    setRenderer(renderer);
    renderer.render(Sprite.from("./logo192.png"), {
      plugins: ["drag", "pinch", "wheel", "decelerate"],
    });

    return () => renderer.destroy();
  }, []);

  const changePlugin = (name: string, value: boolean) => {
    setPlugins({
      ...plugins,
      [name]: value,
    });
    if (value) {
      renderer?.resumePlugin(name);
    } else {
      renderer?.pausePlugin(name);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changePlugin(event.target.name, event.target.checked);
  };

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <Toolbar
        sx={{
          backgroundColor: "#ffffff17",
          borderBottom: "1px solid #ffffff1f",
        }}
      >
        <FormControlLabel
          label="Drag enabled"
          control={
            <Checkbox
              checked={plugins.drag}
              onChange={handleChange}
              name="drag"
            />
          }
        />
        <FormControlLabel
          label="Zoom enabled"
          control={
            <Checkbox
              checked={plugins.wheel}
              onChange={handleChange}
              name="wheel"
            />
          }
        />
      </Toolbar>

      <canvas ref={canvasRef} />
    </Box>
  );
}

export default ViewportExample;
