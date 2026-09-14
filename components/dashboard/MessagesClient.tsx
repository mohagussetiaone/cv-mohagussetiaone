"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Mail, MailOpen, RefreshCw, MessageSquare, CheckCircle, Clock, Reply } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Message = { id: string; name: string; email: string; message: string; read: boolean; repliedAt: string | null; createdAt: string; };
type Pagination = { page: number; pageSize: number; total: number; totalPages: number; };

export function MessagesClient({ locale }: { locale: string }) {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";

  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [readDialogOpen, setReadDialogOpen] = useState(false);
  const [readingMessage, setReadingMessage] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pagination.page), pageSize: String(pagination.pageSize) });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/messages?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setMessages(json.data); setPagination(json.pagination);
    } catch { toast.error("Gagal memuat pesan."); } finally { setIsLoading(false); }
  }, [pagination.page, pagination.pageSize, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read }) });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    } catch { toast.error("Gagal memperbarui status pesan."); }
  };

  const handleReadMessage = (msg: Message) => {
    setReadingMessage(msg); setReadDialogOpen(true);
    if (!msg.read) handleMarkRead(msg.id, true);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const unreadCount = messages.filter((m) => !m.read).length;

  // ─── Shared dark-mode-aware classes ──────────────────────
  const textMain = "text-black dark:text-white";
  const textSub = "text-black/70 dark:text-white/50";
  const textMuted = "text-black/50 dark:text-white/40";

  const filterBtn = (active: boolean) => cn(
    "px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "bg-black dark:bg-white text-white dark:text-black"
      : `${textMain} hover:bg-black/5 dark:hover:bg-white/10`
  );

  const msgCard = (msg: Message) => cn(
    "group flex items-start gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer",
    isNeo || isRetro
      ? cn(
          "border-2 hover:shadow-md",
          isNeo ? "border-black bg-white shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black]" : "border-[#6699ff]/20 bg-[#f5f0e8]",
          !msg.read && (isNeo ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-[#6699ff]")
        )
      : cn(
          "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5",
          !msg.read && "border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-900/20"
        )
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textMain}`}>Messages</h1>
          <p className={`text-sm mt-1 ${textSub}`}>{pagination.total} total messages{unreadCount > 0 && ` · ${unreadCount} unread`}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex rounded-lg overflow-hidden border", isNeo ? "border-black" : "border-black/10 dark:border-white/15")}>
            {["all", "unread", "replied"].map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPagination((p) => ({ ...p, page: 1 })); }} className={filterBtn(filter === f)}>
                {f === "all" ? "All" : f === "unread" ? "Unread" : "Replied"}
              </button>
            ))}
          </div>
          <button onClick={fetchMessages} disabled={isLoading} className={cn("rounded-lg p-2 transition-colors", textMain, "hover:bg-black/5 dark:hover:bg-white/10")}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-2">
        {isLoading && messages.length === 0 ? (
          <div className={`text-center py-20 ${textMuted}`}>Loading...</div>
        ) : messages.length === 0 ? (
          <div className={`text-center py-20 ${textMuted}`}>
            <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-30" />
            <p>No messages yet</p>
            {filter !== "all" && <button onClick={() => setFilter("all")} className="mt-2 text-xs text-brand-500 hover:underline">Show all messages</button>}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={msgCard(msg)} onClick={() => handleReadMessage(msg)}>
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                isNeo && "border-2 border-black bg-amber-200",
                isRetro && "border border-[#6699ff] bg-[#6699ff]/10",
                !isNeo && !isRetro && "border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10"
              )}>
                {msg.read ? <MailOpen className={`h-5 w-5 ${textMain}`} /> : <Mail className={`h-5 w-5 ${textMain}`} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={cn("font-medium text-sm", !msg.read && "font-semibold", textMain)}>{msg.name}</span>
                    {!msg.read && <span className={cn("ml-2 inline-block h-2 w-2 rounded-full", isNeo && "bg-amber-400", isRetro && "bg-[#6699ff]", !isNeo && !isRetro && "bg-amber-400")} />}
                  </div>
                  <span className={`text-[11px] shrink-0 ${textMuted}`}>{formatDate(msg.createdAt)}</span>
                </div>
                <p className={`text-xs mt-1 ${textSub}`}>{msg.email}</p>
                <p className={`text-sm mt-1 line-clamp-2 ${textMain}`}>{msg.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  {msg.repliedAt && (
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                      isNeo && "border-2 border-black bg-green-100 text-black font-bold",
                      isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                      !isNeo && !isRetro && "border border-green-600/30 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    )}><CheckCircle className="h-3 w-3" /> Replied</span>
                  )}
                  {!msg.read && !msg.repliedAt && (
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                      isNeo && "border-2 border-black bg-amber-100 text-black font-bold",
                      isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                      !isNeo && !isRetro && "border border-amber-600/30 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    )}><Clock className="h-3 w-3" /> Unread</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={`mailto:${msg.email}?subject=Re:%20Message%20from%20${encodeURIComponent(msg.name)}%20%E2%80%94%20Moh%20Agus%20Setiawan`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={cn("rounded-lg p-2 transition-colors", textMain, "hover:bg-black/10 dark:hover:bg-white/10")} title="Reply via Gmail">
                  <Reply className="h-4 w-4" />
                </a>
                <button onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id, !msg.read); }} className={cn("rounded-lg p-2 transition-colors", textMain, "hover:bg-black/10 dark:hover:bg-white/10")} title={msg.read ? "Mark unread" : "Mark read"}>
                  {msg.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1} className={cn("rounded-lg p-2 transition-colors disabled:opacity-30", textMain, "hover:bg-black/5 dark:hover:bg-white/10")}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className={`text-sm ${textMain}`}>{pagination.page} / {pagination.totalPages}</span>
          <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages} className={cn("rounded-lg p-2 transition-colors disabled:opacity-30", textMain, "hover:bg-black/5 dark:hover:bg-white/10")}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Read Message Dialog */}
      <Dialog open={readDialogOpen} onOpenChange={setReadDialogOpen}>
        <DialogContent className={cn("max-w-2xl",
          isNeo && "border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_black]",
          isRetro && "border-2 border-[#6699ff]/30 bg-[#f5f0e8]",
          !isNeo && !isRetro && "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-black dark:text-white"
        )}>
          {readingMessage && (
            <>
              <DialogHeader>
                <DialogTitle className={`flex items-center gap-2 ${textMain}`}>
                  <MessageSquare className="h-5 w-5" /> Message from {readingMessage.name}
                </DialogTitle>
                <DialogDescription className={textSub}>
                  <a href={`mailto:${readingMessage.email}`} className="text-brand-500 hover:underline">{readingMessage.email}</a>
                  {" · "}{formatDate(readingMessage.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className={cn("rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto",
                isNeo && "bg-black/5 text-black",
                isRetro && "bg-[#6699ff]/5 text-black",
                !isNeo && !isRetro && "bg-black/5 dark:bg-white/5 text-black dark:text-white"
              )}>
                {readingMessage.message}
              </div>
              <DialogFooter className="flex gap-2 sm:justify-between">
                <div className="flex gap-2">
                  <a href={`mailto:${readingMessage.email}?subject=Re:%20Message%20from%20${encodeURIComponent(readingMessage.name)}%20%E2%80%94%20Moh%20Agus%20Setiawan`} target="_blank" rel="noopener noreferrer">
                    <Button className={cn(
                      isNeo && "border-2 border-black bg-amber-400 text-black font-bold shadow-[3px_3px_0px_0px_black]",
                      isRetro && "bg-[#6699ff] text-white hover:bg-[#6699ff]/80",
                      !isNeo && !isRetro && "border border-black dark:border-white bg-amber-400 text-black font-bold hover:bg-amber-300"
                    )}>
                      <Reply className="h-4 w-4 mr-1" /> Reply via Gmail
                    </Button>
                  </a>
                </div>
                <Button variant="ghost" onClick={() => setReadDialogOpen(false)} className={textMain}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
