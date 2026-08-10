import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const projectData = [
  {
    productId: "d2e8b3c7-5f2a-4e9d-b6c1-3a4d5e6f7a8b",
    sortOrder: 1,
    translations: {
      id: {
        projectName: "Restogemn",
        description: "Platform SaaS untuk restoran yang menyediakan reservasi meja, manajemen menu, dan analitik bisnis dalam satu aplikasi.",
      },
      en: {
        projectName: "Restogemn",
        description: "A SaaS platform for restaurants providing table reservations, menu management, and business analytics in a single application.",
      },
    },
    image: null,
    technologies: ["Next.js", "Tailwind CSS"],
    urlPreview: "https://restogemn.biz.id",
    githubUrl: null,
    figmaUrl: null,
    internal: false,
  },
  {
    productId: "a0f5b1db-9b7f-4af9-a99b-228764f92c0e",
    sortOrder: 2,
    translations: {
      id: {
        projectName: "PT Fortuna Teknik Mandiri",
        description: "Website company profile PT Fortuna Teknik Mandiri, produsen baja fabrikasi, dengan tampilan modern dan responsif untuk menampilkan profil perusahaan serta produk.",
      },
      en: {
        projectName: "PT Fortuna Teknik Mandiri",
        description: "A company profile website for PT Fortuna Teknik Mandiri, a steel fabrication manufacturer, with a modern responsive interface presenting the company profile and products.",
      },
    },
    image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/project/fortuna-teknik-mandiri.png",
    technologies: ["Next.js", "Tailwind CSS"],
    urlPreview: "https://fortuna-teknik-mandiri.vercel.app/",
    githubUrl: "https://github.com/mohagussetiaone/fortuna-teknik-mandiri",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: "bb44b080-1b97-4e28-a182-4081dc0df636",
    sortOrder: 3,
    translations: {
      id: {
        projectName: "Selaras Invitation Raya",
        description: "Platform undangan digital elegan untuk pernikahan, ulang tahun, dan berbagai acara yang responsif dan mudah dibagikan.",
      },
      en: {
        projectName: "Selaras Invitation Raya",
        description: "An elegant digital invitation platform for weddings, birthdays, and various events that is responsive and easy to share.",
      },
    },
    image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/project/selaras-invite.png",
    technologies: ["Next.js", "Tailwind CSS", "Axios", "Supabase", "Prisma"],
    urlPreview: "https://rayainvite.web.id",
    githubUrl: "https://github.com/mohagussetiaone/selarasinvite",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: "58b54a0d-a7c9-4674-895c-e7bc259940e1",
    sortOrder: 4,
    translations: {
      id: {
        projectName: "Tani Deals App",
        description: "Desain aplikasi yang menjembatani petani dan distributor melalui akses pasar yang lebih mudah, solusi pembayaran, dan edukasi pertanian.",
      },
      en: {
        projectName: "Tani Deals App",
        description: "An app design that connects farmers and distributors through easier market access, payment solutions, and agricultural education.",
      },
    },
    image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/project/tanidealsapp.png",
    technologies: ["Figma"],
    urlPreview: "https://www.figma.com/proto/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=7-3&node-type=canvas&t=roF7vYPt7FGuCZPq-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=75%3A2029",
    githubUrl: null,
    figmaUrl: "https://www.figma.com/design/vV1zYKypYPe8bBS5mWyyP8/Tani-Deals-App-UI?node-id=0-1&t=roF7vYPt7FGuCZPq-1",
    internal: false,
  },
];

const categoryNameForProject = (project: { technologies: string[] }) => {
  if (project.technologies.includes("Figma") && project.technologies.length === 1) {
    return "UI/UX Design";
  }
  if (project.technologies.includes("Prisma") || project.technologies.includes("Supabase")) {
    return "Fullstack App";
  }
  return "Frontend App";
};

async function main() {
  const skillNames = Array.from(new Set(projectData.flatMap((project) => project.technologies)));
  const categoryNames = Array.from(new Set(projectData.map(categoryNameForProject)));
  const currentProductIds = projectData.map((project) => project.productId);

  await prisma.project.deleteMany({
    where: { productId: { notIn: currentProductIds } },
  });

  await prisma.skill.createMany({
    data: skillNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  for (const project of projectData) {
    const categoryName = categoryNameForProject(project);

    await prisma.project.upsert({
      where: { productId: project.productId },
      create: {
        productId: project.productId,
        sortOrder: project.sortOrder,
        image: project.image,
        urlPreview: project.urlPreview,
        githubUrl: project.githubUrl,
        figmaUrl: project.figmaUrl,
        internal: project.internal,
        skills: {
          connect: project.technologies.map((name) => ({ name })),
        },
        categories: {
          connect: { name: categoryName },
        },
        translations: {
          create: [
            {
              locale: "id",
              projectName: project.translations.id.projectName,
              description: project.translations.id.description,
            },
            {
              locale: "en",
              projectName: project.translations.en.projectName,
              description: project.translations.en.description,
            },
          ],
        },
      },
      update: {
        sortOrder: project.sortOrder,
        image: project.image,
        urlPreview: project.urlPreview,
        githubUrl: project.githubUrl,
        figmaUrl: project.figmaUrl,
        internal: project.internal,
        skills: {
          set: project.technologies.map((name) => ({ name })),
        },
        categories: {
          set: [{ name: categoryName }],
        },
        translations: {
          deleteMany: {},
          create: [
            {
              locale: "id",
              projectName: project.translations.id.projectName,
              description: project.translations.id.description,
            },
            {
              locale: "en",
              projectName: project.translations.en.projectName,
              description: project.translations.en.description,
            },
          ],
        },
      },
    });
  }
}

// ──────────────────────────────────────────────
// Site Content Seed
// ──────────────────────────────────────────────

const siteContentData: { section: string; key: string; locale: string; value: string; sortOrder: number }[] = [
  // ── Banner (localized) ──
  { section: "banner", key: "greeting", locale: "id", value: "Halo", sortOrder: 1 },
  { section: "banner", key: "greeting", locale: "en", value: "Hello", sortOrder: 1 },
  { section: "banner", key: "name", locale: "id", value: "Nama Saya Moh Agus Setiawan", sortOrder: 2 },
  { section: "banner", key: "name", locale: "en", value: "My Name is Moh Agus Setiawan", sortOrder: 2 },
  {
    section: "banner",
    key: "description",
    locale: "id",
    value:
      "Frontend Developer dengan pengalaman lebih dari 2 tahun yang berfokus pada React.js, siap berkontribusi dalam menciptakan aplikasi website yang responsif dan dinamis menggunakan teknologi modern untuk mencapai solusi bisnis dan pengalaman pengguna yang baik.",
    sortOrder: 3,
  },
  {
    section: "banner",
    key: "description",
    locale: "en",
    value:
      "Frontend Developer with 2+ years specializing in React.js, ready to contribute to creating responsive and dynamic website applications using modern technology, in order to achieve business solutions and good user experience.",
    sortOrder: 3,
  },

  // ── Banner (non-localized) ──
  { section: "banner", key: "email", locale: "", value: "mohagussetiaone@gmail.com", sortOrder: 10 },
  { section: "banner", key: "address", locale: "", value: "Menteng dalam, Kec tebet, Kota Jakarta Selatan", sortOrder: 11 },
  { section: "banner", key: "jobTitle", locale: "", value: "Front End React Developer", sortOrder: 12 },
  { section: "banner", key: "websiteUrl", locale: "", value: "https://mohagussetiaone.my.id", sortOrder: 13 },
  { section: "banner", key: "whatsappNumber", locale: "", value: "6287885159098", sortOrder: 14 },
  { section: "banner", key: "yearsExperience", locale: "", value: "2+", sortOrder: 15 },
  { section: "banner", key: "programmingLanguages", locale: "", value: "2", sortOrder: 16 },
  { section: "banner", key: "developmentProjects", locale: "", value: "8+", sortOrder: 17 },
  { section: "banner", key: "cvFileUrl", locale: "", value: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/CV_2026021211100687.pdf", sortOrder: 18 },
  { section: "banner", key: "bannerImage", locale: "", value: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/profile/mohagus.jpeg", sortOrder: 19 },
  { section: "banner", key: "lets_talk", locale: "id", value: "Mari Mengobrol", sortOrder: 5 },
  { section: "banner", key: "lets_talk", locale: "en", value: "Let's Talk", sortOrder: 5 },
  { section: "banner", key: "years", locale: "id", value: "Tahun", sortOrder: 6 },
  { section: "banner", key: "years", locale: "en", value: "Years", sortOrder: 6 },
  { section: "banner", key: "experience", locale: "id", value: "Pengalaman", sortOrder: 7 },
  { section: "banner", key: "experience", locale: "en", value: "Experience", sortOrder: 7 },
  { section: "banner", key: "programming", locale: "id", value: "Bahasa", sortOrder: 8 },
  { section: "banner", key: "programming", locale: "en", value: "Programming", sortOrder: 8 },
  { section: "banner", key: "language", locale: "id", value: "Pemrograman", sortOrder: 9 },
  { section: "banner", key: "language", locale: "en", value: "Language", sortOrder: 9 },
  { section: "banner", key: "development", locale: "id", value: "Pengembangan", sortOrder: 10 },
  { section: "banner", key: "development", locale: "en", value: "Development", sortOrder: 10 },
  { section: "banner", key: "project", locale: "id", value: "Project", sortOrder: 11 },
  { section: "banner", key: "project", locale: "en", value: "Project", sortOrder: 11 },

  // ── About (localized) ──
  { section: "about", key: "title", locale: "id", value: "Tentang Saya", sortOrder: 1 },
  { section: "about", key: "title", locale: "en", value: "About Me", sortOrder: 1 },
  {
    section: "about",
    key: "description",
    locale: "id",
    value:
      "Frontend Developer dengan pengalaman lebih dari 2 tahun yang berfokus pada React.js, siap berkontribusi dalam menciptakan aplikasi website yang responsif dan dinamis menggunakan teknologi modern untuk mencapai solusi bisnis dan pengalaman pengguna yang baik.",
    sortOrder: 2,
  },
  {
    section: "about",
    key: "description",
    locale: "en",
    value:
      "Frontend Developer with 2+ years specializing in React.js, ready to contribute to creating responsive and dynamic website applications using modern technology, in order to achieve business solutions and good user experience.",
    sortOrder: 2,
  },
  {
    section: "about",
    key: "description_1",
    locale: "id",
    value:
      "Saya memiliki kemampuan untuk bekerja secara kolaboratif dalam tim lintas fungsi, beradaptasi dengan cepat terhadap teknologi baru, dan menjaga fokus pada penyelesaian masalah dengan solusi yang efektif.\n\nDi luar pekerjaan, saya aktif memperdalam pengetahuan di bidang pengembangan web, menjaga kebugaran melalui olahraga bulu tangkis, dan mengeksplorasi tantangan baru yang memperluas perspektif serta keterampilan saya.",
    sortOrder: 3,
  },
  {
    section: "about",
    key: "description_1",
    locale: "en",
    value:
      "I have the ability to work collaboratively in cross-functional teams, adapt quickly to new technologies, and maintain focus on solving problems with effective solutions.\n\nOutside of work, I actively deepen my knowledge in the field of web development, maintain fitness through badminton, and explore new challenges that broaden my perspective and skills.",
    sortOrder: 3,
  },

  // ── Contact (localized) ──
  { section: "contact", key: "title", locale: "id", value: "Kirim Saya Pesan", sortOrder: 1 },
  { section: "contact", key: "title", locale: "en", value: "Send Me A Message", sortOrder: 1 },
  { section: "contact", key: "title_form_1", locale: "id", value: "Nama Anda", sortOrder: 2 },
  { section: "contact", key: "title_form_1", locale: "en", value: "Your Name", sortOrder: 2 },
  { section: "contact", key: "title_form_2", locale: "id", value: "Email Anda", sortOrder: 3 },
  { section: "contact", key: "title_form_2", locale: "en", value: "Your Email", sortOrder: 3 },
  { section: "contact", key: "title_form_3", locale: "id", value: "Pesan Anda", sortOrder: 4 },
  { section: "contact", key: "title_form_3", locale: "en", value: "Your Message", sortOrder: 4 },
  { section: "contact", key: "submit", locale: "id", value: "Kirim", sortOrder: 5 },
  { section: "contact", key: "submit", locale: "en", value: "Submit", sortOrder: 5 },

  // ── Navbar (non-localized) ──
  { section: "navbar", key: "brandName", locale: "", value: "Moh Agus Setiawan", sortOrder: 1 },
  { section: "navbar", key: "logoImage", locale: "", value: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/logo/mohagus.jpg", sortOrder: 2 },
  { section: "navbar", key: "instagramUrl", locale: "", value: "https://www.instagram.com/mohagussetiaone", sortOrder: 3 },
  { section: "navbar", key: "githubUrl", locale: "", value: "https://github.com/mohagussetiaone", sortOrder: 4 },
  { section: "navbar", key: "linkedinUrl", locale: "", value: "https://www.linkedin.com/in/moh-agus-setiawan-464960167/", sortOrder: 5 },

  // ── Footer (localized) ──
  { section: "footer", key: "copyrightText", locale: "id", value: "Hak Cipta Dilindungi.", sortOrder: 1 },
  { section: "footer", key: "copyrightText", locale: "en", value: "All Rights Reserved.", sortOrder: 1 },
  { section: "footer", key: "brandName", locale: "", value: "Moh Agus Setiawan", sortOrder: 2 },
  { section: "footer", key: "brandUrl", locale: "", value: "https://mohagussetiaone.my.id", sortOrder: 3 },

  // ── NavHome (localized) ──
  { section: "navhome", key: "home", locale: "id", value: "Beranda", sortOrder: 1 },
  { section: "navhome", key: "home", locale: "en", value: "Home", sortOrder: 1 },
  { section: "navhome", key: "about", locale: "id", value: "Tentang", sortOrder: 2 },
  { section: "navhome", key: "about", locale: "en", value: "About", sortOrder: 2 },
  { section: "navhome", key: "skills", locale: "id", value: "Kemampuan", sortOrder: 3 },
  { section: "navhome", key: "skills", locale: "en", value: "Skills", sortOrder: 3 },
  { section: "navhome", key: "portfolio", locale: "id", value: "Portofolio", sortOrder: 4 },
  { section: "navhome", key: "portfolio", locale: "en", value: "Portfolio", sortOrder: 4 },
  { section: "navhome", key: "contact", locale: "id", value: "Kontak", sortOrder: 5 },
  { section: "navhome", key: "contact", locale: "en", value: "Contact", sortOrder: 5 },
];

async function seedSiteContent() {
  for (const item of siteContentData) {
    await prisma.siteContent.upsert({
      where: {
        section_key_locale: {
          section: item.section,
          key: item.key,
          locale: item.locale,
        },
      },
      create: item,
      update: {
        value: item.value,
        sortOrder: item.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${siteContentData.length} site content entries seeded`);
}

// ──────────────────────────────────────────────
// Dedicated Section Content Seed
// (skills, works, certificates, education)
// ──────────────────────────────────────────────

const sectionTextData: { section: string; key: string; locale: string; value: string; sortOrder: number }[] = [
  { section: "skills", key: "title", locale: "id", value: "Ketrampilan", sortOrder: 1 },
  { section: "skills", key: "title", locale: "en", value: "Skills", sortOrder: 1 },
  { section: "skills", key: "description", locale: "id", value: "Saya berusaha untuk tidak pernah berhenti belajar dan berkembang", sortOrder: 2 },
  { section: "skills", key: "description", locale: "en", value: "I am striving to never stop learning and improving", sortOrder: 2 },
  { section: "works", key: "title", locale: "id", value: "Pengalaman Kerja", sortOrder: 1 },
  { section: "works", key: "title", locale: "en", value: "Work Experience", sortOrder: 1 },
  { section: "works", key: "description", locale: "id", value: "Perjalanan karir profesional saya sebagai Frontend Developer", sortOrder: 2 },
  { section: "works", key: "description", locale: "en", value: "My professional career journey as a Frontend Developer", sortOrder: 2 },
  { section: "works", key: "experience_label", locale: "id", value: "Pengalaman", sortOrder: 7 },
  { section: "works", key: "experience_label", locale: "en", value: "Experience", sortOrder: 7 },
  { section: "certificates", key: "title", locale: "id", value: "Sertifikasi", sortOrder: 1 },
  { section: "certificates", key: "title", locale: "en", value: "Certifications", sortOrder: 1 },
  { section: "certificates", key: "description", locale: "id", value: "Sertifikasi profesional yang telah saya raih", sortOrder: 2 },
  { section: "certificates", key: "description", locale: "en", value: "Professional certifications I have achieved", sortOrder: 2 },
  { section: "education", key: "title", locale: "id", value: "Pendidikan", sortOrder: 1 },
  { section: "education", key: "title", locale: "en", value: "Education", sortOrder: 1 },
  { section: "education", key: "description", locale: "id", value: "Riwayat pendidikan formal saya", sortOrder: 2 },
  { section: "education", key: "description", locale: "en", value: "My formal education background", sortOrder: 2 },
];

const skillItemsData = [
  { name: "HTML", image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/skills/html5.png", bgColor: "#E54F26", textColor: "#E54F26" },
  { name: "CSS", image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/skills/css.png", bgColor: "#1572B6", textColor: "#1572B6" },
  { name: "JAVASCRIPT", image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/skills/js.png", bgColor: "#F7DF1E", textColor: "#F7DF1E" },
  { name: "REACT JS", image: "https://cdn.mohagussetiaone.my.id/mohagussetiaone/assets/image/skills/react.png", bgColor: "#28A9E0", textColor: "#28A9E0" },
  { name: "TYPESCRIPT", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/typescript/typescript-original.svg", bgColor: "#3178C6", textColor: "#3178C6" },
  { name: "VITE", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/vite/vite-original.svg", bgColor: "#646CFF", textColor: "#646CFF" },
  { name: "NEXTJS", image: "https://cdn.simpleicons.org/nextdotjs/ffffff", bgColor: "#000000", textColor: "#000000" },
  { name: "VUE JS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/vuejs/vuejs-original.svg", bgColor: "#42B883", textColor: "#42B883" },
  { name: "EXPRESS JS", image: "https://cdn.simpleicons.org/express/ffffff", bgColor: "#000000", textColor: "#000000" },
  { name: "NEST JS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/nestjs/nestjs-original.svg", bgColor: "#E0234E", textColor: "#E0234E" },
  { name: "GOLANG", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/go/go-original.svg", bgColor: "#00ADD8", textColor: "#00ADD8" },
  { name: "TAILWINDCSS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/tailwindcss/tailwindcss-original.svg", bgColor: "#38BDF8", textColor: "#38BDF8" },
  { name: "BOOTSTRAP", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/bootstrap/bootstrap-original.svg", bgColor: "#7952B3", textColor: "#7952B3" },
  { name: "MySQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/mysql/mysql-original.svg", bgColor: "#4479A1", textColor: "#4479A1" },
  { name: "POSTGRESQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/postgresql/postgresql-original.svg", bgColor: "#336791", textColor: "#336791" },
  { name: "GITHUB", image: "https://cdn.simpleicons.org/github/ffffff", bgColor: "#181717", textColor: "#181717" },
  { name: "GITLAB", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/gitlab/gitlab-original.svg", bgColor: "#FC6D26", textColor: "#FC6D26" },
  { name: "VITEST", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/vitest/vitest-original.svg", bgColor: "#729B1B", textColor: "#729B1B" },
  { name: "ZUSTAND", image: "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons/zustand/zustand-original.svg", bgColor: "#A020F0", textColor: "#A020F0" },
];

const workExperienceData = [
  {
    company: "PT Solusi Aplikasi Andalan Semesta",
    position: "Frontend Developer",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    startDate: "2023-09",
    endDate: "Present",
    description:
      "Developed and maintained multiple internal and customer-facing web platforms, including:\n- Nethome Client Area (nethome.id) for customer account management, product purchases, internet usage monitoring, and monthly billing.\n- Web OLT Dashboard, a Network Operation Center (NOC) management platform for OLT management, asset monitoring, maintenance, network configuration, client provisioning, client synchronization, inventory management, reporting, system logging, and role-based access control (RBAC).\n- Customer Data Management (tachyon.id) to improve data accuracy, consistency, and asset maintenance processes.\n- Remala Ticketing System for the Diskominfo project to manage issue reporting, ticket tracking, customer service workflows, and resolution processes.\n\nImplemented multi-tenant architecture supporting KSO and Non-KSO company structures and business processes.\nCollaborated with UI/UX designers and backend developers to transform business requirements and design prototypes into responsive, interactive, and maintainable web applications.\nOptimized application code and implemented structured development practices to improve performance, scalability, maintainability, and long-term system reliability.\nPerformed testing, debugging, and issue resolution to ensure application stability and efficient delivery.",
    logo: "",
  },
  {
    company: "PT Whiteopen Teknologi",
    position: "IT Staff Support",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    startDate: "2021-08",
    endDate: "2022-12",
    description:
      "Supporting Legacy System Migration activities for Implementation (Asian Toyota Lean Accounting System) Project SAP R3 to SAP Hana at Toyota Indonesia as responsible for:\n- Admin for Jira Software Issue tracking and monitoring.\n- Managing daily reporting of Cutover Rehearsal progress and the IT Team's Cutover Task List.\n- Handling legacy system support as a System Admin, including:\n  1. Creating backups and restoring folders, file servers, setting up internet information servers, and authorizing users.\n  2. Creating database links, granting access to users, tables, and stored procedures using SQL Server Management Studio.\n  3. Creating SQL Job Schedulers on the database server and Windows Job Schedulers on the App Server.",
    logo: "",
  },
  {
    company: "Freelance Web Developer Kaftan Team",
    position: "Frontend Developer",
    location: "Remote",
    type: "Freelance",
    startDate: "2025-12",
    endDate: "2026-06",
    description:
      "Developing website kaftan brautmode:\n1. Landing page https://kaftan-brautmode.de/de with catalog, schedule, and language switch using next-intl.\n2. Menu dashboard admin kaftan for appointment user such as detail appointment, reschedule appointment, schedule working kaftan, manage calendar for appointment list.\n3. Menu dashboard user for user managing, reschedule appointment, activity, and system notification.",
    logo: "",
  },
];

const certificatesData = [
  {
    name: "Belajar Dasar-Dasar DevOps",
    organization: "Dicoding Indonesia",
    issueDate: "2024-09",
    expiryDate: "2027-09",
    credentialUrl: "https://www.dicoding.com/certificates/1RXY24RL3XVM",
  },
  {
    name: "Belajar Membuat Aplikasi Back-End untuk Pemula",
    organization: "Dicoding Indonesia",
    issueDate: "2022-12",
    expiryDate: "2025-12",
    credentialUrl: "https://www.dicoding.com/certificates/L4PQ655Q4PO1",
  },
  {
    name: "Cloud Practitioner Essentials (Belajar Dasar AWS Cloud)",
    organization: "Dicoding Indonesia",
    issueDate: "2022-10",
    expiryDate: "2025-10",
    credentialUrl: "https://www.dicoding.com/certificates/72ZD9Q95JPYW",
  },
  {
    name: "Belajar Dasar Pemrograman JavaScript",
    organization: "Dicoding Indonesia",
    issueDate: "2022-09",
    expiryDate: "2025-09",
    credentialUrl: "https://www.dicoding.com/certificates/1OP86QJY8XQK",
  },
  {
    name: "Belajar Dasar Pemrograman Web",
    organization: "Dicoding Indonesia",
    issueDate: "2022-08",
    expiryDate: "2025-08",
    credentialUrl: "https://www.dicoding.com/certificates/JLX1GEQM2Z72",
  },
  {
    name: "Linux Administration Batch VII Training",
    organization: "IT Group, Inc.",
    issueDate: "2021-07",
    expiryDate: "",
    credentialUrl: "",
  },
  {
    name: "Kursus SQL",
    organization: "Progate",
    issueDate: "2021-07",
    expiryDate: "",
    credentialUrl: "",
  },
  {
    name: "Kursus Python",
    organization: "Progate",
    issueDate: "2021-07",
    expiryDate: "",
    credentialUrl: "",
  },
  {
    name: "Kursus Node.js Dasar",
    organization: "Progate",
    issueDate: "2021-06",
    expiryDate: "",
    credentialUrl: "",
  },
  {
    name: "Kursus Java Script Pengembangan Web",
    organization: "Progate",
    issueDate: "2021-06",
    expiryDate: "",
    credentialUrl: "",
  },
];

const educationItemsData = [
  {
    school: "Universitas Gunadarma",
    degree: "Bachelor",
    field: "Information System",
    startDate: "2021",
    endDate: "2023",
    description: "GPA 3.21. Focused on information systems, software development, and web technologies.",
    logo: "",
  },
  {
    school: "Jemblongan Valley Community",
    degree: "Bootcamp",
    field: "Fullstack Developer",
    startDate: "2023",
    endDate: "2023",
    description: "Intensive fullstack developer training covering frontend and backend web development.",
    logo: "",
  },
  {
    school: "Code ID",
    degree: "Bootcamp",
    field: "Fullstack Developer",
    startDate: "",
    endDate: "",
    description: "Fullstack developer program covering web development fundamentals and build tools.",
    logo: "",
  },
];

// ──────────────────────────────────────────────
// Per-item localized field data (works, education, certificates)
// Key: item_{index}.{field}  (index = 1-based sort order)
// ──────────────────────────────────────────────
const sectionItemLocalizedData: { section: string; key: string; locale: string; value: string; sortOrder: number }[] = [
  // ── Works (WorkExperience) description ──
  {
    section: "works", key: "item_1.description", locale: "en",
    value: "Developed and maintained multiple internal and customer-facing web platforms, including:\n- Nethome Client Area (nethome.id) for customer account management, product purchases, internet usage monitoring, and monthly billing.\n- Web OLT Dashboard, a Network Operation Center (NOC) management platform for OLT management, asset monitoring, maintenance, network configuration, client provisioning, client synchronization, inventory management, reporting, system logging, and role-based access control (RBAC).\n- Customer Data Management (tachyon.id) to improve data accuracy, consistency, and asset maintenance processes.\n- Remala Ticketing System for the Diskominfo project to manage issue reporting, ticket tracking, customer service workflows, and resolution processes.\n\nImplemented multi-tenant architecture supporting KSO and Non-KSO company structures and business processes.\nCollaborated with UI/UX designers and backend developers to transform business requirements and design prototypes into responsive, interactive, and maintainable web applications.\nOptimized application code and implemented structured development practices to improve performance, scalability, maintainability, and long-term system reliability.\nPerformed testing, debugging, and issue resolution to ensure application stability and efficient delivery.",
    sortOrder: 20,
  },
  {
    section: "works", key: "item_1.description", locale: "id",
    value: "Mengembangkan dan memelihara berbagai platform web internal dan untuk pelanggan, termasuk:\n- Nethome Client Area (nethome.id) untuk pengelolaan akun pelanggan, pembelian produk, pemantauan pemakaian internet, dan penagihan bulanan.\n- Web OLT Dashboard, platform pengelolaan Network Operation Center (NOC) untuk manajemen OLT, pemantauan aset, pemeliharaan, konfigurasi jaringan, penyediaan klien, sinkronisasi klien, manajemen inventaris, pelaporan, pencatatan sistem, dan kontrol akses berbasis peran (RBAC).\n- Customer Data Management (tachyon.id) untuk meningkatkan akurasi data, konsistensi, dan proses pemeliharaan aset.\n- Remala Ticketing System untuk proyek Diskominfo untuk mengelola pelaporan masalah, pelacakan tiket, alur kerja layanan pelanggan, dan proses penyelesaian.\n\nMengimplementasikan arsitektur multi-tenant yang mendukung struktur dan proses bisnis perusahaan KSO dan Non-KSO.\nBerkolaborasi dengan desainer UI/UX dan pengembang backend untuk mengubah kebutuhan bisnis dan prototipe desain menjadi aplikasi web yang responsif, interaktif, dan mudah dipelihara.\nMengoptimalkan kode aplikasi dan menerapkan praktik pengembangan terstruktur untuk meningkatkan performa, skalabilitas, kemudahan pemeliharaan, dan keandalan sistem jangka panjang.\nMelakukan pengujian, debugging, dan penyelesaian masalah untuk memastikan stabilitas dan efisiensi pengiriman aplikasi.",
    sortOrder: 20,
  },
  {
    section: "works", key: "item_2.description", locale: "en",
    value: "Supporting Legacy System Migration activities for Implementation (Asian Toyota Lean Accounting System) Project SAP R3 to SAP Hana at Toyota Indonesia as responsible for:\n- Admin for Jira Software Issue tracking and monitoring.\n- Managing daily reporting of Cutover Rehearsal progress and the IT Team's Cutover Task List.\n- Handling legacy system support as a System Admin, including:\n  1. Creating backups and restoring folders, file servers, setting up internet information servers, and authorizing users.\n  2. Creating database links, granting access to users, tables, and stored procedures using SQL Server Management Studio.\n  3. Creating SQL Job Schedulers on the database server and Windows Job Schedulers on the App Server.",
    sortOrder: 21,
  },
  {
    section: "works", key: "item_2.description", locale: "id",
    value: "Mendukung aktivitas migrasi Legacy System untuk Implementasi (Asian Toyota Lean Accounting System) Proyek SAP R3 ke SAP Hana di Toyota Indonesia dengan tanggung jawab:\n- Admin untuk pelacakan dan pemantauan isu Jira Software.\n- Mengelola pelaporan harian tentang progres Cutover Rehearsal dan Daftar Tugas Cutover Tim IT.\n- Menangani dukungan sistem legacy sebagai System Admin, termasuk:\n  1. Membuat backup dan memulihkan folder, file server, menyiapkan internet information server, dan mengizinkan akses pengguna.\n  2. Membuat database link, memberikan akses kepada pengguna, tabel, dan stored procedure menggunakan SQL Server Management Studio.\n  3. Membuat SQL Job Scheduler di server database dan Windows Job Scheduler di App Server.",
    sortOrder: 21,
  },
  {
    section: "works", key: "item_3.description", locale: "en",
    value: "Developing website kaftan brautmode:\n1. Landing page https://kaftan-brautmode.de/de with catalog, schedule, and language switch using next-intl.\n2. Menu dashboard admin kaftan for appointment user such as detail appointment, reschedule appointment, schedule working kaftan, manage calendar for appointment list.\n3. Menu dashboard user for user managing, reschedule appointment, activity, and system notification.",
    sortOrder: 22,
  },
  {
    section: "works", key: "item_3.description", locale: "id",
    value: "Mengembangkan website kaftan brautmode:\n1. Landing page https://kaftan-brautmode.de/de dengan katalog, jadwal, dan pengalihan bahasa menggunakan next-intl.\n2. Menu dashboard admin kaftan untuk janji temu pengguna seperti detail janji temu, penjadwalan ulang janji temu, jadwal kerja kaftan, dan pengelolaan kalender daftar janji temu.\n3. Menu dashboard user untuk pengelolaan pengguna, penjadwalan ulang janji temu, aktivitas, dan notifikasi sistem.",
    sortOrder: 22,
  },

  // ── Education (EducationItem) field & description ──
  { section: "education", key: "item_1.field", locale: "en", value: "Information System", sortOrder: 30 },
  { section: "education", key: "item_1.field", locale: "id", value: "Sistem Informasi", sortOrder: 30 },
  { section: "education", key: "item_1.description", locale: "en", value: "GPA 3.21. Focused on information systems, software development, and web technologies.", sortOrder: 31 },
  { section: "education", key: "item_1.description", locale: "id", value: "IPK 3.21. Fokus pada sistem informasi, pengembangan perangkat lunak, dan teknologi web.", sortOrder: 31 },
  { section: "education", key: "item_2.field", locale: "en", value: "Fullstack Developer", sortOrder: 32 },
  { section: "education", key: "item_2.field", locale: "id", value: "Fullstack Developer", sortOrder: 32 },
  { section: "education", key: "item_2.description", locale: "en", value: "Intensive fullstack developer training covering frontend and backend web development.", sortOrder: 33 },
  { section: "education", key: "item_2.description", locale: "id", value: "Pelatihan fullstack developer intensif yang mencakup pengembangan web frontend dan backend.", sortOrder: 33 },
  { section: "education", key: "item_3.field", locale: "en", value: "Fullstack Developer", sortOrder: 34 },
  { section: "education", key: "item_3.field", locale: "id", value: "Fullstack Developer", sortOrder: 34 },
  { section: "education", key: "item_3.description", locale: "en", value: "Fullstack developer program covering web development fundamentals and build tools.", sortOrder: 35 },
  { section: "education", key: "item_3.description", locale: "id", value: "Program fullstack developer yang mencakup dasar-dasar pengembangan web dan build tools.", sortOrder: 35 },

  // ── Certificates (Certificate) name ──
  { section: "certificates", key: "item_1.name", locale: "en", value: "DevOps Fundamentals", sortOrder: 40 },
  { section: "certificates", key: "item_1.name", locale: "id", value: "Belajar Dasar-Dasar DevOps", sortOrder: 40 },
  { section: "certificates", key: "item_2.name", locale: "en", value: "Build Back-End Applications for Beginners", sortOrder: 41 },
  { section: "certificates", key: "item_2.name", locale: "id", value: "Belajar Membuat Aplikasi Back-End untuk Pemula", sortOrder: 41 },
  { section: "certificates", key: "item_3.name", locale: "en", value: "Cloud Practitioner Essentials (AWS Cloud Basics)", sortOrder: 42 },
  { section: "certificates", key: "item_3.name", locale: "id", value: "Cloud Practitioner Essentials (Belajar Dasar AWS Cloud)", sortOrder: 42 },
  { section: "certificates", key: "item_4.name", locale: "en", value: "JavaScript Programming Basics", sortOrder: 43 },
  { section: "certificates", key: "item_4.name", locale: "id", value: "Belajar Dasar Pemrograman JavaScript", sortOrder: 43 },
  { section: "certificates", key: "item_5.name", locale: "en", value: "Web Programming Basics", sortOrder: 44 },
  { section: "certificates", key: "item_5.name", locale: "id", value: "Belajar Dasar Pemrograman Web", sortOrder: 44 },
  { section: "certificates", key: "item_6.name", locale: "en", value: "Linux Administration Batch VII Training", sortOrder: 45 },
  { section: "certificates", key: "item_6.name", locale: "id", value: "Linux Administration Batch VII Training", sortOrder: 45 },
  { section: "certificates", key: "item_7.name", locale: "en", value: "SQL Course", sortOrder: 46 },
  { section: "certificates", key: "item_7.name", locale: "id", value: "Kursus SQL", sortOrder: 46 },
  { section: "certificates", key: "item_8.name", locale: "en", value: "Python Course", sortOrder: 47 },
  { section: "certificates", key: "item_8.name", locale: "id", value: "Kursus Python", sortOrder: 47 },
  { section: "certificates", key: "item_9.name", locale: "en", value: "Node.js Basics Course", sortOrder: 48 },
  { section: "certificates", key: "item_9.name", locale: "id", value: "Kursus Node.js Dasar", sortOrder: 48 },
  { section: "certificates", key: "item_10.name", locale: "en", value: "JavaScript Web Development Course", sortOrder: 49 },
  { section: "certificates", key: "item_10.name", locale: "id", value: "Kursus Java Script Pengembangan Web", sortOrder: 49 },
];

async function seedSectionContent() {
  // Hapus data lama yang tersimpan sebagai JSON di SiteContent untuk section dedicated
  await prisma.siteContent.deleteMany({
    where: { section: { in: ["skills", "works", "certificates", "education"] } },
  });

  for (const item of sectionItemLocalizedData) {
    await prisma.sectionText.upsert({
      where: {
        section_key_locale: { section: item.section, key: item.key, locale: item.locale },
      },
      create: item,
      update: { value: item.value, sortOrder: item.sortOrder },
    });
  }

  for (const item of sectionTextData) {
    await prisma.sectionText.upsert({
      where: {
        section_key_locale: { section: item.section, key: item.key, locale: item.locale },
      },
      create: item,
      update: { value: item.value, sortOrder: item.sortOrder },
    });
  }

  await prisma.skillItem.deleteMany();
  await prisma.skillItem.createMany({ data: skillItemsData.map((d, i) => ({ ...d, sortOrder: i + 1 })) });

  await prisma.workExperience.deleteMany();
  await prisma.workExperience.createMany({ data: workExperienceData.map((d, i) => ({ ...d, sortOrder: i + 1 })) });

  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({ data: certificatesData.map((d, i) => ({ ...d, sortOrder: i + 1 })) });

  await prisma.educationItem.deleteMany();
  await prisma.educationItem.createMany({ data: educationItemsData.map((d, i) => ({ ...d, sortOrder: i + 1 })) });

  console.log("  ✓ skills, works, certificates, education (dedicated tables) seeded");
}

main()
  .then(seedSiteContent)
  .then(seedSectionContent)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
