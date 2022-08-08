import { Container, Graphics, Text, TextStyle } from "pixi.js";
import BoxContainer from "../../pixi/BoxContainer";
import Grid from "../../pixi/Grid";
import List from "../../pixi/List";

interface Data {
  label?: string;
  type: string;
  children?: Data[];
}

const textStyle = new TextStyle({
  fill: "#ffffff",
  fontSize: 16,
});

class Group extends Container {
  private data: any;

  constructor(data: Data) {
    super();

    this.data = data;
    const content = this.buildContent();

    if (data.label) {
      const label = new Text(data.label, textStyle);
      this.addChild(new List([label, content], { align: "start" }));
    } else {
      this.addChild(content);
    }
  }

  private options() {
    return objectDefinitions[this.data.type].options;
  }

  private buildContent() {
    const children = this.convertChildren();
    const { type, border, padding, background, ...options } = this.options();

    let content;
    switch (type) {
      case "grid":
        content = new Grid(children, options);
        break;
      case "row":
        content = new List(children, { direction: "row", ...options });
        break;
      case "column":
      default:
        content = new List(children, options);
        break;
    }

    return new BoxContainer([content], { border, padding, background });
  }

  private convertChildren() {
    return (this.data.children ?? []).map((child: any) => {
      const definition = objectDefinitions[child.type];
      return new definition.element(child);
    });
  }
}

class Node extends Container {
  private data: any;

  constructor(data: Data) {
    super();

    this.data = data;

    const rect = new Graphics();
    rect.beginFill(this.options().color);
    rect.drawRect(0, 0, 100, 100);
    rect.endFill();
    this.addChild(rect);

    const label = new Text(data.label, textStyle);
    label.y = rect.height;
    this.addChild(label);
  }

  private options() {
    return objectDefinitions[this.data.type].options;
  }
}

interface ObjectDefinition {
  element: any;
  options: any;
}

const objectDefinitions: { [key: string]: ObjectDefinition } = {
  root: {
    element: Group,
    options: {
      type: "column",
      align: "center",
      spacing: 10,
      padding: 48,
    },
  },
  column: {
    element: Group,
    options: {
      type: "column",
      spacing: 10,
    },
  },
  "column-box": {
    element: Group,
    options: {
      type: "column",
      spacing: 10,
      padding: 24,
      border: { width: 4, color: 0xea1e63 },
    },
  },
  row: {
    element: Group,
    options: {
      type: "row",
      spacing: 10,
    },
  },
  "row-box": {
    element: Group,
    options: {
      type: "row",
      spacing: 10,
      padding: 24,
      border: { width: 4, color: 0xea1e63 },
    },
  },
  "grid-3": {
    element: Group,
    options: {
      type: "grid",
      spacing: 10,
      columns: 3,
      align: "center",
    },
  },
  "grid-3-box": {
    element: Group,
    options: {
      type: "grid",
      spacing: 10,
      columns: 3,
      align: "center",
      border: { width: 4, color: 0xea1e63 },
      padding: 24,
    },
  },
  "grid-2": {
    element: Group,
    options: {
      type: "grid",
      spacing: 10,
      columns: 2,
      align: "center",
      border: { width: 4, color: 0xea1e63 },
      padding: 24,
    },
  },
  node: {
    element: Node,
    options: {
      color: 0xffffff,
    },
  },
};

class Example extends Container {
  private data: Data;

  constructor(data: Data) {
    super();

    this.data = data;
    const root = objectDefinitions[data.type];
    this.addChild(new root.element(data));
  }
}

export default Example;
