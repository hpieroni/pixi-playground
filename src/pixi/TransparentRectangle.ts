import { Graphics } from "pixi.js";

class TransparentRectangle extends Graphics {
  constructor(x: number, y: number, width: number, height: number) {
    super();

    // We can't use alpha = 0 in `beginFill` because the rectangle won't be drawn
    // Using PIXI.filters.AlphaFilter degrades the performance a lot
    // That is why I decided to use an alpha that is close to 0 (user won't notice the difference)
    this.beginFill(0, 1e-10).drawRect(x, y, width, height).endFill();
  }
}

export default TransparentRectangle;
