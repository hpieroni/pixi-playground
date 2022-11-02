import { Container, Graphics, Text, TextStyle } from "pixi.js";
import Row from "../../pixi/Row";
import Column from "../../pixi/Column";
import Grid from "../../pixi/Grid";

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
      this.addChild(new Column([label, content], { align: "start" }));
    } else {
      this.addChild(content);
    }
  }

  private options() {
    return objectDefinitions[this.data.type].options;
  }

  private buildContent() {
    const children = this.convertChildren();
    const {
      type,
      border,
      borderRadius,
      padding,
      shadow,
      background,
      ...options
    } = this.options();
    const style = { border, borderRadius, padding, background, shadow };

    switch (type) {
      case "grid":
        return new Grid(children, { ...options, style });
      case "row":
        return new Row(children, { ...options, style });
      case "column":
      default:
        return new Column(children, { ...options, style });
    }
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
  "column-box-shadow": {
    element: Group,
    options: {
      type: "column",
      spacing: 10,
      padding: 24,
      background: { color: 0xea1e63 },
      shadow: true,
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
      borderRadius: 8,
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
      padding: 24,
      border: { width: 4, color: 0xea1e63 },
    },
  },
  "grid-2": {
    element: Group,
    options: {
      type: "grid",
      spacing: 10,
      columns: 2,
      align: "center",
      padding: 24,
      border: { width: 4, color: 0xea1e63 },
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
