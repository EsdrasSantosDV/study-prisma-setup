-- CreateEnum
CREATE TYPE "public"."PedidoStatus" AS ENUM ('RECEBIDO', 'PREPARANDO', 'PRONTO', 'ENTREGUE');

-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "status" "public"."PedidoStatus" NOT NULL DEFAULT 'RECEBIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PedidoItem" (
    "id" TEXT NOT NULL,
    "dish" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
