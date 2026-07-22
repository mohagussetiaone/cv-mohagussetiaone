-- CreateTable
CREATE TABLE "SiteContent" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT '',
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_section_key_locale_key" ON "SiteContent"("section", "key", "locale");
