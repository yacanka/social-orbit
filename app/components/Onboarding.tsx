"use client";

import { FormEvent, useState } from "react";
import { normalizeName } from "../domain/scoring";

interface OnboardingProps {
  onComplete: (name: string) => void;
}

/** İlk kullanımda merkezde gösterilecek kullanıcı adını toplar. */
export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("");
  const normalized = normalizeName(name);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (normalized) onComplete(normalized);
  }

  return (
    <main className="onboarding">
      <div className="onboarding__stars" aria-hidden="true" />
      <section className="onboarding__card" aria-labelledby="welcome-title">
        <div className="brand-mark" aria-hidden="true"><span /></div>
        <p className="eyebrow">SOCIAL ORBIT</p>
        <h1 id="welcome-title">İlişkilerinin<br /><em>çekim alanını</em> keşfet.</h1>
        <p className="intro">Hayatındaki insanları duygusal yakınlıklarına göre kendi evreninde konumlandır.</p>
        <form onSubmit={submit}>
          <label htmlFor="owner-name">Merkezde kim var?</label>
          <div className="input-row">
            <input id="owner-name" value={name} maxLength={60} autoFocus
              onChange={(event) => setName(event.target.value)} placeholder="Adını yaz" />
            <button className="button button--primary" disabled={!normalized} type="submit">Evrenimi oluştur</button>
          </div>
        </form>
        <p className="privacy-note"><span aria-hidden="true">◈</span> Verilerin yalnızca bu cihazda saklanır.</p>
      </section>
    </main>
  );
}
