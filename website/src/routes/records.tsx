import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import {
  records,
  issueTypeLabel,
  type IssueType,
  type DataRecord,
} from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search, Filter, Wand2, Eye, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/records")({
  head: () => ({ meta: [{ title: "Records — AI Data Fixer" }] }),
  component: RecordsPage,
});

const filters: { key: "all" | "problems" | IssueType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "problems", label: "Has issues" },
  { key: "duplicate", label: "Duplicates" },
  { key: "missing", label: "Missing" },
  { key: "invalid_format", label: "Invalid format" },
  { key: "inconsistent", label: "Inconsistent" },
];

const issueTone: Record<IssueType, string> = {
  duplicate: "bg-magenta/15 text-magenta border-magenta/30",
  missing: "bg-destructive/10 text-destructive border-destructive/30",
  invalid_format: "bg-highlight/15 text-highlight-foreground border-highlight/40",
  inconsistent: "bg-aqua/15 text-aqua-foreground border-aqua/30",
};

function severityOf(r: DataRecord): "high" | "medium" | "low" | "clean" {
  if (!r.issues.length) return "clean";
  if (r.issues.includes("duplicate") || r.issues.includes("missing")) return "high";
  if (r.issues.includes("invalid_format")) return "medium";
  return "low";
}

const sevDot: Record<ReturnType<typeof severityOf>, string> = {
  high: "bg-destructive",
  medium: "bg-highlight",
  low: "bg-aqua",
  clean: "bg-success",
};

function RecordsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchQ =
        !q ||
        [r.id, r.vendor, r.email, r.taxId].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchF =
        filter === "all"
          ? true
          : filter === "problems"
          ? r.issues.length > 0
          : r.issues.includes(filter);
      return matchQ && matchF;
    });
  }, [q, filter]);

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search records, vendors, emails…"
            className="h-10 rounded-full pl-9 bg-card shadow-card"
          />
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 md:overflow-visible md:pb-0">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant="ghost"
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-8 shrink-0 rounded-full border text-xs",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-muted/80 text-left text-xs uppercase tracking-wider text-muted-foreground backdrop-blur">
              <tr>
                <th className="w-8 px-3 py-3 font-medium"></th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Email</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Tax ID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Issues</th>
                <th className="w-24 px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => {
                const sev = severityOf(r);
                const isOpen = expanded === r.id;
                const tone =
                  sev === "high"
                    ? "border-l-destructive/70 hover:bg-destructive/[0.06]"
                    : sev === "medium"
                    ? "border-l-highlight/70 hover:bg-highlight/[0.08]"
                    : sev === "low"
                    ? "border-l-aqua/60 hover:bg-aqua/[0.06]"
                    : "border-l-transparent hover:bg-muted/40";
                return (
                  <Fragment key={r.id}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      className={cn(
                        "group cursor-pointer border-l-2 transition-colors",
                        tone,
                        isOpen && "bg-accent/40",
                      )}
                    >
                      <td className="px-3 py-3">
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isOpen && "rotate-90",
                          )}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", sevDot[sev])} />
                          <span className="font-mono text-[12.5px]">{r.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.vendor}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {r.email || (
                          <em className="not-italic text-destructive">— missing —</em>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-[12.5px] lg:table-cell">
                        {r.taxId || <em className="not-italic text-destructive">—</em>}
                      </td>
                      <td className="px-4 py-3 font-mono">{r.amount}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {r.date}
                      </td>
                      <td className="px-4 py-3">
                        {r.issues.length === 0 ? (
                          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                            clean
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {r.issues.map((i) => (
                              <span
                                key={i}
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                                  issueTone[i],
                                )}
                              >
                                {issueTypeLabel[i]}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Link
                            to="/fixes"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border bg-card hover:bg-accent"
                            title="Suggest fix"
                          >
                            <Wand2 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpanded(r.id);
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border bg-card hover:bg-accent"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-accent/30">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            <Detail label="Email" value={r.email} />
                            <Detail label="Tax ID" value={r.taxId} mono />
                            <Detail label="Date" value={r.date} />
                            <Detail label="Amount" value={r.amount} mono />
                            <Detail
                              label="Severity"
                              value={sev}
                              accent={
                                sev === "high"
                                  ? "text-destructive"
                                  : sev === "medium"
                                  ? "text-highlight-foreground"
                                  : "text-success"
                              }
                            />
                            <div className="rounded-xl border bg-card p-3">
                              <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                                Quick actions
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Link
                                  to="/fixes"
                                  className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground"
                                >
                                  <Wand2 className="h-3 w-3" /> AI fix
                                </Link>
                                <button className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold hover:bg-accent">
                                  Mark clean
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {records.length} records · click any row to expand
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm",
          mono && "font-mono text-[12.5px]",
          accent,
          !value && "italic text-muted-foreground",
        )}
      >
        {value || "—"}
      </p>
    </div>
  );
}
