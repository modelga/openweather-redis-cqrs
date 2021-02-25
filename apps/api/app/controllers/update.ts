import { Router } from "express";
import { UpdateService } from "../services";
import { asyncHandler, createResponse } from "../utils";

export function updateController(service: UpdateService) {
  const router = Router({});
  router.put(
    "/:location",
    asyncHandler(async (req, res) => {
      await service.forceUpdate(req.params.location);
      createResponse(res, true);
    }),
  );
  return router;
}
