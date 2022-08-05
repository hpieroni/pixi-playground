import { Container } from "pixi.js";
import { alignElements, type Alignment } from "./utils";

export interface ListOptions {
  direction?: "column" | "row";
  // the spacing between rows and columns. If a number is specified, it will use the same spacing for rows and columns
  spacing?: number;
  // Align items to the start, center or end of the container
  align?: Alignment;
}

class List extends Container {
  constructor(children: Container[], options: ListOptions = {}) {
    super();

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
      this.addChild(child);
    }

    if (direction === "column") {
      alignElements(align, children, this);
    }
  }
}

export default List;
