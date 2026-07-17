import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SettingsPanel } from "../app/components/SettingsPanel";

describe("çekirdek görünümü seçimi", () => {
  it("tüm gezegenleri sunar ve seçimi anında bildirir", () => {
    const onSkinChange = vi.fn();
    render(<SettingsPanel ownerName="Ada" nucleusSkin="sun" onClose={vi.fn()}
      onRename={vi.fn()} onSkinChange={onSkinChange} onErase={vi.fn()} />);

    expect(screen.getAllByRole("radio")).toHaveLength(9);
    fireEvent.click(screen.getByRole("radio", { name: /Dünya/ }));
    expect(onSkinChange).toHaveBeenCalledWith("earth");
  });
});
