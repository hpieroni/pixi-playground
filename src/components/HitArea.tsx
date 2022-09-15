import { useEffect, useRef } from "react";
import { Container, Graphics, Text } from "pixi.js";
import { Box } from "@mui/material";
import PixiRenderer from "../pixi/PixiRenderer";
import Border from "../pixi/Border";
import BorderHitArea from "../pixi/BorderHitArea";

function HitArea() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    const example = new Container();
    const title = new Text("Border Hit Area (hover & click on the border)", {
      fontSize: 24,
      fill: 0xffffff,
    });
    example.position.set(120, 100);
    example.addChild(title);

    const borderWidth = 8;
    const border = new Border(
      { width: 200, height: 200 },
      { width: borderWidth, color: 0xffffff }
    );
    border.tint = 0xea1e63;
    example.addChild(border);

    border.interactive = true;
    border.buttonMode = true;
    border.hitArea = new BorderHitArea(border, { width: borderWidth });
    border.y = 50;

    border.on("pointerover", () => {
      border.tint = 0x00ff00;
    });

    border.on("pointerout", () => {
      border.tint = 0xea1e63;
    });

    border.on("pointerdown", () => {
      alert("Clicked on border!");
    });

    renderer.render(example);

    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default HitArea;
