import type React from "react";
import { HelpIcon } from "./help-icon";

interface FieldProps {
  label: string;
  value: string | number | React.ReactNode;
  help?: string;
}

export function Field({ label, value, help }: FieldProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground text-sm">
        {label}
        {help && <HelpIcon content={help} />}
      </dt>
      <dd className="font-mono text-foreground text-sm">{value}</dd>
    </div>
  );
}
