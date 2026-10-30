CREATE TYPE "BookReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'READ', 'PAUSED');

CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "googleBooksId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "isbn10" TEXT,
    "isbn13" TEXT,
    "authors" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "description" TEXT NOT NULL DEFAULT '',
    "publisher" TEXT,
    "publishedDate" TEXT,
    "pageCount" INTEGER,
    "coverUrl" TEXT,
    "language" TEXT,
    "categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserBook" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" "BookReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "comment" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserBook_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Book_googleBooksId_key" ON "Book"("googleBooksId");
CREATE UNIQUE INDEX "Book_isbn10_key" ON "Book"("isbn10");
CREATE UNIQUE INDEX "Book_isbn13_key" ON "Book"("isbn13");
CREATE UNIQUE INDEX "UserBook_userId_bookId_key" ON "UserBook"("userId", "bookId");
CREATE INDEX "UserBook_userId_status_idx" ON "UserBook"("userId", "status");
CREATE INDEX "UserBook_userId_isFavorite_idx" ON "UserBook"("userId", "isFavorite");

ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookId_fkey"
FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
