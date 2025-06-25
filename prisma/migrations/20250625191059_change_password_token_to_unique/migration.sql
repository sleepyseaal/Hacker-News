/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `passwordToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "passwordToken_token_key" ON "passwordToken"("token");
