import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Shield, Palette, Database, Save, Check, User, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — IssueVault" }] }),
  component: SettingsPage,
});

const TABS = [
  { id:"profile",  label:"Profile",      icon:User     },
  { id:"notifs",   label:"Notifications",icon:Bell     },
  { id:"database", label:"Database",     icon:Database },
  { id:"security", label:"Security",     icon:Shield   },
  { id:"theme",    label:"Appearance",   icon:Palette  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={cn("relative h-6 w-11 rounded-full border-2 border-ink/20 transition-colors", on ? "bg-gradient-sunset" : "bg-muted")}>
      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sticker-sm transition-all border border-ink/20", on ? "left-5" : "left-0.5")}/>
    </button>
  );
}

function Row({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-4 border-b border-border/50 last:border-0">
      <div>
        <p className="text-[14px] font-semibold">{label}</p>
        {help && <p className="text-[12px] text-muted-foreground">{help}</p>}
      </div>
      <div className="sm:shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email:true, slack:false, digest:true, critical:true });
  const [profile, setProfile] = useState({ name:"Maya Rodriguez", email:"maya@acme.com", org:"Acme Corp" });

  const save = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your workspace preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tab sidebar */}
        <div className="lg:w-52 shrink-0">
          <nav className="flex gap-1.5 lg:flex-col overflow-x-auto pb-1 lg:pb-0">
            {TABS.map(({ id, label, icon:Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn("flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all whitespace-nowrap w-full",
                  tab === id ? "bg-gradient-sunset text-white shadow-sticker border-2 border-ink/20" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
                <Icon className="h-4 w-4 shrink-0"/>{label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl border-2 border-ink/12 bg-card p-6 shadow-card">
          {tab === "profile" && (
            <div className="space-y-0">
              <h2 className="font-display font-bold text-lg mb-4">Profile</h2>
              {[["Full Name","name","Maya Rodriguez"],["Email","email","maya@acme.com"],["Organization","org","Acme Corp"]].map(([label,key,placeholder]) => (
                <Row key={key} label={label}>
                  <Input className="h-9 rounded-xl border-2 border-ink/15 bg-secondary/50 w-full sm:w-60"
                    value={(profile as any)[key]} placeholder={placeholder}
                    onChange={e => setProfile(p => ({...p,[key]:e.target.value}))}/>
                </Row>
              ))}
            </div>
          )}
          {tab === "notifs" && (
            <div>
              <h2 className="font-display font-bold text-lg mb-4">Notifications</h2>
              {[
                { key:"email",    label:"Email alerts",    help:"Get notified via email for new issues"      },
                { key:"slack",    label:"Slack messages",  help:"Post to Slack when critical issues are found"},
                { key:"digest",   label:"Daily digest",    help:"Morning summary of open issues"             },
                { key:"critical", label:"Critical only",   help:"Only alert on high-severity issues"         },
              ].map(({key,label,help}) => (
                <Row key={key} label={label} help={help}>
                  <Toggle on={(notifs as any)[key]} onChange={v => setNotifs(p => ({...p,[key]:v}))}/>
                </Row>
              ))}
            </div>
          )}
          {tab === "database" && (
            <div>
              <h2 className="font-display font-bold text-lg mb-4">Database</h2>
              <Row label="Supabase URL" help="Your project URL from Supabase dashboard">
                <Input className="h-9 rounded-xl border-2 border-ink/15 bg-secondary/50 w-full sm:w-60 font-mono text-xs"
                  placeholder="https://xxx.supabase.co" defaultValue="https://abc123.supabase.co"/>
              </Row>
              <Row label="Service role key" help="Keep this private — never share publicly">
                <Input className="h-9 rounded-xl border-2 border-ink/15 bg-secondary/50 w-full sm:w-60 font-mono text-xs"
                  type="password" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"/>
              </Row>
              <div className="mt-4 rounded-xl border border-success/30 bg-success/8 p-3">
                <p className="text-[13px] font-semibold text-success-foreground flex items-center gap-2">
                  <Check className="h-4 w-4"/> Connection active
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Last ping: 2 min ago · Latency: 48ms</p>
              </div>
            </div>
          )}
          {tab === "security" && (
            <div>
              <h2 className="font-display font-bold text-lg mb-4">Security</h2>
              <Row label="Two-factor auth" help="Require 2FA for all workspace members">
                <Toggle on={false} onChange={() => toast.success("2FA settings opening…")}/>
              </Row>
              <Row label="Session timeout" help="Auto-logout after inactivity">
                <select className="h-9 rounded-xl border-2 border-ink/15 bg-secondary/50 px-3 text-[13px] font-medium">
                  <option>24 hours</option><option>8 hours</option><option>1 hour</option>
                </select>
              </Row>
              <Row label="API access" help="Manage personal API tokens">
                <Button variant="outline" size="sm" className="h-8 rounded-full border-2 border-ink/15 text-xs font-semibold gap-1.5">
                  <Key className="h-3 w-3"/>Manage tokens
                </Button>
              </Row>
            </div>
          )}
          {tab === "theme" && (
            <div>
              <h2 className="font-display font-bold text-lg mb-4">Appearance</h2>
              <Row label="Accent color" help="Primary action color">
                <div className="flex gap-2">
                  {[["#ff2d78","Magenta"],["#9d00ff","Purple"],["#00f5ff","Cyan"],["#00ff94","Green"],["#ffe600","Lemon"]].map(([c,name]) => (
                    <button key={c} title={name}
                      className="h-8 w-8 rounded-xl border-2 border-ink/20 shadow-sticker-sm hover:scale-110 transition-transform"
                      style={{ background:c }}/>
                  ))}
                </div>
              </Row>
              <Row label="Sidebar position" help="Which side the navigation appears on">
                <div className="flex gap-2">
                  {["Left","Right"].map(pos => (
                    <Button key={pos} variant={pos==="Left"?"default":"outline"} size="sm"
                      className={cn("h-8 rounded-full text-xs font-semibold border-2", pos==="Left"?"border-ink/20 bg-gradient-sunset text-white":"border-ink/15")}>
                      {pos}
                    </Button>
                  ))}
                </div>
              </Row>
            </div>
          )}

          <div className="mt-6 flex justify-end border-t border-border/50 pt-4">
            <Button onClick={save} className="h-10 rounded-full border-2 border-ink/20 bg-gradient-sunset text-white shadow-sticker font-bold hover:opacity-90 gap-2">
              {saved ? <><Check className="h-4 w-4"/>Saved!</> : <><Save className="h-4 w-4"/>Save changes</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
