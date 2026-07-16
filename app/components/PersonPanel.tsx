"use client";

import { QUESTIONS } from "../domain/questions";
import type { Placement } from "../domain/types";

interface PersonPanelProps {
  placement: Placement;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function locationText(placement: Placement): string {
  return placement.shell === "free" ? "Serbest yörünge" : `${placement.shell}. orbital`;
}

/** Seçilen kişinin puan, yanıt ve yönetim ayrıntılarını gösterir. */
export function PersonPanel({ placement, onClose, onEdit, onDelete }: PersonPanelProps) {
  const { person } = placement;

  function confirmDelete() {
    if (window.confirm(`${person.name} atomundan çıkarılsın mı? Bu işlem geri alınamaz.`)) onDelete();
  }

  return (
    <aside className="side-panel" aria-labelledby="person-panel-title">
      <header className="side-panel__header">
        <div className="avatar" aria-hidden="true">{person.name.charAt(0).toLocaleUpperCase("tr")}</div>
        <div><p className="eyebrow">{locationText(placement)}</p><h2 id="person-panel-title">{person.name}</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Kişi detaylarını kapat">×</button>
      </header>
      <div className="score-card"><span>Yakınlık puanı</span><strong>{person.score}<small>/50</small></strong></div>
      <div className="rank-row"><span>Atomdaki sırası</span><strong>#{placement.rank + 1}</strong></div>
      <section className="answers-list" aria-labelledby="answers-title">
        <h3 id="answers-title">Yanıtlar</h3>
        {QUESTIONS.map((question, index) => <div className="answer-row" key={question}>
          <span>{index + 1}. {question}</span><strong>{person.answers[index]}/5</strong>
        </div>)}
      </section>
      <footer className="panel-actions">
        <button className="button button--primary" onClick={onEdit}>İsmi ve yanıtları düzenle</button>
        <button className="button button--danger" onClick={confirmDelete}>Kişiyi sil</button>
      </footer>
    </aside>
  );
}
