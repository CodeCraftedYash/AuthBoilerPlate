import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import TokenService from "../services/token.service";

// check if authorization exists in req's headers
// throw error if authorization does not exist or it does not start with "Bearer"
// extract token from the authrization header
// verify this access token 
// set the user from the req to have this payload/verified token
// call next function to pass the control. 

export default function Authorization(
    req: Request,
    _res: Response,
    next: NextFunction
){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new ApiError(401, "Unauthorized");
    }

    const [scheme, token] = authHeader.split(" ");
    
    if(!scheme?.startsWith("Bearer ") || !token){
        throw new ApiError(401, "Invalid authorization header");
    }

// other way =>    const token = authHeader.substring(7); //skips Bearer

    const payload = TokenService.verifyAccessToken(token);

    req.user = payload;
    
    next();
}