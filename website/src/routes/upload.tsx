import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Papa from "papaparse";
import { analyzeData, type AnalyzeResult, type IssueKind } from "@/lib/ai-analyze.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload — AI Data Fixer" }] }),
  component: UploadPage,
});

const SAMPLE = `id,vendor,email,tax_id,amount,date
R-2001,Acme Corp,billing@acme.com,12-3456789,$4200.00,2026-06-01
R-2002,acme corp.,billing@acme.com,12-3456789,$4200,2026-06-01
R-2003,Globex Inc,ap@globex,,1820.50,06/02/2026
R-2004,Initech,finance@initech.com,98-7654321,$925.00,2026-06-02
R-2005,Soylent Co,pay@soylent.com,55-1234567,$12400,2026-06-03
R-2006,Umbrella Corp,,44-9988776,$3300.00,2026-06-03
R-2007,Hooli,ap@hooli.com,77-1122334,$8750.00,2026-06-04
R-2008,HOOLI,ap@hooli.com,77-1122334,$8750.00,2026-06-04
R-2009,Pied Piper,richard@piedpiper,,540,2026/06/05
R-2010,Stark Industries,ap@stark.com,11-2233445,$22000.00,2026-06-06`;

type Row = Record<string, string>;

const issueLabel: Record<IssueKind, string> = {
  duplicate: "Duplicate",
  missing: "Missing",
  invalid_format: "Invalid format",
  inconsistent: "Inconsistent",
};

const issueTone: Record<IssueKind, string> = {
  duplicate: "bg-magenta/15 text-magenta border-magenta/30",
  missing: "bg-destructive/10 text-destructive border-destructive/30",
  invalid_format: "bg-highlight/15 text-highlight-foreground border-highlight/40",
  inconsistent: "bg-aqua/15 text-aqua-foreground border-aqua/30",
};

function UploadPage() {
  const [filename, setFilename] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  function ingest(name: string, text: string) {
    const parsed = Papa.parse<Row>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });
    const r = (parsed.data ?? []).filter((row) => row && Object.keys(row).length > 0);
    const h = parsed.meta.fields ?? Object.keys(r[0] ?? {});
    if (!r.length) {
      toast.error("That CSV looks empty");
      return;
    }
    setFilename(name);
    setHeaders(h);
    setRows(r);
    setResult(null);
    setActiveRow(null);
    toast.success(`Loaded ${name}`, { description: `${r.length} rows · ${h.length} columns` });
  }

  function onFile(file?: File) {
    if (!file) return;
    file.text().then((t) => ingest(file.name, t));
  }

  function loadSample() {
    ingest("sample_vendors.csv", SAMPLE);
  }

  function clearFile() {
    setFilename(null);
    setRows([]);
    setHeaders([]);
    setResult(null);
    setActiveRow(null);
  }

  async function runAnalyze() {
    if (!rows.length) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const payload = {
        headers,
        rows: rows.slice(0, 200).map((data, idx) => ({ id: data.id ?? String(idx), data })),
      };
      const out = await analyzeData({ data: payload });
      setResult(out);
      toast.success("AI analysis complete", { description: out.summary });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error("Couldn't analyze", { description: msg });
    } finally {
      setAnalyzing(false);
    }
  }

  const issuesByRow = useMemo(() => {
    const m = new Map<number, AnalyzeResult["issues"]>();
    if (!result) return m;
    for (const i of result.issues) {
      const list = m.get(i.rowIndex) ?? [];
      list.push(i);
      m.set(i.rowIndex, list);
    }
    return m;
  }, [result]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files[0]);
        }}
        className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-card p-6 text-center shadow-card transition-colors hover:border-primary/60 hover:bg-accent/30 sm:p-10"
      >
        <div className="absolute -top-12 left-1/3 h-32 w-32 rounded-full bg-aqua/30 blur-2xl" />
        <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-highlight/30 blur-2xl" />
        <div className="relative mx-auto flex max-w-md flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-pop">
            <UploadCloud className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold sm:text-2xl">
            Drop your CSV here
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real AI analysis · up to 200 rows per run · UTF-8
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <label>
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
              />
              <span className="inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-pop hover:bg-primary/90">
                Choose file
              </span>
            </label>
            <button
              onClick={loadSample}
              type="button"
              className="rounded-full border-2 border-ink/15 bg-card px-4 py-2 text-xs font-semibold hover:bg-accent"
            >
              Try sample dataset
            </button>
          </div>
        </div>
      </div>

      {/* File panel */}
      {filename && (
        <div className="rounded-2xl border bg-card shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 sm:flex sm:flex-wrap sm:justify-between sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua/20 text-aqua-foreground">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{filename}</p>
                <p className="text-xs text-muted-foreground">
                  {rows.length} rows · {headers.length} columns
                  {result && ` · ${result.totalIssues} issues`}
                </p>
              </div>
              {result && (
                <span className="ml-1 hidden shrink-0 items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success sm:inline-flex">
                  <CheckCircle2 className="h-3 w-3" /> Analyzed
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                onClick={runAnalyze}
                disabled={analyzing}
                className="rounded-full bg-gradient-primary px-4 shadow-pop sm:px-5"
              >
                {analyzing ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {analyzing ? "Analyzing…" : result ? "Re-run" : "Analyze with AI"}
                </span>
                <span className="sm:hidden">{analyzing ? "…" : "Analyze"}</span>
              </Button>
              <button
                onClick={clearFile}
                className="rounded-full border-2 border-ink/15 bg-card p-2 hover:bg-accent"
                title="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Summary strip */}
          {result && (
            <div className="grid grid-cols-2 gap-2 border-b bg-muted/30 px-4 py-3 sm:grid-cols-4 sm:px-5">
              {(Object.keys(result.byType) as IssueKind[]).map((k) => (
                <div
                  key={k}
                  className={cn(
                    "rounded-xl border-2 px-3 py-2 text-left",
                    issueTone[k],
                  )}
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-wider opacity-70">
                    {issueLabel[k]}
                  </p>
                  <p className="font-mono text-xl font-bold leading-tight">
                    {result.byType[k]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="w-10 px-3 py-2.5 font-medium">#</th>
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-2.5 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row, i) => {
                  const rowIssues = issuesByRow.get(i) ?? [];
                  const hasIssues = rowIssues.length > 0;
                  const isActive = activeRow === i;
                  const badFields = new Set(rowIssues.map((x) => x.field));
                  return (
                    <>
                      <tr
                        key={i}
                        onClick={() => setActiveRow(isActive ? null : i)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          hasIssues
                            ? "border-l-2 border-l-destructive/60 bg-destructive/[0.04] hover:bg-destructive/[0.08]"
                            : "border-l-2 border-l-transparent hover:bg-muted/40",
                          isActive && "bg-accent/40",
                        )}
                      >
                        <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                          {i + 1}
                        </td>
                        {headers.map((h) => {
                          const v = row[h] ?? "";
                          const bad = badFields.has(h);
                          return (
                            <td
                              key={h}
                              className={cn(
                                "px-4 py-2.5 font-mono text-[12.5px] max-w-[220px] truncate",
                                bad && "text-destructive",
                              )}
                              title={v}
                            >
                              {v || (
                                <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] not-italic text-destructive">
                                  missing
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-2.5">
                          {hasIssues ? (
                            <div className="flex flex-wrap gap-1">
                              {rowIssues.slice(0, 2).map((iss, k) => (
                                <span
                                  key={k}
                                  className={cn(
                                    "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                                    issueTone[iss.type],
                                  )}
                                >
                                  {issueLabel[iss.type]}
                                </span>
                              ))}
                              {rowIssues.length > 2 && (
                                <span className="text-[10.5px] text-muted-foreground">
                                  +{rowIssues.length - 2}
                                </span>
                              )}
                            </div>
                          ) : result ? (
                            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10.5px] font-semibold text-success">
                              clean
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                      {isActive && hasIssues && (
                        <tr key={`${i}-detail`} className="bg-accent/30">
                          <td colSpan={headers.length + 2} className="px-5 py-4">
                            <div className="space-y-2">
                              {rowIssues.map((iss, k) => (
                                <div
                                  key={k}
                                  className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm"
                                >
                                  <AlertTriangle
                                    className={cn(
                                      "mt-0.5 h-4 w-4 shrink-0",
                                      iss.severity === "high"
                                        ? "text-destructive"
                                        : iss.severity === "medium"
                                        ? "text-highlight-foreground"
                                        : "text-aqua-foreground",
                                    )}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={cn(
                                          "rounded-full border px-2 py-0.5 text-[10.5px] font-bold",
                                          issueTone[iss.type],
                                        )}
                                      >
                                        {issueLabel[iss.type]}
                                      </span>
                                      <span className="font-mono text-[11.5px] text-muted-foreground">
                                        {iss.field}
                                      </span>
                                      <span className="text-[10.5px] text-muted-foreground">
                                        {Math.round(iss.confidence * 100)}% conf
                                      </span>
                                    </div>
                                    <p className="mt-1 text-[13px]">{iss.message}</p>
                                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                                      <span className="font-semibold text-foreground">Fix: </span>
                                      {iss.suggestion}
                                      {iss.fixedValue && (
                                        <span className="ml-1 rounded bg-success/10 px-1.5 py-0.5 font-mono text-[11.5px] text-success">
                                          → {iss.fixedValue}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
