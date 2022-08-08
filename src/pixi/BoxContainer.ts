import { Container, Graphics } from "pixi.js";
import BorderBox, { type BorderConfig } from "./BorderBox";

export interface BoxContainerOptions {
  border?: BorderConfig;
  padding?: number;
  background?: {
    color: number;
    alpha?: number;
  };
}

class BoxContainer extends Container {
  private content: Container;

  constructor(children: Container[] = [], options?: BoxContainerOptions) {
    super();

    const padding = options?.padding ?? 0;
    const borderWidth = options?.border?.width ?? 0;
    const backgroundColor = options?.background?.color;

    this.content = new Container();
    this.content.addChild(...children);

    const width = this.content.width + borderWidth * 2 + padding * 2;
    const height = this.content.height + borderWidth * 2 + padding * 2;

    const box = new Graphics();
    box.beginFill(
      backgroundColor,
      backgroundColor ? options?.background?.alpha : 0
    );
    box.drawRect(0, 0, width, height);
    box.endFill();

    this.addChild(box);

    this.content.x = padding + borderWidth;
    this.content.y = padding + borderWidth;
    this.addChild(this.content);

    if (options?.border) {
      const border = new BorderBox(
        { width: width - borderWidth, height: height - borderWidth },
        options.border
      );
      this.addChild(border);
    }
  }
}

export default BoxContainer;
