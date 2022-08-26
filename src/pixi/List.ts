import { Container } from "pixi.js";
import { alignElements, type Alignment } from "./utils";
import BoxContainer, { type StyleOptions } from "./BoxContainer";

export interface ListOptions {
  /**
   * List items will be arranged in one column or row.
   * @default "column"
   */
  direction?: "column" | "row";
  /**
   * The spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
   */
  spacing?: number;
  /**
   * Align items to the start, center or end of the container
   */
  align?: Alignment;
  /**
   * BoxContainer syles options (padding, border, background)
   */
  style?: StyleOptions;
}

class List extends Container {
  constructor(children: Container[], options: ListOptions = {}) {
    super();

    const content = new Container();
    const direction = options.direction ?? "column";
    const spacing = options.spacing ?? 0;
    const align = options.align ?? "start";
    let offset = 0;

    for (const child of children) {
      if (direction === "column") {
        child.y = offset;
        offset += child.height + spacing;
      } else {
        child.x = offset;
        offset += child.width + spacing;
      }
      content.addChild(child);
    }

    if (direction === "column") {
      alignElements(align, children, content);
    }

    this.addChild(new BoxContainer(content, options.style));
  }
}

export default List;
