"use client";

import { useEffect, useMemo, useState } from "react";
import { Headphones, Loader2, ShieldCheck } from "lucide-react";

import { consentCopy, departments, type Discussion, type Session } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  session: Session;
  discussion: Discussion;
};

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

export function CallExperience({ session, discussion }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [consented, setConsented] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!consented) return;
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [consented]);

  const formattedTimer = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }, [seconds]);

  const identity = resolveIdentity(discussion);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <Card className="w-full max-w-3xl border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Atlas call app</p>
              <h1 className="mt-2 text-2xl font-semibold">{identity.person} · {identity.role}</h1>
              <p className="text-white/70">Employee call · session {session.id.replace("session-", "")}</p>
            </div>
            <Badge className="bg-emerald-300/20 text-emerald-100">
              {consented ? "Recording" : "Awaiting consent"}
            </Badge>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-center gap-4">
              <div className={`grid h-20 w-20 place-items-center rounded-full bg-white/10 ${
                consented ? "animate-pulse" : ""
              }`}>
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-white/60">Atlas is listening</p>
                <h2 className="text-3xl font-semibold">{consented ? formattedTimer : "--:--"}</h2>
                <p className="text-white/60">Minimal UI by design. Stay present with the conversation.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">Discussion</p>
              <p className="text-lg font-semibold text-white">{identity.person}</p>
              <p className="text-sm text-white/60">{identity.role}</p>
              <p className="text-xs text-white/40">{identity.department}</p>
            </Card>
            <Card className="border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">Consent status</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                {consented ? "Captured" : "Required before proceeding"}
              </p>
            </Card>
          </div>

          {!consented && (
            <p className="text-sm text-white/60">
              Atlas will not capture transcript data until you confirm the consent statement below.
            </p>
          )}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>{consentCopy.title}</DialogTitle>
            <DialogDescription className="text-white/70">
              {consentCopy.body}
            </DialogDescription>
          </DialogHeader>
          <Button
            className="mt-4 bg-white text-slate-900 hover:bg-white/90"
            onClick={() => {
              setConsented(true);
              setIsDialogOpen(false);
            }}
          >
            Proceed
          </Button>
          <p className="mt-3 text-xs text-white/40">Consent is required to enter the call. No decline option in v1.</p>
        </DialogContent>
      </Dialog>

      {!consented && (
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-white/40" />
        </div>
      )}
    </div>
  );
}
