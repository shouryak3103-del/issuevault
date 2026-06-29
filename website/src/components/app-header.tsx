import { useRouterState, useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Sparkles, Command, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";

const titleMap: Record<string, { title: string; sub: string; emoji: string }> = {
  "/": { title: "Dashboard", sub: "Quick pulse on your data health", emoji: "📊" },
  "/upload": { title: "Upload data", sub: "Drop a CSV and let the AI do its thing", emoji: "📤" },
  "/records": { title: "Records", sub: "Browse, filter, and spot problems", emoji: "🗂️" },
  "/issues": { title: "Issues", sub: "Everything the AI flagged for review", emoji: "🚨" },
  "/fixes": { title: "Fix suggestions", sub: "Approve, edit or reject AI fixes", emoji: "🪄" },
  "/audit": { title: "Audit log", sub: "Who did what, when", emoji: "📜" },
};

export function AppHeader() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const meta = titleMap[pathname] ?? { title: "AI Data Fixer", sub: "", emoji: "✨" };
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    if (lower.includes("duplicate")) {
      navigate({ to: "/issues", search: { type: "duplicate" } as never });
      toast.success("Filtered duplicates", { description: `AI summary: 4 high-confidence duplicate clusters across 8 records.` });
    } else if (lower.includes("missing") || lower.includes("tax")) {
      navigate({ to: "/issues", search: { type: "missing" } as never });
      toast.success("Filtered missing values", { description: "2 records missing tax IDs · 1 missing email." });
    } else if (lower.includes("fix") || lower.includes("suggest")) {
      navigate({ to: "/fixes" });
      toast.success("Showing fix suggestions", { description: "10 pending · 7 high-confidence auto-fixes ready." });
    } else if (lower.includes("invalid") || lower.includes("format")) {
      navigate({ to: "/issues", search: { type: "invalid_format" } as never });
      toast.success("Filtered invalid formats");
    } else {
      navigate({ to: "/records" });
      toast.message("AI scanned your query", { description: `Showing records matching "${q}".` });
    }
    setQ("");
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="md:-ml-1 rounded-xl" />
      <div className="hidden min-w-0 md:flex md:items-center md:gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-lemon border-2 border-ink/20 shadow-sticker-sm text-lg">
          {meta.emoji}
        </div>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate font-display text-xl font-bold leading-tight tracking-tight">
            {meta.title}
          </h1>
          <p className="truncate text-[11.5px] text-muted-foreground font-medium">{meta.sub}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="ml-auto flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-sunset opacity-0 blur-md transition-opacity group-focus-within:opacity-60" />
          <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 flex items-center text-magenta">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask AI: find duplicate vendors, show missing tax IDs…"
            className="relative h-11 rounded-full border-2 border-ink/15 bg-card pl-10 pr-20 text-sm font-medium shadow-sticker-sm focus-visible:ring-magenta/30 focus-visible:border-magenta/50 transition-all"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-1 rounded-md border-2 border-ink/15 bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground sm:flex">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>
      </form>

      <Button size="icon" variant="ghost" className="rounded-xl relative">
        <Bell className="h-4 w-4" strokeWidth={2.5} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background" />
      </Button>
      <Avatar className="h-10 w-10 border-2 border-ink/20 shadow-sticker-sm">
        <AvatarFallback className="bg-gradient-sunset text-white text-[11px] font-bold">
          MR
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
