-- 1. Add projectName column to Project (with default empty string)
ALTER TABLE "Project" ADD COLUMN "projectName" TEXT NOT NULL DEFAULT '';

-- 2. Add tech detail fields
ALTER TABLE "Project" ADD COLUMN "techStack" TEXT;
ALTER TABLE "Project" ADD COLUMN "deployment" TEXT;
ALTER TABLE "Project" ADD COLUMN "server" TEXT;
ALTER TABLE "Project" ADD COLUMN "designMethod" TEXT;
ALTER TABLE "Project" ADD COLUMN "orm" TEXT;
ALTER TABLE "Project" ADD COLUMN "database" TEXT;
ALTER TABLE "Project" ADD COLUMN "domainProvider" TEXT;

-- 3. Migrate existing projectName data from translations to Project
UPDATE "Project" p SET "projectName" = COALESCE(
  (SELECT pt."projectName" FROM "ProjectTranslation" pt WHERE pt."projectId" = p."id" AND pt."locale" = 'id' LIMIT 1),
  (SELECT pt."projectName" FROM "ProjectTranslation" pt WHERE pt."projectId" = p."id" LIMIT 1),
  ''
);

-- 4. Remove projectName column from ProjectTranslation
ALTER TABLE "ProjectTranslation" DROP COLUMN "projectName";
