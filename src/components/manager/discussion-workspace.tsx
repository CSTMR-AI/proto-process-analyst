"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  Loader2,
  PenLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { departments, type Discussion, type ExtractionField } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function resolveIdentity(discussion: Discussion) {
  for (const dept of departments) {
    for (const person of dept.people) {
      if (person.id === discussion.personId) {
        const role = person.roles.find((roleItem) => roleItem.id === discussion.roleId);
        return {
          person: person.name,
          role: role?.title ?? "",
          department: dept.name,
        };
      }
    }
  }
  return {
    person: discussion.personId,
    role: discussion.roleId,
    department: "",
  };
}

type EvidenceState = string[];

type ExtractionSection = "responsibilities" | "decisionPoints" | "followUps";

export function DiscussionWorkspace({ discussion }: { discussion: Discussion }) {
  const identity = resolveIdentity(discussion);
  const [activeSessionId, setActiveSessionId] = useState(discussion.sessions[0]?.id);
  const [extraction, setExtraction] = useState(discussion.extraction);
  const [transcriptEntries, setTranscriptEntries] = useState(discussion.transcript);
  const [hoverEvidence, setHoverEvidence] = useState<EvidenceState>([]);
  const [pinnedEvidence, setPinnedEvidence] = useState<EvidenceState>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activityFeed, setActivityFeed] = useState([
    `Version ${discussion.extraction.version} synthesized ${format(
      discussion.extraction.lastSynthesized ? new Date(discussion.extraction.lastSynthesized) : new Date(),
      "MMM d, HH:mm",
    )}`,
  ]);

  const activeEvidence = pinnedEvidence.length ? pinnedEvidence : hoverEvidence;
  const activeSession = discussion.sessions.find((session) => session.id === activeSessionId);

  const handleTranscriptChange = (entryId: string, text: string) => {
    setTranscriptEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, text } : entry)));
  };

  const handleExtractionChange = (section: ExtractionSection, fieldId: string, content: string) => {
    setExtraction((prev) => ({
      ...prev,
      [section]: prev[section].map((item: ExtractionField) =>
        item.id === fieldId ? { ...item, content } : item,
      ),
    }));
  };

  const triggerResynthesis = () => {
    setIsSynthesizing(true);
    const timestamp = new Date();
    setActivityFeed((prev) => [
      `Transcript edit sent at ${format(timestamp, "HH:mm:ss")}`,
      ...prev,
    ].slice(0, 4));

    setTimeout(() => {
      setExtraction((prev) => ({
        ...prev,
        version: prev.version + 1,
        lastSynthesized: timestamp.toISOString(),
        summary: `${prev.summary.split("\u2014")[0]} — refreshed ${format(timestamp, "HH:mm")}`,
        responsibilities: prev.responsibilities.map((field, index) =>
          index === 0
            ? {
                ...field,
                content: `${field.content.split("(")[0]?.trim()} (updated ${format(timestamp, "HH:mm")})`,
              }
            : field,
        ),
      }));
      setActivityFeed((prev) => [
        `Extraction updated ${format(timestamp, "HH:mm:ss")}`,
        ...prev,
      ].slice(0, 4));
      setIsSynthesizing(false);
    }, 2000);
  };

  const activeTranscriptSnippet = useMemo(() => {
    if (!activeEvidence.length) return null;
    const matches = transcriptEntries.filter((entry) => activeEvidence.includes(entry.id));
    return matches.map((entry) => `${entry.timestamp} ${entry.text}`).join("\n");
  }, [activeEvidence, transcriptEntries]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-white/60">
          <ArrowLeft className="h-4 w-4" /> Back to navigator
        </Link>
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Discussion</p>
          <h1 className="text-3xl font-semibold">{identity.person}</h1>
          <p className="text-white/70">{identity.role} · {identity.department}</p>
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <Badge variant="outline" className="border-white/20 text-white/80">
              {discussion.status === "active" ? "Draft" : "Complete"}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">
              Version {extraction.version}
            </Badge>
            <span>Last synthesized {format(new Date(extraction.lastSynthesized), "MMM d, HH:mm")}</span>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr_1fr]">
          <Card className="border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
              <CalendarClock className="h-4 w-4" /> Sessions
            </div>
            <ScrollArea className="mt-4 h-[70vh] pr-2">
              <div className="space-y-3">
                {discussion.sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-3 text-left",
                      activeSessionId === session.id
                        ? "border-white bg-white text-slate-900"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/30",
                    )}
                  >
                    <p className="text-sm font-semibold">
                      {format(new Date(session.date), "MMM d, HH:mm")}
                    </p>
                    <p className="text-xs text-white/60">{session.status}</p>
                    {session.exceptionLabel && (
                      <Badge className="mt-2 bg-amber-200/20 text-xs text-amber-200">
                        {session.exceptionLabel}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
            {activeSession?.status === "no_show" && (
              <div className="mt-4 rounded-lg border border-amber-300/30 bg-amber-400/10 p-3 text-xs text-amber-100">
                no-show detected · retry actions available
              </div>
            )}
          </Card>

          <Card className="border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Extraction</p>
                <h2 className="text-xl font-semibold">Editable DAG</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                {isSynthesizing ? (
                  <span className="flex items-center gap-1 text-emerald-200">
                    <Loader2 className="h-3 w-3 animate-spin" /> Re-synthesizing
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> Stable
                  </span>
                )}
              </div>
            </div>
            <Textarea
              className="mt-4 min-h-[100px] border-white/10 bg-black/20"
              value={extraction.summary}
              onChange={(event) =>
                setExtraction((prev) => ({ ...prev, summary: event.target.value }))
              }
            />
            <Separator className="my-4 border-white/10" />
            <div className="space-y-4">
              {(
                [
                  { label: "Responsibilities", key: "responsibilities" },
                  { label: "Decision points", key: "decisionPoints" },
                  { label: "Follow ups", key: "followUps" },
                ] as { label: string; key: ExtractionSection }[]
              ).map((section) => (
                <div key={section.key}>
                  <p className="text-xs uppercase tracking-wide text-white/50">{section.label}</p>
                  <div className="mt-2 space-y-3">
                    {extraction[section.key].map((field) => {
                      const highlighted = activeEvidence.some((id) => field.evidenceIds.includes(id));
                      return (
                        <div
                          key={field.id}
                          onMouseEnter={() => setHoverEvidence(field.evidenceIds)}
                          onMouseLeave={() => setHoverEvidence([])}
                          onClick={() => setPinnedEvidence(field.evidenceIds)}
                          className={cn(
                            "rounded-lg border bg-black/20 p-3",
                            highlighted ? "border-emerald-300" : "border-white/10",
                          )}
                        >
                          <div className="flex items-center justify-between text-sm text-white/70">
                            <span>{field.label}</span>
                            <Badge variant="outline" className="text-[10px] text-white/50">
                              {field.evidenceIds.length} links
                            </Badge>
                          </div>
                          <Textarea
                            className="mt-2 min-h-[80px] border-white/10 bg-transparent"
                            value={field.content}
                            onChange={(event) =>
                              handleExtractionChange(section.key, field.id, event.target.value)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {activeTranscriptSnippet && (
              <div className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-400/5 p-3 text-xs text-emerald-100">
                <p className="font-semibold uppercase tracking-wide">Linked transcript</p>
                <pre className="mt-2 whitespace-pre-wrap text-emerald-50">{activeTranscriptSnippet}</pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-7 bg-white/10 text-xs text-white"
                  onClick={() => setPinnedEvidence([])}
                >
                  Clear highlight
                </Button>
              </div>
            )}
          </Card>

          <Card className="border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">Transcript</p>
                <h2 className="text-xl font-semibold">Editor</h2>
              </div>
              <Button size="sm" variant="ghost" className="text-white/80" onClick={triggerResynthesis}>
                <Sparkles className="mr-2 h-4 w-4" /> Save & re-synthesize
              </Button>
            </div>
            <ScrollArea className="mt-4 h-[65vh] pr-3">
              <div className="space-y-4">
                {transcriptEntries.map((entry) => {
                  const highlighted = activeEvidence.includes(entry.id);
                  return (
                    <div
                      key={entry.id}
                      onMouseEnter={() => setHoverEvidence([entry.id])}
                      onMouseLeave={() => setHoverEvidence([])}
                      onClick={() => setPinnedEvidence([entry.id])}
                      className={cn(
                        "rounded-lg border bg-black/20 p-3 text-sm",
                        highlighted ? "border-emerald-300" : "border-white/10",
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between text-xs text-white/60">
                        <span>
                          {entry.speaker} · {entry.timestamp}
                        </span>
                        <PenLine className="h-3 w-3" />
                      </div>
                      <Textarea
                        value={entry.text}
                        onChange={(event) => handleTranscriptChange(entry.id, event.target.value)}
                        className="border-white/5 bg-transparent"
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="mt-4 space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2">
                {isSynthesizing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CircleAlert className="h-3 w-3" />}
                Transcript edits automatically trigger extraction re-synthesis.
              </div>
              <ol className="list-decimal pl-4 text-white/50">
                {activityFeed.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
