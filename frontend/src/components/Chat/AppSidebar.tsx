"use client";

import {
  MessageSquare,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Chat {
  id: string; // uuid
  userId: string; // user_id
  title: string; // title
  createdAt: string; // timestamp
  updatedAt: string; // timestamp
}

export default function AppSidebar() {
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } =
    useSidebar();
  const isExpanded = state === "expanded";

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams(); // Added to detect the ?new=true flag
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("chat/conversations")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sortedChats = res.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setChats(sortedChats);
        }
      })
      .catch((err) => {
        console.error("Error fetching conversations:", err);
        setChats([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  const handleNewChat = () => {
    const newId = uuidv4();

    const newEntry: Chat = {
      id: newId,
      title: "New Chat",
      userId: "", // Will be filled by backend later
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChats((prev) => [newEntry, ...prev]);

    if (isMobile) setOpenMobile(false);

    router.push(`/chat/${newId}`);
  };

  return (
    <>
      {isMobile && !openMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className="fixed bottom-35 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-blue)] text-white shadow-lg transition-transform active:scale-90"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      <Sidebar
        collapsible="icon"
        /* FIX: We add !bg-[var(--bg-muted)] and !opacity-100.
           The '!' ensures mobile mode (SheetContent) cannot override it with transparency.
        */
        className="w-64 data-[collapsible=icon]:w-16 border-r border-[var(--border)] !bg-[var(--bg-muted)] !opacity-100 shadow-xl"
      >
        {/* STRICT FIX: We wrap the entire internal content in a div that 
           matches the desktop background perfectly. 
        */}
        <div className="flex flex-col h-full w-full bg-[var(--bg-muted)]">
          <SidebarHeader className="p-3">
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-end group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  onClick={toggleSidebar}
                  className="hover:bg-[var(--hover-color)] h-9 w-9 p-0 flex items-center justify-center transition-all"
                  tooltip={isExpanded ? "Reduce Sidebar" : "Expand Sidebar"}
                >
                  {isExpanded ? (
                    <PanelLeftClose className="h-5 w-5 text-[var(--text-muted)]" />
                  ) : (
                    <PanelLeftOpen className="h-5 w-5 text-[var(--text-muted)]" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton
                  onClick={handleNewChat}
                  className="bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)] hover:opacity-90 py-6 rounded-xl transition-all shadow-sm flex items-center justify-start px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  tooltip="New Chat"
                >
                  <Plus className="h-5 w-5 shrink-0" />
                  <span className="font-bold ml-2 group-data-[collapsible=icon]:hidden">
                    New Chat
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="px-2 scrollbar-hide !bg-[var(--bg-muted)]">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[var(--text-muted)] font-bold px-2 py-4 text-[10px] uppercase tracking-[0.2em] group-data-[collapsible=icon]:hidden">
                Chat History
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-1">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="animate-spin h-5 w-5" />
                  </div>
                ) : chats.length > 0 ? (
                  chats.map((chat) => {
                    const isNewChatRoute = searchParams.get("new") === "true";
                    const isActive =
                      params?.id === chat.id ||
                      (isNewChatRoute && chat.title === "New Chat");

                    return (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          onClick={() => {
                            router.push(`/chat/${chat.id}`);
                            if (isMobile) setOpenMobile(false);
                          }}
                          isActive={isActive}
                          tooltip={chat.title}
                          className={`py-6 px-3 rounded-xl transition-all duration-200 group/item relative ${
                            isActive
                              ? "bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] shadow-sm"
                              : "hover:bg-[var(--hover-color)] text-[var(--text-main)]"
                          }`}
                        >
                          <MessageSquare
                            className={`h-5 w-5 shrink-0 transition-colors ${
                              isActive
                                ? "text-[var(--brand-blue)]"
                                : "text-[var(--text-muted)]"
                            }`}
                          />
                          <span
                            className={`ml-2 truncate group-data-[collapsible=icon]:hidden ${isActive ? "font-bold" : "font-medium"}`}
                          >
                            {chat.title}
                          </span>
                          {isActive && (
                            <div className="absolute right-0 top-1/4 h-1/2 w-1 rounded-l-full bg-[var(--brand-blue)] group-data-[collapsible=icon]:hidden" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                ) : (
                  // <div className="flex flex-col items-center justify-center py-10 px-4 text-center group-data-[collapsible=icon]:hidden">
                  //   <div className="bg-[var(--hover-color)] p-3 rounded-full mb-3">
                  //     <MessageSquare className="h-6 w-6 text-[var(--text-muted)] opacity-40" />
                  //   </div>
                  //   <h3 className="text-sm font-bold text-[var(--text-main)]">
                  //     No chat history
                  //   </h3>
                  //   <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
                  //     Start a new chat to begin
                  //   </p>
                  // </div>

                  <div className="flex flex-col items-center justify-center py-6 px-2 text-center">
                    {/* The Icon: Stays visible even when collapsed */}
                    <div className="bg-[var(--hover-color)] p-2 rounded-full mb-2">
                      <MessageSquare className="h-4 w-4 text-[var(--text-muted)] opacity-40" />
                    </div>

                    {/* The Text: Hidden when collapsed, visible when expanded */}
                    <div className="transition-all duration-300">
                      <h3 className="text-[11px] font-bold text-[var(--text-main)]">
                        No chat history
                      </h3>
                      <p className=" group-data-[collapsible=icon]:hidden text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">
                        Start a new chat to begin
                      </p>
                    </div>
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer with forced background */}
          <div className="p-4 mt-auto text-center group-data-[collapsible=icon]:hidden bg-[var(--bg-muted)]">
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase italic opacity-50">
              InfoPlus AI
            </p>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
