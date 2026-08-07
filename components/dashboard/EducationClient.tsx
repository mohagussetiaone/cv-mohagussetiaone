"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, BookOpen, PencilLine, PlusCircle, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { Education, SectionContentResponse } from "@/app/types/site-content";

type EducationClientProps = { locale: string };

type EduForm = {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

const emptyForm = (): EduForm => ({
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
});

export function EducationClient({ locale }: EducationClientProps) {
  const [items, setItems] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EduForm>(emptyForm());
  const editRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/education");
      const json = await res.json();
      const payload = json?.data as SectionContentResponse<Education> | undefined;
      setItems(payload?.items ?? []);
      const id = payload?.settings?.localized?.["id"] ?? {};
      const en = payload?.settings?.localized?.["en"] ?? {};
      setTitleId(id.title ?? "");
      setTitleEn(en.title ?? "");
      setDescId(id.description ?? "");
      setDescEn(en.description ?? "");
    } catch {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = async (index: number) => {
    const item = items[index];
    if (!item) return;
    const requestId = ++editRequestRef.current;
    setEditingId(item.id);
    setDialogOpen(true);
    // Isi dari list dulu sebagai fallback, lalu update dengan detail realtime dari API
    setForm({
      school: item.school,
      degree: item.degree,
      field: item.field,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description ?? "",
    });
    try {
      const res = await fetch(`/api/education/${item.id}`);
      const json = await res.json();
      // Abaikan response lama jika user sudah pindah ke item lain
      if (requestId !== editRequestRef.current) return;
      if (res.ok && json?.data) {
        const detail = json.data as Education;
        setForm({
          school: detail.school,
          degree: detail.degree,
          field: detail.field,
          startDate: detail.startDate,
          endDate: detail.endDate,
          description: detail.description ?? "",
        });
      }
    } catch {
      // Fallback ke data list yang sudah terisi
    }
  };

  const handleSaveForm = () => {
    if (!form.school || !form.degree) {
      toast.error("School dan Degree wajib diisi.");
      return;
    }
    startSave(async () => {
      try {
        const isEdit = editingId !== null;
        const endpoint = isEdit ? `/api/education/${editingId}` : "/api/education";
        const res = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan.");
        toast.success(isEdit ? "Pendidikan berhasil diperbarui." : "Pendidikan berhasil ditambahkan.");
        setDialogOpen(false);
        loadData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  };

  const handleDelete = (index: number) => {
    const item = items[index];
    if (!item) return;
    startSave(async () => {
      try {
        const res = await fetch(`/api/education/${item.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus.");
        toast.success("Pendidikan berhasil dihapus.");
        loadData();
      } catch {
        toast.error("Gagal menghapus.");
      }
    });
  };

  const handleSaveSettings = () => {
    startSave(async () => {
      try {
        const entries = [
          { key: "title", locale: "id", value: titleId },
          { key: "title", locale: "en", value: titleEn },
          { key: "description", locale: "id", value: descId },
          { key: "description", locale: "en", value: descEn },
        ];
        const res = await fetch("/api/education/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan.");
        toast.success("Pengaturan section berhasil disimpan.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-black">Education Management</h1>
            <p className="mt-1 text-sm text-black">Kelola riwayat pendidikan yang ditampilkan di halaman utama. Setiap tambah, edit, atau hapus langsung tersimpan ke API.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-amber-400">
            <BookOpen className="h-5 w-5 text-black" />
          </div>
        </div>
      </div>

      {/* Section Settings */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black">Section Settings</h2>
          <Button type="button" size="sm" onClick={handleSaveSettings} disabled={isSaving} className="h-8 text-xs border border-black/10 bg-amber-400 text-black font-bold hover:bg-amber-300">
            <Save className="mr-1.5 h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Section"}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Title" idValue={titleId} onIdChange={setTitleId} enValue={titleEn} onEnChange={setTitleEn} />
          <FieldGroup label="Description" idValue={descId} onIdChange={setDescId} enValue={descEn} onEnChange={setDescEn} textarea />
        </div>
      </div>

      {/* Education Table */}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2 text-black font-semibold text-sm">
            Education Items
            <span className="text-xs text-black bg-black/5 px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd} className="h-8 text-xs border border-black/10 bg-amber-400 text-black font-bold hover:bg-amber-300">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Education
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-black">
            <BookOpen className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No education yet. Click &quot;Add Education&quot; to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-black/5 hover:bg-transparent">
                <TableHead className="text-xs text-black uppercase w-[200px]">School</TableHead>
                <TableHead className="text-xs text-black uppercase">Degree / Field</TableHead>
                <TableHead className="text-xs text-black uppercase hidden md:table-cell">Period</TableHead>
                <TableHead className="text-xs text-black uppercase w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={item.id} className="border-black/5 hover:bg-black/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-sky-100 text-sky-800 text-xs font-bold overflow-hidden">
                        {item.school.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.school}</p>
                        {item.description && <p className="text-xs text-black line-clamp-1 max-w-xs">{item.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-black">{item.degree}</p>
                    {item.field && <p className="text-xs text-black">{item.field}</p>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-black">{item.startDate} — {item.endDate}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(i)} className="rounded-lg p-1.5 text-black/60 hover:bg-black/5 hover:text-black transition-colors">
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(i)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
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
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto border border-black/10 bg-white text-black">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1 mb-2 border border-black/10 bg-amber-400 text-black">
              {editingId !== null ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {editingId !== null ? "Edit Education" : "Add Education"}
            </Badge>
            <DialogTitle className="text-xl">{editingId !== null ? "Edit education record" : "Add new education record"}</DialogTitle>
            <DialogDescription className="text-black">All fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-black">School *</Label>
                <Input value={form.school} onChange={(e) => setForm((p) => ({ ...p, school: e.target.value }))} placeholder="University name" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Degree *</Label>
                <Input value={form.degree} onChange={(e) => setForm((p) => ({ ...p, degree: e.target.value }))} placeholder="Bachelor" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-black">Field of Study</Label>
                <Input value={form.field} onChange={(e) => setForm((p) => ({ ...p, field: e.target.value }))} placeholder="Computer Science" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
              <div className="hidden md:block" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-black">Start Year</Label>
                <Input type="number" min={1950} max={2099} step={1} value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} placeholder="2020" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-black">End Year</Label>
                <Input type="number" min={1950} max={2099} step={1} value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} placeholder="2024" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-black">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe your studies, achievements, activities, and relevant coursework..." rows={4} className="border border-black/10 bg-white text-black min-h-[100px] placeholder:text-black/40" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full border border-black/10 bg-transparent text-black hover:bg-black/5">
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveForm} disabled={isSaving} className="rounded-full bg-amber-400 text-black hover:bg-amber-300 font-bold border border-black px-6">
              {isSaving ? "Saving..." : editingId !== null ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* ── Shared sub-components ── */

function FieldGroup({ label, idValue, onIdChange, enValue, onEnChange, textarea }: {
  label: string; idValue: string; onIdChange: (v: string) => void;
  enValue: string; onEnChange: (v: string) => void; textarea?: boolean;
}) {
  const InputTag = textarea ? "textarea" : "input";
  const inputProps = textarea ? { rows: 3 } : {};
  return (
    <>
      <div className="space-y-2">
        <label className="text-xs text-black">{label} (ID)</label>
        <InputTag value={idValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onIdChange(e.target.value)} {...inputProps} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none resize-y" />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-black">{label} (EN)</label>
        <InputTag value={enValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onEnChange(e.target.value)} {...inputProps} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none resize-y" />
      </div>
    </>
  );
}