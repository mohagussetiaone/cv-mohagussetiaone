"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ArrowLeft, Award, ExternalLink, PencilLine, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import type { Certification, SiteContentGrouped } from "@/app/types/site-content";

type CertificationClientProps = { locale: string };

async function fetchContent(locale: string): Promise<SiteContentGrouped | null> {
  const res = await fetch(`/api/site-content?locale=${locale}`);
  const json = await res.json();
  return json?.data?.certificates ?? null;
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

const emptyForm = (): Certification => ({
  id: "",
  name: "",
  organization: "",
  issueDate: "",
  expiryDate: "",
  credentialUrl: "",
  logo: "",
});

export function CertificationClient({ locale }: CertificationClientProps) {
  const [data, setData] = useState<SiteContentGrouped | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");

  const [items, setItems] = useState<Certification[]>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Certification>(emptyForm());

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
    setItems(parseJSON<Certification[]>(data.global?.items, []));
  }, [data]);

  const openAdd = () => {
    setEditingIndex(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...items[index] });
    setDialogOpen(true);
  };

  const handleSaveForm = () => {
    if (!form.name || !form.organization) {
      toast.error("Name dan Organization wajib diisi.");
      return;
    }
    if (editingIndex !== null) {
      setItems((p) => p.map((x, i) => (i === editingIndex ? { ...form } : x)));
    } else {
      setItems((p) => [...p, { ...form, id: `cert-${Date.now()}` }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (index: number) => {
    setItems((p) => p.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("certificates", [
          { key: "title", locale: "id", value: titleId },
          { key: "title", locale: "en", value: titleEn },
          { key: "description", locale: "id", value: descId },
          { key: "description", locale: "en", value: descEn },
          { key: "items", locale: "", value: JSON.stringify(items) },
        ]);
        toast.success("Certificates content saved!");
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
            <h1 className="mt-3 text-xl font-semibold text-white">Certification Management</h1>
            <p className="mt-1 text-sm text-white/40">Kelola sertifikat yang ditampilkan di halaman utama.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
            <Award className="h-5 w-5 text-brand-400" />
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

      {/* Certification Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            Certification Items
            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd}
            className="bg-brand-500 text-black hover:bg-brand-400 h-8 text-xs">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Certificate
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-white/40">
            <Award className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No certificates yet. Click &quot;Add Certificate&quot; to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-xs text-white/30 uppercase w-[200px]">Name</TableHead>
                <TableHead className="text-xs text-white/30 uppercase">Organization</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden md:table-cell">Dates</TableHead>
                <TableHead className="text-xs text-white/30 uppercase hidden lg:table-cell">Credential</TableHead>
                <TableHead className="text-xs text-white/30 uppercase w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold overflow-hidden">
                        {item.logo ? (
                          <Image src={item.logo} alt={item.name} width={36} height={36} className="object-cover w-full h-full" />
                        ) : (
                          item.name.charAt(0)
                        )}
                      </div>
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-white/80">{item.organization}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-white/60">
                      {item.issueDate}
                      {item.expiryDate ? ` — ${item.expiryDate}` : ""}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.credentialUrl ? (
                      <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
                        <ExternalLink className="h-3 w-3" /> Verify
                      </a>
                    ) : (
                      <span className="text-xs text-white/30">—</span>
                    )}
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
              {editingIndex !== null ? "Edit Certificate" : "Add Certificate"}
            </Badge>
            <DialogTitle className="text-xl">
              {editingIndex !== null ? "Edit certification" : "Add new certification"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Name *</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Belajar Membuat Aplikasi React" className="border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Organization *</Label>
                <Input value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="Dicoding Indonesia" className="border-white/10 bg-white/5 text-white" />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Issue Date</Label>
                <Input type="month" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                  className="border-white/10 bg-white/5 text-white [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Expiry Date</Label>
                <Input type="month" value={form.expiryDate ?? ""} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                  className="border-white/10 bg-white/5 text-white [color-scheme:dark]" />
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Logo URL</Label>
                <Input value={form.logo ?? ""} onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                  placeholder="https://org.com/logo.png" className="border-white/10 bg-white/5 text-white" />
                {form.logo && (
                  <div className="mt-1 flex items-center gap-2">
                    <Image src={form.logo} alt="Preview" width={32} height={32} className="rounded object-cover w-8 h-8" />
                    <span className="text-xs text-white/40">Logo preview</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Credential URL</Label>
                <Input value={form.credentialUrl ?? ""} onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))}
                  placeholder="https://credential.example.com/verify/..." className="border-white/10 bg-white/5 text-white" />
              </div>
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

      {/* Save */}
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
