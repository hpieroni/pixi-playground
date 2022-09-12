import { Container, DisplayObject, Graphics } from "pixi.js";
import Border, { type BorderConfig } from "./Border";
import { castArray } from "./utils";

export interface StyleOptions {
  padding?: number;
  border?: BorderConfig;
  background?: {
    color: number;
    alpha?: number;
  };
  minWidth?: number;
  minHeight?: number;
}

export class Box extends Container {
  constructor(
    children: DisplayObject | DisplayObject[],
    options?: StyleOptions
  ) {
    super();

    const padding = options?.padding ?? 0;
    const borderWidth = options?.border?.width ?? 0;

    const content = new Container();
    castArray(children).forEach((child) => content.addChild(child));

    const width =
      Math.max(content.width, options?.minWidth ?? 0) +
      padding * 2 +
      borderWidth * 2;
    const height =
      Math.max(content.height, options?.minHeight ?? 0) +
      padding * 2 +
      borderWidth * 2;

    if (padding > 0) {
      content.x = padding;
      content.y = padding;
      const paddingBox = new Graphics();

      if (options?.background) {
        paddingBox.beginFill(
          options.background.color,
          options.background.alpha ?? 1
        );
      } else {
        // We can't use alpha = 0 in `beginFill` because the box won't be drawn
        // Using PIXI.filters.AlphaFilter degrades the performance a lot
        // That is why I decided to use an alpha that is close to 0 (user won't notice the difference)
        paddingBox.beginFill(0, 1e-10);
      }

      paddingBox.drawRoundedRect(
        0,
        0,
        width,
        height,
        options?.border?.radius ?? 0
      );
      paddingBox.endFill();
      this.addChild(paddingBox);
    }

    if (options?.border) {
      const border = new Border({ width, height }, options.border);
      switch (options?.border.target) {
        case "top":
          content.y += borderWidth;
          break;
        case "left":
          content.x += borderWidth;
          break;
        case "all":
        default:
          content.x += borderWidth;
          content.y += borderWidth;
      }
      this.addChild(border);
    }

    this.addChild(content);
  }
}

export default Box;
