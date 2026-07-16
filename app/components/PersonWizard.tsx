"use client";

import { FormEvent, useEffect, useState } from "react";
import { ANSWER_LABELS, QUESTIONS } from "../domain/questions";
import { normalizeName } from "../domain/scoring";
import type { Person, SurveyAnswer } from "../domain/types";

interface PersonWizardProps {
  person?: Person;
  onCancel: () => void;
  onSave: (name: string, answers: SurveyAnswer[]) => void;
}

const EMPTY_ANSWERS: Array<SurveyAnswer | undefined> = Array(10).fill(undefined);

/** İsim ve on yakınlık sorusunu tek odaklı adımlarda toplar. */
export function PersonWizard({ person, onCancel, onSave }: PersonWizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(person?.name ?? "");
  const [answers, setAnswers] = useState<Array<SurveyAnswer | undefined>>(person?.answers ?? EMPTY_ANSWERS);
  const normalizedName = normalizeName(name);
  const currentAnswer = step ? answers[step - 1] : undefined;

  useEffect(() => {
    document.getElementById(step ? `answer-${step}-${currentAnswer ?? 1}` : "person-name")?.focus();
  }, [step, currentAnswer]);

  function choose(answer: SurveyAnswer) {
    setAnswers((current) => current.map((value, index) => index === step - 1 ? answer : value));
  }

  function next(event: FormEvent) {
    event.preventDefault();
    if (step === 0 && !normalizedName) return;
    if (step > 0 && !currentAnswer) return;
    if (step < QUESTIONS.length) setStep(step + 1);
    else onSave(normalizedName, answers as SurveyAnswer[]);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="wizard" role="dialog" aria-modal="true" aria-labelledby="wizard-title">
        <header className="wizard__header">
          <div><p className="eyebrow">{person ? "BAĞI GÜNCELLE" : "YENİ YÖRÜNGE"}</p>
            <h2 id="wizard-title">{step === 0 ? "Bu kişi kim?" : `Yakınlık sorusu ${step}/10`}</h2></div>
          <button className="icon-button" onClick={onCancel} aria-label="Pencereyi kapat">×</button>
        </header>
        <div className="progress" aria-label={`İlerleme: ${step + 1}/11`}><span style={{ width: `${((step + 1) / 11) * 100}%` }} /></div>
        <form onSubmit={next}>
          {step === 0 ? (
            <div className="wizard__body name-step">
              <label htmlFor="person-name">Kişinin adı</label>
              <input id="person-name" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder="Örn. Deniz" />
              <p>Bu isim atomundaki ışık noktasının yanında görünecek.</p>
            </div>
          ) : (
            <fieldset className="wizard__body question-step">
              <legend>{QUESTIONS[step - 1]}</legend>
              <div className="answer-scale">
                {ANSWER_LABELS.map((label, index) => {
                  const value = (index + 1) as SurveyAnswer;
                  return <label className={currentAnswer === value ? "answer selected" : "answer"} key={label}>
                    <input id={`answer-${step}-${value}`} type="radio" name="answer" value={value} aria-label={`${value} — ${label}`}
                      checked={currentAnswer === value} onChange={() => choose(value)} />
                    <strong>{value}</strong><span>{label}</span>
                  </label>;
                })}
              </div>
            </fieldset>
          )}
          <footer className="wizard__footer">
            <button type="button" className="button button--ghost" onClick={() => step ? setStep(step - 1) : onCancel()}>{step ? "Geri" : "Vazgeç"}</button>
            <button type="submit" className="button button--primary" disabled={step === 0 ? !normalizedName : !currentAnswer}>{step === 10 ? "Yörüngeye ekle" : "Devam et"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
