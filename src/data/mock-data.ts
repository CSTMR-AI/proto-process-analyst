export type SessionStatus =
  | "scheduled"
  | "completed"
  | "in_progress"
  | "no_show"
  | "failed";

export type Session = {
  id: string;
  discussionId: string;
  date: string;
  status: SessionStatus;
  exceptionLabel?: string;
  callUrl: string;
};

export type TranscriptEntry = {
  id: string;
  speaker: "Atlas" | "Employee" | "Manager";
  timestamp: string;
  text: string;
};

export type ExtractionField = {
  id: string;
  label: string;
  content: string;
  evidenceIds: string[];
};

export type ExtractionModel = {
  summary: string;
  responsibilities: ExtractionField[];
  decisionPoints: ExtractionField[];
  followUps: ExtractionField[];
  version: number;
  lastSynthesized: string;
};

export type Discussion = {
  id: string;
  personId: string;
  roleId: string;
  status: "active" | "complete";
  sessions: Session[];
  transcript: TranscriptEntry[];
  extraction: ExtractionModel;
};

export type Role = {
  id: string;
  title: string;
  discussionId?: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
};

export type Department = {
  id: string;
  name: string;
  people: Person[];
};

export const departments: Department[] = [
  {
    id: "dept-fulfillment",
    name: "Fulfillment",
    people: [
      {
        id: "person-ava",
        name: "Ava Patel",
        email: "ava@figbloom.com",
        roles: [
          {
            id: "role-ops-lead",
            title: "Operations Lead",
            discussionId: "discussion-ava-ops",
          },
        ],
      },
      {
        id: "person-marcus",
        name: "Marcus Reed",
        email: "marcus@figbloom.com",
        roles: [
          { id: "role-inventory", title: "Inventory Analyst" },
          { id: "role-scheduler", title: "Scheduling Manager" },
        ],
      },
    ],
  },
  {
    id: "dept-cx",
    name: "Customer Experience",
    people: [
      {
        id: "person-leo",
        name: "Leo Han",
        email: "leo@figbloom.com",
        roles: [
          { id: "role-support-lead", title: "Support Lead" },
          { id: "role-vip", title: "VIP Services" },
        ],
      },
      {
        id: "person-ida",
        name: "Ida Romero",
        email: "ida@figbloom.com",
        roles: [
          { id: "role-quality", title: "Quality Coach" },
          { id: "role-nps", title: "NPS Analyst" },
        ],
      },
    ],
  },
];

const transcriptEntries: TranscriptEntry[] = [
  {
    id: "t1",
    speaker: "Atlas",
    timestamp: "00:04",
    text: "Walk me through how you confirm courier slots when flower supply drops unexpectedly.",
  },
  {
    id: "t2",
    speaker: "Employee",
    timestamp: "00:31",
    text: "I check the weather-driven demand tab first, then freeze non-priority deliveries.",
  },
  {
    id: "t3",
    speaker: "Atlas",
    timestamp: "01:10",
    text: "What signals tell you it's safe to release the frozen orders?",
  },
  {
    id: "t4",
    speaker: "Employee",
    timestamp: "01:32",
    text: "When courier hold time drops under five minutes and the chiller board is under 60% capacity.",
  },
  {
    id: "t5",
    speaker: "Employee",
    timestamp: "02:18",
    text: "If the VIP queue is impacted, I ping Marcus for manual routing before we promise anything.",
  },
];

export const discussions: Discussion[] = [
  {
    id: "discussion-ava-ops",
    personId: "person-ava",
    roleId: "role-ops-lead",
    status: "active",
    sessions: [
      {
        id: "session-101",
        discussionId: "discussion-ava-ops",
        date: "2026-03-28T02:00:00Z",
        status: "completed",
        callUrl: "/call/session-101",
      },
      {
        id: "session-102",
        discussionId: "discussion-ava-ops",
        date: "2026-03-30T02:00:00Z",
        status: "scheduled",
        callUrl: "/call/session-102",
      },
      {
        id: "session-103",
        discussionId: "discussion-ava-ops",
        date: "2026-04-02T02:00:00Z",
        status: "no_show",
        exceptionLabel: "No-show",
        callUrl: "/call/session-103",
      },
    ],
    transcript: transcriptEntries,
    extraction: {
      version: 3,
      lastSynthesized: "2026-03-28T04:12:00Z",
      summary:
        "Ava triages courier capacity hourly, freezes discretionary orders, and runs a release checklist before reopening the queue.",
      responsibilities: [
        {
          id: "resp-1",
          label: "Capacity triage cadence",
          content: "Hourly check of weather tab + courier backlog to decide if slots freeze.",
          evidenceIds: ["t1", "t2"],
        },
        {
          id: "resp-2",
          label: "Release criteria",
          content: "Hold releases when courier wait >5 min or chiller board >60%.",
          evidenceIds: ["t4"],
        },
      ],
      decisionPoints: [
        {
          id: "dec-1",
          label: "Escalate VIP impact",
          content: "If VIP queue blocked, route through Marcus before confirming.",
          evidenceIds: ["t5"],
        },
      ],
      followUps: [
        {
          id: "fu-1",
          label: "Need courier hold SLA",
          content: "Document the SLA that triggers release vs. freeze during storms.",
          evidenceIds: ["t3"],
        },
      ],
    },
  },
  {
    id: "discussion-leo-support",
    personId: "person-leo",
    roleId: "role-support-lead",
    status: "active",
    sessions: [
      {
        id: "session-201",
        discussionId: "discussion-leo-support",
        date: "2026-03-27T01:00:00Z",
        status: "completed",
        callUrl: "/call/session-201",
      },
    ],
    transcript: [
      {
        id: "t10",
        speaker: "Atlas",
        timestamp: "00:12",
        text: "How do you decide which tickets jump the queue?",
      },
      {
        id: "t11",
        speaker: "Employee",
        timestamp: "00:44",
        text: "NPS < 5 and orders over $300 always escalate.",
      },
    ],
    extraction: {
      version: 1,
      lastSynthesized: "2026-03-27T03:47:00Z",
      summary:
        "Leo triages tickets using NPS score and order value, with manual overrides for VIP profiles.",
      responsibilities: [
        {
          id: "resp-3",
          label: "Escalation screen",
          content: "Tickets escalate when NPS < 5 and AOV > $300.",
          evidenceIds: ["t11"],
        },
      ],
      decisionPoints: [],
      followUps: [
        {
          id: "fu-2",
          label: "VIP override",
          content: "Capture what qualifies as VIP for manual override.",
          evidenceIds: ["t10"],
        },
      ],
    },
  },
];

export const consentCopy = {
  title: "You’re about to join an Atlas discussion",
  body:
    "We anonymise transcripts and only your manager can approve what gets stored. Click Proceed to confirm you understand and consent to recording.",
};

export function getDiscussionById(id: string) {
  return discussions.find((d) => d.id === id);
}

export function getSessionById(id: string) {
  for (const discussion of discussions) {
    const session = discussion.sessions.find((s) => s.id === id);
    if (session) {
      return { session, discussion };
    }
  }
  return undefined;
}
