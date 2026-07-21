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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
