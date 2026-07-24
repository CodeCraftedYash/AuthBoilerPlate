import { Request, Response, Router } from "express";
import healthRouter from "../modules/health/health.route";
import authRouter from "../modules/auth/auth.route";

export const router = Router();

router.get("/",(req:Request,res:Response)=>{
 req.log.info("fetching user record")
 res.status(201).json({
    success: true,
    message:"Main app",
    version:"1.0"
 })
})

router.use("/health",healthRouter);
router.use("/auth",authRouter);
export default router;