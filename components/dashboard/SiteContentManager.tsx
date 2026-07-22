"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Globe2, Plus, Save, Trash2 } from "lucide-react";
import type { SiteContentGrouped, SkillItem } from "@/app/types/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────

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

// ─── Banner Editor ───────────────────────────────────────────

function BannerEditor({ data, locale }: { data: SiteContentGrouped | null; locale: string }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const g = data?.global ?? {};

  const [form, setForm] = useState({
    greetingId: idT.greeting ?? "",
    greetingEn: enT.greeting ?? "",
    nameId: idT.name ?? "",
    nameEn: enT.name ?? "",
    descriptionId: idT.description ?? "",
    descriptionEn: enT.description ?? "",
    letsTalkId: idT.letsTalk ?? "",
    letsTalkEn: enT.letsTalk ?? "",
    yearsId: idT.years ?? "",
    yearsEn: enT.years ?? "",
    experienceId: idT.experience ?? "",
    experienceEn: enT.experience ?? "",
    programmingId: idT.programming ?? "",
    programmingEn: enT.programming ?? "",
    languageId: idT.language ?? "",
    languageEn: enT.language ?? "",
    developmentId: idT.development ?? "",
    developmentEn: enT.development ?? "",
    projectId: idT.project ?? "",
    projectEn: enT.project ?? "",
    email: g.email ?? "",
    address: g.address ?? "",
    jobTitle: g.jobTitle ?? "",
    websiteUrl: g.websiteUrl ?? "",
    whatsappNumber: g.whatsappNumber ?? "",
    yearsExperience: g.yearsExperience ?? "",
    programmingLanguages: g.programmingLanguages ?? "",
    developmentProjects: g.developmentProjects ?? "",
    cvFileUrl: g.cvFileUrl ?? "",
    bannerImage: g.bannerImage ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    const g = data.global ?? {};
    setForm({
      greetingId: idT.greeting ?? "", greetingEn: enT.greeting ?? "",
      nameId: idT.name ?? "", nameEn: enT.name ?? "",
      descriptionId: idT.description ?? "", descriptionEn: enT.description ?? "",
      letsTalkId: idT.letsTalk ?? "", letsTalkEn: enT.letsTalk ?? "",
      yearsId: idT.years ?? "", yearsEn: enT.years ?? "",
      experienceId: idT.experience ?? "", experienceEn: enT.experience ?? "",
      programmingId: idT.programming ?? "", programmingEn: enT.programming ?? "",
      languageId: idT.language ?? "", languageEn: enT.language ?? "",
      developmentId: idT.development ?? "", developmentEn: enT.development ?? "",
      projectId: idT.project ?? "", projectEn: enT.project ?? "",
      email: g.email ?? "", address: g.address ?? "",
      jobTitle: g.jobTitle ?? "", websiteUrl: g.websiteUrl ?? "",
      whatsappNumber: g.whatsappNumber ?? "",
      yearsExperience: g.yearsExperience ?? "", programmingLanguages: g.programmingLanguages ?? "",
      developmentProjects: g.developmentProjects ?? "", cvFileUrl: g.cvFileUrl ?? "",
      bannerImage: g.bannerImage ?? "",
    });
  }, [data]);

  const handleSave = () => {
    const entries = [
      { key: "greeting", locale: "id", value: form.greetingId },
      { key: "greeting", locale: "en", value: form.greetingEn },
      { key: "name", locale: "id", value: form.nameId },
      { key: "name", locale: "en", value: form.nameEn },
      { key: "description", locale: "id", value: form.descriptionId },
      { key: "description", locale: "en", value: form.descriptionEn },
      { key: "letsTalk", locale: "id", value: form.letsTalkId },
      { key: "letsTalk", locale: "en", value: form.letsTalkEn },
      { key: "years", locale: "id", value: form.yearsId },
      { key: "years", locale: "en", value: form.yearsEn },
      { key: "experience", locale: "id", value: form.experienceId },
      { key: "experience", locale: "en", value: form.experienceEn },
      { key: "programming", locale: "id", value: form.programmingId },
      { key: "programming", locale: "en", value: form.programmingEn },
      { key: "language", locale: "id", value: form.languageId },
      { key: "language", locale: "en", value: form.languageEn },
      { key: "development", locale: "id", value: form.developmentId },
      { key: "development", locale: "en", value: form.developmentEn },
      { key: "project", locale: "id", value: form.projectId },
      { key: "project", locale: "en", value: form.projectEn },
      { key: "email", locale: "", value: form.email },
      { key: "address", locale: "", value: form.address },
      { key: "jobTitle", locale: "", value: form.jobTitle },
      { key: "websiteUrl", locale: "", value: form.websiteUrl },
      { key: "whatsappNumber", locale: "", value: form.whatsappNumber },
      { key: "yearsExperience", locale: "", value: form.yearsExperience },
      { key: "programmingLanguages", locale: "", value: form.programmingLanguages },
      { key: "developmentProjects", locale: "", value: form.developmentProjects },
      { key: "cvFileUrl", locale: "", value: form.cvFileUrl },
      { key: "bannerImage", locale: "", value: form.bannerImage },
    ];
    startSave(async () => {
      try {
        await saveSection("banner", entries);
        toast.success("Banner content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Banner" onSave={handleSave} isSaving={isSaving}>
      <LocalizedBlock locale="id" accent="amber">
        <Field label="Greeting" value={form.greetingId} onChange={(v) => setForm((p) => ({ ...p, greetingId: v }))} />
        <Field label="Nama" value={form.nameId} onChange={(v) => setForm((p) => ({ ...p, nameId: v }))} />
        <TextareaField label="Deskripsi" value={form.descriptionId} onChange={(v) => setForm((p) => ({ ...p, descriptionId: v }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Let's Talk" value={form.letsTalkId} onChange={(v) => setForm((p) => ({ ...p, letsTalkId: v }))} />
          <Field label="Years" value={form.yearsId} onChange={(v) => setForm((p) => ({ ...p, yearsId: v }))} />
          <Field label="Experience" value={form.experienceId} onChange={(v) => setForm((p) => ({ ...p, experienceId: v }))} />
          <Field label="Programming" value={form.programmingId} onChange={(v) => setForm((p) => ({ ...p, programmingId: v }))} />
          <Field label="Language" value={form.languageId} onChange={(v) => setForm((p) => ({ ...p, languageId: v }))} />
          <Field label="Development" value={form.developmentId} onChange={(v) => setForm((p) => ({ ...p, developmentId: v }))} />
          <Field label="Project" value={form.projectId} onChange={(v) => setForm((p) => ({ ...p, projectId: v }))} />
        </div>
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <Field label="Greeting" value={form.greetingEn} onChange={(v) => setForm((p) => ({ ...p, greetingEn: v }))} />
        <Field label="Name" value={form.nameEn} onChange={(v) => setForm((p) => ({ ...p, nameEn: v }))} />
        <TextareaField label="Description" value={form.descriptionEn} onChange={(v) => setForm((p) => ({ ...p, descriptionEn: v }))} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Let's Talk" value={form.letsTalkEn} onChange={(v) => setForm((p) => ({ ...p, letsTalkEn: v }))} />
          <Field label="Years" value={form.yearsEn} onChange={(v) => setForm((p) => ({ ...p, yearsEn: v }))} />
          <Field label="Experience" value={form.experienceEn} onChange={(v) => setForm((p) => ({ ...p, experienceEn: v }))} />
          <Field label="Programming" value={form.programmingEn} onChange={(v) => setForm((p) => ({ ...p, programmingEn: v }))} />
          <Field label="Language" value={form.languageEn} onChange={(v) => setForm((p) => ({ ...p, languageEn: v }))} />
          <Field label="Development" value={form.developmentEn} onChange={(v) => setForm((p) => ({ ...p, developmentEn: v }))} />
          <Field label="Project" value={form.projectEn} onChange={(v) => setForm((p) => ({ ...p, projectEn: v }))} />
        </div>
      </LocalizedBlock>
      <SeparateBlock title="Profile Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
          <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />
          <Field label="Job Title" value={form.jobTitle} onChange={(v) => setForm((p) => ({ ...p, jobTitle: v }))} />
          <Field label="Website URL" value={form.websiteUrl} onChange={(v) => setForm((p) => ({ ...p, websiteUrl: v }))} />
          <Field label="WhatsApp Number" value={form.whatsappNumber} onChange={(v) => setForm((p) => ({ ...p, whatsappNumber: v }))} />
          <Field label="CV File URL" value={form.cvFileUrl} onChange={(v) => setForm((p) => ({ ...p, cvFileUrl: v }))} />
          <Field label="Banner Image URL" value={form.bannerImage} onChange={(v) => setForm((p) => ({ ...p, bannerImage: v }))} />
        </div>
        <div className="h-px bg-white/10" />
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Years Exp (e.g. 2+)" value={form.yearsExperience} onChange={(v) => setForm((p) => ({ ...p, yearsExperience: v }))} />
          <Field label="Programming Count" value={form.programmingLanguages} onChange={(v) => setForm((p) => ({ ...p, programmingLanguages: v }))} />
          <Field label="Dev Projects Count" value={form.developmentProjects} onChange={(v) => setForm((p) => ({ ...p, developmentProjects: v }))} />
        </div>
      </SeparateBlock>
    </SectionWrapper>
  );
}

// ─── About Editor ────────────────────────────────────────────

function AboutEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const [form, setForm] = useState({
    titleId: idT.title ?? "", titleEn: enT.title ?? "",
    descriptionId: idT.description ?? "", descriptionEn: enT.description ?? "",
    description_1Id: idT.description_1 ?? "", description_1En: enT.description_1 ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    setForm({
      titleId: idT.title ?? "", titleEn: enT.title ?? "",
      descriptionId: idT.description ?? "", descriptionEn: enT.description ?? "",
      description_1Id: idT.description_1 ?? "", description_1En: enT.description_1 ?? "",
    });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("about", [
          { key: "title", locale: "id", value: form.titleId },
          { key: "title", locale: "en", value: form.titleEn },
          { key: "description", locale: "id", value: form.descriptionId },
          { key: "description", locale: "en", value: form.descriptionEn },
          { key: "description_1", locale: "id", value: form.description_1Id },
          { key: "description_1", locale: "en", value: form.description_1En },
        ]);
        toast.success("About content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="About" onSave={handleSave} isSaving={isSaving}>
      <LocalizedBlock locale="id" accent="amber">
        <Field label="Title" value={form.titleId} onChange={(v) => setForm((p) => ({ ...p, titleId: v }))} />
        <TextareaField label="Deskripsi" value={form.descriptionId} onChange={(v) => setForm((p) => ({ ...p, descriptionId: v }))} />
        <TextareaField label="Deskripsi (lanjutan)" value={form.description_1Id} onChange={(v) => setForm((p) => ({ ...p, description_1Id: v }))} />
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <Field label="Title" value={form.titleEn} onChange={(v) => setForm((p) => ({ ...p, titleEn: v }))} />
        <TextareaField label="Description" value={form.descriptionEn} onChange={(v) => setForm((p) => ({ ...p, descriptionEn: v }))} />
        <TextareaField label="Description (cont.)" value={form.description_1En} onChange={(v) => setForm((p) => ({ ...p, description_1En: v }))} />
      </LocalizedBlock>
    </SectionWrapper>
  );
}

// ─── Skills Editor ───────────────────────────────────────────

function SkillsEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const existingItems: SkillItem[] = (() => {
    try { return data?.global?.items ? JSON.parse(data.global.items) : []; }
    catch { return []; }
  })();
  const [form, setForm] = useState({
    titleId: idT.title ?? "", titleEn: enT.title ?? "",
    descriptionId: idT.description ?? "", descriptionEn: enT.description ?? "",
  });
  const [items, setItems] = useState<SkillItem[]>(existingItems);
  const [newItem, setNewItem] = useState<SkillItem>({ name: "", image: "", bgColor: "#28A9E0", textColor: "#28A9E0" });
  const [showAdd, setShowAdd] = useState(false);
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    setForm({
      titleId: idT.title ?? "", titleEn: enT.title ?? "",
      descriptionId: idT.description ?? "", descriptionEn: enT.description ?? "",
    });
    try { const raw = data.global?.items; setItems(raw ? JSON.parse(raw) : []); }
    catch { setItems([]); }
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("skills", [
          { key: "title", locale: "id", value: form.titleId },
          { key: "title", locale: "en", value: form.titleEn },
          { key: "description", locale: "id", value: form.descriptionId },
          { key: "description", locale: "en", value: form.descriptionEn },
          { key: "items", locale: "", value: JSON.stringify(items) },
        ]);
        toast.success("Skills content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Skills" onSave={handleSave} isSaving={isSaving}>
      <LocalizedBlock locale="id" accent="amber">
        <Field label="Title" value={form.titleId} onChange={(v) => setForm((p) => ({ ...p, titleId: v }))} />
        <TextareaField label="Description" value={form.descriptionId} onChange={(v) => setForm((p) => ({ ...p, descriptionId: v }))} />
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <Field label="Title" value={form.titleEn} onChange={(v) => setForm((p) => ({ ...p, titleEn: v }))} />
        <TextareaField label="Description" value={form.descriptionEn} onChange={(v) => setForm((p) => ({ ...p, descriptionEn: v }))} />
      </LocalizedBlock>
      <SeparateBlock title="Skill Items">
        <div className="mb-3 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)} className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10">
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Skill
          </Button>
        </div>
        {showAdd && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <CompactField label="Name" value={newItem.name} onChange={(v) => setNewItem((p) => ({ ...p, name: v }))} placeholder="HTML" />
              <CompactField label="Image URL" value={newItem.image} onChange={(v) => setNewItem((p) => ({ ...p, image: v }))} placeholder="/assets/image/skills/html5.png" />
              <CompactField label="BG Color" value={newItem.bgColor} onChange={(v) => setNewItem((p) => ({ ...p, bgColor: v }))} placeholder="#E54F26" />
              <CompactField label="Text Color" value={newItem.textColor} onChange={(v) => setNewItem((p) => ({ ...p, textColor: v }))} placeholder="#E54F26" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="text-white/50 hover:text-white">Cancel</Button>
              <Button type="button" size="sm" onClick={() => { if (newItem.name && newItem.image) { setItems((p) => [...p, { ...newItem }]); setNewItem({ name: "", image: "", bgColor: "#28A9E0", textColor: "#28A9E0" }); setShowAdd(false); }}} className="bg-brand-500 text-black hover:bg-brand-400">Add</Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs text-white" style={{ backgroundColor: item.bgColor }}>{item.name.charAt(0)}</div>
              <div className="min-w-0 flex-1 grid gap-1 md:grid-cols-3">
                <input value={item.name} onChange={(e) => setItems((p) => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm text-white outline-none" />
                <input value={item.image} onChange={(e) => setItems((p) => p.map((x, j) => j === i ? { ...x, image: e.target.value } : x))} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm text-white font-mono outline-none" />
                <div className="flex gap-1">
                  <input value={item.bgColor} onChange={(e) => setItems((p) => p.map((x, j) => j === i ? { ...x, bgColor: e.target.value } : x))} className="flex-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm text-white font-mono outline-none" />
                  <input type="color" value={item.bgColor} onChange={(e) => setItems((p) => p.map((x, j) => j === i ? { ...x, bgColor: e.target.value } : x))} className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent" />
                </div>
              </div>
              <button type="button" onClick={() => setItems((p) => p.filter((_, j) => j !== i))} className="shrink-0 text-rose-400/60 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-white/40">No skills yet.</p>}
        </div>
      </SeparateBlock>
    </SectionWrapper>
  );
}

// ─── Contact Editor ──────────────────────────────────────────

function ContactEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const [form, setForm] = useState({
    titleId: idT.title ?? "", titleEn: enT.title ?? "",
    title_form_1Id: idT.title_form_1 ?? "", title_form_1En: enT.title_form_1 ?? "",
    title_form_2Id: idT.title_form_2 ?? "", title_form_2En: enT.title_form_2 ?? "",
    title_form_3Id: idT.title_form_3 ?? "", title_form_3En: enT.title_form_3 ?? "",
    submitId: idT.submit ?? "", submitEn: enT.submit ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {}; const enT = data.localized?.["en"] ?? {};
    setForm({
      titleId: idT.title ?? "", titleEn: enT.title ?? "",
      title_form_1Id: idT.title_form_1 ?? "", title_form_1En: enT.title_form_1 ?? "",
      title_form_2Id: idT.title_form_2 ?? "", title_form_2En: enT.title_form_2 ?? "",
      title_form_3Id: idT.title_form_3 ?? "", title_form_3En: enT.title_form_3 ?? "",
      submitId: idT.submit ?? "", submitEn: enT.submit ?? "",
    });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("contact", [
          { key: "title", locale: "id", value: form.titleId }, { key: "title", locale: "en", value: form.titleEn },
          { key: "title_form_1", locale: "id", value: form.title_form_1Id }, { key: "title_form_1", locale: "en", value: form.title_form_1En },
          { key: "title_form_2", locale: "id", value: form.title_form_2Id }, { key: "title_form_2", locale: "en", value: form.title_form_2En },
          { key: "title_form_3", locale: "id", value: form.title_form_3Id }, { key: "title_form_3", locale: "en", value: form.title_form_3En },
          { key: "submit", locale: "id", value: form.submitId }, { key: "submit", locale: "en", value: form.submitEn },
        ]);
        toast.success("Contact content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Contact" onSave={handleSave} isSaving={isSaving}>
      <LocalizedBlock locale="id" accent="amber">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" value={form.titleId} onChange={(v) => setForm((p) => ({ ...p, titleId: v }))} />
          <Field label="Nama Form" value={form.title_form_1Id} onChange={(v) => setForm((p) => ({ ...p, title_form_1Id: v }))} />
          <Field label="Email Form" value={form.title_form_2Id} onChange={(v) => setForm((p) => ({ ...p, title_form_2Id: v }))} />
          <Field label="Pesan Form" value={form.title_form_3Id} onChange={(v) => setForm((p) => ({ ...p, title_form_3Id: v }))} />
          <Field label="Submit Button" value={form.submitId} onChange={(v) => setForm((p) => ({ ...p, submitId: v }))} />
        </div>
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" value={form.titleEn} onChange={(v) => setForm((p) => ({ ...p, titleEn: v }))} />
          <Field label="Name Form" value={form.title_form_1En} onChange={(v) => setForm((p) => ({ ...p, title_form_1En: v }))} />
          <Field label="Email Form" value={form.title_form_2En} onChange={(v) => setForm((p) => ({ ...p, title_form_2En: v }))} />
          <Field label="Message Form" value={form.title_form_3En} onChange={(v) => setForm((p) => ({ ...p, title_form_3En: v }))} />
          <Field label="Submit Button" value={form.submitEn} onChange={(v) => setForm((p) => ({ ...p, submitEn: v }))} />
        </div>
      </LocalizedBlock>
    </SectionWrapper>
  );
}

// ─── Navbar Editor ───────────────────────────────────────────

function NavbarEditor({ data }: { data: SiteContentGrouped | null }) {
  const g = data?.global ?? {};
  const [form, setForm] = useState({
    brandName: g.brandName ?? "", logoImage: g.logoImage ?? "",
    instagramUrl: g.instagramUrl ?? "", githubUrl: g.githubUrl ?? "",
    linkedinUrl: g.linkedinUrl ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const g = data.global ?? {};
    setForm({ brandName: g.brandName ?? "", logoImage: g.logoImage ?? "", instagramUrl: g.instagramUrl ?? "", githubUrl: g.githubUrl ?? "", linkedinUrl: g.linkedinUrl ?? "" });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("navbar", [
          { key: "brandName", locale: "", value: form.brandName },
          { key: "logoImage", locale: "", value: form.logoImage },
          { key: "instagramUrl", locale: "", value: form.instagramUrl },
          { key: "githubUrl", locale: "", value: form.githubUrl },
          { key: "linkedinUrl", locale: "", value: form.linkedinUrl },
        ]);
        toast.success("Navbar content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Navbar" onSave={handleSave} isSaving={isSaving}>
      <SeparateBlock title="Brand Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand Name" value={form.brandName} onChange={(v) => setForm((p) => ({ ...p, brandName: v }))} />
          <Field label="Logo Image URL" value={form.logoImage} onChange={(v) => setForm((p) => ({ ...p, logoImage: v }))} />
        </div>
      </SeparateBlock>
      <SeparateBlock title="Social Links">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => setForm((p) => ({ ...p, instagramUrl: v }))} />
          <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm((p) => ({ ...p, githubUrl: v }))} />
          <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm((p) => ({ ...p, linkedinUrl: v }))} />
        </div>
      </SeparateBlock>
    </SectionWrapper>
  );
}

// ─── Shared UI Primitives ────────────────────────────────────

function SectionWrapper({ title, onSave, isSaving, children }: { title: string; onSave: () => void; isSaving: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Button onClick={onSave} disabled={isSaving} size="sm" className="rounded-lg bg-brand-500 text-black hover:bg-brand-400 font-medium">
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function LocalizedBlock({ locale, accent, children }: { locale: string; accent: string; children: React.ReactNode }) {
  const color = accent === "amber" ? "text-amber-300" : "text-sky-400";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
      <div className="flex items-center gap-2 text-white font-semibold">
        <Globe2 className={`h-4 w-4 ${color}`} />
        {locale === "id" ? "Bahasa Indonesia" : "English"}
      </div>
      {children}
    </div>
  );
}

function SeparateBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
      <div className="flex items-center gap-2 text-white font-semibold">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/60">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="border-white/10 bg-white/5 h-9" />
    </div>
  );
}

function CompactField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-white/60 text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border-white/10 bg-black/20 h-8 text-sm" />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-white/60">{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="border-white/10 bg-white/5 min-h-[100px]" />
    </div>
  );
}

// ─── Main Exported Component ─────────────────────────────────

const SECTIONS = [
  { id: "banner", label: "Banner", icon: "🏠" },
  { id: "about", label: "About", icon: "👤" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "contact", label: "Contact", icon: "✉️" },
  { id: "navbar", label: "Navbar", icon: "🧭" },
] as const;

type SiteContentManagerProps = {
  locale: string;
};

export function SiteContentManager({ locale }: SiteContentManagerProps) {
  const [activeSection, setActiveSection] = useState<string>("banner");
  const [data, setData] = useState<Record<string, SiteContentGrouped> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/site-content?locale=${locale}`)
      .then((res) => res.json())
      .then((json) => { if (json?.data) setData(json.data); })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [locale]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const renderEditor = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
            <p className="text-sm text-white/40">Memuat konten...</p>
          </div>
        </div>
      );
    }
    const sectionData = data?.[activeSection] ?? null;
    switch (activeSection) {
      case "banner": return <BannerEditor data={sectionData} locale={locale} />;
      case "about": return <AboutEditor data={sectionData} />;
      case "skills": return <SkillsEditor data={sectionData} />;
      case "contact": return <ContactEditor data={sectionData} />;
      case "navbar": return <NavbarEditor data={sectionData} />;
      default: return null;
    }
  };

  return (
    <div id="content-editor" className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Content Editor</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Landing Page Content</h2>
            <p className="mt-0.5 text-sm text-white/40">Manage all landing page content here. Changes appear on the main page immediately.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-5 py-3">
        {SECTIONS.map((section) => (
          <button key={section.id} type="button" onClick={() => setActiveSection(section.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === section.id ? "bg-brand-500/15 text-brand-400" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{section.icon}</span> {section.label}
          </button>
        ))}
      </div>
      <div className="p-5">{renderEditor()}</div>
    </div>
  );
}
