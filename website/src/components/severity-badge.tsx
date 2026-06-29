import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/mock-data";

const styles: Record<Severity, string> = {
  high: "bg-destructive text-destructive-foreground border-ink",
  medium: "bg-highlight text-highlight-foreground border-ink",
  low: "bg-lemon text-lemon-foreground border-ink",
  fixed: "bg-success text-success-foreground border-ink",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider shadow-sticker-sm",
        styles[severity],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />
      {severity}
    </span>
  );
}
