import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler( err:Error, req:Request, res:Response ){
    if( err instanceof ApiError ){
        res.status(err.statusCode).json({
            success:false,
            message:err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}