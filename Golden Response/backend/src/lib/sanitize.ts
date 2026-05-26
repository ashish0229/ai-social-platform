import xss from "xss";

export function sanitizeText(value: string) {
  return xss(value.trim(), {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"]
  });
}

