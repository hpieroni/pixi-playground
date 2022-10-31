import {
  Container,
  DisplayObject,
  Graphics,
  filters as pixiFilters,
} from "pixi.js";
import { castArray } from "./utils";
import Border, { type BorderConfig } from "./Border";
import TransparentRectangle from "./TransparentRectangle";

interface ShadowOptions {
  strength: number;
  quality: number;
}

const defaultShadowOptions: ShadowOptions = {
  strength: 12,
  quality: 8,
};

export interface StyleOptions {
  padding?: number;
  border?: Omit<BorderConfig, "radius">;
  borderRadius?: number;
  background?: {
    color: number;
    alpha?: number;
  };
  shadow?: ShadowOptions | boolean;
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

    const minWidth = options?.minWidth ?? content.width;
    const width =
      Math.max(content.width, minWidth) + padding * 2 + borderWidth * 2;
    const minHeight = options?.minHeight ?? content.height;
    const height =
      Math.max(content.height, minHeight) + padding * 2 + borderWidth * 2;

    // Easy way to add a shadow. It's not perfect, but it's good enough for now
    if (options?.shadow) {
      const shadowOptions =
        typeof options.shadow === "boolean"
          ? defaultShadowOptions
          : {
              strength:
                options.shadow.strength ?? defaultShadowOptions.strength,
              quality: options.shadow.quality ?? defaultShadowOptions.quality,
            };
      const boxShadow = new Graphics()
        .beginFill(0, 0.5)
        .drawRoundedRect(0, 0, width, height, options?.borderRadius ?? 0)
        .endFill();
      boxShadow.filters = [
        new pixiFilters.BlurFilter(
          shadowOptions.strength,
          shadowOptions.quality
        ),
      ];
      this.addChild(boxShadow);
    }

    if (
      padding > 0 ||
      minWidth > content.width ||
      minHeight > content.height ||
      options?.background
    ) {
      content.x = padding;
      content.y = padding;

      let paddingBox: Graphics;

      if (options?.background) {
        paddingBox = new Graphics()
          .beginFill(options.background.color, options.background.alpha ?? 1)
          .drawRoundedRect(0, 0, width, height, options?.borderRadius ?? 0)
          .endFill();
      } else {
        paddingBox = new TransparentRectangle(0, 0, width, height);
      }

      this.addChild(paddingBox);
    }

    if (options?.border) {
      const border = new Border(
        { width, height },
        { ...options.border, radius: options?.borderRadius }
      );
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
