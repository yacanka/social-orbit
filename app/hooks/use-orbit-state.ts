"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { calculateScore, normalizeName } from "../domain/scoring";
import { EMPTY_STATE, type AppState, type CustomTexture, type Person, type PlanetSkin, type SurveyAnswer } from "../domain/types";
import { clearState, loadState, saveState } from "../storage/orbit-storage";

function createPerson(name: string, answers: SurveyAnswer[]): Person {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: normalizeName(name),
    answers,
    score: calculateScore(answers),
    createdAt: now,
    updatedAt: now,
  };
}

/** Yerel Social Orbit durumunu yükler, günceller ve kalıcılaştırır. */
export function useOrbitState() {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const skipSave = useRef(false);

  useEffect(() => {
    loadState().then(setState).catch(() => setState(EMPTY_STATE)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || skipSave.current) {
      skipSave.current = false;
      return;
    }
    void saveState(state);
  }, [ready, state]);

  const setOwnerName = useCallback((ownerName: string) => {
    setState((current) => ({ ...current, ownerName: normalizeName(ownerName) }));
  }, []);

  const setNucleusSkin = useCallback((nucleusSkin: PlanetSkin) => {
    setState((current) => ({ ...current, nucleusSkin: nucleusSkin === "custom" && !current.customTexture ? "sun" : nucleusSkin }));
  }, []);

  const setCustomTexture = useCallback((customTexture: CustomTexture) => {
    setState((current) => ({ ...current, customTexture, nucleusSkin: "custom" }));
  }, []);

  const removeCustomTexture = useCallback(() => {
    setState((current) => ({ ...current, customTexture: null, nucleusSkin: current.nucleusSkin === "custom" ? "sun" : current.nucleusSkin }));
  }, []);

  const addPerson = useCallback((name: string, answers: SurveyAnswer[]) => {
    setState((current) => ({ ...current, people: [...current.people, createPerson(name, answers)] }));
  }, []);

  const updatePerson = useCallback((id: string, name: string, answers: SurveyAnswer[]) => {
    setState((current) => ({
      ...current,
      people: current.people.map((person) => person.id === id ? {
        ...person, name: normalizeName(name), answers,
        score: calculateScore(answers), updatedAt: new Date().toISOString(),
      } : person),
    }));
  }, []);

  const deletePerson = useCallback((id: string) => {
    setState((current) => ({ ...current, people: current.people.filter((person) => person.id !== id) }));
  }, []);

  const eraseAll = useCallback(async () => {
    skipSave.current = true;
    await clearState();
    setState(EMPTY_STATE);
  }, []);

  return { state, ready, setOwnerName, setNucleusSkin, setCustomTexture, removeCustomTexture,
    addPerson, updatePerson, deletePerson, eraseAll };
}
