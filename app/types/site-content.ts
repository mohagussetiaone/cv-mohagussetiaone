export type SiteContentSection = "banner" | "about" | "skills" | "contact" | "navbar";

export interface SiteContentRecord {
  id: number;
  section: SiteContentSection;
  key: string;
  locale: string;
  value: string;
  sortOrder: number;
}

export type SiteContentMap = Record<string, string>;

export interface SiteContentGrouped {
  localized: Record<string, SiteContentMap>; // locale -> key -> value
  global: SiteContentMap; // key -> value
}

export interface SkillItem {
  name: string;
  image: string;
  bgColor: string;
  textColor: string;
}
