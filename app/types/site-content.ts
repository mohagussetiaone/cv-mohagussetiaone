export type SiteContentSection = "banner" | "about" | "skills" | "contact" | "navbar" | "works" | "footer" | "navhome" | "certificates" | "education";

export interface SiteContentRecord {
  id: string;
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
  id: string;
  name: string;
  image: string;
  bgColor: string;
  textColor: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  type: string;
  startDate: string;
  endDate: string;
  description: string | null;
  logo: string | null;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  logo?: string | null;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string | null;
  expiryDate?: string | null;
  credentialUrl?: string | null;
  logo?: string | null;
}

export interface SectionSettings {
  localized: Record<string, Record<string, string>>;
}

export interface SectionContentResponse<T> {
  items: T[];
  settings: SectionSettings;
}

export interface WorksData {
  experiences: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}
