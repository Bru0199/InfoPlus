//src/app/chat/[id]/page.tsx

"use client";

import ChatWindow from "@/components/Chat/ChatWindow";

// Mark this page as dynamic - don't prerender statically
export const dynamic = "force-dynamic";

export default function ConversationPage() {
  return <ChatWindow />;
}
