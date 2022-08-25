import { Graphics } from "pixi.js";

type Border = "top" | "right" | "bottom" | "left";
export interface BorderConfig {
  width: number;
  color?: number;
  alpha?: number;
  only?: Border;
}

class BorderBox extends Graphics {
  constructor(
    dimension: { width: number; height: number },
    config: BorderConfig
  ) {
    super();

    const offset = config.width / 2;
    this.lineStyle(config.width, config.color, config.alpha);

    switch (config.only) {
      case "top":
        this.moveTo(config.width, offset);
        this.lineTo(dimension.width, offset);
        break;
      case "right":
        this.moveTo(dimension.width + offset, config.width);
        this.lineTo(dimension.width + offset, dimension.height);
        break;
      case "bottom":
        this.moveTo(config.width, dimension.height + offset);
        this.lineTo(dimension.width, dimension.height + offset);
        break;
      case "left":
        this.moveTo(offset, config.width);
        this.lineTo(offset, dimension.height);
        break;
      default:
        this.drawRect(offset, offset, dimension.width, dimension.height);
    }
  }
}

export default BorderBox;
