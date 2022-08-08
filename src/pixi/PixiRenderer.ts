import {
  Application,
  DisplayObject,
  Ticker,
  type IApplicationOptions,
  type TickerCallback,
} from "pixi.js";
import { Viewport, type IViewportOptions } from "pixi-viewport";
import { Simple } from "pixi-cull";

interface RenderOptions {
  plugins?: string[];
  fit?: boolean;
  culling?: boolean;
}

class PixiRenderer {
  private app: Application;
  private viewport: Viewport;
  private cullingHandler?: TickerCallback<PixiRenderer>;

  constructor(
    applicationOptions: IApplicationOptions,
    viewportOptions: IViewportOptions = {}
  ) {
    this.app = new Application({
      autoStart: false,
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      ...applicationOptions,
    });

    this.viewport = new Viewport({
      screenWidth: this.app.screen.width,
      screenHeight: this.app.screen.height,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.app.renderer.plugins.interaction,
      ...viewportOptions,
    });
  }

  public render(
    displayObject: DisplayObject[] | DisplayObject,
    options: RenderOptions = {}
  ) {
    this.resumePlugin(...(options.plugins ?? []));

    const displayObjects = Array.isArray(displayObject)
      ? displayObject
      : [displayObject];

    for (const object of displayObjects) {
      this.viewport.addChild(object);
    }
    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport);

    if (options.fit) {
      this.fit();
    }

    if (options.culling) {
      this.enableCulling();
    }

    // Need to start manually because `autoStart` option was set to `false`
    this.app.start();
  }

  public destroy() {
    this.app.destroy(false, { children: true });
  }

  public enableCulling() {
    if (this.cullingHandler) {
      return;
    }

    // TODO: Review. It's not working when a container wraps all the objects
    const simpleCull = new Simple();
    simpleCull.addList(this.viewport.children);
    simpleCull.cull(this.viewport.getVisibleBounds());

    // cull whenever the viewport moves
    this.cullingHandler = () => {
      if (this.viewport.dirty) {
        simpleCull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    };

    Ticker.shared.add(this.cullingHandler);
  }

  public disableCulling() {
    if (this.cullingHandler) {
      Ticker.shared.remove(this.cullingHandler);
      delete this.cullingHandler;
    }

    this.makeAllVisible();
  }

  public resumePlugin(...plugins: string[]) {
    for (const plugin of plugins) {
      if (this.viewport.plugins.get(plugin)) {
        this.viewport.plugins.resume(plugin);
      } else {
        // activate plugin. It is the same as calling viewport.drag() etc
        // @ts-ignore
        this.viewport[plugin]();
      }
    }
  }

  public pausePlugin(...plugins: string[]) {
    plugins.forEach((name) => this.viewport.plugins.pause(name));
  }

  public fit() {
    this.viewport.left = 0;
    this.viewport.top = 0;

    if (this.cullingHandler) {
      this.makeAllVisible();
    }
    this.viewport.fit();
  }

  private makeAllVisible() {
    for (const child of this.viewport.children) {
      child.visible = true;
    }
  }
}

export default PixiRenderer;
