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
    productId: 0,
    sortOrder: 1,
    translations: {
      id: {
        projectName: "Kaftan Brautmode",
        description: "Website untuk Kaftan Brautmode yang menampilkan koleksi dress serta menyediakan fitur pemesanan dan konsultasi melalui live Zoom.",
      },
      en: {
        projectName: "Kaftan Brautmode",
        description: "A website for Kaftan Brautmode that showcases dress collections and provides ordering and live Zoom consultation features.",
      },
    },
    image: "/project/kaftan.png",
    technologies: ["Next.js", "Tailwind CSS"],
    urlPreview: "https://kaftan-brautmode.de/de",
    githubUrl: "https://github.com/mohagussetiaone/kaftan-brautmode",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 1,
    sortOrder: 2,
    translations: {
      id: {
        projectName: "PT Fortuna Teknik Mandiri",
        description: "Website company profile untuk PT Fortuna Teknik Mandiri dengan tampilan modern dan responsif untuk menampilkan profil perusahaan serta katalog furniture.",
      },
      en: {
        projectName: "PT Fortuna Teknik Mandiri",
        description: "A company profile website for PT Fortuna Teknik Mandiri with a modern responsive interface for presenting the company profile and furniture catalog.",
      },
    },
    image: "/project/fortuna-teknik-mandiri.png",
    technologies: ["Next.js", "Tailwind CSS"],
    urlPreview: "https://fortuna-teknik-mandiri.vercel.app/",
    githubUrl: "https://github.com/mohagussetiaone/fortuna-teknik-mandiri",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 2,
    sortOrder: 3,
    translations: {
      id: {
        projectName: "PT Solusi Aplikasi Andalan Semesta",
        description: "Website company profile yang menampilkan layanan pembuatan website, SaaS, dan solusi teknologi untuk PT Solusi Aplikasi Andalan Semesta.",
      },
      en: {
        projectName: "PT Solusi Aplikasi Andalan Semesta",
        description: "A company profile website that highlights website development, SaaS, and technology solutions for PT Solusi Aplikasi Andalan Semesta.",
      },
    },
    image: "/project/pt-saas.png",
    technologies: ["Vite.js", "Tailwind CSS"],
    urlPreview: "https://ptsaas.vercel.app/",
    githubUrl: "https://github.com/mohagussetiaone/saasisme",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 3,
    sortOrder: 4,
    translations: {
      id: {
        projectName: "Selaras Invite",
        description: "Platform undangan digital yang menghadirkan pengalaman undangan online yang elegan, responsif, dan mudah dibagikan.",
      },
      en: {
        projectName: "Selaras Invite",
        description: "A digital invitation platform designed to deliver an elegant, responsive, and easy-to-share online invitation experience.",
      },
    },
    image: "/project/selaras-invite.png",
    technologies: ["Next.js", "Tailwind CSS", "Axios", "Supabase", "Prisma"],
    urlPreview: "https://selarasinvite.vercel.app/",
    githubUrl: "https://github.com/mohagussetiaone/selarasinvite",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 4,
    sortOrder: 5,
    translations: {
      id: {
        projectName: "Jajanian",
        description: "Platform e-commerce camilan yang memudahkan pemesanan melalui WhatsApp dan mendukung beberapa metode pembayaran.",
      },
      en: {
        projectName: "Jajanian",
        description: "A snack e-commerce platform that simplifies ordering through WhatsApp and supports multiple payment methods.",
      },
    },
    image: "/project/jajanian.png",
    technologies: ["Vite.js", "Tailwind CSS", "Axios", "Supabase"],
    urlPreview: "https://jajanian.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jajanian.git",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 5,
    sortOrder: 6,
    translations: {
      id: {
        projectName: "Client Area Nethome",
        description: "Portal pelanggan Nethome untuk transaksi, pengelolaan layanan, pelacakan tagihan bulanan, dan akses dukungan dalam satu aplikasi.",
      },
      en: {
        projectName: "Client Area Nethome",
        description: "A Nethome customer portal for transactions, service management, monthly billing tracking, and support access in a single application.",
      },
    },
    image: "/project/nethome.png",
    technologies: ["Vite.js", "Tailwind CSS", "Axios"],
    urlPreview: null,
    githubUrl: null,
    figmaUrl: null,
    internal: true,
  },
  {
    productId: 6,
    sortOrder: 7,
    translations: {
      id: {
        projectName: "WEB OLT Management",
        description: "Sistem manajemen OLT untuk onboarding pelanggan, aktivasi jaringan, penjadwalan pekerjaan, dan pengaturan akses berbasis peran.",
      },
      en: {
        projectName: "WEB OLT Management",
        description: "An OLT management system for customer onboarding, network activation, job scheduling, and role-based access control.",
      },
    },
    image: "/project/webolt.png",
    technologies: ["Vite.js", "Tailwind CSS", "Axios"],
    urlPreview: null,
    githubUrl: null,
    figmaUrl: null,
    internal: true,
  },
  {
    productId: 7,
    sortOrder: 8,
    translations: {
      id: {
        projectName: "Jvalleyverse",
        description: "Platform pembelajaran daring yang menyediakan course gratis, forum interaktif, project praktikal, dan sertifikat penyelesaian.",
      },
      en: {
        projectName: "Jvalleyverse",
        description: "An online learning platform that offers free courses, interactive forums, practical projects, and completion certificates.",
      },
    },
    image: "/project/jvalleyverse.png",
    technologies: ["Vite.js", "Tailwind CSS", "Axios", "Supabase"],
    urlPreview: "https://jvalleyverse.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jvalleyverse.git",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 8,
    sortOrder: 9,
    translations: {
      id: {
        projectName: "Laundrivy",
        description: "Aplikasi laundry yang menyediakan pelacakan pesanan real-time, manajemen transaksi, dan dukungan chat agar pengalaman pelanggan lebih praktis.",
      },
      en: {
        projectName: "Laundrivy",
        description: "A laundry app that offers real-time order tracking, transaction management, and chat support for a more practical customer experience.",
      },
    },
    image: "/project/laundrivy.png",
    technologies: ["Next.js", "Tailwind CSS", "Axios", "Prisma"],
    urlPreview: "https://laundrivy.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/laundrivy.git",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 9,
    sortOrder: 10,
    translations: {
      id: {
        projectName: "Jvalleyverse Dashboard",
        description: "Dashboard untuk mengelola course, memantau user, mengatur notifikasi, serta menampilkan blog dan project showcase secara dinamis.",
      },
      en: {
        projectName: "Jvalleyverse Dashboard",
        description: "A dashboard for managing courses, monitoring users, handling notifications, and publishing dynamic blog and project showcase content.",
      },
    },
    image: "/project/jvalleyverse-dashboard.png",
    technologies: ["Vite.js", "Tailwind CSS", "Axios", "Supabase"],
    urlPreview: "https://jvalleyverse-dashboard.vercel.app",
    githubUrl: "https://github.com/mohagussetiaone/jvalleyverse-dashboard.git",
    figmaUrl: null,
    internal: false,
  },
  {
    productId: 10,
    sortOrder: 11,
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
    image: "/project/tanidealsapp.png",
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
    section: "banner", key: "description", locale: "id",
    value: "Frontend Developer dengan pengalaman 2 tahun membangun aplikasi web interaktif menggunakan React.js dan Tailwind CSS. Berhasil mengembangkan dan mengoptimalkan antarmuka yang responsif dan ramah pengguna, termasuk proyek yang meningkatkan user engagement hingga 30%. Berfokus pada penerapan teknologi modern untuk menciptakan solusi bisnis yang efektif dan memberikan pengalaman pengguna yang optimal.",
    sortOrder: 3,
  },
  {
    section: "banner", key: "description", locale: "en",
    value: "Frontend Developer with 2 years of experience building interactive web applications using React.js and Tailwind CSS. Developing and optimizing responsive and user-friendly interfaces, including projects that increased user engagement by up to 30%. Focused on applying modern technologies to create effective business solutions and deliver optimal user experiences.",
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
  { section: "banner", key: "cvFileUrl", locale: "", value: "/CV_2026021211100687.pdf", sortOrder: 18 },
  { section: "banner", key: "bannerImage", locale: "", value: "/assets/image/profile/mohagus.jpeg", sortOrder: 19 },
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
    section: "about", key: "description", locale: "id",
    value: "Frontend Developer dengan pengalaman membangun aplikasi web responsif dan berkinerja tinggi menggunakan HTML, CSS, JavaScript, dan React. Saya mengutamakan penerapan praktik pengembangan terbaik untuk menghasilkan kode yang bersih, terstruktur, mudah dipelihara, dan siap untuk skala lebih besar.\n\nDalam pengalaman profesional saya, saya telah berkontribusi pada pengembangan dan optimalisasi antarmuka pengguna yang secara langsung meningkatkan kinerja aplikasi serta kualitas pengalaman pengguna.",
    sortOrder: 2,
  },
  {
    section: "about", key: "description", locale: "en",
    value: "A Frontend Developer with experience building responsive and high-performance web applications using HTML, CSS, JavaScript, and React. I prioritize the implementation of best development practices to produce clean, structured, maintainable, and scalable code.\n\nIn my professional experience,",
    sortOrder: 2,
  },
  {
    section: "about", key: "description_1", locale: "id",
    value: "Saya memiliki kemampuan untuk bekerja secara kolaboratif dalam tim lintas fungsi, beradaptasi dengan cepat terhadap teknologi baru, dan menjaga fokus pada penyelesaian masalah dengan solusi yang efektif.\n\nDi luar pekerjaan, saya aktif memperdalam pengetahuan di bidang pengembangan web, menjaga kebugaran melalui olahraga bulu tangkis, dan mengeksplorasi tantangan baru yang memperluas perspektif serta keterampilan saya.",
    sortOrder: 3,
  },
  {
    section: "about", key: "description_1", locale: "en",
    value: "I have contributed to the development and optimization of user interfaces that directly improve application performance and the quality of the user experience. I have the ability to work collaboratively in cross-functional teams, adapt quickly to new technologies, and maintain focus on solving problems with effective solutions.\n\nOutside of work, I actively deepen my knowledge in the field of web development, maintain fitness through badminton, and explore new challenges that broaden my perspective and skills.",
    sortOrder: 3,
  },

  // ── Skills (localized) ──
  { section: "skills", key: "title", locale: "id", value: "Ketrampilan", sortOrder: 1 },
  { section: "skills", key: "title", locale: "en", value: "Skills", sortOrder: 1 },
  { section: "skills", key: "description", locale: "id", value: "Saya berusaha untuk tidak pernah berhenti belajar dan berkembang", sortOrder: 2 },
  { section: "skills", key: "description", locale: "en", value: "I am striving to never stop learning and improving", sortOrder: 2 },

  // ── Skills items (stored as JSON array) ──
  {
    section: "skills", key: "items", locale: "",
    value: JSON.stringify([
      { name: "HTML", image: "/assets/image/skills/html5.png", bgColor: "#E54F26", textColor: "#E54F26" },
      { name: "CSS", image: "/assets/image/skills/css.png", bgColor: "#0C73B8", textColor: "#0C73B8" },
      { name: "JAVASCRIPT", image: "/assets/image/skills/js.png", bgColor: "#E7A020", textColor: "#E7A020" },
      { name: "REACT JS", image: "/assets/image/skills/react.png", bgColor: "#28A9E0", textColor: "#28A9E0" },
    ]),
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
  { section: "navbar", key: "logoImage", locale: "", value: "/assets/image/logo/mohagus.jpg", sortOrder: 2 },
  { section: "navbar", key: "instagramUrl", locale: "", value: "https://www.instagram.com/mohagussetiaone", sortOrder: 3 },
  { section: "navbar", key: "githubUrl", locale: "", value: "https://github.com/mohagussetiaone", sortOrder: 4 },
  { section: "navbar", key: "linkedinUrl", locale: "", value: "https://www.linkedin.com/in/moh-agus-setiawan-464960167/", sortOrder: 5 },
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

main()
  .then(seedSiteContent)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
