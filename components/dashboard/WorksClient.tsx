"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowLeft, Briefcase, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { SiteContentGrouped, WorkExperience } from "@/app/types/site-content";

type WorksClientProps = { locale: string };

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"] as const;

async function fetchContent(locale: string): Promise<SiteContentGrouped | null> {
  const res = await fetch(`/api/site-content?locale=${locale}`);
  const json = await res.json();
  return json?.data?.works ?? null;
}

async function saveSection(section: string, entries: { key: string; locale: string; value: string }[]) {
  const response = await fetch(`/api/site-content/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menyimpan.");
  return result;
}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

const emptyForm = (): WorkExperience => ({
  id: "",
  company: "",
  position: "",
  location: "",
  type: "Full-time",
  startDate: "",
  endDate: "Present",
  description: "",
  logo: "",
});

export function WorksClient({ locale }: WorksClientProps) {
  const [data, setData] = useState<SiteContentGrouped | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();

  // Section settings
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");

  // Items
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<WorkExperience>(emptyForm());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchContent(locale);
      setData(result);
    } catch {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!data) return;
    const idMap = data.localized?.["id"] ?? {};
    const enMap = data.localized?.["en"] ?? {};
    setTitleId(idMap.title ?? "");
    setTitleEn(enMap.title ?? "");
    setDescId(idMap.description ?? "");
    setDescEn(enMap.description ?? "");
    setExperiences(parseJSON<WorkExperience[]>(data.global?.experience, []));
  }, [data]);

  const openAdd = () => {
    setEditingIndex(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...experiences[index] });
    setDialogOpen(true);
  };

  const handleSaveForm = () => {
    if (!form.company || !form.position) {
      toast.error("Company dan Position wajib diisi.");
      return;
    }
    if (editingIndex !== null) {
      setExperiences((p) => p.map((x, i) => (i === editingIndex ? { ...form } : x)));
    } else {
      setExperiences((p) => [...p, { ...form, id: `exp-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (index: number) => {
    setExperiences((p) => p.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("works", [
          { key: "title", locale: "id", value: titleId },
          { key: "title", locale: "en", value: titleEn },
          { key: "description", locale: "id", value: descId },
          { key: "description", locale: "en", value: descEn },
          { key: "experience", locale: "", value: JSON.stringify(experiences) },
        ]);
        toast.success("Works content saved!");
        loadData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
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
            <p className="mt-1 text-sm text-white/40">Kelola pengalaman kerja yang ditampilkan di halaman utama.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
            <Briefcase className="h-5 w-5 text-brand-400" />
          </div>
        </div>
      </div>

      {/* Section Settings */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-6">
        <h2 className="text-sm font-semibold text-white">Section Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup label="Title" idValue={titleId} onIdChange={setTitleId} enValue={titleEn} onEnChange={setTitleEn} />
          <FieldGroup label="Description" idValue={descId} onIdChange={setDescId} enValue={descEn} onEnChange={setDescEn} textarea />
        </div>
      </div>

      {/* Experiences Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            Work Experiences
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{experiences.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd}
            className="bg-brand-500 text-black hover:bg-brand-400 h-8 text-xs">
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
                <TableHead className="text-xs text-white/30 uppercase w-[180px]">Company</TableHead>
                <TableHead className="text-xs text-white/30 uppercase">Position</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden md:table-cell">Period</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden lg:table-cell">Type</TableHead>
                <TableHead className="text-xs text-white/30 uppercase w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp, i) => (
                <TableRow key={exp.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold overflow-hidden">
                        {exp.logo ? (
                          <Image src={exp.logo} alt={exp.company} width={36} height={36} className="object-cover w-full h-full" />
                        ) : (
                          exp.company.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{exp.company}</p>
                        <p className="text-xs text-white/40 truncate">{exp.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-white/80">{exp.position}</p>
                    {exp.description && (
                      <p className="text-xs text-white/40 line-clamp-1 mt-0.5 max-w-xs">{exp.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-white/60">{exp.startDate} — {exp.endDate}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-xs text-white/50">
                      {exp.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(i)}
                        className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white/70 transition-colors">
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(i)}
                        className="rounded-lg p-1.5 text-rose-400/40 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
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
              {editingIndex !== null ? <PencilLine className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
              {editingIndex !== null ? "Edit Experience" : "Add Experience"}
            </Badge>
            <DialogTitle className="text-xl">
              {editingIndex !== null ? "Edit work experience" : "Add new work experience"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Company *</Label>
                <Input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Company name" className="border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Position *</Label>
                <Input value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                  placeholder="Job title" className="border-white/10 bg-white/5 text-white" />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Location</Label>
                <Input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="City, Country" className="border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger className="border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="z-[60] border-white/10 bg-[#1a1a2e] text-white">
                    {[...JOB_TYPES].map((t) => (
                      <SelectItem key={t} value={t} className="hover:bg-white/10 focus:bg-white/10">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Start Date</Label>
                <Input type="month" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="border-white/10 bg-white/5 text-white [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">End Date</Label>
                  <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer select-none hover:text-white/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.endDate === "Present"}
                      onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.checked ? "Present" : "" }))}
                      className="rounded border-white/20 bg-white/10 accent-brand-500"
                    />
                    Current job
                  </label>
                </div>
                {form.endDate === "Present" ? (
                  <div className="flex h-10 w-full items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/50">
                    Present
                  </div>
                ) : (
                  <Input type="month" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="border-white/10 bg-white/5 text-white [color-scheme:dark]" />
                )}
              </div>
            </div>
            {/* Row 4 */}
            <div className="space-y-2">
              <Label className="text-white/80">Logo URL</Label>
              <Input value={form.logo ?? ""} onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                placeholder="https://company.com/logo.png" className="border-white/10 bg-white/5 text-white" />
              {form.logo && (
                <div className="mt-1 flex items-center gap-2">
                  <Image src={form.logo} alt="Preview" width={32} height={32} className="rounded object-cover w-8 h-8" />
                  <span className="text-xs text-white/40">Logo preview</span>
                </div>
              )}
            </div>
            {/* Row 5 */}
            <div className="space-y-2">
              <Label className="text-white/80">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your responsibilities, achievements, and technologies used..."
                rows={4}
                className="border-white/10 bg-white/5 text-white min-h-[100px]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}
              className="rounded-full border-white/10 bg-transparent text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveForm}
              className="rounded-full bg-brand-500 text-black hover:bg-brand-400 font-semibold px-6">
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}
          className="bg-brand-500 text-black hover:bg-brand-400 px-6">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
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
        <label className="text-xs text-white/50">{label} (ID)</label>
        <InputTag value={idValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onIdChange(e.target.value)}
          {...inputProps}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none resize-y" />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-white/50">{label} (EN)</label>
        <InputTag value={enValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onEnChange(e.target.value)}
          {...inputProps}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none resize-y" />
      </div>
    </>
  );
}
