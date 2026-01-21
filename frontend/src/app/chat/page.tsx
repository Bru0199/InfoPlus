//app/chat/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatWindow from "@/components/Chat/ChatWindow";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Mark this page as dynamic - don't prerender statically
export const dynamic = "force-dynamic";

function ChatMainPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingHistory, setCheckingHistory] = useState(true);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  //   // Check for latest conversation
  //   api
  //     .get("/chat/conversations")
  //     .then((res) => {
  //       if (Array.isArray(res.data) && res.data.length > 0) {
  //         // Redirect to the most recent chat
  //         router.replace(`/chat/${res.data[0].id}`);
  //       } else {
  //         setCheckingHistory(false);
  //       }
  //     })
  //     .catch(() => {
  //       setCheckingHistory(false);
  //     });
  // }, [router, searchParams]);

  // if (checkingHistory) {
  //   return (
  //     <div className="flex h-full w-full items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-blue)]" />
  //     </div>
  //   );
  // }

  return <ChatWindow />;
}

export default function ChatMainPage() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand-blue)]" /></div>}>
      <ChatMainPageContent />
    </Suspense>
  );
}

// "use client";

// import { useEffect, useState, Suspense } from "react"; // Added Suspense
// import { useRouter, useSearchParams } from "next/navigation";
// import ChatWindow from "@/components/Chat/ChatWindow";
// import { api } from "@/lib/api";
// import { Loader2 } from "lucide-react";

// // Wrap in a component to use searchParams safely in Next.js
// function ChatContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [checkingHistory, setCheckingHistory] = useState(true);

//   useEffect(() => {
//     // SOLUTION: Check if user explicitly clicked "New Chat"
//     const isForcedNew = searchParams.get("new") === "true";

//     if (isForcedNew) {
//       setCheckingHistory(false); // Stop the spinner
//       return; // EXIT: Do not fetch conversations or redirect
//     }

//     // Normal flow: Check for latest conversation and redirect
//     api
//       .get("/chat/conversations")
//       .then((res) => {
//         if (Array.isArray(res.data) && res.data.length > 0) {
//           router.replace(`/chat/${res.data[0].id}`);
//         } else {
//           setCheckingHistory(false);
//         }
//       })
//       .catch(() => {
//         setCheckingHistory(false);
//       });
//   }, [router, searchParams]); // searchParams is crucial here

//   if (checkingHistory) {
//     return (
//       <div className="flex h-full w-full items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-blue)]" />
//       </div>
//     );
//   }

//   return <ChatWindow />;
// }

// export default function ChatMainPage() {
//   return (
//     <Suspense fallback={<Loader2 className="animate-spin" />}>
//       <ChatContent />
//     </Suspense>
//   );
// }
