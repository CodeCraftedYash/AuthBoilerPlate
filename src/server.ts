import "dotenv/config";
import { env } from "./config/env";
import { logger } from "./config/logger";
import prisma from "./lib/Prisma";
import app from "./app";

async function startServer() {
  try {
    await prisma.$connect(); //connects to prisma client 
    logger.info("Database connected");

    app.listen(env.PORT, () => {
      logger.info(`Server started in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal(error);

    await prisma.$disconnect(); //disconnect if server fails 
    process.exit(1);
  }
}

startServer();
