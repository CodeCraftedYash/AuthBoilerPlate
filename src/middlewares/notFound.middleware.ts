import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function notFound( req:Request, res:Response, next:NextFunction ){
 next(
   new ApiError(
      404,
      `Cannot ${req.method} ${req.originalUrl}`
   )
 )
}