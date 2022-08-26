import { Container } from "pixi.js";
import { alignElements, chunk, type Alignment } from "./utils";
import BoxContainer, { type StyleOptions } from "./BoxContainer";

export interface GridOptions {
  /**
   * By default all elements will be arranged in one row. Set it to 1 for a vertical list or use a List component
   */
  columns?: number;
  /**
   * The spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
   */
  spacing?: number | { row?: number; column?: number };
  /**
   * Align items to the start, center or end of the container
   */
  align?: Alignment;
  /**
   * BoxContainer syles options (padding, border, background)
   */
  style?: StyleOptions;
}

class Grid extends Container {
  constructor(children: Container[], options: GridOptions = {}) {
    super();

    const content = new Container();
    const columns = options.columns ?? children.length;
    const rows = chunk(children, columns);

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

    for (const row of rows) {
      const rowContainer = new Container();

      for (const element of row) {
        element.x = nextX;
        element.y = nextY;
        nextX += element.width + columnSpacing;
        rowContainer.addChild(element);
      }

      nextX = 0;
      nextY += rowContainer.y + rowContainer.height + rowSpacing;

      content.addChild(rowContainer);
    }

    alignElements(align, content.children as Container[], content);

    this.addChild(new BoxContainer(content, options.style));
  }
}

export default Grid;
