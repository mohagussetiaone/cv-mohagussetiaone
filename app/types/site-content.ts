export type SiteContentSection = "banner" | "about" | "skills" | "contact" | "navbar" | "works" | "footer" | "navhome" | "certificates" | "education";

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

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
  logo?: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  logo?: string;
}

export interface WorksData {
  experiences: WorkExperience[];
  education: Education[];
  certifications: Certification[];
}
