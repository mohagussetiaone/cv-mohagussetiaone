import { prisma } from "@/lib/prisma";

export type SectionKind = "skills" | "works" | "certificates" | "education";

export const SECTION_KINDS: readonly SectionKind[] = ["skills", "works", "certificates", "education"] as const;

export function isSectionKind(value: string): value is SectionKind {
  return (SECTION_KINDS as readonly string[]).includes(value);
}

export function getSectionSettings(section: SectionKind) {
  return prisma.sectionText.findMany({
    where: { section },
    orderBy: { sortOrder: "asc" },
  });
}

export type SectionTextEntry = { key: string; locale: string; value: string };

export async function upsertSectionSettings(section: SectionKind, entries: SectionTextEntry[]) {
  for (const entry of entries) {
    await prisma.sectionText.upsert({
      where: {
        section_key_locale: {
          section,
          key: entry.key,
          locale: entry.locale,
        },
      },
      create: {
        section,
        key: entry.key,
        locale: entry.locale,
        value: entry.value,
      },
      update: {
        value: entry.value,
      },
    });
  }
}

export async function listSectionItems(section: SectionKind) {
  switch (section) {
    case "skills":
      return prisma.skillItem.findMany({ orderBy: { sortOrder: "asc" } });
    case "works":
      return prisma.workExperience.findMany({ orderBy: { sortOrder: "asc" } });
    case "certificates":
      return prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } });
    case "education":
      return prisma.educationItem.findMany({ orderBy: { sortOrder: "asc" } });
  }
}

export async function getSectionPayload(section: SectionKind) {
  const [items, settingsRows] = await Promise.all([listSectionItems(section), getSectionSettings(section)]);
  const localized: Record<string, Record<string, string>> = {};
  for (const row of settingsRows) {
    if (!localized[row.locale]) {
      localized[row.locale] = {};
    }
    localized[row.locale][row.key] = row.value;
  }
  return { items, settings: { localized } };
}

export async function getNextSortOrder(section: SectionKind) {
  let max: number | null = 0;
  switch (section) {
    case "skills":
      max = (await prisma.skillItem.aggregate({ _max: { sortOrder: true } }))._max.sortOrder;
      break;
    case "works":
      max = (await prisma.workExperience.aggregate({ _max: { sortOrder: true } }))._max.sortOrder;
      break;
    case "certificates":
      max = (await prisma.certificate.aggregate({ _max: { sortOrder: true } }))._max.sortOrder;
      break;
    case "education":
      max = (await prisma.educationItem.aggregate({ _max: { sortOrder: true } }))._max.sortOrder;
      break;
  }
  return (max ?? 0) + 1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSectionItem(section: SectionKind, data: Record<string, any>) {
  const sortOrder = await getNextSortOrder(section);
  switch (section) {
    case "skills":
      return prisma.skillItem.create({
        data: { name: data.name, image: data.image, bgColor: data.bgColor, textColor: data.textColor, sortOrder },
      });
    case "works":
      return prisma.workExperience.create({
        data: {
          company: data.company,
          position: data.position,
          location: data.location ?? null,
          type: data.type ?? "Full-time",
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "Present",
          description: data.description ?? null,
          logo: data.logo ?? null,
          sortOrder,
        },
      });
    case "certificates":
      return prisma.certificate.create({
        data: {
          name: data.name,
          organization: data.organization,
          issueDate: data.issueDate ?? null,
          expiryDate: data.expiryDate ?? null,
          credentialUrl: data.credentialUrl ?? null,
          logo: data.logo ?? null,
          sortOrder,
        },
      });
    case "education":
      return prisma.educationItem.create({
        data: {
          school: data.school,
          degree: data.degree,
          field: data.field ?? "",
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "",
          description: data.description ?? null,
          logo: data.logo ?? null,
          sortOrder,
        },
      });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSectionItem(section: SectionKind, id: string, data: Record<string, any>) {
  switch (section) {
    case "skills":
      return prisma.skillItem.update({
        where: { id },
        data: { name: data.name, image: data.image, bgColor: data.bgColor, textColor: data.textColor },
      });
    case "works":
      return prisma.workExperience.update({
        where: { id },
        data: {
          company: data.company,
          position: data.position,
          location: data.location ?? null,
          type: data.type ?? "Full-time",
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "Present",
          description: data.description ?? null,
          logo: data.logo ?? null,
        },
      });
    case "certificates":
      return prisma.certificate.update({
        where: { id },
        data: {
          name: data.name,
          organization: data.organization,
          issueDate: data.issueDate ?? null,
          expiryDate: data.expiryDate ?? null,
          credentialUrl: data.credentialUrl ?? null,
          logo: data.logo ?? null,
        },
      });
    case "education":
      return prisma.educationItem.update({
        where: { id },
        data: {
          school: data.school,
          degree: data.degree,
          field: data.field ?? "",
          startDate: data.startDate ?? "",
          endDate: data.endDate ?? "",
          description: data.description ?? null,
          logo: data.logo ?? null,
        },
      });
  }
}

export async function deleteSectionItem(section: SectionKind, id: string) {
  switch (section) {
    case "skills":
      return prisma.skillItem.delete({ where: { id } });
    case "works":
      return prisma.workExperience.delete({ where: { id } });
    case "certificates":
      return prisma.certificate.delete({ where: { id } });
    case "education":
      return prisma.educationItem.delete({ where: { id } });
  }
}
