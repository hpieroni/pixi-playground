import {
  Container,
  DisplayObject,
  InteractionEvent,
  ITextStyle,
  Text,
} from "pixi.js";
import Box, { type StyleOptions } from "./Box";

export enum TooltipPosition {
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
  BOTTOM_LEFT = "bottom-start",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-end",
}

export enum TooltipPositionTarget {
  POINTER = "pointer",
  TARGET = "target",
}

export interface TooltipOptions {
  /**
   * Tooltip positioning
   * @default "bottom-center"
   */
  position?: TooltipPosition;
  /**
   * Where the tooltip should be positioned based on the pointer or the target
   * @default "target"
   */
  positionTarget?: TooltipPositionTarget;
  /**
   * Tooltip container style options (padding, border, background). Same as Box component
   */
  style?: StyleOptions;
  /**
   * Left offset between the tooltip and the pointer or the target
   * @default 0
   */
  offsetLeft?: number;
  /**
   * Top offset between the tooltip and the pointer or the target
   * @default 0
   */
  offsetTop?: number;
  /**
   * This property will be used if a string is passed to the content property
   */
  textStyle?: Partial<ITextStyle>;
  /**
   * Delay in milliseconds before the tooltip is shown.
   * It won't be shown if the pointer leaves the target before the delay is over
   * @default 0
   */
  delay?: number;
}

class Tooltip extends Box {
  private target: Container;
  private options: TooltipOptions;
  private timeout?: number;

  constructor(
    target: Container,
    content: string | DisplayObject,
    options?: TooltipOptions
  ) {
    super(
      typeof content === "string"
        ? new Text(content, options?.textStyle)
        : content,
      options?.style
    );

    this.target = target;
    this.options = {
      offsetLeft: 0,
      offsetTop: 0,
      delay: 0,
      position: TooltipPosition.BOTTOM_CENTER,
      positionTarget: TooltipPositionTarget.TARGET,
      ...options,
    };

    this.initializeHover();
  }

  private initializeHover() {
    this.target.interactive = true;

    this.target.on("pointerover", (e: InteractionEvent): void => {
      if (this.options.delay! > 0) {
        this.timeout = window.setTimeout(() => {
          this.setPosition(e);
          this.target.addChild(this);
        }, this.options.delay);
      } else {
        this.setPosition(e);
        this.target.addChild(this);
      }
    });

    this.target.on("pointerout", (e?: InteractionEvent): void => {
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.target.removeChild(this);
    });
  }

  private setPosition(e: InteractionEvent) {
    if (this.options.positionTarget === TooltipPositionTarget.TARGET) {
      this.setPositionOnTarget();
    } else {
      this.setPositionOnPointer(e);
    }
  }

  private setPositionOnPointer(e: InteractionEvent) {
    const position = e.data.getLocalPosition(this.target);

    switch (this.options.position) {
      case TooltipPosition.TOP_LEFT:
        this.x = position.x - this.width;
        this.y = position.y - this.height;
        break;
      case TooltipPosition.TOP_CENTER:
        this.x = position.x - this.width / 2;
        this.y = position.y - this.height;
        break;
      case TooltipPosition.TOP_RIGHT:
        this.x = position.x;
        this.y = position.y - this.height;
        break;
      case TooltipPosition.LEFT:
        this.x = position.x - this.width;
        this.y = position.y - this.height / 2;
        break;
      case TooltipPosition.CENTER:
        this.x = position.x - this.width / 2;
        this.y = position.y - this.height / 2;
        break;
      case TooltipPosition.RIGHT:
        this.x = position.x;
        this.y = position.y - this.height / 2;
        break;
      case TooltipPosition.BOTTOM_LEFT:
        this.x = position.x - this.width;
        this.y = position.y;
        break;
      case TooltipPosition.BOTTOM_CENTER:
        this.x = position.x - this.width / 2;
        this.y = position.y;
        break;
      case TooltipPosition.BOTTOM_RIGHT:
      default:
        this.x = position.x;
        this.y = position.y;
    }

    this.x += this.options.offsetLeft!;
    this.y += this.options.offsetTop!;
  }

  private setPositionOnTarget() {
    switch (this.options.position) {
      case TooltipPosition.TOP_LEFT:
        this.x = 0;
        this.y = -this.height;
        break;
      case TooltipPosition.TOP_CENTER:
        this.x = this.target.width / 2 - this.width / 2;
        this.y = -this.height;
        break;
      case TooltipPosition.TOP_RIGHT:
        this.x = this.target.width - this.width;
        this.y = -this.height;
        break;
      case TooltipPosition.LEFT:
        this.x = -this.width;
        this.y = this.target.height / 2 - this.height / 2;
        break;
      case TooltipPosition.CENTER:
        this.x = this.target.width / 2 - this.width / 2;
        this.y = this.target.height / 2 - this.height / 2;
        break;
      case TooltipPosition.RIGHT:
        this.x = this.target.width;
        this.y = this.target.height / 2 - this.height / 2;
        break;
      case TooltipPosition.BOTTOM_LEFT:
        this.x = 0;
        this.y = this.target.height;
        break;
      case TooltipPosition.BOTTOM_CENTER:
        this.x = this.target.width / 2 - this.width / 2;
        this.y = this.target.height;
        break;
      case TooltipPosition.BOTTOM_RIGHT:
      default:
        this.x = this.target.width - this.width;
        this.y = this.target.height;
    }

    this.x += this.options.offsetLeft!;
    this.y += this.options.offsetTop!;
  }
}

export default Tooltip;
