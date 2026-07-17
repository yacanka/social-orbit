"use client";

import { FormEvent, useState } from "react";
import { PLANETS } from "../domain/planets";
import { normalizeName } from "../domain/scoring";
import type { PlanetSkin } from "../domain/types";

interface SettingsPanelProps {
  ownerName: string;
  nucleusSkin: PlanetSkin;
  onClose: () => void;
  onRename: (name: string) => void;
  onSkinChange: (skin: PlanetSkin) => void;
  onErase: () => Promise<void>;
}

/** Merkez adını ve cihazdaki veri yaşam döngüsünü yönetir. */
export function SettingsPanel({ ownerName, nucleusSkin, onClose, onRename, onSkinChange, onErase }: SettingsPanelProps) {
  const [name, setName] = useState(ownerName);
  const [eraseArmed, setEraseArmed] = useState(false);
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
      </fieldset>
      <section className="privacy-card">
        <h3>Mahremiyet</h3>
        <p>İsimler ve anket yanıtları bu tarayıcı profilindeki IndexedDB alanında saklanır; başka cihazlara gönderilmez.</p>
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
