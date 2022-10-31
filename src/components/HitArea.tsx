import { useEffect, useRef } from "react";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { Box } from "@mui/material";
import PixiRenderer from "../pixi/PixiRenderer";
import Border from "../pixi/Border";
import BorderHitArea from "../pixi/BorderHitArea";
import CompoundHitArea from "../pixi/CompoundHitArea";

const borderWidth = 8;
const textStyle = {
  fontSize: 16,
  fill: 0xffffff,
};

function HitArea() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const borderExample = () => {
    const example = new Container();
    const title = new Text(
      "Border Hit Area (hover & click on the border)",
      textStyle
    );
    example.position.set(50, 100);
    example.addChild(title);

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

    return example;
  };

  const compoundExample = () => {
    const example = new Container();
    const title2 = new Text(
      "Compound Hit Area (hover & click on shape)",
      textStyle
    );
    example.position.set(400, 100);
    example.addChild(title2);

    const rectangle = new Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, 100, 50)
      .endFill();
    rectangle.tint = 0xea1e63;

    const border = new Border(
      { width: 200, height: 200 },
      { width: borderWidth, color: 0xffffff }
    );
    border.tint = 0xea1e63;
    border.y = rectangle.height;

    const compound = new Container();
    compound.y = 50;
    compound.addChild(rectangle, border);

    border.hitArea = new BorderHitArea(border, { width: borderWidth });
    border.y = 50;

    compound.interactive = true;
    compound.buttonMode = true;
    compound.hitArea = new CompoundHitArea([
      new Rectangle(0, 0, rectangle.width, rectangle.height),
      new BorderHitArea(border, { width: borderWidth }),
    ]);

    compound.on("pointerover", () => {
      rectangle.tint = 0x00ff00;
      border.tint = 0x00ff00;
    });

    compound.on("pointerout", () => {
      rectangle.tint = 0xea1e63;
      border.tint = 0xea1e63;
    });

    compound.on("pointerdown", () => {
      alert("Clicked!");
    });

    example.addChild(compound);

    return example;
  };

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    renderer.render([borderExample(), compoundExample()]);

    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default HitArea;
