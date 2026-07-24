"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MailOpen,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Clock,
  ExternalLink,
  Reply,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  repliedAt: string | null;
  createdAt: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function MessagesClient({ locale }: { locale: string }) {
  const { theme } = useTheme();
  const isNeo = theme === "neobrutalism";
  const isRetro = theme === "retro";
  const cardTheme = isNeo || isRetro;

  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Read dialog state
  const [readDialogOpen, setReadDialogOpen] = useState(false);
  const [readingMessage, setReadingMessage] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
      });
      if (filter !== "all") params.set("status", filter);

      const res = await fetch(`/api/messages?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const json = await res.json();
      setMessages(json.data);
      setPagination(json.pagination);
    } catch {
      toast.error("Gagal memuat pesan.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkRead = async (id: number, read: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    } catch {
      toast.error("Gagal memperbarui status pesan.");
    }
  };

  const handleReadMessage = (msg: Message) => {
    setReadingMessage(msg);
    setReadDialogOpen(true);
    if (!msg.read) handleMarkRead(msg.id, true);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", cardTheme ? "text-black" : "text-white")}>
            Messages
          </h1>
          <p className={cn("text-sm mt-1", cardTheme ? "text-black/60" : "text-white/50")}>
            {pagination.total} total messages
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter buttons */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {["all", "unread", "replied"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? cardTheme
                      ? "bg-black text-white"
                      : "bg-white/15 text-white"
                    : cardTheme
                      ? "text-black/50 hover:text-black hover:bg-black/5"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {f === "all" ? "All" : f === "unread" ? "Unread" : "Replied"}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMessages}
            disabled={isLoading}
            className={cn(
              "rounded-lg p-2 transition-colors",
              cardTheme
                ? "text-black/50 hover:text-black hover:bg-black/5"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-2">
        {isLoading && messages.length === 0 ? (
          <div className={cn("text-center py-20", cardTheme ? "text-black/40" : "text-white/30")}>
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className={cn("text-center py-20", cardTheme ? "text-black/40" : "text-white/30")}>
            <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-30" />
            <p>No messages yet</p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-2 text-xs text-brand-500 hover:underline"
              >
                Show all messages
              </button>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "group flex items-start gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer",
                cardTheme
                  ? cn(
                      "border-2 hover:shadow-md",
                      isNeo
                        ? "border-black bg-white shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5"
                        : "border-[#6699ff]/20 bg-[#f5f0e8] hover:border-[#6699ff]/40",
                      !msg.read && (isNeo ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-[#6699ff]")
                    )
                  : cn(
                      "border border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
                      !msg.read && "border-l-2 border-l-brand-500 bg-brand-500/5"
                    ),
              )}
              onClick={() => handleReadMessage(msg)}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  cardTheme && isNeo && "border-2 border-black bg-amber-200",
                  cardTheme && isRetro && "border border-[#6699ff] bg-[#6699ff]/10",
                  !cardTheme && "border border-white/10 bg-white/5"
                )}
              >
                {msg.read ? (
                  <MailOpen className={cn("h-5 w-5", cardTheme ? "text-black/40" : "text-white/30")} />
                ) : (
                  <Mail className={cn("h-5 w-5", cardTheme ? "text-black" : "text-brand-400")} />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={cn(
                        "font-medium text-sm",
                        !msg.read && "font-semibold",
                        cardTheme ? "text-black" : "text-white"
                      )}
                    >
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span
                        className={cn(
                          "ml-2 inline-block h-2 w-2 rounded-full",
                          cardTheme && isNeo && "bg-amber-400",
                          cardTheme && isRetro && "bg-[#6699ff]",
                          !cardTheme && "bg-brand-500"
                        )}
                      />
                    )}
                  </div>
                  <span className={cn("text-[11px] shrink-0", cardTheme ? "text-black/40" : "text-white/30")}>
                    {formatDate(msg.createdAt)}
                  </span>
                </div>

                <p className={cn("text-xs mt-1 line-clamp-1", cardTheme ? "text-black/50" : "text-white/40")}>
                  {msg.email}
                </p>
                <p className={cn("text-sm mt-1 line-clamp-2", cardTheme ? "text-black/70" : "text-white/60")}>
                  {msg.message}
                </p>

                {/* Status badges */}
                <div className="flex items-center gap-2 mt-2">
                  {msg.repliedAt && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                        cardTheme && isNeo && "border-2 border-black bg-green-100 text-black font-bold",
                        cardTheme && isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                        !cardTheme && "border border-green-500/20 bg-green-500/10 text-green-400"
                      )}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Replied
                    </span>
                  )}
                  {!msg.read && !msg.repliedAt && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                        cardTheme && isNeo && "border-2 border-black bg-amber-100 text-black font-bold",
                        cardTheme && isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                        !cardTheme && "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      Unread
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={`mailto:${msg.email}?subject=Re:%20Message%20from%20${encodeURIComponent(msg.name)}%20%E2%80%94%20Moh%20Agus%20Setiawan`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    cardTheme
                      ? "text-black/40 hover:bg-black/10 hover:text-black"
                      : "text-white/30 hover:bg-white/10 hover:text-white"
                  )}
                  title="Reply via Gmail"
                >
                  <Reply className="h-4 w-4" />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkRead(msg.id, !msg.read);
                  }}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    cardTheme
                      ? "text-black/40 hover:bg-black/10 hover:text-black"
                      : "text-white/30 hover:bg-white/10 hover:text-white"
                  )}
                  title={msg.read ? "Mark unread" : "Mark read"}
                >
                  {msg.read ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            disabled={pagination.page <= 1}
            className={cn(
              "rounded-lg p-2 transition-colors disabled:opacity-30",
              cardTheme
                ? "text-black/50 hover:text-black hover:bg-black/5"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className={cn("text-sm", cardTheme ? "text-black/60" : "text-white/50")}>
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className={cn(
              "rounded-lg p-2 transition-colors disabled:opacity-30",
              cardTheme
                ? "text-black/50 hover:text-black hover:bg-black/5"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ─── Read Message Dialog ──────────────────────────── */}
      <Dialog open={readDialogOpen} onOpenChange={setReadDialogOpen}>
        <DialogContent
          className={cn(
            "max-w-2xl",
            cardTheme && isNeo && "border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_black]",
            cardTheme && isRetro && "border-2 border-[#6699ff]/30 bg-[#f5f0e8]",
            !cardTheme && "border border-white/10 bg-[#12121a] text-white"
          )}
        >
          {readingMessage && (
            <>
              <DialogHeader>
                <DialogTitle className={cn("flex items-center gap-2", cardTheme ? "text-black" : "text-white")}>
                  <MessageSquare className="h-5 w-5" />
                  Message from {readingMessage.name}
                </DialogTitle>
                <DialogDescription className={cardTheme ? "text-black/60" : "text-white/50"}>
                  <a
                    href={`mailto:${readingMessage.email}`}
                    className="text-brand-500 hover:underline"
                  >
                    {readingMessage.email}
                  </a>
                  {" · "}
                  {formatDate(readingMessage.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div
                className={cn(
                  "rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto",
                  cardTheme ? "bg-black/5 text-black" : "bg-white/5 text-white/80"
                )}
              >
                {readingMessage.message}
              </div>

              <DialogFooter className="flex gap-2 sm:justify-between">
                <div className="flex gap-2">
                  <a
                    href={`mailto:${readingMessage.email}?subject=Re:%20Message%20from%20${encodeURIComponent(readingMessage.name)}%20%E2%80%94%20Moh%20Agus%20Setiawan`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className={cn(
                        cardTheme && isNeo && "border-2 border-black bg-amber-400 text-black font-bold shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black]",
                        cardTheme && isRetro && "bg-[#6699ff] text-white hover:bg-[#6699ff]/80",
                        !cardTheme && "bg-brand-500 text-black hover:bg-brand-500/80"
                      )}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply via Gmail
                    </Button>
                  </a>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setReadDialogOpen(false)}
                  className={cardTheme ? "text-black" : "text-white/50"}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
