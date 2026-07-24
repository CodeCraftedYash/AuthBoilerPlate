import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

import { UserRepository } from "../../repositories/user.repository";
import { SessionRepository } from "../../repositories/session.repository";
import db from '../../lib/Prisma.js';

const userRepository = new UserRepository(db);
const sessionRepository = new SessionRepository(db);

const authService = new AuthService(
  userRepository,
  sessionRepository,
);

export const authController =
  new AuthController(authService);