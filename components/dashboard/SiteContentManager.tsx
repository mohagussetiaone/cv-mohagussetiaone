"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { FileText, Globe2, Home, Mail, Navigation, Plus, Puzzle, Save, Trash2, User } from "lucide-react";
import type { SiteContentGrouped } from "@/app/types/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { deleteImageByUrl, uploadImageFile } from "@/lib/upload-client";

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
    letsTalkId: idT.lets_talk ?? "",
    letsTalkEn: enT.lets_talk ?? "",
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
  // File banner yang dipilih — diupload saat Save (deferred)
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    const g = data.global ?? {};
    setForm({
      greetingId: idT.greeting ?? "",
      greetingEn: enT.greeting ?? "",
      nameId: idT.name ?? "",
      nameEn: enT.name ?? "",
      descriptionId: idT.description ?? "",
      descriptionEn: enT.description ?? "",
      letsTalkId: idT.lets_talk ?? "",
      letsTalkEn: enT.lets_talk ?? "",
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
    setPendingBannerFile(null);
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      // URL image baru yang terlanjur diupload — untuk rollback jika submit gagal
      let uploadedNewUrl: string | null = null;

      try {
        // 1. Upload pending banner dulu (jika ada) — file lama belum dihapus
        let bannerImage = form.bannerImage;
        if (pendingBannerFile) {
          const uploaded = await uploadImageFile(pendingBannerFile, "banner");
          uploadedNewUrl = uploaded;
          bannerImage = uploaded;
        }

        // 2. Submit data
        const entries = [
          { key: "greeting", locale: "id", value: form.greetingId },
          { key: "greeting", locale: "en", value: form.greetingEn },
          { key: "name", locale: "id", value: form.nameId },
          { key: "name", locale: "en", value: form.nameEn },
          { key: "description", locale: "id", value: form.descriptionId },
          { key: "description", locale: "en", value: form.descriptionEn },
          { key: "lets_talk", locale: "id", value: form.letsTalkId },
          { key: "lets_talk", locale: "en", value: form.letsTalkEn },
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
          { key: "bannerImage", locale: "", value: bannerImage },
        ];
        await saveSection("banner", entries);

        // 3. Submit sukses: hapus file lama yang diganti dengan yang baru
        if (uploadedNewUrl && form.bannerImage && form.bannerImage !== uploadedNewUrl) {
          await deleteImageByUrl(form.bannerImage);
        }
        // Sync URL baru ke form state supaya save berikutnya tidak menimpa dengan URL lama
        setForm((p) => ({ ...p, bannerImage }));
        setPendingBannerFile(null);
        toast.success("Banner content saved!");
      } catch (err) {
        // 4. ROLLBACK: hapus image baru jika submit gagal
        if (uploadedNewUrl) {
          await deleteImageByUrl(uploadedNewUrl);
        }
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
          <div className="space-y-1.5">
            <Label className="text-xs text-black">Banner Image</Label>
            <ImageUploader folder="banner" currentUrl={form.bannerImage} onUrlChange={(url) => setForm((p) => ({ ...p, bannerImage: url }))} onPendingFile={setPendingBannerFile} label="Upload banner image ke MinIO/CDN (otomatis saat Save)" />
          </div>
        </div>
        <div className="h-px bg-black/10" />
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
    titleId: idT.title ?? "",
    titleEn: enT.title ?? "",
    descriptionId: idT.description ?? "",
    descriptionEn: enT.description ?? "",
    description_1Id: idT.description_1 ?? "",
    description_1En: enT.description_1 ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    setForm({
      titleId: idT.title ?? "",
      titleEn: enT.title ?? "",
      descriptionId: idT.description ?? "",
      descriptionEn: enT.description ?? "",
      description_1Id: idT.description_1 ?? "",
      description_1En: enT.description_1 ?? "",
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

// ─── JSONBlock helper component ──────────────────────────────

function JSONBlock({ title, count, onAdd, showAdd, children }: { title: string; count: number; onAdd: () => void; showAdd: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-black font-semibold text-sm">
          {title}
          <span className="text-xs text-black bg-black/5 px-2 py-0.5 rounded-full">{count}</span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="border border-black/10 bg-white text-black hover:bg-black/5 h-7 text-xs">
          <Plus className="mr-1 h-3 w-3" />
          {showAdd ? "Close" : "Add"}
        </Button>
      </div>
      {children}
    </div>
  );
}

// ─── Footer Editor ───────────────────────────────────────────

function FooterEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const g = data?.global ?? {};
  const [form, setForm] = useState({
    copyrightTextId: idT.copyrightText ?? "",
    copyrightTextEn: enT.copyrightText ?? "",
    brandName: g.brandName ?? "",
    brandUrl: g.brandUrl ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    const g = data.global ?? {};
    setForm({
      copyrightTextId: idT.copyrightText ?? "",
      copyrightTextEn: enT.copyrightText ?? "",
      brandName: g.brandName ?? "",
      brandUrl: g.brandUrl ?? "",
    });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("footer", [
          { key: "copyrightText", locale: "id", value: form.copyrightTextId },
          { key: "copyrightText", locale: "en", value: form.copyrightTextEn },
          { key: "brandName", locale: "", value: form.brandName },
          { key: "brandUrl", locale: "", value: form.brandUrl },
        ]);
        toast.success("Footer content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Footer" onSave={handleSave} isSaving={isSaving}>
      <LocalizedBlock locale="id" accent="amber">
        <Field label="Teks Hak Cipta" value={form.copyrightTextId} onChange={(v) => setForm((p) => ({ ...p, copyrightTextId: v }))} />
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <Field label="Copyright Text" value={form.copyrightTextEn} onChange={(v) => setForm((p) => ({ ...p, copyrightTextEn: v }))} />
      </LocalizedBlock>
      <SeparateBlock title="Brand Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand Name" value={form.brandName} onChange={(v) => setForm((p) => ({ ...p, brandName: v }))} />
          <Field label="Brand URL" value={form.brandUrl} onChange={(v) => setForm((p) => ({ ...p, brandUrl: v }))} />
        </div>
      </SeparateBlock>
    </SectionWrapper>
  );
}

// ─── NavHome Editor ──────────────────────────────────────────

function NavHomeEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const [form, setForm] = useState({
    homeId: idT.home ?? "",
    homeEn: enT.home ?? "",
    aboutId: idT.about ?? "",
    aboutEn: enT.about ?? "",
    skillsId: idT.skills ?? "",
    skillsEn: enT.skills ?? "",
    portfolioId: idT.portfolio ?? "",
    portfolioEn: enT.portfolio ?? "",
    contactId: idT.contact ?? "",
    contactEn: enT.contact ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    setForm({
      homeId: idT.home ?? "",
      homeEn: enT.home ?? "",
      aboutId: idT.about ?? "",
      aboutEn: enT.about ?? "",
      skillsId: idT.skills ?? "",
      skillsEn: enT.skills ?? "",
      portfolioId: idT.portfolio ?? "",
      portfolioEn: enT.portfolio ?? "",
      contactId: idT.contact ?? "",
      contactEn: enT.contact ?? "",
    });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("navhome", [
          { key: "home", locale: "id", value: form.homeId },
          { key: "home", locale: "en", value: form.homeEn },
          { key: "about", locale: "id", value: form.aboutId },
          { key: "about", locale: "en", value: form.aboutEn },
          { key: "skills", locale: "id", value: form.skillsId },
          { key: "skills", locale: "en", value: form.skillsEn },
          { key: "portfolio", locale: "id", value: form.portfolioId },
          { key: "portfolio", locale: "en", value: form.portfolioEn },
          { key: "contact", locale: "id", value: form.contactId },
          { key: "contact", locale: "en", value: form.contactEn },
        ]);
        toast.success("NavHome content saved!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="NavHome (Floating Dock)" onSave={handleSave} isSaving={isSaving}>
      <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
        <p className="text-sm text-black">Labels untuk navigasi floating dock di bagian bawah layar.</p>
      </div>
      <LocalizedBlock locale="id" accent="amber">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Beranda" value={form.homeId} onChange={(v) => setForm((p) => ({ ...p, homeId: v }))} />
          <Field label="Tentang" value={form.aboutId} onChange={(v) => setForm((p) => ({ ...p, aboutId: v }))} />
          <Field label="Kemampuan" value={form.skillsId} onChange={(v) => setForm((p) => ({ ...p, skillsId: v }))} />
          <Field label="Portofolio" value={form.portfolioId} onChange={(v) => setForm((p) => ({ ...p, portfolioId: v }))} />
          <Field label="Kontak" value={form.contactId} onChange={(v) => setForm((p) => ({ ...p, contactId: v }))} />
        </div>
      </LocalizedBlock>
      <LocalizedBlock locale="en" accent="sky">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Home" value={form.homeEn} onChange={(v) => setForm((p) => ({ ...p, homeEn: v }))} />
          <Field label="About" value={form.aboutEn} onChange={(v) => setForm((p) => ({ ...p, aboutEn: v }))} />
          <Field label="Skills" value={form.skillsEn} onChange={(v) => setForm((p) => ({ ...p, skillsEn: v }))} />
          <Field label="Portfolio" value={form.portfolioEn} onChange={(v) => setForm((p) => ({ ...p, portfolioEn: v }))} />
          <Field label="Contact" value={form.contactEn} onChange={(v) => setForm((p) => ({ ...p, contactEn: v }))} />
        </div>
      </LocalizedBlock>
    </SectionWrapper>
  );
}

// ─── Contact Editor ──────────────────────────────────────────

function ContactEditor({ data }: { data: SiteContentGrouped | null }) {
  const idT = data?.localized?.["id"] ?? {};
  const enT = data?.localized?.["en"] ?? {};
  const [form, setForm] = useState({
    titleId: idT.title ?? "",
    titleEn: enT.title ?? "",
    title_form_1Id: idT.title_form_1 ?? "",
    title_form_1En: enT.title_form_1 ?? "",
    title_form_2Id: idT.title_form_2 ?? "",
    title_form_2En: enT.title_form_2 ?? "",
    title_form_3Id: idT.title_form_3 ?? "",
    title_form_3En: enT.title_form_3 ?? "",
    submitId: idT.submit ?? "",
    submitEn: enT.submit ?? "",
  });
  const [isSaving, startSave] = useTransition();

  useEffect(() => {
    if (!data) return;
    const idT = data.localized?.["id"] ?? {};
    const enT = data.localized?.["en"] ?? {};
    setForm({
      titleId: idT.title ?? "",
      titleEn: enT.title ?? "",
      title_form_1Id: idT.title_form_1 ?? "",
      title_form_1En: enT.title_form_1 ?? "",
      title_form_2Id: idT.title_form_2 ?? "",
      title_form_2En: enT.title_form_2 ?? "",
      title_form_3Id: idT.title_form_3 ?? "",
      title_form_3En: enT.title_form_3 ?? "",
      submitId: idT.submit ?? "",
      submitEn: enT.submit ?? "",
    });
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      try {
        await saveSection("contact", [
          { key: "title", locale: "id", value: form.titleId },
          { key: "title", locale: "en", value: form.titleEn },
          { key: "title_form_1", locale: "id", value: form.title_form_1Id },
          { key: "title_form_1", locale: "en", value: form.title_form_1En },
          { key: "title_form_2", locale: "id", value: form.title_form_2Id },
          { key: "title_form_2", locale: "en", value: form.title_form_2En },
          { key: "title_form_3", locale: "id", value: form.title_form_3Id },
          { key: "title_form_3", locale: "en", value: form.title_form_3En },
          { key: "submit", locale: "id", value: form.submitId },
          { key: "submit", locale: "en", value: form.submitEn },
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
    brandName: g.brandName ?? "",
    logoImage: g.logoImage ?? "",
    instagramUrl: g.instagramUrl ?? "",
    githubUrl: g.githubUrl ?? "",
    linkedinUrl: g.linkedinUrl ?? "",
  });
  const [isSaving, startSave] = useTransition();
  // File logo yang dipilih — diupload saat Save (deferred)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!data) return;
    const g = data.global ?? {};
    setForm({ brandName: g.brandName ?? "", logoImage: g.logoImage ?? "", instagramUrl: g.instagramUrl ?? "", githubUrl: g.githubUrl ?? "", linkedinUrl: g.linkedinUrl ?? "" });
    setPendingLogoFile(null);
  }, [data]);

  const handleSave = () => {
    startSave(async () => {
      // URL image baru yang terlanjur diupload — untuk rollback jika submit gagal
      let uploadedNewUrl: string | null = null;

      try {
        // 1. Upload pending logo dulu (jika ada) — file lama belum dihapus
        let logoImage = form.logoImage;
        if (pendingLogoFile) {
          const uploaded = await uploadImageFile(pendingLogoFile, "navbar");
          uploadedNewUrl = uploaded;
          logoImage = uploaded;
        }

        // 2. Submit data
        await saveSection("navbar", [
          { key: "brandName", locale: "", value: form.brandName },
          { key: "logoImage", locale: "", value: logoImage },
          { key: "instagramUrl", locale: "", value: form.instagramUrl },
          { key: "githubUrl", locale: "", value: form.githubUrl },
          { key: "linkedinUrl", locale: "", value: form.linkedinUrl },
        ]);

        // 3. Submit sukses: hapus file lama yang diganti dengan yang baru
        if (uploadedNewUrl && form.logoImage && form.logoImage !== uploadedNewUrl) {
          await deleteImageByUrl(form.logoImage);
        }
        // Sync URL baru ke form state supaya save berikutnya tidak menimpa dengan URL lama
        setForm((p) => ({ ...p, logoImage }));
        setPendingLogoFile(null);
        toast.success("Navbar content saved!");
      } catch (err) {
        // 4. ROLLBACK: hapus image baru jika submit gagal
        if (uploadedNewUrl) {
          await deleteImageByUrl(uploadedNewUrl);
        }
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
    <SectionWrapper title="Navbar" onSave={handleSave} isSaving={isSaving}>
      <SeparateBlock title="Brand Info">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Brand Name" value={form.brandName} onChange={(v) => setForm((p) => ({ ...p, brandName: v }))} />
          <div className="space-y-1.5">
            <Label className="text-xs text-black">Logo Image</Label>
            <ImageUploader folder="navbar" currentUrl={form.logoImage} onUrlChange={(url) => setForm((p) => ({ ...p, logoImage: url }))} onPendingFile={setPendingLogoFile} label="Upload navbar logo ke MinIO/CDN (otomatis saat Save)" />
          </div>
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
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <Button onClick={onSave} disabled={isSaving} size="sm" className="rounded-lg border border-black/10 bg-amber-400 text-black font-bold hover:bg-amber-300">
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function LocalizedBlock({ locale, accent, children }: { locale: string; accent: string; children: React.ReactNode }) {
  const color = accent === "amber" ? "text-amber-600" : "text-sky-600";
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2 text-black font-semibold">
        <Globe2 className={`h-4 w-4 ${color}`} />
        {locale === "id" ? "Bahasa Indonesia" : "English"}
      </div>
      {children}
    </div>
  );
}

function SeparateBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2 text-black font-semibold">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-black">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="border border-black/10 bg-white text-black h-9 placeholder:text-black/40" />
    </div>
  );
}

function CompactField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-black text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-black/10 bg-white h-8 text-sm text-black placeholder:text-black/40" />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-black">{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="border border-black/10 bg-white text-black min-h-25 placeholder:text-black/40" />
    </div>
  );
}

// ─── Main Exported Component ─────────────────────────────────

const SECTIONS = [
  { id: "banner", label: "Banner", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "navbar", label: "Navbar", icon: Navigation },
  { id: "footer", label: "Footer", icon: FileText },
  { id: "navhome", label: "NavHome", icon: Puzzle },
] as const;

export type SiteContentSectionId = "banner" | "about" | "contact" | "navbar" | "navhome" | "footer";

type SiteContentManagerProps = {
  locale: string;
  defaultSection?: SiteContentSectionId;
};

export function SiteContentManager({ locale, defaultSection }: SiteContentManagerProps) {
  const [activeSection, setActiveSection] = useState<string>(defaultSection ?? "banner");
  const [data, setData] = useState<Record<string, SiteContentGrouped> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/site-content?locale=${locale}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [locale]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const renderEditor = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
            <p className="text-sm text-black">Memuat konten...</p>
          </div>
        </div>
      );
    }
    const sectionData = data?.[activeSection] ?? null;
    switch (activeSection) {
      case "banner":
        return <BannerEditor data={sectionData} locale={locale} />;
      case "about":
        return <AboutEditor data={sectionData} />;
      case "contact":
        return <ContactEditor data={sectionData} />;
      case "navbar":
        return <NavbarEditor data={sectionData} />;
      case "footer":
        return <FooterEditor data={sectionData} />;
      case "navhome":
        return <NavHomeEditor data={sectionData} />;
      default:
        return null;
    }
  };

  return (
    <div id="content-editor" className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="border-b border-black/10 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Content Editor</p>
            <h2 className="mt-1 text-xl font-semibold text-black">Landing Page Content</h2>
            <p className="mt-0.5 text-sm text-black">Manage all landing page content here. Changes appear on the main page immediately.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-black/10 px-5 py-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${activeSection === section.id ? "border border-black/10 bg-amber-400 font-bold text-black" : "text-black hover:text-black hover:bg-black/5"}`}
          >
            <section.icon className="h-4 w-4" /> {section.label}
          </button>
        ))}
      </div>
      <div className="p-5">{renderEditor()}</div>
    </div>
  );
}
