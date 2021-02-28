import { Router } from "express";

import { TrackService } from "../services";
import { asyncHandler, createResponse } from "../utils";
import { createDeleteResponse } from "../utils/handlers";

export function trackController(service: TrackService) {
  const router = Router({});
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      console.log("Body", req.body);
      const data = await service.trackLocation(req.body);
      createResponse(res, data);
    }),
  );

  router.delete(
    "/:locationId",
    asyncHandler(async (req, res) => {
      const data = await service.stopTracking(req.params.locationId);
      createDeleteResponse(res);
    }),
  );

  return router;
}
