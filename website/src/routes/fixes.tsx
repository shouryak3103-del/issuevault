import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { issues as seedIssues, issueTypeLabel } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/severity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Pencil, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fixes")({
  head: () => ({ meta: [{ title: "Fix suggestions — AI Data Fixer" }] }),
  component: FixesPage,
});

type Status = "pending" | "approved" | "rejected" | "fixed";

function FixesPage() {
  const [items, setItems] = useState(() => seedIssues.map((i) => ({ ...i, status: "pending" as Status })));
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function update(id: string, patch: Partial<(typeof items)[number]>) {
    setItems((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function approve(id: string) { update(id, { status: "fixed" }); toast.success("Fix applied"); }
  function reject(id: string) { update(id, { status: "rejected" }); toast.message("Suggestion rejected"); }
  function startEdit(id: string, current: string) { setEditing(id); setDraft(current); }
  function saveEdit(id: string) { update(id, { suggestion: draft, status: "fixed" }); setEditing(null); toast.success("Custom fix saved"); }

  const pending = items.filter((i) => i.status === "pending").length;
  const fixed = items.filter((i) => i.status === "fixed").length;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Pending</p>
          <p className="mt-1 font-display text-2xl font-semibold">{pending}</p>
        </div>
        <div className="rounded-2xl border bg-gradient-aqua/10 p-4 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Auto-fixable (≥90%)</p>
          <p className="mt-1 font-display text-2xl font-semibold">{items.filter(i => i.confidence >= 0.9 && i.status === "pending").length}</p>
        </div>
        <div className="rounded-2xl border bg-success/10 p-4 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Fixed</p>
          <p className="mt-1 font-display text-2xl font-semibold text-success">{fixed}</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((i) => (
          <div
            key={i.id}
            className={cn(
              "group rounded-2xl border bg-card p-5 shadow-card transition-all",
              i.status === "fixed" && "border-success/40 bg-success/5",
              i.status === "rejected" && "opacity-60",
            )}
          >
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-pop">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{i.recordId}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm font-medium">{i.field}</span>
                  <span className="rounded-full border bg-card px-2 py-0.5 text-[11px]">{issueTypeLabel[i.type]}</span>
                  <SeverityBadge severity={i.severity} />
                  {i.status === "fixed" && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">Applied</span>
                  )}
                  {i.status === "rejected" && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">Rejected</span>
                  )}
                </div>

                {editing === i.id ? (
                  <div className="flex gap-2">
                    <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="bg-background" autoFocus />
                    <Button size="sm" onClick={() => saveEdit(i.id)} className="rounded-full"><Save className="mr-1 h-3.5 w-3.5" />Save</Button>
                  </div>
                ) : (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Suggested fix:</span>{" "}
                    <span className="font-medium">{i.suggestion}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-aqua" style={{ width: `${i.confidence * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{(i.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>

              {i.status === "pending" && editing !== i.id && (
                <div className="flex shrink-0 gap-1.5">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(i.id, i.suggestion)} className="rounded-full">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => reject(i.id)} className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => approve(i.id)} className="rounded-full bg-success text-success-foreground hover:bg-success/90">
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
