const ENTER_RADIUS = 30;
const EXIT_RADIUS = 42;

interface ScreenPoint {
  x: number;
  y: number;
}

/** Ekran koordinatlarında kararlı hover için giriş ve çıkış histerezisi uygular. */
export function isScreenPointHovered(
  node: ScreenPoint,
  pointer: ScreenPoint,
  viewport: ScreenPoint,
  hovered: boolean,
): boolean {
  const horizontalDistance = (node.x - pointer.x) * viewport.x * .5;
  const verticalDistance = (node.y - pointer.y) * viewport.y * .5;
  const radius = hovered ? EXIT_RADIUS : ENTER_RADIUS;
  return Math.hypot(horizontalDistance, verticalDistance) <= radius;
}

/** Kamera kırpma alanının dışındaki bir düğümün hover almasını engeller. */
export function isVisibleDepth(depth: number): boolean {
  return depth >= -1 && depth <= 1;
}
