-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_University" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "ranking" TEXT NOT NULL,
    "students" TEXT NOT NULL,
    "programs" TEXT NOT NULL,
    "acceptance" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "freeOfferLetter" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_University" ("acceptance", "color", "country", "flag", "id", "logo", "name", "order", "programs", "ranking", "students") SELECT "acceptance", "color", "country", "flag", "id", "logo", "name", "order", "programs", "ranking", "students" FROM "University";
DROP TABLE "University";
ALTER TABLE "new_University" RENAME TO "University";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
