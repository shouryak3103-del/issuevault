import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { team } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, CheckCircle2, AlertTriangle, Clock, Mail, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — IssueVault" }] }),
  component: TeamPage,
});

const ROLE_COLORS: Record<string, string> = {
  "Data Lead":        "bg-gradient-magenta text-white",
  "Data Engineer":    "bg-aqua/20 text-aqua-foreground border border-aqua/30",
  "QA Analyst":       "bg-lemon/20 text-lemon-foreground border border-lemon/40",
  "Backend Engineer": "bg-success/10 text-success-foreground border border-success/20",
};

function TeamPage() {
  const [search, setSearch] = useState("");
  const filtered = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );
  const totalFixed = team.reduce((a, m) => a + m.issuesFixed, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{team.length} members · {totalFixed} issues fixed total</p>
        </div>
        <Button
          className="h-10 rounded-full border-2 border-ink/20 bg-gradient-sunset text-white shadow-sticker font-bold hover:opacity-90 gap-2"
          onClick={() => toast.success("Invite sent!")}
        >
          <Plus className="h-4 w-4"/> Invite member
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:"Members",     value:team.length,                               icon:Users,        accent:"bg-aqua" },
          { label:"Fixed total", value:totalFixed,                                icon:CheckCircle2, accent:"bg-success" },
          { label:"Pending",     value:team.reduce((a,m)=>a+m.issuesPending,0),  icon:AlertTriangle,accent:"bg-highlight" },
          { label:"Active now",  value:team.filter(m=>m.lastActive.includes("min")).length, icon:Sparkles, accent:"bg-magenta" },
        ].map(({label,value,icon:Icon,accent}) => (
          <div key={label} className="rounded-2xl border-2 border-ink/12 bg-card p-4 shadow-card text-center">
            <div className={cn("h-10 w-10 rounded-xl border-2 border-ink/15 shadow-sticker-sm flex items-center justify-center mx-auto mb-2", accent)}>
              <Icon className="h-4.5 w-4.5 text-ink" strokeWidth={2.5}/>
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
        <Input className="h-11 rounded-full border-2 border-ink/15 bg-card pl-10 shadow-card focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Search by name or role…" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map(member => (
          <div key={member.id} className="group rounded-2xl border-2 border-ink/12 bg-card p-5 shadow-card hover:shadow-pop hover:-translate-y-0.5 transition-all">
            {/* Avatar */}
            <div className={cn("h-14 w-14 rounded-2xl border-2 border-ink/20 shadow-sticker flex items-center justify-center font-display text-xl font-bold text-white mb-4 bg-gradient-to", member.gradient)}>
              {member.avatar}
            </div>
            <h3 className="font-display font-bold text-[15px] leading-tight">{member.name}</h3>
            <div className="mt-1 mb-3">
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", ROLE_COLORS[member.role] || "bg-muted text-muted-foreground")}>
                {member.role}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-3">
              <Mail className="h-3 w-3"/>{member.email}
            </p>
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-success-foreground">{member.issuesFixed} fixed</span>
                <span className="text-muted-foreground">{member.issuesPending} pending</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-sunset transition-all"
                  style={{ width: `${(member.issuesFixed / (member.issuesFixed + member.issuesPending)) * 100}%` }}/>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3"/>{member.lastActive}
            </p>
          </div>
        ))}

        {/* Add card */}
        <button
          className="rounded-2xl border-2 border-dashed border-ink/20 bg-card/50 p-5 hover:border-magenta/40 hover:bg-magenta/5 transition-all flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-magenta"
          onClick={() => toast.success("Invite flow coming soon!")}
        >
          <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="h-6 w-6"/>
          </div>
          <span className="text-[13px] font-semibold">Invite teammate</span>
        </button>
      </div>
    </div>
  );
}
