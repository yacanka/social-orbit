"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { PLANETS } from "../domain/planets";
import { normalizeName } from "../domain/scoring";
import type { CustomTexture, PlanetSkin } from "../domain/types";
import { prepareCustomTexture } from "./custom-texture";

interface SettingsPanelProps {
  ownerName: string;
  nucleusSkin: PlanetSkin;
  customTexture: CustomTexture | null;
  onClose: () => void;
  onRename: (name: string) => void;
  onSkinChange: (skin: PlanetSkin) => void;
  onCustomTextureChange: (texture: CustomTexture) => void;
  onCustomTextureRemove: () => void;
  onErase: () => Promise<void>;
}

/** Merkez adını ve cihazdaki veri yaşam döngüsünü yönetir. */
export function SettingsPanel({ ownerName, nucleusSkin, customTexture, onClose, onRename, onSkinChange,
  onCustomTextureChange, onCustomTextureRemove, onErase }: SettingsPanelProps) {
  const [name, setName] = useState(ownerName);
  const [eraseArmed, setEraseArmed] = useState(false);
  const [textureError, setTextureError] = useState("");
  const [textureBusy, setTextureBusy] = useState(false);
  const normalized = normalizeName(name);

  function save(event: FormEvent) {
    event.preventDefault();
    if (normalized) onRename(normalized);
  }

  async function erase() {
    if (!eraseArmed) {
      setEraseArmed(true);
      return;
    }
    await onErase();
    onClose();
  }

  async function uploadTexture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setTextureBusy(true);
    setTextureError("");
    try {
      onCustomTextureChange(await prepareCustomTexture(file));
    } catch (error) {
      setTextureError(error instanceof Error ? error.message : "Texture işlenemedi.");
    } finally {
      setTextureBusy(false);
    }
  }

  return (
    <aside className="side-panel settings-panel" aria-labelledby="settings-title">
      <header className="side-panel__header"><div><p className="eyebrow">EVREN AYARLARI</p><h2 id="settings-title">Ayarlar</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Ayarları kapat">×</button></header>
      <form className="settings-form" onSubmit={save}>
        <label htmlFor="settings-name">Merkezdeki isim</label>
        <input id="settings-name" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} />
        <button className="button button--primary" disabled={!normalized}>İsmi güncelle</button>
      </form>
      <fieldset className="skin-picker">
        <legend>Çekirdek görünümü</legend>
        <p>Merkezindeki gezegeni seç. Değişiklik anında evrenine uygulanır.</p>
        <div className="skin-grid">
          {PLANETS.map((planet) => <label key={planet.id} className={nucleusSkin === planet.id ? "is-selected" : ""}>
            <input type="radio" name="nucleus-skin" value={planet.id} checked={nucleusSkin === planet.id}
              onChange={() => onSkinChange(planet.id)} />
            <span className={`planet-swatch planet-swatch--${planet.id}`} aria-hidden="true"><i /></span>
            <b>{planet.name}</b><small>{planet.description}</small>
          </label>)}
        </div>
        <section className={`custom-texture${nucleusSkin === "custom" ? " is-selected" : ""}`}>
          <span className="custom-texture__preview" style={customTexture ? { backgroundImage: `url(${customTexture.dataUrl})` } : undefined} aria-hidden="true" />
          <div><b>{customTexture?.name ?? "Kendi texture'ını kullan"}</b>
            <small>PNG, JPEG veya WebP · en fazla 4 MB</small></div>
          <label className="custom-texture__upload" htmlFor="custom-texture-file">{textureBusy ? "İşleniyor…" : customTexture ? "Değiştir" : "Yükle"}</label>
          <input id="custom-texture-file" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Özel texture yükle"
            disabled={textureBusy} onChange={uploadTexture} />
          {customTexture && <div className="custom-texture__actions">
            <button type="button" onClick={() => onSkinChange("custom")} disabled={nucleusSkin === "custom"}>Kullan</button>
            <button type="button" onClick={onCustomTextureRemove}>Kaldır</button>
          </div>}
          {textureError && <p role="alert">{textureError}</p>}
        </section>
      </fieldset>
      <section className="privacy-card">
        <h3>Mahremiyet</h3>
        <p>İsimler, anket yanıtları ve yüklediğin texture bu tarayıcı profilindeki IndexedDB alanında saklanır; başka cihazlara gönderilmez.</p>
      </section>
      <section className="danger-zone">
        <h3>Tüm verileri sil</h3>
        <p>Merkez ismi, kişiler ve yanıtlar kalıcı olarak kaldırılır.</p>
        <button className="button button--danger" onClick={erase}>{eraseArmed ? "Evet, her şeyi kalıcı sil" : "Silme işlemini başlat"}</button>
        {eraseArmed && <button className="text-button" onClick={() => setEraseArmed(false)}>Vazgeç</button>}
      </section>
    </aside>
  );
}
