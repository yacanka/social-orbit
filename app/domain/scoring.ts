import type { SurveyAnswer } from "./types";

/** On geçerli anket yanıtından 10–50 aralığında yakınlık puanı üretir. */
export function calculateScore(answers: SurveyAnswer[]): number {
  if (answers.length !== 10) {
    throw new Error("Yakınlık anketi tam olarak 10 yanıt içermelidir.");
  }
  return answers.reduce((total, answer) => total + answer, 0);
}

/** Kullanıcı girdisini güvenli, görüntülenebilir bir ada dönüştürür. */
export function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 60);
}
