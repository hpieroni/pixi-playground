import { Graphics } from "pixi.js";

enum LineAlignment {
  Inner = 0,
  Middle = 0.5,
  Outer = 1,
}

export interface BorderOptions {
  width: number;
  color?: number;
  alpha?: number;
  /**
   * For now this will only apply when target is `all`
   */
  radius?: number;
  target?: "all" | "top" | "right" | "bottom" | "left";
}

class Border extends Graphics {
  constructor(
    dimension: { width: number; height: number; x?: number; y?: number },
    options: BorderOptions
  ) {
    super();

    const { width, height, x = 0, y = 0 } = dimension;
    const target = options.target ?? "all";

    this.lineStyle(
      options.width,
      options.color,
      options.alpha,
      target === "left" || target === "right"
        ? LineAlignment.Outer
        : LineAlignment.Inner
    );

    switch (target) {
      case "top":
        this.moveTo(x, y);
        this.lineTo(width, y);
        break;
      case "right":
        this.moveTo(width, y);
        this.lineTo(width, height);
        break;
      case "bottom":
        this.moveTo(x, height);
        this.lineTo(width, height);
        break;
      case "left":
        this.moveTo(x, y);
        this.lineTo(x, height);
        break;
      case "all":
      default:
        this.drawRoundedRect(x, y, width, height, options.radius ?? 0);
    }
  }
}

export default Border;
