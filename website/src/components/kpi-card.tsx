import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "aqua" | "warm" | "success" | "magenta" | "lemon";
  size?: "sm" | "md" | "lg";
}

const toneMap = {
  primary: "bg-gradient-primary text-primary-foreground",
  aqua: "bg-gradient-aqua text-aqua-foreground",
  warm: "bg-gradient-warm text-highlight-foreground",
  success: "bg-success text-success-foreground",
  magenta: "bg-gradient-magenta text-magenta-foreground",
  lemon: "bg-gradient-lemon text-lemon-foreground",
};

const tiltMap = ["-rotate-[0.6deg]", "rotate-[0.4deg]", "-rotate-[0.3deg]", "rotate-[0.7deg]"];

export function KpiCard({ label, value, delta, icon: Icon, tone = "primary", size = "md" }: KpiCardProps) {
  const tilt = tiltMap[Math.abs(label.length) % tiltMap.length];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border-2 border-ink/90 bg-card p-5 shadow-sticker transition-all duration-300",
        "hover:-translate-y-1 hover:rotate-0 hover:shadow-pop",
        tilt,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className={cn(
            "mt-3 font-display font-bold tracking-tight leading-none",
            size === "lg" ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl",
          )}>
            {value}
          </p>
          {delta && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              <span className="font-mono">{delta}</span>
              <span className="text-muted-foreground font-normal">vs last week</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-ink shadow-sticker-sm transition-transform group-hover:rotate-[8deg] group-hover:scale-105",
            toneMap[tone],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-magenta/20 blur-2xl opacity-60 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
