import { useEffect, useRef } from "react";
import {
  Application,
  Graphics,
  InteractionData,
  InteractionEvent,
  Point,
  DisplayObject,
} from "pixi.js";
import { drawerWidth } from "./Layout";

class Rectangle extends Graphics {
  private dragging: boolean = false;
  private data: InteractionData | null = null;
  private dragPointerStart?: DisplayObject;
  private dragInitialPosition?: Point;

  constructor(width: number, height: number, color: number) {
    super();

    this.draw(width, height, color);
    this.initializeInteractions();
  }

  private draw(width: number, height: number, color: number) {
    this.beginFill(color);
    this.drawRect(0, 0, width, height);
    this.endFill();
  }

  private initializeInteractions() {
    this.on("pointerdown", this.onDragStart, this)
      .on("pointerup", this.onDragEnd, this)
      .on("pointerupoutside", this.onDragEnd, this)
      .on("pointermove", this.onDragMove, this);

    this.interactive = true;
  }

  private onDragStart(event: InteractionEvent): void {
    this.data = event.data;
    this.dragging = true;

    this.dragPointerStart = event.data.getLocalPosition(this.parent);
    this.dragInitialPosition = new Point().copyFrom(this.position);
  }

  private onDragEnd(e: InteractionEvent): void {
    this.data = null;
    this.dragging = false;
  }

  private onDragMove(e: InteractionEvent): void {
    if (this.dragging) {
      const currentPointer = this.data!.getLocalPosition(this.parent);
      this.position.set(
        this.dragInitialPosition!.x +
          (currentPointer.x - this.dragPointerStart!.x),
        this.dragInitialPosition!.y +
          (currentPointer.y - this.dragPointerStart!.y)
      );
    }
  }
}

function DragAndDrop() {
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

    const rect1 = new Rectangle(100, 100, 0xea1e63);
    rect1.position.set(20, 20);
    app.stage.addChild(rect1);

    const rect2 = new Rectangle(100, 50, 0xecedf1);
    rect2.position.set(300, 100);
    app.stage.addChild(rect2);

    return () => app.destroy();
  }, []);

  return <canvas ref={containerRef} />;
}

export default DragAndDrop;
