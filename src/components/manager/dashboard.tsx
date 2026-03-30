"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, CirclePlay, Plus, Sparkles, Users } from "lucide-react";

import { departments, discussions, type Department } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const statusCopy = {
  active: { label: "In progress", tone: "bg-emerald-100 text-emerald-900" },
  complete: { label: "Complete", tone: "bg-slate-900 text-white" },
  draft: { label: "Not started", tone: "bg-zinc-200 text-zinc-900" },
};

type Selection = {
  departmentId: string;
  personId: string;
  roleId: string;
};

function deriveDefaultSelection(structure: Department[]): Selection {
  for (const dept of structure) {
    for (const person of dept.people) {
      for (const role of person.roles) {
        return {
          departmentId: dept.id,
          personId: person.id,
          roleId: role.id,
        };
      }
    }
  }
  return {
    departmentId: structure[0]?.id ?? "",
    personId: structure[0]?.people[0]?.id ?? "",
    roleId: structure[0]?.people[0]?.roles[0]?.id ?? "",
  };
}

function describeDiscussionParticipants(personId: string, roleId: string) {
  for (const dept of departments) {
    for (const person of dept.people) {
      if (person.id === personId) {
        const role = person.roles.find((roleItem) => roleItem.id === roleId);
        return {
          person: person.name,
          role: role?.title ?? "",
          department: dept.name,
        };
      }
    }
  }
  return { person: personId, role: roleId, department: "" };
}

export function ManagerDashboard() {
  const defaultSelection = useMemo(() => deriveDefaultSelection(departments), []);
  const [selection, setSelection] = useState<Selection>(defaultSelection);

  const selectedDepartment = departments.find((dept) => dept.id === selection.departmentId);
  const selectedPerson = selectedDepartment?.people.find((person) => person.id === selection.personId);
  const selectedRole = selectedPerson?.roles.find((role) => role.id === selection.roleId);

  const currentDiscussion = discussions.find(
    (discussion) =>
      discussion.personId === selectedPerson?.id && discussion.roleId === selectedRole?.id,
  );

  const nextSession = currentDiscussion?.sessions.find((session) => session.status === "scheduled");
  const completedSessions = currentDiscussion?.sessions.filter((session) => session.status === "completed") ?? [];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <aside className="hidden w-80 border-r border-white/5 bg-slate-950/60 px-6 py-10 lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-2 text-sm uppercase tracking-wide text-white/60">
          <Users className="h-4 w-4" /> Departments
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
          <div className="space-y-6">
            {departments.map((dept) => (
              <div key={dept.id}>
                <div className="text-sm font-semibold uppercase tracking-wide text-white/60">
                  {dept.name}
                </div>
                <div className="mt-3 space-y-4">
                  {dept.people.map((person) => (
                    <Card key={person.id} className="border-white/5 bg-white/5 p-4">
                      <div className="text-sm font-medium text-white">{person.name}</div>
                      <div className="text-xs text-white/60">{person.roles.length} roles</div>
                      <div className="mt-3 flex flex-col gap-2">
                        {person.roles.map((role) => {
                          const isSelected =
                            selection.personId === person.id && selection.roleId === role.id;
                          const roleDiscussion = discussions.find(
                            (discussion) =>
                              discussion.personId === person.id && discussion.roleId === role.id,
                          );
                          return (
                            <button
                              key={role.id}
                              onClick={() =>
                                setSelection({
                                  departmentId: dept.id,
                                  personId: person.id,
                                  roleId: role.id,
                                })
                              }
                              className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                                isSelected
                                  ? "bg-white text-slate-900"
                                  : "bg-white/5 text-white/80 hover:bg-white/10"
                              }`}
                            >
                              <span>{role.title}</span>
                              {roleDiscussion ? (
                                <Badge variant="outline" className="bg-emerald-300/20 text-[11px] text-emerald-200">
                                  active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[11px] text-white/60">
                                  new
                                </Badge>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <section className="flex flex-1 flex-col gap-8 px-6 py-10 md:px-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Atlas / Alfred</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Process Analyst workspace</h1>
            {selectedPerson && selectedRole && (
              <p className="text-white/70">
                {selectedDepartment?.name} · {selectedPerson.name} · {selectedRole.title}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/discussions/new" className="inline-flex">
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Plus className="mr-2 h-4 w-4" /> Create discussion
              </Button>
            </Link>
            {currentDiscussion && (
              <Link href={`/discussions/${currentDiscussion.id}`} className="inline-flex">
                <Button className="bg-white text-slate-900 hover:bg-white/90">
                  <Sparkles className="mr-2 h-4 w-4" /> Open manager view
                </Button>
              </Link>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border-white/5 bg-white/5 p-6">
            {currentDiscussion ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={`text-xs uppercase tracking-wide ${statusCopy[currentDiscussion.status].tone}`}
                  >
                    {statusCopy[currentDiscussion.status].label}
                  </Badge>
                  <span className="text-sm text-white/70">
                    Version {currentDiscussion.extraction.version} · Synthesized {new Date(
                      currentDiscussion.extraction.lastSynthesized,
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Latest extraction snapshot
                </h2>
                <p className="text-white/70">{currentDiscussion.extraction.summary}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentDiscussion.extraction.responsibilities.slice(0, 2).map((resp) => (
                    <div key={resp.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        {resp.label}
                      </p>
                      <p className="mt-2 text-sm text-white/80">{resp.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-start justify-center gap-4">
                <h2 className="text-2xl font-semibold">No discussion yet</h2>
                <p className="text-white/70">
                  Create a discussion to start recording this role. Identity = person + role, no title required.
                </p>
                <Link href="/discussions/new" className="inline-flex">
                  <Button variant="ghost" className="text-white">
                    <Plus className="mr-2 h-4 w-4" /> Start from template
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          <Card className="border-white/5 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/60">
              <CirclePlay className="h-4 w-4" /> Sessions
            </div>
            {nextSession ? (
              <div className="mt-4 space-y-3">
                <p className="text-lg font-semibold text-white">Next call</p>
                <p className="text-sm text-white/70">
                  {new Date(nextSession.date).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <Link href={`/call/${nextSession.id}`} className="inline-flex">
                  <Button variant="outline" className="border-white/20 bg-transparent text-white">
                    Join employee preview <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/70">No upcoming sessions scheduled.</p>
            )}
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-white/40">Completed</p>
              <div className="mt-3 space-y-3">
                {completedSessions.length ? (
                  completedSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm text-white/80">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <Badge className="bg-emerald-300/20 text-emerald-100">Transcript ready</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">No completed sessions yet.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-white/5 bg-white/5 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/60">Exception monitor</p>
              <h3 className="text-xl font-semibold text-white">Session health across the org</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {discussions.flatMap((discussion) => discussion.sessions)
                .filter((session) => session.exceptionLabel)
                .map((session) => (
                  <Badge key={session.id} className="bg-amber-200/20 text-amber-200">
                    {session.exceptionLabel}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {discussions.map((discussion) => {
              const identity = describeDiscussionParticipants(discussion.personId, discussion.roleId);
              return (
                <div key={discussion.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/50">{identity.person}</p>
                  <p className="text-sm text-white/80">{identity.role}</p>
                  <p className="text-xs text-white/50">{discussion.sessions.length} sessions · {discussion.status}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </div>
  );
}
