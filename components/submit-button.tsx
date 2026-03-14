"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

export function SubmitButton({ children, className, pendingLabel = "Working..." }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        pending ? "cursor-not-allowed opacity-70" : ""
      } ${className ?? ""}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
