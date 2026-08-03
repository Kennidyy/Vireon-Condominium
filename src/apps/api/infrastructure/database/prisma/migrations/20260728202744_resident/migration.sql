-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('PNG', 'JPEG');

-- CreateTable
CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" "ContactType" NOT NULL,
    "value" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_photos" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "contentType" "ImageType" NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "profile_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_userId_key" ON "residents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profile_photos_residentId_key" ON "profile_photos"("residentId");

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_photos" ADD CONSTRAINT "profile_photos_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
