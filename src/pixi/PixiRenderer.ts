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
  private options: PixiRendererOptions;
  private app: Application;
  private viewport: Viewport;

  constructor(options: PixiRendererOptions) {
    const appOptions = {
      autoStart: false,
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      ...options.app,
    };
    this.app = new Application(appOptions);

    const viewportOptions = {
      culling: false,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      interaction: this.app.renderer.plugins.interaction,
      ...options.viewport,
    };
    this.viewport = new Viewport(viewportOptions);

    this.options = { app: appOptions, viewport: viewportOptions };
    this.resumePlugin(...(viewportOptions.plugins ?? []));
  }

  private enableCulling() {
    // TODO: Review. It's not working when a container wraps all the objects
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

  public fit() {
    this.viewport.fit();
  }

  public render(displayObject: DisplayObject[] | DisplayObject) {
    const displayObjects = Array.isArray(displayObject)
      ? displayObject
      : [displayObject];

    for (const object of displayObjects) {
      this.viewport.addChild(object);
    }
    // Add the viewport to the stage
    this.app.stage.addChild(this.viewport);

    if (this.options.viewport?.culling) {
      this.enableCulling();
    }

    // Need to start manually because `autoStart` option was set to `false`
    this.app.start();
  }

  public destroy() {
    this.app.destroy(false, { children: true });
  }
}

export default PixiRenderer;
