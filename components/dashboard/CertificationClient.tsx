"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, Award, ExternalLink, PencilLine, PlusCircle, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { Certification, SectionContentResponse } from "@/app/types/site-content";

type CertificationClientProps = { locale: string };

type CertForm = {
  name: string;
  organization: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
};

const emptyForm = (): CertForm => ({
  name: "",
  organization: "",
  issueDate: "",
  expiryDate: "",
  credentialUrl: "",
});

export function CertificationClient({ locale }: CertificationClientProps) {
  const [items, setItems] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSave] = useTransition();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertForm>(emptyForm());
  const editRequestRef = useRef(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/certificates");
      const json = await res.json();
      const payload = json?.data as SectionContentResponse<Certification> | undefined;
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
      name: item.name,
      organization: item.organization,
      issueDate: item.issueDate ?? "",
      expiryDate: item.expiryDate ?? "",
      credentialUrl: item.credentialUrl ?? "",
    });
    try {
      const res = await fetch(`/api/certificates/${item.id}`);
      const json = await res.json();
      // Abaikan response lama jika user sudah pindah ke item lain
      if (requestId !== editRequestRef.current) return;
      if (res.ok && json?.data) {
        const detail = json.data as Certification;
        setForm({
          name: detail.name,
          organization: detail.organization,
          issueDate: detail.issueDate ?? "",
          expiryDate: detail.expiryDate ?? "",
          credentialUrl: detail.credentialUrl ?? "",
        });
      }
    } catch {
      // Fallback ke data list yang sudah terisi
    }
  };

  const handleSaveForm = () => {
    if (!form.name || !form.organization) {
      toast.error("Name dan Organization wajib diisi.");
      return;
    }
    startSave(async () => {
      try {
        const isEdit = editingId !== null;
        const endpoint = isEdit ? `/api/certificates/${editingId}` : "/api/certificates";
        const res = await fetch(endpoint, {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal menyimpan.");
        toast.success(isEdit ? "Sertifikat berhasil diperbarui." : "Sertifikat berhasil ditambahkan.");
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
        const res = await fetch(`/api/certificates/${item.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Gagal menghapus.");
        toast.success("Sertifikat berhasil dihapus.");
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
        const res = await fetch("/api/certificates/settings", {
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
            <h1 className="mt-3 text-xl font-semibold text-black">Certification Management</h1>
            <p className="mt-1 text-sm text-black">Kelola sertifikat yang ditampilkan di halaman utama. Setiap tambah, edit, atau hapus langsung tersimpan ke API.</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-amber-400">
            <Award className="h-5 w-5 text-black" />
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

      {/* Certification Table */}
      <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2 text-black font-semibold text-sm">
            Certification Items
            <span className="text-xs text-black bg-black/5 px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <Button type="button" size="sm" onClick={openAdd} className="h-8 text-xs border border-black/10 bg-amber-400 text-black font-bold hover:bg-amber-300">
            <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Certificate
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-black">
            <Award className="mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm">No certificates yet. Click &quot;Add Certificate&quot; to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-black/5 hover:bg-transparent">
                <TableHead className="text-xs text-black uppercase w-[200px]">Name</TableHead>
                <TableHead className="text-xs text-black uppercase">Organization</TableHead>
                <TableHead className="text-xs text-black uppercase hidden md:table-cell">Dates</TableHead>
                <TableHead className="text-xs text-black uppercase hidden lg:table-cell">Credential</TableHead>
                <TableHead className="text-xs text-black uppercase w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={item.id} className="border-black/5 hover:bg-black/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-amber-100 text-amber-800 text-xs font-bold overflow-hidden">
                        {item.name.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-black truncate">{item.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-black">{item.organization}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-black">
                      {item.issueDate}
                      {item.expiryDate ? ` — ${item.expiryDate}` : ""}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.credentialUrl ? (
                      <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-black underline decoration-black/30 hover:decoration-black">
                        <ExternalLink className="h-3 w-3" /> Verify
                      </a>
                    ) : (
                      <span className="text-xs text-black">—</span>
                    )}
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
              {editingId !== null ? "Edit Certificate" : "Add Certificate"}
            </Badge>
            <DialogTitle className="text-xl">{editingId !== null ? "Edit certification" : "Add new certification"}</DialogTitle>
            <DialogDescription className="text-black">All fields marked with * are required.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-black">Name *</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Belajar Membuat Aplikasi React" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Organization *</Label>
                <Input value={form.organization} onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))} placeholder="Dicoding Indonesia" className="border border-black/10 bg-white text-black placeholder:text-black/40" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-black">Issue Date</Label>
                <Input type="month" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} className="border border-black/10 bg-white text-black [color-scheme:light]" />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Expiry Date</Label>
                <Input type="month" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} className="border border-black/10 bg-white text-black [color-scheme:light]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-black">Credential URL</Label>
              <Input value={form.credentialUrl} onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://credential.example.com/verify/..." className="border border-black/10 bg-white text-black placeholder:text-black/40" />
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