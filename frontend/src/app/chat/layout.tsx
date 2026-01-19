//app/chat/layout.tsx

import ChatShell from "@/components/Chat/ChatShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatShell>{children}</ChatShell>;
}
