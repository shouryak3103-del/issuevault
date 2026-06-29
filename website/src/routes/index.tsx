import { createFileRoute, Link } from "@tanstack/react-router";
import { kpis, audit, issues, records, analyticsWeekly } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/severity-badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, TrendingUp, CheckCircle2, Upload,
  Zap, AlertTriangle, Database, Users, BarChart3, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — IssueVault" }] }),
  component: Dashboard,
});

const weekData = analyticsWeekly;
const maxFixed = Math.max(...weekData.map(d => d.fixed));

function Dashboard() {
  const topIssues = issues.slice(0, 5);
  const pending = issues.filter(i => i.status === "pending").length;
  const cleanPct = Math.round((1 - issues.length / (records.length * 3)) * 100);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">

      {/* ── HERO BENTO ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main hero card */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink/90 bg-gradient-sunset p-7 text-white shadow-sticker lg:col-span-2 md:p-9">
          <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-magenta/60 blob" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-lemon/60 blob" />
          <div className="absolute right-8 top-8 hidden md:block">
            <div className="animate-float rounded-2xl border-2 border-white/30 bg-white/10 px-3 py-2 backdrop-blur-md rotate-3">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Clean score</p>
              <p className="font-display text-3xl font-bold leading-none">{kpis.cleanScore}<span className="text-base">%</span></p>
            </div>
          </div>
          <div className="relative flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-white/40 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI scan complete · 2m ago
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl leading-[1.02]">
                Your data is<br />
                <span className="inline-block squiggle">spotless-ish</span> ✨
              </h2>
              <p className="mt-3 max-w-lg text-sm md:text-base text-white/85 font-medium">
                We spotted <span className="font-bold text-lemon">{kpis.issuesFound} fresh issues</span> across{" "}
                {kpis.totalRecords.toLocaleString()} records. Most are fixable in one click.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button asChild size="lg" className="h-12 rounded-full border-2 border-ink/30 bg-lemon px-6 text-ink hover:bg-lemon/90 shadow-sticker font-bold">
                <Link to="/fixes"><Zap className="h-4 w-4" /> Fix {pending} issues</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-2 border-white/40 bg-white/10 px-6 text-white hover:bg-white/20 backdrop-blur font-medium">
                <Link to="/upload"><Upload className="h-4 w-4" /> Upload data</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI stack */}
        <div className="flex flex-col gap-4">
          {[
            { icon:Database,      label:"Total records",   value:kpis.totalRecords.toLocaleString(), accent:"bg-aqua",         sub:"↑ 1,240 this week" },
            { icon:AlertTriangle, label:"Issues found",    value:kpis.issuesFound,                   accent:"bg-destructive",  sub:`${kpis.duplicates} duplicates` },
            { icon:CheckCircle2,  label:"Fixed today",     value:kpis.fixedToday,                    accent:"bg-success",      sub:"↑ 28% vs yesterday" },
          ].map(({ icon:Icon, label, value, accent, sub }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border-2 border-ink/15 bg-card p-4 shadow-card hover:shadow-pop transition-shadow">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink/20 shadow-sticker-sm", accent)}>
                <Icon className="h-5 w-5 text-ink" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="font-display text-2xl font-bold leading-none">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTIVITY CHART + TOP ISSUES ── */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Mini bar chart */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-ink/15 bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base">This week</h3>
              <p className="text-xs text-muted-foreground">Issues fixed vs found</p>
            </div>
            <span className="rounded-full border-2 border-ink/10 bg-success/10 px-2.5 py-0.5 text-[11px] font-bold text-success-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3"/> +18%
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weekData.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full gap-0.5 items-end h-24">
                  <div className="flex-1 rounded-t-md bg-gradient-magenta opacity-70 transition-all"
                    style={{ height: `${(d.found / maxFixed) * 100}%` }} />
                  <div className="flex-1 rounded-t-md bg-success transition-all"
                    style={{ height: `${(d.fixed / maxFixed) * 100}%` }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gradient-magenta opacity-70 inline-block"/>Found</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success inline-block"/>Fixed</span>
          </div>
        </div>

        {/* Top issues */}
        <div className="lg:col-span-3 rounded-2xl border-2 border-ink/15 bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base">Top issues</h3>
              <p className="text-xs text-muted-foreground">Highest confidence fixes</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-8 rounded-full text-xs font-semibold">
              <Link to="/fixes">View all <ArrowRight className="ml-1 h-3 w-3"/></Link>
            </Button>
          </div>
          <div className="space-y-2.5">
            {topIssues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2.5 hover:bg-accent/40 transition-colors">
                <SeverityBadge severity={issue.severity} />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13px] font-semibold">{issue.suggestion}</p>
                  <p className="text-[11px] text-muted-foreground">{issue.recordId} · {issue.field}</p>
                </div>
                <div className="shrink-0 rounded-full border border-border/60 bg-background px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                  {Math.round(issue.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECENT AUDIT ── */}
      <div className="rounded-2xl border-2 border-ink/15 bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base">Recent activity</h3>
            <p className="text-xs text-muted-foreground">Last 7 actions across your workspace</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-8 rounded-full text-xs font-semibold">
            <Link to="/audit">Full log <ArrowRight className="ml-1 h-3 w-3"/></Link>
          </Button>
        </div>
        <div className="space-y-2">
          {audit.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/40 transition-colors">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-ink/10 text-[11px] font-bold",
                entry.user === "AI Auto" ? "bg-gradient-magenta text-white" : "bg-lemon text-ink shadow-sticker-sm")}>
                {entry.user === "AI Auto" ? <Sparkles className="h-3.5 w-3.5"/> : entry.user.slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">{entry.action}</p>
                <p className="truncate text-[11px] text-muted-foreground">{entry.target}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground">{entry.time.split(" ")[1]}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
