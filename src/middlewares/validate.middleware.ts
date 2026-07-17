// this will validate the inputs with a schema
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../utils/apiError";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedUrlQuery } from "querystring";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};
// parseAsync throws an error while safeParseAsync returns an object both for pass and fail
function validate(schema: RequestSchemas) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (schema.body) {
      const result = await schema.body.safeParseAsync(req.body);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      req.body = result.data;
    }

    if (schema.params) {
      const result = await schema.params.safeParseAsync(req.params);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      req.params = result.data as ParamsDictionary;
    }

    if (schema.query) {
      const result = await schema.query.safeParseAsync(req.query);
      if (!result.success) {
        throw new ApiError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        );
      }
      req.query = result.data as ParsedUrlQuery;
    }
    next();
  };
}
