import { Request, Response, RequestHandler, NextFunction } from "express";
export function asyncHandler(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

export function createResponse(res: Response, data: any) {
  if (!data) {
    res.status(404);
    res.send();
  } else {
    res.json(data);
  }
}
