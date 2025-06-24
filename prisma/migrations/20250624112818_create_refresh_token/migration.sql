-- CreateTable
CREATE TABLE "refreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
