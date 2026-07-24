import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import { authController } from "./auth.index.js";

const router = Router();

router.post(
  "/signup",
  validate({
    body: signupSchema,
  }),
  authController.signup,
);

router.post(
  "/login",
  validate({
    body: loginSchema,
  }),
  authController.login,
);

router.post(
  "/refresh",
  authController.refresh,
);

router.post(
  "/logout",
  authController.logout,
);

export default router;