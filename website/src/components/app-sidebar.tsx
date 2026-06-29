import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Upload, Database, AlertTriangle,
  Wand2, ScrollText, Sparkles, Users, BarChart3, Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";

const nav = [
  { title:"Dashboard",     url:"/",          icon:LayoutDashboard, accent:"bg-highlight" },
  { title:"Upload",        url:"/upload",     icon:Upload,          accent:"bg-aqua"      },
  { title:"Records",       url:"/records",    icon:Database,        accent:"bg-primary"   },
  { title:"Issues",        url:"/issues",     icon:AlertTriangle,   accent:"bg-destructive"},
  { title:"Fix suggestions",url:"/fixes",    icon:Wand2,           accent:"bg-lemon"     },
  { title:"Audit log",     url:"/audit",      icon:ScrollText,      accent:"bg-success"   },
];
const secondary = [
  { title:"Analytics", url:"/analytics", icon:BarChart3, accent:"bg-aqua"    },
  { title:"Team",      url:"/team",      icon:Users,     accent:"bg-magenta" },
  { title:"Settings",  url:"/settings",  icon:Settings,  accent:"bg-muted"   },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  const NavItem = ({ item }: { item: typeof nav[0] }) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={active} tooltip={item.title}
          className="h-10 rounded-xl font-medium data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sticker-sm data-[active=true]:border-2 data-[active=true]:border-ink/30 hover:bg-sidebar-accent/60">
          <Link to={item.url} className="flex items-center gap-2.5">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${active ? item.accent : "bg-sidebar-accent/40"} ${active ? "text-ink shadow-sticker-sm border-2 border-ink/40" : "text-sidebar-foreground/80"}`}>
              <item.icon className="h-3.5 w-3.5" strokeWidth={2.5}/>
            </span>
            <span className="text-[13.5px]">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-3 py-5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-sunset border-2 border-ink/20 shadow-sticker-sm group-hover:rotate-[-8deg] transition-transform">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5}/>
            <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full bg-lemon border-2 border-sidebar animate-pulse"/>
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-[15px] font-bold tracking-tight text-sidebar-foreground">IssueVault</span>
            <span className="text-[10.5px] text-sidebar-foreground/60 font-medium">AI-powered data quality ✨</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] font-bold uppercase tracking-[0.18em]">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {nav.map(item => <NavItem key={item.url} item={item}/>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] font-bold uppercase tracking-[0.18em]">Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondary.map(item => <NavItem key={item.url} item={item}/>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-ink/20 bg-gradient-magenta p-3 group-data-[collapsible=icon]:hidden shadow-sticker-sm">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-lemon/40 blur-xl"/>
          <div className="relative flex items-center gap-2 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-lemon animate-pulse shadow-[0_0_8px_currentColor]"/>AI engine online
          </div>
          <p className="relative mt-1 text-[10.5px] text-white/80 font-medium">Last sync 2 min ago · 99.9% uptime</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
