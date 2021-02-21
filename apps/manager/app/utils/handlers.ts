import { Request, Response, RequestHandler, NextFunction } from "express";
export function asyncHandler(handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}

export function createResponse(res: Response, data: any) {
  if (!data) {
    res.status(404);
    return res.send();
  }
  switch (typeof data) {
    case "object":
      return res.json(data);
    case "boolean":
      res.status(204);
      return res.send();
    default:
      return res.send(data);
  }
}

export function createDeleteResponse(res: Response) {
  res.status(204);
  res.send();
}
