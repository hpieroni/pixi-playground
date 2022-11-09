import Grid from "./Grid";
import { buildTestContainers, testLayout } from "./test.helpers";

describe("Grid", () => {
  it("should layout children in a Grid as a column by default", () => {
    const grid = new Grid(
      buildTestContainers([
        { width: 10, height: 10 },
        { width: 10, height: 10 },
        { width: 10, height: 10 },
      ])
    );

    testLayout(grid, {
      children: [
        {
          children: [
            { height: 10, width: 10, x: 0, y: 0 },
            { height: 10, width: 10, x: 10, y: 0 },
            { height: 10, width: 10, x: 20, y: 0 },
          ],
          height: 10,
          width: 30,
          x: 0,
          y: 0,
        },
      ],
      height: 10,
      width: 30,
      x: 0,
      y: 0,
    });
  });

  it("should layout children in a grid", () => {
    const grid = new Grid(
      buildTestContainers([
        { width: 10, height: 10 },
        { width: 10, height: 20 },
        { width: 10, height: 10 },
        { width: 10, height: 10 },
      ]),
      { columns: 2 }
    );

    testLayout(grid, {
      children: [
        {
          children: [
            { height: 10, width: 10, x: 0, y: 0 },
            { height: 20, width: 10, x: 10, y: 0 },
          ],
          height: 20,
          width: 20,
          x: 0,
          y: 0,
        },
        {
          children: [
            { height: 10, width: 10, x: 0, y: 20 },
            { height: 10, width: 10, x: 10, y: 20 },
          ],
          height: 10,
          width: 20,
          x: 0,
          y: 0,
        },
      ],
      height: 30,
      width: 20,
      x: 0,
      y: 0,
    });
  });

  it("should layout children in a 2 columns grid with spacing", () => {
    const grid = new Grid(
      buildTestContainers([
        { width: 10, height: 10 },
        { width: 10, height: 20 },
        { width: 10, height: 10 },
        { width: 10, height: 10 },
      ]),
      { columns: 2, spacing: 5 }
    );

    testLayout(grid, {
      children: [
        {
          children: [
            { height: 10, width: 10, x: 0, y: 0 },
            { height: 20, width: 10, x: 15, y: 0 },
          ],
          height: 20,
          width: 25,
          x: 0,
          y: 0,
        },
        {
          children: [
            { height: 10, width: 10, x: 0, y: 25 },
            { height: 10, width: 10, x: 15, y: 25 },
          ],
          height: 10,
          width: 25,
          x: 0,
          y: 0,
        },
      ],
      height: 35,
      width: 25,
      x: 0,
      y: 0,
    });
  });

  it("should layout children horizontally centered", () => {
    const grid = new Grid(
      buildTestContainers([
        { width: 10, height: 10 },
        { width: 10, height: 20 },
        { width: 10, height: 10 },
      ]),
      { columns: 2, align: "center" }
    );

    testLayout(grid, {
      children: [
        {
          children: [
            { height: 10, width: 10, x: 0, y: 0 },
            { height: 20, width: 10, x: 10, y: 0 },
          ],
          height: 20,
          width: 20,
          x: 0,
          y: 0,
        },
        {
          children: [{ height: 10, width: 10, x: 0, y: 20 }],
          height: 10,
          width: 10,
          x: 5,
          y: 0,
        },
      ],
      height: 30,
      width: 20,
      x: 0,
      y: 0,
    });
  });

  xit("should layout children horizontally align at the end", () => {
    const grid = new Grid(
      buildTestContainers([
        { width: 10, height: 10 },
        { width: 40, height: 10 },
        { width: 20, height: 10 },
      ]),
      { align: "end" }
    );

    testLayout(grid, [
      { x: 30, y: 0, width: 10, height: 10 },
      { x: 0, y: 10, width: 40, height: 10 },
      { x: 20, y: 20, width: 20, height: 10 },
    ]);
  });

  // xit("should layout children with box styling", () => {
  //   const grid = new Grid(buildTestContainers([{ width: 10, height: 10 }]), {
  //     style: {
  //       padding: 10,
  //     },
  //   });

  //   testLayout(grid, [{ x: 0, y: 0, width: 20, height: 20 }]);
  // });
});
