-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Program" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tuitionFees" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "intakeMonths" TEXT NOT NULL,
    "qualification" TEXT NOT NULL DEFAULT 'Bachelor''s Degree',
    "englishRequirement" TEXT NOT NULL DEFAULT 'IELTS 5.5',
    "offerLetter" BOOLEAN NOT NULL DEFAULT true,
    "classType" TEXT NOT NULL DEFAULT 'Physical',
    "yearlyTuitionFees" TEXT NOT NULL DEFAULT '',
    "otherFees" TEXT NOT NULL DEFAULT '',
    "departmentId" INTEGER NOT NULL,
    CONSTRAINT "Program_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Program" ("departmentId", "description", "duration", "id", "intakeMonths", "name", "tuitionFees") SELECT "departmentId", "description", "duration", "id", "intakeMonths", "name", "tuitionFees" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
