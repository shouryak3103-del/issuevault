import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { issues, issueTypeLabel, type IssueType } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/severity-badge";
import { Copy, FileQuestion, AlertCircle, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";

const search = z.object({
  type: fallback(z.enum(["all", "duplicate", "missing", "invalid_format", "inconsistent"]), "all").default("all"),
});

export const Route = createFileRoute("/issues")({
  head: () => ({ meta: [{ title: "Issues — AI Data Fixer" }] }),
  validateSearch: zodValidator(search),
  component: IssuesPage,
});

const tabs: { key: "all" | IssueType; label: string; icon: typeof Copy }[] = [
  { key: "all", label: "All issues", icon: AlertCircle },
  { key: "duplicate", label: "Duplicates", icon: Copy },
  { key: "missing", label: "Missing fields", icon: FileQuestion },
  { key: "invalid_format", label: "Invalid formats", icon: AlertCircle },
  { key: "inconsistent", label: "Inconsistent", icon: Shuffle },
];

function IssuesPage() {
  const { type } = Route.useSearch();

  const counts = useMemo(() => ({
    all: issues.length,
    duplicate: issues.filter((i) => i.type === "duplicate").length,
    missing: issues.filter((i) => i.type === "missing").length,
    invalid_format: issues.filter((i) => i.type === "invalid_format").length,
    inconsistent: issues.filter((i) => i.type === "inconsistent").length,
  }), []);

  const list = type === "all" ? issues : issues.filter((i) => i.type === type);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = type === t.key;
          return (
            <Link
              key={t.key}
              to="/issues"
              search={{ type: t.key }}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-card transition-all",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <span className={cn(
                "ml-1 rounded-full px-2 py-0.5 text-[11px] font-mono",
                active ? "bg-white/20" : "bg-muted text-muted-foreground"
              )}>
                {counts[t.key]}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Record</th>
                <th className="px-5 py-3 font-medium">Field</th>
                <th className="px-5 py-3 font-medium">Issue</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Suggested fix</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-mono text-[13px]">{i.recordId}</td>
                  <td className="px-5 py-3.5 font-medium">{i.field}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full border bg-card px-2.5 py-0.5 text-[11px]">{issueTypeLabel[i.type]}</span>
                  </td>
                  <td className="px-5 py-3.5"><SeverityBadge severity={i.severity} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground max-w-md">{i.suggestion}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-aqua"
                          style={{ width: `${i.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{(i.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
