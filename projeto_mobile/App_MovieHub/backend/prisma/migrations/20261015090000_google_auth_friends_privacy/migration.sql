-- Add Google authentication and per-category friend visibility.
ALTER TABLE "User"
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "googleSub" TEXT,
  ADD COLUMN "shareWatched" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "shareWatchlist" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "shareFavorites" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "shareReviews" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "shareRecent" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX "User_googleSub_key" ON "User"("googleSub");

CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED');

CREATE TABLE "Friendship" (
  "id" SERIAL NOT NULL,
  "requesterId" TEXT NOT NULL,
  "addresseeId" TEXT NOT NULL,
  "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Friendship_requesterId_addresseeId_key"
  ON "Friendship"("requesterId", "addresseeId");
CREATE INDEX "Friendship_addresseeId_status_idx"
  ON "Friendship"("addresseeId", "status");
CREATE INDEX "Friendship_requesterId_status_idx"
  ON "Friendship"("requesterId", "status");

ALTER TABLE "Friendship"
  ADD CONSTRAINT "Friendship_requesterId_fkey"
  FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "Friendship_addresseeId_fkey"
  FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
