"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, PencilLine, PlusCircle, Trash2, Save, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl, uploadImageFile } from "@/lib/upload-client";
import type { SectionContentResponse, SkillItem } from "@/app/types/site-content";

type SkillsClientProps = { locale: string };
type SkillForm = { name: string; image: string; bgColor: string };
const emptyForm = (): SkillForm => ({ name: "", image: "", bgColor: "#28A9E0" });

export function SkillsClient({ locale }: SkillsClientProps) {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm());
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const editRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/skills");
      const json = await res.json();
      const payload = json?.data as SectionContentResponse<SkillItem> | undefined;
      setItems(payload?.items ?? []);
      const id = payload?.settings?.localized?.["id"] ?? {};
      const en = payload?.settings?.localized?.["en"] ?? {};
      setTitleId(id.title ?? ""); setTitleEn(en.title ?? "");
      setDescId(id.description ?? ""); setDescEn(en.description ?? "");
    } catch { toast.error("Gagal memuat data."); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openAdd = () => { setEditingId(null); setForm(emptyForm()); setPendingFile(null); setDialogOpen(true); };

  const openEdit = async (index: number) => {
    const item = items[index];
    if (!item) return;
    const requestId = ++editRequestRef.current;
    setEditingId(item.id); setDialogOpen(true); setPendingFile(null);
    setForm({ name: item.name, image: item.image, bgColor: item.bgColor });
    try {
      const res = await fetch(`/api/skills/${item.id}`);
      const json = await res.json();
      if (requestId !== editRequestRef.current) return;
      if (res.ok && json?.data) { const d = json.data as SkillItem; setForm({ name: d.name, image: d.image, bgColor: d.bgColor }); }
    } catch {}
  };

  const handleSaveForm = () => {
    if (!form.name) { toast.error("Nama skill wajib diisi."); return; }
    startSave(async () => {
      let uploadedNewUrl: string | null = null;
      try {
        let imageUrl = form.image;
        if (pendingFile) { const uploaded = await uploadImageFile(pendingFile, "skills"); uploadedNewUrl = uploaded; imageUrl = uploaded; }
        const isEdit = editingId !== null;
        const res = await fetch(isEdit ? `/api/skills/${editingId}` : "/api/skills", { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, image: imageUrl }) });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan.");
        if (uploadedNewUrl && form.image && form.image !== uploadedNewUrl) await deleteImageByUrl(form.image);
        toast.success(isEdit ? "Skill berhasil diperbarui." : "Skill berhasil ditambahkan.");
        setPendingFile(null); setDialogOpen(false); loadData();
      } catch (err) { if (uploadedNewUrl) await deleteImageByUrl(uploadedNewUrl); toast.error(err instanceof Error ? err.message : "Gagal menyimpan."); }
    });
  };

  const handleDelete = (index: number) => {
    const item = items[index]; if (!item) return;
    startSave(async () => {
      try { const res = await fetch(`/api/skills/${item.id}`, { method: "DELETE" }); if (!res.ok) throw new Error("Gagal menghapus."); toast.success("Skill berhasil dihapus."); loadData(); } catch { toast.error("Gagal menghapus."); }
    });
  };

  const handleSaveSettings = () => {
    startSave(async () => {
      try {
        const entries = [{ key: "title", locale: "id", value: titleId }, { key: "title", locale: "en", value: titleEn }, { key: "description", locale: "id", value: descId }, { key: "description", locale: "en", value: descEn }];
        const res = await fetch("/api/skills/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entries }) });
        const json = await res.json(); if (!res.ok) throw new Error(json.message || "Gagal menyimpan."); toast.success("Pengaturan section berhasil disimpan.");
      } catch (err) { toast.error(err instanceof Error ? err.message : "Gagal menyimpan."); }
    });
  };

  const inputCls = "border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-800 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40";
  const cardCls = "rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900";

  return (
    <main className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className={`relative overflow-hidden p-6 ${cardCls}`}>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <h1 className="mt-3 text-xl font-semibold text-black dark:text-white">Skills Management</h1>
            <p className="mt-1 text-sm text-black/70 dark:text-white/50">Kelola skill yang ditampilkan di halaman utama.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/15 bg-amber-400">
            <Zap className="h-5 w-5 text-black dark:text-white" />
          </div>
        </div>
      </div>

      {/* Section Settings */}
      <div className={`${cardCls} p-5 space-y-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black dark:text-white">Section Settings</h2>
          <Button type="button" size="sm" onClick={handleSaveSettings} disabled={isSaving} className="h-8 text-xs border border-black/10 dark:border-white/15 bg-amber-400 text-black font-bold hover:bg-amber-300">
            <Save className="mr-1.5 h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Section"}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Title" idValue={titleId} onIdChange={setTitleId} enValue={titleEn} onEnChange={setTitleEn} />
          <FieldGroup label="Description" idValue={descId} onIdChange={setDescId} enValue={descEn} onEnChange={setDescEn} textarea />
        </div>
      </div>

      {/* Skills Table */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-black dark:text-white font-semibold text-sm">
            Skill Items <span className="text-xs text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd} className="h-8 text-xs border border-black/10 dark:border-white/15 bg-amber-400 text-black font-bold hover:bg-amber-300">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Skill
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-black/50 dark:text-white/40">
            <Zap className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No skills yet. Click &quot;Add Skill&quot; to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-black/5 dark:border-white/5 hover:bg-transparent">
                <TableHead className="text-xs text-black dark:text-white uppercase">Name</TableHead>
                <TableHead className="text-xs text-black dark:text-white uppercase hidden md:table-cell">Icon</TableHead>
                <TableHead className="text-xs text-black dark:text-white uppercase w-25">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={item.id} className="border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: item.bgColor }}>
                        {item.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-black dark:text-white truncate">{item.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.image ? <Image src={item.image} alt={item.name} width={28} height={28} className="object-contain" /> : <span className="text-xs text-black/40 dark:text-white/30">—</span>}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(i)} className="rounded-lg p-1.5 text-black/50 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors">
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(i)} className="rounded-lg p-1.5 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-300 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-black dark:text-white">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1 mb-2 border border-black/10 dark:border-white/15 bg-amber-400 text-black">
              {editingId !== null ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {editingId !== null ? "Edit Skill" : "Add Skill"}
            </Badge>
            <DialogTitle className="text-xl text-black dark:text-white">{editingId !== null ? "Edit skill" : "Add new skill"}</DialogTitle>
            <DialogDescription className="text-black/60 dark:text-white/50">Fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="min-w-0 space-y-2">
              <Label className="text-black dark:text-white">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="HTML" className={inputCls} />
            </div>
            <div className="min-w-0 space-y-2">
              <Label className="text-black dark:text-white">Icon</Label>
              <ImageUploader folder="skills" currentUrl={form.image} onUrlChange={(url) => setForm((p) => ({ ...p, image: url }))} onPendingFile={setPendingFile} label="Upload icon skill (upload otomatis saat submit form)" />
            </div>
            <div className="min-w-0 space-y-2">
              <Label className="text-black dark:text-white">Circle Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.bgColor} onChange={(e) => setForm((p) => ({ ...p, bgColor: e.target.value }))} className="h-10 w-14 cursor-pointer rounded border border-black/10 dark:border-white/20 bg-transparent" />
                <Input value={form.bgColor} onChange={(e) => setForm((p) => ({ ...p, bgColor: e.target.value }))} className={`w-40 font-mono ${inputCls}`} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-black/10 dark:border-white/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full border border-black/10 dark:border-white/15 bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Cancel</Button>
            <Button type="button" onClick={handleSaveForm} disabled={isSaving} className="rounded-full bg-amber-400 text-black hover:bg-amber-300 font-bold border border-black px-6">
              {isSaving ? "Saving..." : editingId !== null ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function FieldGroup({ label, idValue, onIdChange, enValue, onEnChange, textarea }: { label: string; idValue: string; onIdChange: (v: string) => void; enValue: string; onEnChange: (v: string) => void; textarea?: boolean }) {
  const InputTag = textarea ? "textarea" : "input";
  const inputProps = textarea ? { rows: 3 } : {};
  const cls = "w-full rounded-lg border border-black/10 dark:border-white/20 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-black dark:text-white outline-none resize-y placeholder:text-black/40 dark:placeholder:text-white/40";
  return (
    <>
      <div className="space-y-2">
        <label className="text-xs text-black dark:text-white">{label} (ID)</label>
        <InputTag value={idValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onIdChange(e.target.value)} {...inputProps} className={cls} />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-black dark:text-white">{label} (EN)</label>
        <InputTag value={enValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onEnChange(e.target.value)} {...inputProps} className={cls} />
      </div>
    </>
  );
}
