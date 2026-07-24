import { CanvasTexture, Color, LinearFilter, SRGBColorSpace, TextureLoader, type Texture } from "three";
import type { PlanetDefinition } from "../domain/planets";

const WIDTH = 512;
const HEIGHT = 256;

function random(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function blend(first: string, second: string, amount: number): Color {
  return new Color(first).lerp(new Color(second), amount);
}

function fillBase(context: CanvasRenderingContext2D, planet: PlanetDefinition) {
  const image = context.createImageData(WIDTH, HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) colorPixel(image, x, y, planet);
  }
  context.putImageData(image, 0, 0);
}

function colorPixel(image: ImageData, x: number, y: number, planet: PlanetDefinition) {
  const band = (Math.sin(y / HEIGHT * planet.bands * Math.PI * 2) + 1) / 2;
  const grain = random(x * 0.31 + y * 11.73 + planet.bands) * .22;
  const amount = Math.min(1, band * .64 + grain);
  const color = blend(planet.colors[0], planet.colors[1], amount).lerp(new Color(planet.colors[2]), grain * .5);
  const index = (y * WIDTH + x) * 4;
  image.data.set([color.r * 255, color.g * 255, color.b * 255, 255], index);
}

function drawSpot(context: CanvasRenderingContext2D, x: number, y: number, width: number, color: string, alpha = .45) {
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(x, y, width, width * .42, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawCraters(context: CanvasRenderingContext2D, planet: PlanetDefinition) {
  for (let index = 0; index < 34; index += 1) {
    const x = random(index + 8) * WIDTH;
    const y = random(index + 91) * HEIGHT;
    const radius = 2 + random(index + 37) * 11;
    drawSpot(context, x, y, radius, planet.colors[2], .28);
    drawSpot(context, x - 1, y - 1, radius * .55, planet.colors[0], .13);
  }
}

function drawEarth(context: CanvasRenderingContext2D) {
  const lands = [[80, 68, 42], [145, 150, 56], [280, 82, 65], [390, 170, 43], [470, 95, 31]];
  lands.forEach(([x, y, size], index) => drawSpot(context, x, y, size, index % 2 ? "#548b42" : "#3b7d3f", .95));
  for (let index = 0; index < 16; index += 1) {
    drawSpot(context, random(index + 4) * WIDTH, random(index + 44) * HEIGHT, 18 + random(index) * 30, "#ffffff", .2);
  }
}

function drawPlanetDetails(context: CanvasRenderingContext2D, planet: PlanetDefinition) {
  if (planet.id === "mercury" || planet.id === "mars" || planet.id === "moon") drawCraters(context, planet);
  if (planet.id === "earth") drawEarth(context);
  if (planet.id === "jupiter") drawSpot(context, 364, 170, 38, "#9d3f2f", .72);
  if (planet.id === "neptune") drawSpot(context, 330, 138, 24, "#17215f", .55);
  if (planet.id === "sun") drawSolarFlares(context);
}

function drawSolarFlares(context: CanvasRenderingContext2D) {
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 28; index += 1) {
    drawSpot(context, random(index + 20) * WIDTH, random(index + 70) * HEIGHT, 10 + random(index) * 28, "#ffd36a", .22);
  }
  context.globalCompositeOperation = "source-over";
}

/** Seçilen gezegen için çevrimdışı, deterministik bir yüzey texture'ı üretir. */
export function createPlanetTexture(planet: PlanetDefinition): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Gezegen texture alanı oluşturulamadı.");
  fillBase(context, planet);
  drawPlanetDetails(context, planet);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function configureTexture(texture: Texture): Texture {
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/** Resim kaynağını bağımsız yükler; kaynak yoksa prosedürel texture'a geri döner. */
export function createNucleusTexture(planet: PlanetDefinition, source?: string): Texture {
  const texture = source ? new TextureLoader().load(source) : createPlanetTexture(planet);
  return configureTexture(texture);
}
