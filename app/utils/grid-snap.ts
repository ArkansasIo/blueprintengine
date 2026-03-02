export const GRID_SIZE = 8;

export function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPosition(x: number, y: number, gridSize: number = GRID_SIZE) {
  return {
    x: snapToGrid(x, gridSize),
    y: snapToGrid(y, gridSize),
  };
}

export function shouldSnapToGrid(modifierPressed: boolean): boolean {
  return !modifierPressed; // Hold Shift/Cmd to disable snapping
}
