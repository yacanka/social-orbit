"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { derivePlacements } from "../domain/placement";
import type { SurveyAnswer } from "../domain/types";
import { useOrbitState } from "../hooks/use-orbit-state";
import { AccessiblePeopleList } from "./AccessiblePeopleList";
import { Onboarding } from "./Onboarding";
import { PersonPanel } from "./PersonPanel";
import { PersonWizard } from "./PersonWizard";
import { SettingsPanel } from "./SettingsPanel";

const OrbitScene = dynamic(() => import("../scene/OrbitScene").then((module) => module.OrbitScene), {
  ssr: false,
  loading: () => <div className="scene-loading">Evren hazırlanıyor…</div>,
});

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Uygulama kabuğunu, yerel durumu ve tüm ana kullanıcı akışlarını birleştirir. */
export function OrbitApp() {
  const orbit = useOrbitState();
  const [wizard, setWizard] = useState<"add" | "edit" | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const placements = useMemo(() => derivePlacements(orbit.state.people), [orbit.state.people]);
  const selected = placements.find(({ person }) => person.id === selectedId);

  if (!orbit.ready) return <main className="app-loading"><div className="brand-mark"><span /></div><p>Evrenin yükleniyor…</p></main>;
  if (!orbit.state.ownerName) return <Onboarding onComplete={orbit.setOwnerName} />;

  function savePerson(name: string, answers: SurveyAnswer[]) {
    if (wizard === "edit" && selected) orbit.updatePerson(selected.person.id, name, answers);
    else orbit.addPerson(name, answers);
    setWizard(null);
  }

  function removeSelected() {
    if (!selected) return;
    orbit.deletePerson(selected.person.id);
    setSelectedId(undefined);
  }

  return (
    <main className="orbit-app">
      <div className="scene"><OrbitScene ownerName={orbit.state.ownerName} placements={placements}
        nucleusSkin={orbit.state.nucleusSkin} customTextureUrl={orbit.state.customTexture?.dataUrl}
        orbitalDensity={orbit.state.orbitalDensity} selectedId={selectedId}
        paused={manuallyPaused || reducedMotion} onSelect={setSelectedId} /></div>
      <header className="topbar">
        <a className="brand" href="#main-controls" aria-label="Social Orbit ana görünüm"><span className="brand-mark"><i /></span><b>SOCIAL ORBIT</b></a>
        <p className="local-status"><span /> Yalnızca bu cihazda</p>
        <nav aria-label="Görünüm kontrolleri">
          <button className="round-button" onClick={() => setListOpen(!listOpen)} aria-label="Kişi listesini aç">☷</button>
          <button className="round-button" onClick={() => setManuallyPaused(!manuallyPaused)} aria-label={manuallyPaused ? "Animasyonu oynat" : "Animasyonu duraklat"}>{manuallyPaused ? "▶" : "Ⅱ"}</button>
          <button className="round-button" onClick={() => setSettingsOpen(true)} aria-label="Ayarları aç">⚙</button>
        </nav>
      </header>
      <section className="hero-copy" id="main-controls">
        <p className="eyebrow">SENİN EVRENİN</p>
        <h1>Yakınlık bir<br /><em>çekim meselesi.</em></h1>
        <p>Her bağın kendine özgü bir yeri var. İnsanlarını ekle, duygusal yörüngeni keşfet.</p>
        <button className="button button--primary add-button" onClick={() => setWizard("add")}><span>＋</span> Yeni kişi ekle</button>
      </section>
      <section className="legend" aria-label="Orbital açıklamaları">
        <p><i className="dot dot--one" /><span><b>1. orbital</b> En yakın 2 kişi</span><strong>{Math.min(placements.length, 2)}/2</strong></p>
        <p><i className="dot dot--two" /><span><b>2. orbital</b> Yakın 8 kişi</span><strong>{Math.min(Math.max(placements.length - 2, 0), 8)}/8</strong></p>
        <p><i className="dot dot--three" /><span><b>3. orbital</b> Çevrendeki 18 kişi</span><strong>{Math.min(Math.max(placements.length - 10, 0), 18)}/18</strong></p>
        {placements.length > 28 && <p><i className="dot dot--free" /><span><b>Serbest</b> Evreninde dolaşanlar</span><strong>{placements.length - 28}</strong></p>}
      </section>
      <p className="camera-hint"><span>↻</span> Döndürmek için sürükle · Yakınlaşmak için kaydır</p>
      {!placements.length && <button className="empty-orbit" onClick={() => setWizard("add")}><span>＋</span><b>İlk bağını ekle</b><small>Atomun seni bekliyor</small></button>}
      {listOpen && <aside className="list-drawer"><header><div><p className="eyebrow">TÜM BAĞLAR</p><h2>Kişiler</h2></div><button className="icon-button" onClick={() => setListOpen(false)}>×</button></header>
        <AccessiblePeopleList placements={placements} onSelect={(id) => { setSelectedId(id); setListOpen(false); }} /></aside>}
      {selected && <PersonPanel placement={selected} onClose={() => setSelectedId(undefined)} onEdit={() => setWizard("edit")} onDelete={removeSelected} />}
      {settingsOpen && <SettingsPanel ownerName={orbit.state.ownerName} nucleusSkin={orbit.state.nucleusSkin}
        customTexture={orbit.state.customTexture} orbitalDensity={orbit.state.orbitalDensity}
        onClose={() => setSettingsOpen(false)} onRename={orbit.setOwnerName}
        onSkinChange={orbit.setNucleusSkin} onCustomTextureChange={orbit.setCustomTexture}
        onCustomTextureRemove={orbit.removeCustomTexture} onDensityChange={orbit.setOrbitalDensity} onErase={orbit.eraseAll} />}
      {wizard && <PersonWizard person={wizard === "edit" ? selected?.person : undefined} onCancel={() => setWizard(null)} onSave={savePerson} />}
    </main>
  );
}
