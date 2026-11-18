import nextConfig from "../../next.config.js";

export type ImageHostPattern = {
  protocol: "https";
  hostname: string;
  pathname: string;
};

type ConfigPattern = {
  protocol?: string;
  hostname?: string;
  pathname?: string;
};

function isImageHostPattern(value: ConfigPattern): value is ImageHostPattern {
  return (
    value.protocol === "https" &&
    typeof value.hostname === "string" &&
    typeof value.pathname === "string"
  );
}

const configured = (
  nextConfig as { images?: { remotePatterns?: ConfigPattern[] } }
).images?.remotePatterns;

export const remotePatterns: ImageHostPattern[] = (configured ?? []).filter(
  isImageHostPattern
);

function pathnameMatches(pattern: string, pathname: string) {
  const expression =
    "^" +
    pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*/g, "\0")
      .replace(/\*/g, "[^/]*")
      .replace(/\0/g, ".*") +
    "$";
  return new RegExp(expression).test(pathname);
}

export function isOptimizableImage(src: string) {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }

  const protocol = url.protocol.replace(":", "");
  return remotePatterns.some(
    (pattern) =>
      pattern.protocol === protocol &&
      pattern.hostname === url.hostname &&
      pathnameMatches(pattern.pathname, url.pathname)
  );
}
