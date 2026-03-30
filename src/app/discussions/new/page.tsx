"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar, Link2, Save, UserRound } from "lucide-react";

import { departments } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewDiscussionPage() {
  const initialDepartment = departments[0];
  const [departmentId, setDepartmentId] = useState(initialDepartment?.id ?? "");
  const [personId, setPersonId] = useState(initialDepartment?.people[0]?.id ?? "");
  const [roleId, setRoleId] = useState(initialDepartment?.people[0]?.roles[0]?.id ?? "");
  const [sessionDate, setSessionDate] = useState("2026-04-01");
  const [sessionTime, setSessionTime] = useState("10:00");
  const [notes, setNotes] = useState("Capture the freeze/release signals in one pass.");
  const [callUrl, setCallUrl] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  const currentDepartment = departments.find((dept) => dept.id === departmentId) ?? initialDepartment;
  const currentPerson = currentDepartment?.people.find((person) => person.id === personId);
  const currentRole = currentPerson?.roles.find((role) => role.id === roleId);

  const handleGenerate = () => {
    const syntheticLink = `/call/${roleId}-seed-${Date.now().toString().slice(-4)}`;
    setCallUrl(syntheticLink);
    setCreated(true);
  };

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-3 text-sm text-white/70">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to navigator
          </Link>
        </div>
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Discussion identity</p>
          <h1 className="mt-2 text-3xl font-semibold">Create a new role discussion</h1>
          <p className="text-white/70">
            Identity is locked to person + role. No titles, no fluff. Scheduling is optional.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/5 bg-white/5 p-5 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm text-white/80">
                Department
                <select
                  className="w-full rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                  value={departmentId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    setDepartmentId(nextId);
                    const nextDepartment = departments.find((dept) => dept.id === nextId);
                    const firstPerson = nextDepartment?.people[0];
                    setPersonId(firstPerson?.id ?? "");
                    setRoleId(firstPerson?.roles[0]?.id ?? "");
                  }}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Person
                <select
                  className="w-full rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                  value={personId}
                  onChange={(event) => {
                    const nextPersonId = event.target.value;
                    setPersonId(nextPersonId);
                    const nextPerson = currentDepartment?.people.find((person) => person.id === nextPersonId);
                    setRoleId(nextPerson?.roles[0]?.id ?? "");
                  }}
                >
                  {currentDepartment?.people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Role
                <select
                  className="w-full rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
                  value={roleId}
                  onChange={(event) => setRoleId(event.target.value)}
                >
                  {currentPerson?.roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-white/80">
                Session date
                <Input type="date" value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} />
              </label>
              <label className="space-y-2 text-sm text-white/80">
                Time
                <Input type="time" value={sessionTime} onChange={(event) => setSessionTime(event.target.value)} />
              </label>
            </div>

            <label className="mt-6 block space-y-2 text-sm text-white/80">
              Notes for Atlas
              <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleGenerate} className="bg-white text-slate-900 hover:bg-white/90">
                <Save className="mr-2 h-4 w-4" />
                Create discussion shell
              </Button>
              {callUrl && (
                <Button variant="secondary" className="bg-white/10 text-white">
                  <Link2 className="mr-2 h-4 w-4" /> Copy invite link
                </Button>
              )}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/5 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
                <UserRound className="h-4 w-4" /> Identity
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {currentPerson?.name}
              </h3>
              <p className="text-white/60">{currentRole?.title}</p>
              <Badge className="mt-4 bg-emerald-300/20 text-emerald-100">Person + role locked</Badge>
            </Card>
            <Card className="border-white/5 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
                <Calendar className="h-4 w-4" /> Session preview
              </div>
              <p className="mt-3 text-sm text-white/70">
                {new Date(`${sessionDate}T${sessionTime}`).toLocaleString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-white/50">Timezone auto-resolves per invitee.</p>
              {callUrl && (
                <div className="mt-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-white/60">Generated call URL</p>
                  <p className="truncate text-sm text-emerald-200">{callUrl}</p>
                </div>
              )}
            </Card>
            {created && (
              <Card className="border-emerald-400/40 bg-emerald-400/10 p-5 text-sm text-emerald-100">
                Discussion shell created. Sessions: 0. Invite link ready for employee call app.
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
