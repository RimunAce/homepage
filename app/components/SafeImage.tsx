"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { isOptimizableImage } from "@/app/lib/imageHosts";

type SafeImageProps = ImageProps & {
  fallbackLabel?: string;
};

function asRemoteSrc(src: ImageProps["src"]) {
  return typeof src === "string" ? src : null;
}

export default function SafeImage({
  alt,
  src,
  onError,
  fallbackLabel = "Image unavailable",
  className,
  fill,
  width,
  height,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const remoteSrc = asRemoteSrc(src);
  const missing = remoteSrc == null || remoteSrc.length === 0;

  if (failed || missing) {
    return (
      <span
        role="img"
        aria-label={alt || fallbackLabel || "Image unavailable"}
        className={`flex items-center justify-center bg-retro-gray px-1 text-center font-mono text-[10px] leading-tight text-retro-black ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className ?? ""}`}
        style={fill ? undefined : { width, height }}
      >
        {fallbackLabel}
      </span>
    );
  }

  if (!isOptimizableImage(remoteSrc)) {
    return (
      // Hosts outside next.config remotePatterns cannot go through the optimizer.
      // A plain img still shows them, and a failed load uses the same fallback.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={remoteSrc}
        alt={alt}
        width={fill ? undefined : typeof width === "number" ? width : undefined}
        height={fill ? undefined : typeof height === "number" ? height : undefined}
        className={`${fill ? "absolute inset-0 h-full w-full" : ""} ${className ?? ""}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={remoteSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
