import patterns from "./image-hosts.json";

export type ImageHostPattern = {
  protocol: "https";
  hostname: string;
  pathname: string;
};

export const remotePatterns = patterns as ImageHostPattern[];

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
