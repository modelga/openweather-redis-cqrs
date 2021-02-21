import _slugify from "slugify";

export const slugify = (text: string) => _slugify(text, { lower: true });
