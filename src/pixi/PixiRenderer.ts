import {
  Application,
  DisplayObject,
  Ticker,
  type IApplicationOptions,
} from "pixi.js";
import { Viewport, type IViewportOptions } from "pixi-viewport";
import { Simple } from "pixi-cull";

interface PixiRendererOptions {
  app: IApplicationOptions;
  viewport?: IViewportOptions & {
    plugins?: string[];
    culling?: boolean;
  };
}

class PixiRenderer {
  private app: Application;
  private viewport: Viewport;

  constructor(options: PixiRendererOptions) {
    this.app = new Application({
      autoStart: false,
      autoDensity: true,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio ?? 1,
      ...options.app,
    });

    const {
      plugins,
      culling = true,
      ...viewportOptions
    } = options.viewport ?? {};

    this.viewport = new Viewport({
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.app.renderer.plugins.interaction,
      ...viewportOptions,
    });

    const defaultPlugins = ["drag", "pinch", "wheel", "decelerate"];
    this.resumePlugin(...(plugins ?? defaultPlugins));

    if (culling) {
      this.enableCulling();
    }
  }

  private enableCulling() {
    const simpleCull = new Simple();
    simpleCull.addList(this.viewport.children);
    simpleCull.cull(this.viewport.getVisibleBounds());

    // cull whenever the viewport moves
    Ticker.shared.add(() => {
      if (this.viewport.dirty) {
        simpleCull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    });
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

  public render(...displayObjects: DisplayObject[]) {
    this.viewport.addChild(...displayObjects);
    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport);
    // Need to start manually because `autoStart` option was set to `false`
    this.app.start();
  }

  public destroy() {
    this.app?.destroy(false, { children: true });
  }
}

export default PixiRenderer;
