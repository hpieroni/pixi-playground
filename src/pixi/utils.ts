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
export function alignElements(
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
