import { createFileRoute } from "@tanstack/react-router";
import { kpis, analyticsWeekly, issues, records } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Zap, Database, CheckCircle2, AlertTriangle, BarChart3, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — IssueVault" }] }),
  component: AnalyticsPage,
});

const maxVal = Math.max(...analyticsWeekly.map(d => Math.max(d.fixed, d.found)));
const typeBreakdown = [
  { label:"Duplicates",       value:87,  pct:25, color:"bg-destructive"   },
  { label:"Missing fields",   value:156, pct:46, color:"bg-highlight"     },
  { label:"Invalid format",   value:72,  pct:21, color:"bg-aqua"          },
  { label:"Inconsistent",     value:27,  pct:8,  color:"bg-lemon"         },
];
const sevBreakdown = [
  { label:"High",   value:issues.filter(i=>i.severity==="high").length,   color:"bg-destructive", ring:"ring-destructive/20" },
  { label:"Medium", value:issues.filter(i=>i.severity==="medium").length, color:"bg-highlight",   ring:"ring-highlight/20"   },
  { label:"Low",    value:issues.filter(i=>i.severity==="low").length,    color:"bg-lemon",       ring:"ring-lemon/40"       },
];
const total = sevBreakdown.reduce((a,s)=>a+s.value,0);

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">7-day overview of your data quality</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon:Database,      label:"Total records",  value:kpis.totalRecords.toLocaleString(), delta:"+10.4%", up:true,  accent:"bg-aqua"      },
          { icon:AlertTriangle, label:"Issues found",   value:kpis.issuesFound,                   delta:"-8.1%",  up:false, accent:"bg-destructive"},
          { icon:CheckCircle2,  label:"Fixed this week",value:230,                                 delta:"+18%",   up:true,  accent:"bg-success"    },
          { icon:Target,        label:"Clean score",    value:`${kpis.cleanScore}%`,              delta:"+1.2pt", up:true,  accent:"bg-magenta"    },
        ].map(({icon:Icon,label,value,delta,up,accent}) => (
          <div key={label} className="rounded-2xl border-2 border-ink/12 bg-card p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div className={cn("h-10 w-10 rounded-xl border-2 border-ink/15 shadow-sticker-sm flex items-center justify-center", accent)}>
                <Icon className="h-4.5 w-4.5 text-ink" strokeWidth={2.5}/>
              </div>
              <span className={cn("flex items-center gap-1 text-[11px] font-bold rounded-full px-2 py-0.5", up ? "bg-success/10 text-success-foreground" : "bg-destructive/10 text-destructive")}>
                {up ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}{delta}
              </span>
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Weekly bar chart */}
        <div className="lg:col-span-3 rounded-2xl border-2 border-ink/12 bg-card p-5 shadow-card">
          <div className="mb-5">
            <h3 className="font-display font-bold">Weekly activity</h3>
            <p className="text-xs text-muted-foreground">Issues found vs fixed per day</p>
          </div>
          <div className="flex items-end gap-3 h-40">
            {analyticsWeekly.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-32">
                  <div className="flex-1 rounded-t-lg bg-gradient-magenta opacity-75 min-h-1 transition-all"
                    style={{ height:`${(d.found/maxVal)*100}%` }}/>
                  <div className="flex-1 rounded-t-lg bg-gradient-to-t from-success to-aqua min-h-1 transition-all"
                    style={{ height:`${(d.fixed/maxVal)*100}%` }}/>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-5 text-[12px] font-semibold">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gradient-magenta opacity-75 inline-block"/>Found</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-success inline-block"/>Fixed</span>
          </div>
        </div>

        {/* Severity donut */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-ink/12 bg-card p-5 shadow-card flex flex-col">
          <div className="mb-4">
            <h3 className="font-display font-bold">Severity split</h3>
            <p className="text-xs text-muted-foreground">{total} active issues</p>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            {sevBreakdown.map(({label,value,color,ring}) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] font-semibold mb-1.5">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{value} <span className="text-muted-foreground/60">({Math.round(value/total*100)}%)</span></span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", color)} style={{ width:`${(value/total)*100}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue type breakdown */}
      <div className="rounded-2xl border-2 border-ink/12 bg-card p-5 shadow-card">
        <div className="mb-5">
          <h3 className="font-display font-bold">Issue type breakdown</h3>
          <p className="text-xs text-muted-foreground">Distribution across {kpis.issuesFound} total issues</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {typeBreakdown.map(({label,value,pct,color}) => (
            <div key={label} className="rounded-xl border-2 border-ink/10 bg-secondary/40 p-4">
              <div className="flex items-end justify-between mb-2">
                <p className="font-display text-2xl font-bold">{value}</p>
                <span className="text-[11px] font-bold text-muted-foreground">{pct}%</span>
              </div>
              <p className="text-[12px] font-semibold mb-2">{label}</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", color)} style={{ width:`${pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
