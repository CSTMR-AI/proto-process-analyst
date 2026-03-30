import { notFound } from "next/navigation";

import { getDiscussionById } from "@/data/mock-data";
import { DiscussionWorkspace } from "@/components/manager/discussion-workspace";

export default function DiscussionDetailPage({ params }: { params: { id: string } }) {
  const discussion = getDiscussionById(params.id);

  if (!discussion) {
    notFound();
  }

  return <DiscussionWorkspace discussion={discussion} />;
}
