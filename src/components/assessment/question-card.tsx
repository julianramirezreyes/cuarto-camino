"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SCALE_KINDS, type QuestionDTO } from "@/hooks/assessment-types";

export interface QuestionCardProps {
  question: QuestionDTO;
  onSelect: (optionId: string) => void;
  /** Option shown as selected while its answer is being sent. */
  pendingOptionId?: string | null;
  disabled?: boolean;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function QuestionCard({ question, onSelect, pendingOptionId = null, disabled = false }: QuestionCardProps) {
  const reduced = useReducedMotion() ?? false;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isScale = SCALE_KINDS.includes(question.kind);
  const selectedId = pendingOptionId ?? question.selectedOptionId ?? null;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [question.id]);

  useEffect(() => {
    if (disabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey || isTypingTarget(e.target)) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const option = question.options[Number(e.key) - 1];
      if (option) {
        e.preventDefault();
        onSelect(option.id);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [disabled, question.options, onSelect]);

  const enter = reduced ? { opacity: 1 } : { opacity: 0, y: 12 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.section
      key={question.id}
      data-reduced-motion={reduced ? "true" : "false"}
      initial={enter}
      animate={shown}
      transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
      aria-labelledby={`question-${question.id}`}
    >
      <h2
        id={`question-${question.id}`}
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-2xl leading-snug outline-none md:text-3xl"
      >
        {question.text}
      </h2>
      {isScale ? (
        <p className="mt-2 text-sm text-muted-foreground">Elige el punto de la escala que mejor te describe.</p>
      ) : null}
      <ol
        className={cn(
          "mt-6 grid gap-3",
          isScale && "sm:grid-flow-col sm:auto-cols-fr",
        )}
      >
        {question.options.map((option, index) => {
          const selected = selectedId === option.id;
          return (
            <motion.li
              key={option.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={shown}
              transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 0.08 + index * 0.05 }}
            >
              <button
                type="button"
                aria-pressed={selected}
                aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                disabled={disabled}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base transition-colors disabled:cursor-not-allowed",
                  isScale && "sm:flex-col sm:justify-center sm:text-center",
                  selected
                    ? "border-primary bg-primary/15"
                    : "border-control bg-card hover:border-violet hover:bg-muted",
                  disabled && !selected && "opacity-60",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span>{option.text}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </motion.section>
  );
}
