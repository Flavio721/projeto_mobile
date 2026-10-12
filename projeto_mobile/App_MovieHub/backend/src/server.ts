import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET não configurada.");

const PORT = Number(process.env.PORT ?? 3000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`MovieHub API ouvindo na porta ${PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
  });
}
