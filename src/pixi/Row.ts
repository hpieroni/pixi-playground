import { Container } from "pixi.js";
import { alignVertically, type Alignment } from "./utils";
import Box, { type StyleOptions } from "./Box";

export interface RowOptions {
  /**
   * The spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
   */
  spacing?: number;
  /**
   * Align items to the start, center or end of the container
   */
  align?: Alignment;
  /**
   * Box syles options (padding, border, background)
   */
  style?: StyleOptions;
}

class Row extends Container {
  constructor(children: Container[], options: RowOptions = {}) {
    super();

    const spacing = options.spacing ?? 0;
    const align = options.align ?? "start";
    let offset = 0;
    let height = 0;

    for (const child of children) {
      child.x = offset;
      offset += child.width + spacing;
      height = Math.max(height, child.height);
    }

    alignVertically(align, children, { height });

    if (options.style) {
      this.addChild(new Box(children, options.style));
    } else {
      children.forEach((child) => this.addChild(child));
    }
  }
}

export default Row;
