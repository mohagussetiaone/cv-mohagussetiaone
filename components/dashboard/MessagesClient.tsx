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
  id: string;
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

  const handleMarkRead = async (id: string, read: boolean) => {
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
          <h1 className="text-2xl font-bold text-black">
            Messages
          </h1>
          <p className="text-sm mt-1 text-black">
            {pagination.total} total messages
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter buttons */}
          <div className="flex rounded-lg overflow-hidden border border-black/10">
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
                    ? "bg-black text-white"
                    : "text-black hover:text-black hover:bg-black/5"
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
              "text-black hover:text-black hover:bg-black/5"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex flex-col gap-2">
        {isLoading && messages.length === 0 ? (
          <div className={cn("text-center py-20", "text-black")}>
            Loading...
          </div>
        ) : messages.length === 0 ? (
          <div className={cn("text-center py-20", "text-black")}>
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
                isNeo || isRetro
                  ? cn(
                      "border-2 hover:shadow-md",
                      isNeo
                        ? "border-black bg-white shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black] hover:translate-x-0.5 hover:translate-y-0.5"
                        : "border-[#6699ff]/20 bg-[#f5f0e8] hover:border-[#6699ff]/40",
                      !msg.read && (isNeo ? "border-l-4 border-l-amber-400" : "border-l-4 border-l-[#6699ff]")
                    )
                  : cn(
                      "border border-black/10 bg-white hover:border-black/20 hover:bg-black/5",
                      !msg.read && "border-l-4 border-l-amber-400 bg-amber-50"
                    ),
              )}
              onClick={() => handleReadMessage(msg)}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  isNeo && "border-2 border-black bg-amber-200",
                  isRetro && "border border-[#6699ff] bg-[#6699ff]/10",
                  !isNeo && !isRetro && "border border-black/10 bg-black/5"
                )}
              >
                {msg.read ? (
                  <MailOpen className="h-5 w-5 text-black" />
                ) : (
                  <Mail className="h-5 w-5 text-black" />
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
                        "text-black"
                      )}
                    >
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span
                        className={cn(
                          "ml-2 inline-block h-2 w-2 rounded-full",
                          isNeo && "bg-amber-400",
                          isRetro && "bg-[#6699ff]",
                          !isNeo && !isRetro && "bg-amber-400"
                        )}
                      />
                    )}
                  </div>
                  <span className={cn("text-[11px] shrink-0", "text-black")}>
                    {formatDate(msg.createdAt)}
                  </span>
                </div>

                <p className={cn("text-xs mt-1 line-clamp-1", "text-black")}>
                  {msg.email}
                </p>
                <p className={cn("text-sm mt-1 line-clamp-2", "text-black")}>
                  {msg.message}
                </p>

                {/* Status badges */}
                <div className="flex items-center gap-2 mt-2">
                  {msg.repliedAt && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                        isNeo && "border-2 border-black bg-green-100 text-black font-bold",
                        isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                        !isNeo && !isRetro && "border border-green-600/30 bg-green-100 text-green-700"
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
                        isNeo && "border-2 border-black bg-amber-100 text-black font-bold",
                        isRetro && "border border-[#6699ff] bg-[#6699ff]/10 text-[#6699ff]",
                        !isNeo && !isRetro && "border border-amber-600/30 bg-amber-100 text-amber-700"
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
                    "text-black hover:bg-black/10 hover:text-black"
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
                    "text-black hover:bg-black/10 hover:text-black"
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
              "text-black hover:text-black hover:bg-black/5"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className={cn("text-sm", "text-black")}>
            {pagination.page} / {pagination.totalPages}
          </span>

          <button
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className={cn(
              "rounded-lg p-2 transition-colors disabled:opacity-30",
              "text-black hover:text-black hover:bg-black/5"
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
            isNeo && "border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_black]",
            isRetro && "border-2 border-[#6699ff]/30 bg-[#f5f0e8]",
            !isNeo && !isRetro && "border border-black/10 bg-white text-black"
          )}
        >
          {readingMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-black">
                  <MessageSquare className="h-5 w-5" />
                  Message from {readingMessage.name}
                </DialogTitle>
                <DialogDescription className="text-black">
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
                className="rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto bg-black/5 text-black"
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
                        isNeo && "border-2 border-black bg-amber-400 text-black font-bold shadow-[3px_3px_0px_0px_black] hover:shadow-[1px_1px_0px_0px_black]",
                        isRetro && "bg-[#6699ff] text-white hover:bg-[#6699ff]/80",
                        !isNeo && !isRetro && "border border-black bg-amber-400 text-black font-bold hover:bg-amber-300"
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
                  className="text-black"
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
