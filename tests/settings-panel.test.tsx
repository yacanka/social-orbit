import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsPanel } from "../app/components/SettingsPanel";

describe("çekirdek görünümü seçimi", () => {
  it("tüm gezegenleri sunar ve seçimi anında bildirir", () => {
    const onSkinChange = vi.fn();
    render(<SettingsPanel ownerName="Ada" nucleusSkin="sun" customTexture={null} orbitalDensity="balanced" onClose={vi.fn()}
      onRename={vi.fn()} onSkinChange={onSkinChange} onCustomTextureChange={vi.fn()}
      onCustomTextureRemove={vi.fn()} onDensityChange={vi.fn()} onErase={vi.fn()} />);

    expect(screen.getAllByRole("radio")).toHaveLength(13);
    fireEvent.click(screen.getByRole("radio", { name: /Dünya/ }));
    expect(onSkinChange).toHaveBeenCalledWith("earth");
    expect(screen.getByRole("radio", { name: /Ay/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Özel texture/)).toHaveAttribute("accept", "image/png,image/jpeg,image/webp");
  });

  it("kayıtlı özel texture'ı seçer ve kaldırır", () => {
    const onSkinChange = vi.fn();
    const onRemove = vi.fn();
    render(<SettingsPanel ownerName="Ada" nucleusSkin="earth" customTexture={{ name: "benim.jpg",
      dataUrl: "data:image/jpeg;base64,AA==", updatedAt: "2026-07-18T00:00:00.000Z" }} orbitalDensity="balanced" onClose={vi.fn()}
      onRename={vi.fn()} onSkinChange={onSkinChange} onCustomTextureChange={vi.fn()}
      onCustomTextureRemove={onRemove} onDensityChange={vi.fn()} onErase={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Kullan" }));
    fireEvent.click(screen.getByRole("button", { name: "Kaldır" }));
    expect(onSkinChange).toHaveBeenCalledWith("custom");
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("orbital yoğunluk tercihini anında bildirir", () => {
    const onDensityChange = vi.fn();
    render(<SettingsPanel ownerName="Ada" nucleusSkin="sun" customTexture={null} orbitalDensity="balanced" onClose={vi.fn()}
      onRename={vi.fn()} onSkinChange={vi.fn()} onCustomTextureChange={vi.fn()}
      onCustomTextureRemove={vi.fn()} onDensityChange={onDensityChange} onErase={vi.fn()} />);
    fireEvent.click(screen.getByRole("radio", { name: /Yoğun/ }));
    expect(onDensityChange).toHaveBeenCalledWith("dense");
  });
});
