import { Router } from "express";
import { SearchService } from "../services";
import { asyncHandler, createResponse } from "../utils";

export function searchController(service: SearchService) {
  const router = Router({});
  router.get(
    "/:location",
    asyncHandler(async (req, res) => {
      const data = await service.queryForLocation(req.params.location);
      createResponse(res, data);
    }),
  );
  return router;
}
