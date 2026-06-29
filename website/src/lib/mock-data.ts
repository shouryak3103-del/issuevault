export type Severity = "high" | "medium" | "low" | "fixed";
export type IssueType = "duplicate" | "missing" | "invalid_format" | "inconsistent";

export interface DataRecord {
  id: string; vendor: string; email: string; taxId: string;
  amount: string; date: string; issues: IssueType[];
}
export interface Issue {
  id: string; recordId: string; field: string; type: IssueType;
  severity: Severity; suggestion: string; confidence: number;
  status: "pending" | "approved" | "rejected" | "fixed";
}
export interface AuditEntry {
  id: string; time: string; user: string; action: string; target: string;
}
export interface TeamMember {
  id: string; name: string; role: string; email: string; avatar: string;
  issuesFixed: number; issuesPending: number; lastActive: string; gradient: string;
}

export const kpis = {
  totalRecords: 12480, issuesFound: 342, duplicates: 87,
  missingValues: 156, cleanScore: 94.2, fixedToday: 34,
};

export const records: DataRecord[] = [
  { id:"R-1001", vendor:"Acme Corp",        email:"billing@acme.com",     taxId:"12-3456789", amount:"$4,200.00",  date:"2026-05-14", issues:[] },
  { id:"R-1002", vendor:"acme corp.",        email:"billing@acme.com",     taxId:"12-3456789", amount:"$4200",      date:"2026-05-14", issues:["duplicate","inconsistent"] },
  { id:"R-1003", vendor:"Globex Inc",        email:"ap@globex",            taxId:"",           amount:"$1,820.50",  date:"2026-05-15", issues:["missing","invalid_format"] },
  { id:"R-1004", vendor:"Initech",           email:"finance@initech.com",  taxId:"98-7654321", amount:"$925.00",    date:"2026-05-16", issues:[] },
  { id:"R-1005", vendor:"Soylent Co",        email:"pay@soylent.com",      taxId:"55-1234567", amount:"$12,400",    date:"05/17/2026", issues:["invalid_format"] },
  { id:"R-1006", vendor:"Umbrella Corp",     email:"",                     taxId:"44-9988776", amount:"$3,300.00",  date:"2026-05-18", issues:["missing"] },
  { id:"R-1007", vendor:"Hooli",             email:"ap@hooli.com",         taxId:"77-1122334", amount:"$8,750.00",  date:"2026-05-18", issues:[] },
  { id:"R-1008", vendor:"HOOLI",             email:"ap@hooli.com",         taxId:"77-1122334", amount:"$8,750.00",  date:"2026-05-18", issues:["duplicate","inconsistent"] },
  { id:"R-1009", vendor:"Pied Piper",        email:"richard@piedpiper",    taxId:"",           amount:"$540.00",    date:"2026-05-19", issues:["missing","invalid_format"] },
  { id:"R-1010", vendor:"Stark Industries",  email:"ap@stark.com",         taxId:"11-2233445", amount:"$22,000.00", date:"2026-05-20", issues:[] },
  { id:"R-1011", vendor:"Wayne Enterprises", email:"billing@wayne.com",    taxId:"33-4455667", amount:"$15,300.00", date:"2026-05-20", issues:[] },
  { id:"R-1012", vendor:"wayne ent.",        email:"billing@wayne.com",    taxId:"33-4455667", amount:"$15300",     date:"2026-05-20", issues:["duplicate","inconsistent"] },
];

export const issues: Issue[] = [
  { id:"I-01", recordId:"R-1002", field:"vendor",  type:"duplicate",     severity:"high",   suggestion:"Merge with R-1001 (Acme Corp)",            confidence:0.97, status:"pending" },
  { id:"I-02", recordId:"R-1003", field:"taxId",   type:"missing",       severity:"high",   suggestion:"Request tax ID from vendor",               confidence:0.88, status:"pending" },
  { id:"I-03", recordId:"R-1003", field:"email",   type:"invalid_format",severity:"medium", suggestion:"Append '.com' → ap@globex.com",            confidence:0.92, status:"pending" },
  { id:"I-04", recordId:"R-1005", field:"amount",  type:"invalid_format",severity:"low",    suggestion:"Reformat as $12,400.00",                   confidence:0.99, status:"pending" },
  { id:"I-05", recordId:"R-1006", field:"email",   type:"missing",       severity:"high",   suggestion:"Pull from vendor profile: contact@umbrella.com", confidence:0.74, status:"pending" },
  { id:"I-06", recordId:"R-1008", field:"vendor",  type:"duplicate",     severity:"high",   suggestion:"Merge with R-1007 (Hooli)",                confidence:0.96, status:"pending" },
  { id:"I-07", recordId:"R-1008", field:"vendor",  type:"inconsistent",  severity:"low",    suggestion:"Normalize casing: Hooli",                  confidence:0.99, status:"pending" },
  { id:"I-08", recordId:"R-1009", field:"email",   type:"invalid_format",severity:"medium", suggestion:"Append '.com' → richard@piedpiper.com",    confidence:0.91, status:"pending" },
  { id:"I-09", recordId:"R-1012", field:"vendor",  type:"duplicate",     severity:"high",   suggestion:"Merge with R-1011 (Wayne Enterprises)",    confidence:0.95, status:"pending" },
  { id:"I-10", recordId:"R-1005", field:"date",    type:"invalid_format",severity:"medium", suggestion:"ISO format: 2026-05-17",                   confidence:0.98, status:"pending" },
];

export const audit: AuditEntry[] = [
  { id:"A-01", time:"2026-06-22 09:14", user:"Maya R.",  action:"Approved fix",      target:"I-04 · amount format" },
  { id:"A-02", time:"2026-06-22 09:02", user:"Maya R.",  action:"Merged duplicate",  target:"R-1002 → R-1001" },
  { id:"A-03", time:"2026-06-22 08:51", user:"AI Auto",  action:"Ran analysis",      target:"vendors_may.csv" },
  { id:"A-04", time:"2026-06-21 17:28", user:"Devon K.", action:"Rejected fix",      target:"I-05 · email guess" },
  { id:"A-05", time:"2026-06-21 16:09", user:"Devon K.", action:"Uploaded file",     target:"vendors_may.csv (12,480 rows)" },
  { id:"A-06", time:"2026-06-21 15:44", user:"AI Auto",  action:"Normalized casing", target:"8 records" },
  { id:"A-07", time:"2026-06-20 11:30", user:"Maya R.",  action:"Approved fix",      target:"I-07 · vendor casing" },
];

export const team: TeamMember[] = [
  { id:"T-01", name:"Maya Rodriguez", role:"Data Lead",        email:"maya@acme.com",   avatar:"MR", issuesFixed:128, issuesPending:14, lastActive:"2 min ago", gradient:"from-magenta to-primary" },
  { id:"T-02", name:"Devon Kim",      role:"Data Engineer",    email:"devon@acme.com",  avatar:"DK", issuesFixed:94,  issuesPending:8,  lastActive:"1 hr ago",  gradient:"from-aqua to-primary" },
  { id:"T-03", name:"Priya Shah",     role:"QA Analyst",       email:"priya@acme.com",  avatar:"PS", issuesFixed:67,  issuesPending:22, lastActive:"3 hr ago",  gradient:"from-highlight to-magenta" },
  { id:"T-04", name:"Luca Bianchi",   role:"Backend Engineer", email:"luca@acme.com",   avatar:"LB", issuesFixed:43,  issuesPending:5,  lastActive:"Yesterday", gradient:"from-lemon to-aqua" },
];

export const analyticsWeekly = [
  { day:"Mon", fixed:28, found:45, uploaded:2 },
  { day:"Tue", fixed:34, found:38, uploaded:1 },
  { day:"Wed", fixed:52, found:61, uploaded:4 },
  { day:"Thu", fixed:41, found:33, uploaded:2 },
  { day:"Fri", fixed:38, found:42, uploaded:3 },
  { day:"Sat", fixed:22, found:18, uploaded:1 },
  { day:"Sun", fixed:15, found:12, uploaded:0 },
];

export const issueTypeLabel: Record<IssueType, string> = {
  duplicate:"Duplicate", missing:"Missing field",
  invalid_format:"Invalid format", inconsistent:"Inconsistent",
};

export const severityColor: Record<Severity, string> = {
  high:   "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-highlight/15 text-highlight-foreground border-highlight/30",
  low:    "bg-lemon/20 text-lemon-foreground border-lemon/40",
  fixed:  "bg-success/10 text-success-foreground border-success/20",
};
