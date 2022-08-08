import { useEffect, useRef } from "react";
import { Graphics, InteractionData, InteractionEvent, Point } from "pixi.js";
import { Box } from "@mui/material";
import PixiRenderer from "../pixi/PixiRenderer";

class Resizer extends Graphics {
  private dragging: boolean = false;
  private data: InteractionData | null = null;

  constructor() {
    super();

    this.draw();
    this.initializeInteractions();
  }

  private draw() {
    this.beginFill(0xecedf1).drawCircle(0, 0, 5).endFill();
  }

  private initializeInteractions() {
    this.interactive = true;
    this.cursor = "nwse-resize";

    this.on("pointerdown", this.onDragStart, this)
      .on("pointerup", this.onDragEnd, this)
      .on("pointerupoutside", this.onDragEnd, this)
      .on("pointermove", this.onDragMove, this);
  }

  private onDragStart(event: InteractionEvent): void {
    this.data = event.data;
    this.dragging = true;
  }

  private onDragEnd(e: InteractionEvent): void {
    this.data = null;
    this.dragging = false;
  }

  private onDragMove(e: InteractionEvent): void {
    if (this.dragging) {
      const currentPosition = this.data!.getLocalPosition(this.parent);
      (this.parent as Rectangle).resize(currentPosition);
      this.position.set(currentPosition.x, currentPosition.y);
    }
  }
}

class Rectangle extends Graphics {
  constructor(width: number, height: number) {
    super();

    this.draw(width, height);

    const resizer = new Resizer();
    resizer.position.set(this.width, this.height);
    this.addChild(resizer);
  }

  private draw(width: number, height: number) {
    this.lineStyle(4, 0xea1e63, 1).drawRect(0, 0, width, height);
  }

  public resize(position: Point) {
    this.clear();
    this.draw(position.x, position.y);
  }
}

function Resize() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    const rectangle = new Rectangle(300, 200);
    rectangle.position.set(300, 200);

    renderer.render(rectangle);

    return () => renderer.destroy();
  }, []);

  return (
    <Box ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </Box>
  );
}

export default Resize;
