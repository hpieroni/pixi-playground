export function castArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export type Alignment = "start" | "center" | "end";

// This function mutate the elements
export function alignHorizontally(
  align: Alignment,
  elements: { x: number; width: number }[],
  container: { width: number }
) {
  for (const element of elements) {
    switch (align) {
      case "start":
        element.x = 0;
        break;
      case "center":
        element.x = (container.width - element.width) / 2;
        break;
      case "end":
      default:
        element.x = container.width - element.width;
        break;
    }
  }
}

// This function mutate the elements
export function alignVertically(
  align: Alignment,
  elements: { y: number; height: number }[],
  container: { height: number }
) {
  for (const element of elements) {
    switch (align) {
      case "start":
        element.y = 0;
        break;
      case "center":
        element.y = (container.height - element.height) / 2;
        break;
      case "end":
      default:
        element.y = container.height - element.height;
        break;
    }
  }
}
