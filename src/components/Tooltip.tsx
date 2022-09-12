import { useEffect, useRef } from "react";
import { Box as MuiBox } from "@mui/material";
import { Container, Text } from "pixi.js";
import PixiRenderer from "../pixi/PixiRenderer";
import Grid from "../pixi/Grid";
import Box from "../pixi/Box";
import Tooltip, {
  TooltipPosition,
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
    const targetTooltipTitle = new Text("Target Tooltips", {
      fontSize: 24,
      fill: 0xffffff,
    });
    targetTooltipExample.addChild(targetTooltipTitle);
    targetTooltipTitle.x = 120;
    targetTooltipTitle.y = 50;

    const targetTooltips = Object.values(TooltipPosition).map((position) => {
      const text = new Text(position, { fontSize: 16, fill: 0xffffff });
      const box = new Box(text, {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      });
      new Tooltip(box, "I'm a tooltip", {
        position,
        style: tooltipStyle,
        textStyle: { fontSize: 14, fill: 0xffffff },
      });
      return box;
    });

    const targetTooltipGrid = new Grid(targetTooltips, {
      columns: 3,
      spacing: 30,
    });
    targetTooltipGrid.x = 120;
    targetTooltipGrid.y = 100;
    targetTooltipExample.addChild(targetTooltipGrid);
    /* ************************ */

    /**
     * Tooltips with pointer positioning
     */
    const pointerTooltipExample = new Container();
    const pointerTooltipTitle = new Text("Pointer Tooltips", {
      fontSize: 24,
      fill: 0xffffff,
    });
    pointerTooltipExample.addChild(pointerTooltipTitle);
    pointerTooltipTitle.x = 120;
    pointerTooltipTitle.y = 350;

    const pointerTooltips = Object.values(TooltipPosition).map((position) => {
      const text = new Text(position, { fontSize: 16, fill: 0xffffff });
      const box = new Box(text, {
        padding: 10,
        background: { color: 0x808080 },
        minWidth: 120,
      });
      new Tooltip(box, "I'm a tooltip", {
        position,
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
    pointerTooltipGrid.x = 120;
    pointerTooltipGrid.y = 400;
    pointerTooltipExample.addChild(pointerTooltipGrid);
    /* ************************ */

    /**
     * Tooltips with delay
     */
    const delayedTooltipExample = new Container();
    const delayedTooltipTitle = new Text("Delayed Tooltip", {
      fontSize: 24,
      fill: 0xffffff,
    });
    delayedTooltipExample.addChild(delayedTooltipTitle);
    delayedTooltipTitle.x = 120;
    delayedTooltipTitle.y = 650;

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

    delayedTooltipTarget.x = 120;
    delayedTooltipTarget.y = 700;
    delayedTooltipExample.addChild(delayedTooltipTarget);
    /* ************************ */

    renderer.render([
      targetTooltipExample,
      pointerTooltipExample,
      delayedTooltipExample,
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
