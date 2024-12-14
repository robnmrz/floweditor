/*
  Warnings:

  - The primary key for the `Credential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `iud` on the `Credential` table. All the data in the column will be lost.
  - The required column `id` was added to the `Credential` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Credential" ("createdAt", "name", "userId", "value") SELECT "createdAt", "name", "userId", "value" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE UNIQUE INDEX "Credential_userId_name_key" ON "Credential"("userId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
