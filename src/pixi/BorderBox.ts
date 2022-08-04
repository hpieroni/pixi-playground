import { Graphics } from "pixi.js";

export interface BorderConfig {
  width: number;
  color?: number;
  alpha?: number;
}

class BorderBox extends Graphics {
  constructor(
    dimension: { width: number; height: number },
    config: BorderConfig
  ) {
    super();

    const offset = config.width / 2;
    this.lineStyle(config.width, config.color, config.alpha);
    this.drawRect(offset, offset, dimension.width, dimension.height);
  }
}

export default BorderBox;
