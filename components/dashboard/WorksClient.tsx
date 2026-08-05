"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowLeft, Briefcase, PencilLine, PlusCircle, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { SectionContentResponse, WorkExperience } from "@/app/types/site-content";

type WorksClientProps = { locale: string };

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"] as const;

type WorkForm = {
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
};

const emptyForm = (): WorkForm => ({
  company: "",
  position: "",
  location: "",
  type: "Full-time",
  startDate: "",
  endDate: "Present",
  description: "",
});

export function WorksClient({ locale }: WorksClientProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();

  // Section settings
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [expLabelId, setExpLabelId] = useState("");
  const [expLabelEn, setExpLabelEn] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WorkForm>(emptyForm());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/works");
      const json = await res.json();
      const payload = json?.data as SectionContentResponse<WorkExperience> | undefined;
      setExperiences(payload?.items ?? []);
      const id = payload?.settings?.localized?.["id"] ?? {};
      const en = payload?.settings?.localized?.["en"] ?? {};
      setTitleId(id.title ?? "");
      setTitleEn(en.title ?? "");
      setDescId(id.description ?? "");
      setDescEn(en.description ?? "");
      setExpLabelId(id.experience_label ?? "");
      setExpLabelEn(en.experience_label ?? "");
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

  const openEdit = (index: number) => {
    const exp = experiences[index];
    if (!exp) return;
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      position: exp.position,
      location: exp.location ?? "",
      type: exp.type,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description ?? "",
    });
    setDialogOpen(true);
  };

  const handleSaveForm = () => {
    if (!form.company || !form.position) {
      toast.error("Company dan Position wajib diisi.");
      return;
    }

    startSave(async () => {
      try {
        const isEdit = editingId !== null;
        const endpoint = isEdit ? `/api/works/${editingId}` : "/api/works";
        const res = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan.");
        toast.success(isEdit ? "Work experience berhasil diperbarui." : "Work experience berhasil ditambahkan.");
        setDialogOpen(false);
        loadData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  };

  const handleDelete = (index: number) => {
    const exp = experiences[index];
    if (!exp) return;
    startSave(async () => {
      try {
        const res = await fetch(`/api/works/${exp.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus.");
        toast.success("Work experience berhasil dihapus.");
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
          { key: "experience_label", locale: "id", value: expLabelId },
          { key: "experience_label", locale: "en", value: expLabelEn },
        ];
        const res = await fetch("/api/works/settings", {
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
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/2 p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-white">Works Management</h1>
            <p className="mt-1 text-sm text-white/40">Kelola pengalaman kerja yang ditampilkan di halaman utama. Setiap tambah, edit, atau hapus langsung tersimpan ke API.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
            <Briefcase className="h-5 w-5 text-brand-400" />
          </div>
        </div>
      </div>

      {/* Section Settings */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Section Settings</h2>
          <Button type="button" size="sm" onClick={handleSaveSettings} disabled={isSaving} className="bg-brand-500 text-black hover:bg-brand-400 h-8 text-xs">
            <Save className="mr-1.5 h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Section"}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Title" idValue={titleId} onIdChange={setTitleId} enValue={titleEn} onEnChange={setTitleEn} />
          <FieldGroup label="Description" idValue={descId} onIdChange={setDescId} enValue={descEn} onEnChange={setDescEn} textarea />
          <FieldGroup label="Experience Label" idValue={expLabelId} onIdChange={setExpLabelId} enValue={expLabelEn} onEnChange={setExpLabelEn} />
        </div>
      </div>

      {/* Experiences Table */}
      <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            Work Experiences
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{experiences.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd} className="bg-brand-500 text-black hover:bg-brand-400 h-8 text-xs">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Experience
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-white/40">
            <Briefcase className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No experiences yet. Click &quot;Add Experience&quot; to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs text-white/30 uppercase w-45">Company</TableHead>
                <TableHead className="text-xs text-white/30 uppercase">Position</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden md:table-cell">Period</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden lg:table-cell">Type</TableHead>
                <TableHead className="text-xs text-white/30 uppercase w-25">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp, i) => (
                <TableRow key={exp.id} className="border-white/5 hover:bg-white/2">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold overflow-hidden">
                        {exp.company.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{exp.company}</p>
                        <p className="text-xs text-white/40 truncate">{exp.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-white/80">{exp.position}</p>
                    {exp.description && <p className="text-xs text-white/40 line-clamp-1 mt-0.5 max-w-xs">{exp.description}</p>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-white/60">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-white/50">
                      {exp.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(i)} className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white/70 transition-colors">
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(i)} className="rounded-lg p-1.5 text-rose-400/40 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
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
        <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto border-white/10 bg-[#0a0a0a] text-white">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1 mb-2">
              {editingId !== null ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {editingId !== null ? "Edit Experience" : "Add Experience"}
            </Badge>
            <DialogTitle className="text-xl">{editingId !== null ? "Edit work experience" : "Add new work experience"}</DialogTitle>
            <DialogDescription className="text-white/60">All fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Company *</Label>
                <Input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company name" className="border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Position *</Label>
                <Input value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} placeholder="Job title" className="border-white/10 bg-white/5 text-white" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Location</Label>
                <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="City, Country" className="border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="z-60 border-white/10 bg-[#1a1a2e] text-white">
                    {[...JOB_TYPES].map((t) => (
                      <SelectItem key={t} value={t} className="hover:bg-white/10 focus:bg-white/10">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Start Date</Label>
                <Input type="month" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="border-white/10 bg-white/5 text-white scheme-dark" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">End Date</Label>
                  <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer select-none hover:text-white/60 transition-colors">
                    <input type="checkbox" checked={form.endDate === "Present"} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.checked ? "Present" : "" }))} className="rounded border-white/20 bg-white/10 accent-brand-500" />
                    Current job
                  </label>
                </div>
                {form.endDate === "Present" ? (
                  <div className="flex h-10 w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/50">Present</div>
                ) : (
                  <Input type="month" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="border-white/10 bg-white/5 text-white scheme-dark" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe your responsibilities, achievements, and technologies used..." rows={4} className="border-white/10 bg-white/5 text-white min-h-25" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveForm} disabled={isSaving} className="rounded-full bg-brand-500 text-black hover:bg-brand-400 font-semibold px-6">
              {isSaving ? "Saving..." : editingId !== null ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* ── Shared sub-components ── */

function FieldGroup({ label, idValue, onIdChange, enValue, onEnChange, textarea }: { label: string; idValue: string; onIdChange: (v: string) => void; enValue: string; onEnChange: (v: string) => void; textarea?: boolean }) {
  const InputTag = textarea ? "textarea" : "input";
  const inputProps = textarea ? { rows: 3 } : {};
  return (
    <>
      <div className="space-y-2">
        <label className="text-xs text-white/50">{label} (ID)</label>
        <InputTag
          value={idValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onIdChange(e.target.value)}
          {...inputProps}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none resize-y"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-white/50">{label} (EN)</label>
        <InputTag
          value={enValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onEnChange(e.target.value)}
          {...inputProps}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none resize-y"
        />
      </div>
    </>
  );
}