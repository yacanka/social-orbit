import type { Placement } from "../domain/types";

interface AccessiblePeopleListProps {
  placements: Placement[];
  onSelect: (id: string) => void;
}

function shellLabel(placement: Placement): string {
  return placement.shell === "free" ? "Serbest" : `${placement.shell}. orbital`;
}

/** 3D sahnenin klavye ve ekran okuyucu dostu kişi karşılığını sunar. */
export function AccessiblePeopleList({ placements, onSelect }: AccessiblePeopleListProps) {
  if (!placements.length) return <p className="empty-list">Henüz yörüngede kimse yok.</p>;

  return (
    <ol className="people-list">
      {placements.map((placement) => <li key={placement.person.id}>
        <button onClick={() => onSelect(placement.person.id)}>
          <span><strong>{placement.person.name}</strong><small>{shellLabel(placement)}</small></span>
          <b>{placement.person.score}</b>
        </button>
      </li>)}
    </ol>
  );
}
