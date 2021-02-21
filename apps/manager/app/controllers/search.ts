import { Router } from "express";
import { WeatherService } from "../services/weather/index";
import { asyncHandler, createResponse } from "../utils/handlers";

export function searchController(service: WeatherService) {
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
