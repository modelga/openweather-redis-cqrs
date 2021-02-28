import { Router } from "express";

import { SearchService } from "../services";
import { asyncHandler, createResponse } from "../utils";

export function searchController(service: SearchService) {
  const router = Router({});
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const data = await service.queryForLocation(req.query.q as string);
      createResponse(res, data);
    }),
  );
  return router;
}
