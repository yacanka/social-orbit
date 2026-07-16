import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PersonWizard } from "../app/components/PersonWizard";

describe("kişi anketi", () => {
  it("isim olmadan ilerlemeyi engeller", () => {
    render(<PersonWizard onCancel={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Devam et" })).toBeDisabled();
  });

  it("isim ve 10 yanıtı eksiksiz kaydeder", () => {
    const save = vi.fn();
    render(<PersonWizard onCancel={vi.fn()} onSave={save} />);
    fireEvent.change(screen.getByLabelText("Kişinin adı"), { target: { value: "Deniz" } });
    fireEvent.click(screen.getByRole("button", { name: "Devam et" }));
    for (let step = 1; step <= 10; step += 1) {
      fireEvent.click(screen.getByRole("radio", { name: "5 — Tamamen katılıyorum" }));
      const buttonName = step === 10 ? "Yörüngeye ekle" : "Devam et";
      fireEvent.click(screen.getByRole("button", { name: buttonName }));
    }
    expect(save).toHaveBeenCalledWith("Deniz", Array(10).fill(5));
  });
});
