import type { ComponentProps, Ref } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "min-h-12 w-full rounded-xl border border-control bg-background px-4 text-base text-foreground placeholder:text-muted-foreground disabled:opacity-50 aria-[invalid=true]:border-accent";

export interface TextFieldProps extends Omit<ComponentProps<"input">, "id"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

/** Labelled input; hint and error are wired through aria-describedby. */
export function TextField({ id, label, hint, error, className, ref, ...props }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(inputClass, className)}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** `code` lets a form react to a specific, non-sensitive failure (e.g. unverified email, dead link). */
export type SubmitFailureCode = "email-not-verified" | "invalid-token";
export type SubmitResult = { ok: true } | { ok: false; message: string; code?: SubmitFailureCode };
