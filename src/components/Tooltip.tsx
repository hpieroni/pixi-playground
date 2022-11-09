import { useEffect, useRef } from "react";
import { Box as MuiBox } from "@mui/material";
import { Container, Graphics, Text } from "pixi.js";
import PixiRenderer from "../pixi/PixiRenderer";
import Grid from "../pixi/Grid";
import Box from "../pixi/Box";
import Row from "../pixi/Row";
import Tooltip, {
  TooltipPlacement,
  TooltipPositionTarget,
} from "../pixi/Tooltip";

function TooltipExample() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderer = new PixiRenderer({
      view: canvasRef?.current as HTMLCanvasElement,
      resizeTo: containerRef?.current as HTMLElement,
      backgroundColor: 0x2c2c31,
    });

    const tooltipStyle = {
      background: { color: 0xea1e63 },
      border: {
        width: 2,
        color: 0xffffff,
      },
      padding: 10,
    };

    /**
     * Tooltips with target positioning
     */
    const targetTooltipExample = new Container();
    targetTooltipExample.x = 120;
    targetTooltipExample.y = 50;
    const targetTooltipTitle = new Text("Target Tooltips", {
      fontSize: 24,
      fill: 0xffffff,
    });
    targetTooltipExample.addChild(targetTooltipTitle);

    const targetTooltips = Object.values(TooltipPlacement).map((placement) => {
      const text = new Text(placement, { fontSize: 16, fill: 0xffffff });
      const box = new Box(text, {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      });
      new Tooltip(box, "I'm a tooltip", {
        placement,
        style: tooltipStyle,
        textStyle: { fontSize: 14, fill: 0xffffff },
      });
      return box;
    });

    const targetTooltipGrid = new Grid(targetTooltips, {
      columns: 3,
      spacing: 30,
    });
    targetTooltipGrid.y = 50;
    targetTooltipExample.addChild(targetTooltipGrid);
    /* ************************ */

    /**
     * Tooltips with pointer positioning
     */
    const pointerTooltipExample = new Container();
    pointerTooltipExample.x = 120;
    pointerTooltipExample.y = 350;
    const pointerTooltipTitle = new Text("Pointer Tooltips", {
      fontSize: 24,
      fill: 0xffffff,
    });
    pointerTooltipExample.addChild(pointerTooltipTitle);

    const pointerTooltips = Object.values(TooltipPlacement).map((placement) => {
      const text = new Text(placement, { fontSize: 16, fill: 0xffffff });
      const box = new Box(text, {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      });
      new Tooltip(box, "I'm a tooltip", {
        placement,
        positionTarget: TooltipPositionTarget.POINTER,
        style: tooltipStyle,
        textStyle: { fontSize: 14, fill: 0xffffff },
      });
      return box;
    });

    const pointerTooltipGrid = new Grid(pointerTooltips, {
      columns: 3,
      spacing: 30,
    });
    pointerTooltipGrid.y = 50;
    pointerTooltipExample.addChild(pointerTooltipGrid);
    /* ************************ */

    /**
     * Tooltips with delay
     */
    const delayedTooltipExample = new Container();
    delayedTooltipExample.x = 120;
    delayedTooltipExample.y = 650;
    const delayedTooltipTitle = new Text("Delayed Tooltip", {
      fontSize: 24,
      fill: 0xffffff,
    });
    delayedTooltipExample.addChild(delayedTooltipTitle);

    const delayedTooltipTarget = new Box(
      new Text("Hover me (500ms)", { fontSize: 16, fill: 0xffffff }),
      {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      }
    );
    new Tooltip(delayedTooltipTarget, "I'm a delayed tooltip", {
      style: tooltipStyle,
      textStyle: { fontSize: 14, fill: 0xffffff },
      delay: 500,
    });

    delayedTooltipTarget.y = 50;

    delayedTooltipExample.addChild(delayedTooltipTarget);

    /* ************************ */
    /**
     * Complex content
     */
    const complexTooltipExample = new Container();
    complexTooltipExample.x = 350;
    complexTooltipExample.y = 650;
    const complexTooltipTitle = new Text("Complex Tooltip Content", {
      fontSize: 24,
      fill: 0xffffff,
    });
    complexTooltipExample.addChild(complexTooltipTitle);

    const rect = new Graphics();
    rect.lineStyle(10, 0xffbd01, 1);
    rect.beginFill(0xc34288);
    rect.drawRect(50, 50, 100, 100);
    rect.endFill();
    const complexContent = new Row(
      [
        new Text("This is a title", {
          fontWeight: "bold",
          fontSize: 36,
          fill: 0xffffff,
        }),
        rect,
      ],
      { spacing: 10 }
    );
    const complexTooltipTarget = new Box(
      new Text("Hover me", { fontSize: 16, fill: 0xffffff }),
      {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      }
    );
    complexTooltipTarget.y = 50;

    new Tooltip(complexTooltipTarget, complexContent, {
      style: tooltipStyle,
      textStyle: { fontSize: 14, fill: 0xffffff },
    });

    complexTooltipExample.addChild(complexTooltipTarget);
    /* ************************ */

    renderer.render([
      targetTooltipExample,
      pointerTooltipExample,
      delayedTooltipExample,
      complexTooltipExample,
    ]);

    return () => renderer.destroy();
  }, []);

  return (
    <MuiBox ref={containerRef} width="100%" height="100vh" overflow="hidden">
      <canvas ref={canvasRef} />
    </MuiBox>
  );
}

export default TooltipExample;
