-- CreateTable
CREATE TABLE "NoteTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SentNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" INTEGER,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientType" TEXT NOT NULL,
    "recipientIds" TEXT NOT NULL,
    "readStatus" TEXT NOT NULL DEFAULT '{}',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "expiresAt" DATETIME,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SentNote_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "NoteTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SentNote_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
