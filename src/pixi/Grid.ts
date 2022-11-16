import { Container } from "pixi.js";
import { alignHorizontally, chunk, type Alignment } from "./utils";
import Box, { type StyleOptions } from "./Box";

export interface GridOptions {
  /**
   * By default all elements will be arranged in one row. Set it to 1 for a column layout or use a Column component
   */
  columns?: number;
  /**
   * The spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
   * @default 0
   */
  spacing?: number | { row?: number; column?: number };
  /**
   * Align items to the start, center or end of the container
   * @default 'start'
   */
  align?: Alignment;
  /**
   * Box syles options (padding, border, background)
   */
  style?: StyleOptions;
}

class Grid extends Container {
  constructor(children: Container[], options: GridOptions = {}) {
    super();

    const columns = options.columns ?? children.length;
    const rows = chunk(children, columns);
    const rowContainers = [];

    const rowSpacing =
      typeof options.spacing === "number"
        ? options.spacing
        : options.spacing?.row ?? 0;
    const columnSpacing =
      typeof options.spacing === "number"
        ? options.spacing
        : options.spacing?.column ?? 0;
    const align = options.align ?? "start";

    let nextX = 0;
    let nextY = 0;
    let width = 0;

    for (const row of rows) {
      const rowContainer = new Container();
      rowContainer.y = nextY;

      for (const element of row) {
        element.x = nextX;
        nextX += element.width + columnSpacing;
        rowContainer.addChild(element);
      }

      nextX = 0;
      nextY += rowContainer.height + rowSpacing;
      width = Math.max(width, rowContainer.width);
      rowContainers.push(rowContainer);
    }

    alignHorizontally(align, rowContainers as Container[], { width });

    if (options.style) {
      this.addChild(new Box(rowContainers, options.style));
    } else {
      rowContainers.forEach((row) => this.addChild(row));
    }
  }
}

export default Grid;
