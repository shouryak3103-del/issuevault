import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RowSchema = z.object({
  id: z.string().optional(),
  data: z.record(z.string(), z.string()),
});

const InputSchema = z.object({
  headers: z.array(z.string()).min(1).max(40),
  rows: z.array(RowSchema).min(1).max(500),
});

export type AnalyzeInput = z.infer<typeof InputSchema>;

export type IssueKind = "duplicate" | "missing" | "invalid_format" | "inconsistent";
export type Severity = "high" | "medium" | "low";

export interface AIIssue {
  rowIndex: number;
  field: string;
  type: IssueKind;
  severity: Severity;
  message: string;
  suggestion: string;
  fixedValue?: string;
  confidence: number;
}

export interface AnalyzeResult {
  summary: string;
  totalIssues: number;
  byType: Record<IssueKind, number>;
  issues: AIIssue[];
}

const SYSTEM = `You are an expert data quality analyst. Inspect tabular CSV data and detect:
- duplicates: rows that refer to the same entity (case/punctuation/whitespace differences in name, same email/tax id, etc.)
- missing: empty required values
- invalid_format: emails, dates, phone numbers, tax IDs, monetary amounts that don't match standard formats
- inconsistent: casing, units, abbreviations, date formats that vary across rows for the same concept

For each issue propose a concrete corrected value when possible.
Respond ONLY with valid JSON matching the schema. Be thorough but precise. rowIndex is 0-based.`;

const JSON_SCHEMA_HINT = `{
  "summary": "one-sentence human summary",
  "issues": [
    {
      "rowIndex": 0,
      "field": "email",
      "type": "duplicate" | "missing" | "invalid_format" | "inconsistent",
      "severity": "high" | "medium" | "low",
      "message": "what's wrong",
      "suggestion": "how to fix it",
      "fixedValue": "corrected value (optional)",
      "confidence": 0.0
    }
  ]
}`;

export const analyzeData = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const userPrompt = `Headers: ${JSON.stringify(data.headers)}

Rows (rowIndex : data):
${data.rows
  .map((r, i) => `${i}: ${JSON.stringify(r.data)}`)
  .join("\n")}

Return JSON matching this schema exactly:
${JSON_SCHEMA_HINT}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("AI rate limit reached. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error(`AI analysis failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";

    let parsed: { summary?: string; issues?: AIIssue[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { issues: [] };
    }

    const issues = (parsed.issues ?? []).filter(
      (i) => i && typeof i.rowIndex === "number" && i.field && i.type,
    );

    const byType: Record<IssueKind, number> = {
      duplicate: 0,
      missing: 0,
      invalid_format: 0,
      inconsistent: 0,
    };
    for (const i of issues) byType[i.type] = (byType[i.type] ?? 0) + 1;

    return {
      summary: parsed.summary ?? `Found ${issues.length} issues across ${data.rows.length} rows.`,
      totalIssues: issues.length,
      byType,
      issues,
    };
  });
