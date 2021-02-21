import { Router } from "express";
import { asyncHandler, createResponse } from "../utils";
import { TrackService } from "../services";
import { createDeleteResponse } from "../utils/handlers";

export function trackController(service: TrackService) {
  const router = Router({});
  router.get(
    "/:location_slug",
    asyncHandler(async (req, res) => {
      const data = await service.isTracked(req.params.location_slug);
      createResponse(res, data);
    }),
  );
  router.post(
    "/:location",
    asyncHandler(async (req, res) => {
      const data = await service.trackLocation(req.params.location);
      createResponse(res, data);
    }),
  );

  router.delete(
    "/:location_slug",
    asyncHandler(async (req, res) => {
      const data = await service.stopTracking(req.params.location_slug);
      createDeleteResponse(res);
    }),
  );
  return router;
}
