import { notFound } from "next/navigation";

import { getSessionById } from "@/data/mock-data";
import { CallExperience } from "@/components/call/call-experience";

export default function CallPage({ params }: { params: { sessionId: string } }) {
  const result = getSessionById(params.sessionId);

  if (!result) {
    notFound();
  }

  return <CallExperience session={result.session} discussion={result.discussion} />;
}
