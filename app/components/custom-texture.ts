import type { CustomTexture } from "../domain/types";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;
const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 512;

/** Yüklenen texture dosyasının tür ve boyut sınırlarını doğrular. */
export function validateTextureFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return "Yalnızca PNG, JPEG veya WebP yükleyebilirsin.";
  if (file.size > MAX_FILE_SIZE) return "Texture dosyası en fazla 4 MB olabilir.";
  if (!file.size) return "Boş bir dosya texture olarak kullanılamaz.";
  return null;
}

function drawTexture(canvas: HTMLCanvasElement, image: ImageBitmap) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Texture işleme alanı oluşturulamadı.");
  const scale = Math.max(TEXTURE_WIDTH / image.width, TEXTURE_HEIGHT / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.fillStyle = "#10111c";
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  context.drawImage(image, (TEXTURE_WIDTH - width) / 2, (TEXTURE_HEIGHT - height) / 2, width, height);
}

async function resizeTexture(file: File): Promise<string> {
  const image = await createImageBitmap(file);
  try {
    if (image.width * image.height > MAX_PIXELS) throw new Error("Görsel çözünürlüğü çok yüksek.");
    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_WIDTH;
    canvas.height = TEXTURE_HEIGHT;
    drawTexture(canvas, image);
    return canvas.toDataURL("image/jpeg", .86);
  } finally {
    image.close();
  }
}

/** Güvenli görseli 2:1 gezegen yüzeyine dönüştürerek cihaz içi kayda hazırlar. */
export async function prepareCustomTexture(file: File): Promise<CustomTexture> {
  const validationError = validateTextureFile(file);
  if (validationError) throw new Error(validationError);
  const dataUrl = await resizeTexture(file);
  return { name: file.name.slice(0, 120), dataUrl, updatedAt: new Date().toISOString() };
}
