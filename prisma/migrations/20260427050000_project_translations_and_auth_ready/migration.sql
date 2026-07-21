-- CreateTable
CREATE TABLE "ProjectTranslation" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectTranslation_pkey" PRIMARY KEY ("id")
);

-- Migrate existing project text into translations
INSERT INTO "ProjectTranslation" ("locale", "projectName", "description", "projectId")
SELECT 'id', "projectName", "description", "id" FROM "Project";

INSERT INTO "ProjectTranslation" ("locale", "projectName", "description", "projectId")
SELECT 'en', "projectName", "description", "id" FROM "Project";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTranslation_projectId_locale_key" ON "ProjectTranslation"("projectId", "locale");

-- AddForeignKey
ALTER TABLE "ProjectTranslation" ADD CONSTRAINT "ProjectTranslation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old columns after data migration
ALTER TABLE "Project" DROP COLUMN "projectName",
DROP COLUMN "description";
