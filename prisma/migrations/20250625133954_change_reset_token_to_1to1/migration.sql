/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `passwordToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "passwordToken_userId_key" ON "passwordToken"("userId");
