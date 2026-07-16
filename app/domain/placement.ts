import type { Person, Placement, Shell } from "./types";

const SHELL_ENDS = [2, 10, 28] as const;

function comparePeople(left: Person, right: Person): number {
  if (left.score !== right.score) return right.score - left.score;
  return left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id);
}

function shellForRank(rank: number): Shell {
  if (rank < SHELL_ENDS[0]) return 1;
  if (rank < SHELL_ENDS[1]) return 2;
  if (rank < SHELL_ENDS[2]) return 3;
  return "free";
}

function shellStart(shell: Shell): number {
  if (shell === 1) return 0;
  if (shell === 2) return SHELL_ENDS[0];
  if (shell === 3) return SHELL_ENDS[1];
  return SHELL_ENDS[2];
}

/** Kişi kimliğinden oturumlar arasında kararlı bir animasyon tohumu üretir. */
export function seedFromId(id: string): number {
  return [...id].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7);
}

/** Puan sırasını kabuk kapasitelerine göre türetir; hiçbir kişiyi silmez. */
export function derivePlacements(people: Person[]): Placement[] {
  return [...people].sort(comparePeople).map((person, rank) => {
    const shell = shellForRank(rank);
    return { person, rank, shell, shellIndex: rank - shellStart(shell), seed: seedFromId(person.id) };
  });
}
