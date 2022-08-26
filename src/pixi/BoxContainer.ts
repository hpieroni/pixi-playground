import { Container, Graphics } from "pixi.js";

export type Border = "top" | "right" | "bottom" | "left";
export interface BorderConfig {
  width: number;
  color?: number;
  alpha?: number;
  radius?: number;
  only?: "top" | "right" | "bottom" | "left";
}

export interface StyleOptions {
  padding?: number;
  border?: BorderConfig;
  background?: {
    color: number;
    alpha?: number;
  };
}

enum LineAlignment {
  Inner = 0,
  Middle = 0.5,
  Outer = 1,
}

class BoxContainer extends Container {
  constructor(children: Container | Container[] = [], options?: StyleOptions) {
    super();

    const content = new Container();
    content.addChild(...(Array.isArray(children) ? children : [children]));

    const padding = options?.padding ?? 0;
    const borderWidth = options?.border?.width ?? 0;
    const backgroundColor = options?.background?.color;

    content.x = padding;
    content.y = padding;

    const width = content.width + padding * 2;
    const height = content.height + padding * 2;

    const box = new Graphics();

    box.beginFill(
      backgroundColor,
      backgroundColor ? options?.background?.alpha : 0
    );

    if (options?.border) {
      box.lineStyle(
        borderWidth,
        options.border.color,
        options.border.alpha,
        options?.border?.only === "left" || options?.border?.only === "right"
          ? LineAlignment.Outer
          : LineAlignment.Inner
      );

      switch (options?.border?.only) {
        case "top":
          content.y += borderWidth;
          box.moveTo(0, 0);
          box.lineTo(width, 0);
          break;
        case "right":
          box.moveTo(width, 0);
          box.lineTo(width, height);
          break;
        case "bottom":
          box.moveTo(0, height);
          box.lineTo(width, height);
          break;
        case "left":
          content.x += borderWidth;
          box.moveTo(0, 0);
          box.lineTo(0, height);
          break;
        default: // all the borders
          content.x += borderWidth;
          content.y += borderWidth;
          box.drawRoundedRect(
            0,
            0,
            width + borderWidth * 2,
            height + borderWidth * 2,
            options?.border?.radius ?? 0
          );
      }
    }

    box.endFill();

    this.addChild(content);
    this.addChild(box);
  }
}

export default BoxContainer;
