import { useEffect, useRef, useState } from "react";
import { Application, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Checkbox, FormControlLabel, Toolbar } from "@mui/material";
import { drawerWidth } from "./Layout";

const toolbarHeight = 64;

function ViewportExample() {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState<Viewport>();
  const [plugins, setPlugins] = useState({ drag: true, wheel: true });

  useEffect(() => {
    const width = window.innerWidth - drawerWidth;
    const height = window.innerHeight - toolbarHeight;

    const app = new Application({
      view: containerRef?.current as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x2c2c31,
      width,
      height,
    });

    // create viewport
    const viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: app.renderer.plugins.interaction,
    });

    // add the viewport to the stage
    app.stage.addChild(viewport);

    // activate plugins
    viewport.drag().pinch().wheel().decelerate();

    const sprite = Sprite.from("./logo192.png");
    sprite.position.set(0, 0);
    viewport.addChild(sprite);

    setViewport(viewport);

    return () => app.destroy(false, { children: true });
  }, []);

  const changePlugin = (name: string, value: boolean) => {
    setPlugins({
      ...plugins,
      [name]: value,
    });
    if (value) {
      viewport?.plugins.resume(name);
    } else {
      viewport?.plugins.pause(name);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changePlugin(event.target.name, event.target.checked);
  };

  return (
    <>
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
      <canvas ref={containerRef} />
    </>
  );
}

export default ViewportExample;