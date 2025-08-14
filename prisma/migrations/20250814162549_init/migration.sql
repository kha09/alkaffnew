-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "University" (
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
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "avatar" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hasVideo" BOOLEAN NOT NULL,
    "featured" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);
