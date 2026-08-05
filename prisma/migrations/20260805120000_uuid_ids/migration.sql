-- Reset all data (re-seeded by prisma/seed.ts)
TRUNCATE TABLE "ProjectTranslation" CASCADE;
TRUNCATE TABLE "_ProjectSkills" CASCADE;
TRUNCATE TABLE "_ProjectCategories" CASCADE;
TRUNCATE TABLE "Project" CASCADE;
TRUNCATE TABLE "Category" CASCADE;
TRUNCATE TABLE "Skill" CASCADE;
TRUNCATE TABLE "Message" CASCADE;
TRUNCATE TABLE "SiteContent" CASCADE;
TRUNCATE TABLE "SectionText" CASCADE;
TRUNCATE TABLE "SkillItem" CASCADE;
TRUNCATE TABLE "WorkExperience" CASCADE;
TRUNCATE TABLE "Certificate" CASCADE;
TRUNCATE TABLE "EducationItem" CASCADE;

-- DropForeignKey
ALTER TABLE "ProjectTranslation" DROP CONSTRAINT "ProjectTranslation_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectSkills" DROP CONSTRAINT "_ProjectSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectSkills" DROP CONSTRAINT "_ProjectSkills_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectCategories" DROP CONSTRAINT "_ProjectCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectCategories" DROP CONSTRAINT "_ProjectCategories_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Certificate_id_seq";

-- AlterTable
ALTER TABLE "EducationItem" DROP CONSTRAINT "EducationItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EducationItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EducationItem_id_seq";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Message_id_seq";

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Project_id_seq";

-- AlterTable
ALTER TABLE "ProjectTranslation" DROP CONSTRAINT "ProjectTranslation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProjectTranslation_id_seq";

-- AlterTable
ALTER TABLE "SectionText" DROP CONSTRAINT "SectionText_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SectionText_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SectionText_id_seq";

-- AlterTable
ALTER TABLE "SiteContent" DROP CONSTRAINT "SiteContent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SiteContent_id_seq";

-- AlterTable
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Skill_id_seq";

-- AlterTable
ALTER TABLE "SkillItem" DROP CONSTRAINT "SkillItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SkillItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SkillItem_id_seq";

-- AlterTable
ALTER TABLE "WorkExperience" DROP CONSTRAINT "WorkExperience_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WorkExperience_id_seq";

-- AlterTable
ALTER TABLE "_ProjectCategories" DROP CONSTRAINT "_ProjectCategories_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ProjectCategories_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_ProjectSkills" DROP CONSTRAINT "_ProjectSkills_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ProjectSkills_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectCategories" ADD CONSTRAINT "_ProjectCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectCategories" ADD CONSTRAINT "_ProjectCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
