import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { Container, Graphics, Text } from "pixi.js";
import PixiRenderer from "../pixi/PixiRenderer";

function Masking() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const textStyle = { fontSize: 16, fill: 0xffffff };

    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    const container = new Container();
    container.position.set(100, 100);

    const objectText = new Text("Object", textStyle);
    const circle = new Graphics();
    circle.beginFill(0xea1e63).drawCircle(100, 100, 100).endFill();
    circle.y = 50;
    container.addChild(objectText);
    container.addChild(circle);

    const maskText = new Text("Mask", textStyle);
    maskText.x = 300;
    const mask = new Graphics();
    mask
      .beginFill(0xffffff)
      .drawPolygon([
        circle.width / 2,
        0,
        circle.width,
        0,
        circle.width,
        circle.height,
        0,
        circle.height,
        0,
        circle.height / 2,
        circle.width / 2,
        circle.height / 2,
      ])
      .endFill();
    mask.position.set(300, 50);
    container.addChild(maskText);
    container.addChild(mask);

    const maskedObjectText = new Text("Object with mask", textStyle);
    maskedObjectText.x = 600;
    const maskedObject = circle.clone();
    maskedObject.position.set(600, 50);
    const maskToApply = mask.clone();
    maskToApply.position.set(600, 50);
    maskedObject.mask = maskToApply;

    container.addChild(maskToApply);
    container.addChild(maskedObjectText);
    container.addChild(maskedObject);

    renderer.render(container);

    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default Masking;
