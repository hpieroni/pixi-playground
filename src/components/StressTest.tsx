import { useEffect, useRef } from "react";
import { Application, Sprite } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { drawerWidth } from "./Layout";

function StressTest() {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const width = window.innerWidth - drawerWidth;
    const height = window.innerHeight;

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

    const rows = 10;
    const columns = 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const sprite = Sprite.from("./logo192.png");
        sprite.x = i * 200;
        sprite.y = j * 200;
        viewport.addChild(sprite);
      }
    }

    viewport.fit();

    return () => app.destroy();
  }, []);

  return <canvas ref={containerRef} />;
}

export default StressTest;
