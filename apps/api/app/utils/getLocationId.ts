import slugify from "slugify";

import { DetailedLocation } from "../models";

export const getLocationId = ({ name, country, state }: DetailedLocation) => {
  return `${slugify(name)}.${country}${state ? `.${state}` : ""}`.toLocaleLowerCase();
};
