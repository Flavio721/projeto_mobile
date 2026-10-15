-- Add a unique public handle while preserving the existing display name.
ALTER TABLE "User" ADD COLUMN "username" TEXT;

UPDATE "User"
SET "username" =
  LEFT(
    COALESCE(
      NULLIF(TRIM(BOTH '_' FROM REGEXP_REPLACE(LOWER(SPLIT_PART("email", '@', 1)), '[^a-z0-9_]+', '_', 'g')), ''),
      'user'
    ),
    16
  ) || '_' || LEFT(MD5("id"), 6);

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
