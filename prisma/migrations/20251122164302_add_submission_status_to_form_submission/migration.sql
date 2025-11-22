-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryOfResidence" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "cityOfResidence" TEXT NOT NULL,
    "preferredProgram" TEXT NOT NULL,
    "universityId" INTEGER,
    "programId" INTEGER,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER,
    "orderStage" TEXT NOT NULL DEFAULT 'New',
    "submissionStatus" TEXT NOT NULL DEFAULT 'submitted',
    "userId" INTEGER,
    CONSTRAINT "FormSubmission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FormSubmission" ("agentId", "cityOfResidence", "contactNumber", "countryOfResidence", "email", "fullName", "id", "nationality", "orderStage", "preferredProgram", "programId", "submittedAt", "universityId", "userId") SELECT "agentId", "cityOfResidence", "contactNumber", "countryOfResidence", "email", "fullName", "id", "nationality", "orderStage", "preferredProgram", "programId", "submittedAt", "universityId", "userId" FROM "FormSubmission";
DROP TABLE "FormSubmission";
ALTER TABLE "new_FormSubmission" RENAME TO "FormSubmission";
CREATE UNIQUE INDEX "FormSubmission_userId_key" ON "FormSubmission"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
