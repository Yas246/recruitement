/* eslint-disable */
"use client";

import MessagingSystem from "@/app/components/MessagingSystem";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MessagesContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  return (
    <MessagingSystem
      initialConversations={[]}
      title="Messages Admin"
      onSendMessage={async (conversationId, content) => {
        // Implementation of send message logic
      }}
    />
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
