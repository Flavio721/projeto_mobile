-- Existing Movie records were user-entered copies. Per product decision,
-- these records are removed; the User accounts and profiles are preserved.
DROP TABLE "_GenreToMovie";
DROP TABLE "Genre";
DROP TABLE "Movie";
DROP TYPE "MovieStatus";

CREATE TYPE "MovieStatus" AS ENUM ('WATCHLIST', 'WATCHED');

CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "posterPath" TEXT,
    "releaseDate" TEXT,
    "overview" TEXT NOT NULL DEFAULT '',
    "runtime" INTEGER,
    "genres" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "voteAverage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserMovie" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'WATCHLIST',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "comment" TEXT,
    "watchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserMovie_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UserMovie_rating_range" CHECK ("rating" IS NULL OR ("rating" >= 1 AND "rating" <= 5)),
    CONSTRAINT "UserMovie_watched_date" CHECK (
        ("status" = 'WATCHED' AND "watchedAt" IS NOT NULL) OR
        ("status" = 'WATCHLIST' AND "watchedAt" IS NULL)
    )
);

CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");
CREATE UNIQUE INDEX "UserMovie_userId_movieId_key" ON "UserMovie"("userId", "movieId");
CREATE INDEX "UserMovie_userId_status_idx" ON "UserMovie"("userId", "status");
CREATE INDEX "UserMovie_userId_isFavorite_idx" ON "UserMovie"("userId", "isFavorite");

ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserMovie" ADD CONSTRAINT "UserMovie_movieId_fkey"
    FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
