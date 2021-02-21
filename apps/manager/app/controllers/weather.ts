import { Router } from "express";
import { WeatherService } from "../services";
import { asyncHandler, createResponse } from "../utils";

export function weatherController(service: WeatherService) {
  const router = Router({});
  router.get(
    "/current/:location",
    asyncHandler(async (req, res) => {
      const data = await service.getHistoryWeather(req.params.location);
      createResponse(res, data);
    }),
  );
  router.get(
    "/history/:location",
    asyncHandler(async (req, res) => {
      const data = await service.getHistoryWeather(req.params.location);
      createResponse(res, data);
    }),
  );
  router.get(
    "/:location",
    asyncHandler(async (req, res) => {
      const location = req.params.location;
      const [history, current] = await Promise.all([
        service.getHistoryWeather(location),
        service.getCurrentWeather(location),
      ]);
      createResponse(res, { history, current });
    }),
  );
  return router;
}
