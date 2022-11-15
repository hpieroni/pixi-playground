import { Container } from "pixi.js";
import { alignVertically, type Alignment } from "./utils";
import Box, { type StyleOptions } from "./Box";

export interface WrappedRowOptions {
  /**
   * The width  where the row will wrap
   */
  wrapWidth?: number;
  /**
   * The spacing between elements and spacing
   * @default 0
   */
  spacing?: number;
  /**
   * Align each row items to the start, center or end
   * @default start
   */
  align?: Alignment;
  /**
   * Box syles options (padding, border, background)
   */
  style?: StyleOptions;
}

/**
 * This works similar to how flex-wrap works in CSS
 */
class WrappedRow extends Container {
  constructor(children: Container[], options?: WrappedRowOptions) {
    super();

    const wrapWidth = options?.wrapWidth ?? Infinity;
    const spacing = options?.spacing ?? 0;
    const align = options?.align ?? "start";
    let nextX = 0;
    let nextY = 0;
    let row = new Container();

    const rowContainers = [];
    rowContainers.push(row);

    for (const child of children) {
      if (
        row.children.length &&
        row.width + child.width + spacing > wrapWidth
      ) {
        nextX = 0;
        nextY += row.height + spacing;
        row = new Container();
        rowContainers.push(row);
        row.y = nextY;
      }

      child.x = nextX;
      nextX += child.width + spacing;
      row.addChild(child);
    }

    for (const row of rowContainers) {
      alignVertically(align, row.children as Container[], row);
    }

    if (options?.style) {
      this.addChild(new Box(rowContainers, options.style));
    } else {
      rowContainers.forEach((row) => this.addChild(row));
    }
  }
}

export default WrappedRow;
