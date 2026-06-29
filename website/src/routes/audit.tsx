import { createFileRoute } from "@tanstack/react-router";
import { audit } from "@/lib/mock-data";
import { Bot, User, Upload, Check, X, Merge, Wand2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit log — AI Data Fixer" }] }),
  component: AuditPage,
});

function iconFor(action: string): { icon: LucideIcon; tone: string } {
  if (action.includes("Approved")) return { icon: Check, tone: "bg-success/15 text-success" };
  if (action.includes("Rejected")) return { icon: X, tone: "bg-destructive/15 text-destructive" };
  if (action.includes("Merged")) return { icon: Merge, tone: "bg-aqua/20 text-aqua-foreground" };
  if (action.includes("Uploaded")) return { icon: Upload, tone: "bg-primary/15 text-primary" };
  if (action.includes("Normalized")) return { icon: Wand2, tone: "bg-highlight/20 text-highlight-foreground" };
  return { icon: Bot, tone: "bg-muted text-foreground" };
}

function AuditPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border bg-card shadow-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-display text-base font-semibold">Timeline</h2>
          <p className="text-xs text-muted-foreground">Every team and AI action, newest first</p>
        </div>

        <ol className="relative px-5 py-5">
          <span className="absolute left-[34px] top-6 bottom-6 w-px bg-border" />
          {audit.map((a) => {
            const { icon: Icon, tone } = iconFor(a.action);
            const isAI = a.user.includes("AI");
            return (
              <li key={a.id} className="relative flex gap-4 py-3">
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-4 ring-card ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold">{a.user}</span>
                    {isAI ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                        <Bot className="h-2.5 w-2.5" /> AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        <User className="h-2.5 w-2.5" /> Human
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">· {a.time}</span>
                  </div>
                  <p className="mt-0.5 text-sm">
                    <span className="font-medium">{a.action}</span>{" "}
                    <span className="text-muted-foreground">— {a.target}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
