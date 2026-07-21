"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteButtonProps = {
  productId: number;
  projectName: string;
  trigger?: React.ReactNode;
  onDeleted?: () => void;
};

export function DeleteButton({
  productId,
  projectName,
  trigger,
  onDeleted,
}: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/projects/${productId}`, {
          method: "DELETE",
        });

        const payload = await response.json();

        if (!response.ok) {
          toast.error(payload.message || "Gagal menghapus project.");
          return;
        }

        toast.success("Project berhasil dihapus.");
        onDeleted?.();
        router.refresh();
      } catch {
        toast.error("Terjadi kesalahan saat menghapus project.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="text-left text-sm text-rose-300 hover:text-rose-200">
            Delete
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0a0a0a] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-400" />
            Hapus Project?
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Apakah Anda yakin ingin menghapus <strong>{projectName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/10">
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-rose-500 hover:bg-rose-600"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
