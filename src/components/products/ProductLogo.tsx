"use client";

import { useState } from "react";
import { getProductLogoUrl } from "@/lib/utils/product-logo";

type ProductLogoProps = {
  name: string;
  logoUrl?: string | null;
  seed?: number;
  className?: string;
};

const logoStyles =
  "flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-300 bg-gray-100 text-lg font-semibold text-gray-500";

export function ProductLogo({
  name,
  logoUrl,
  seed = 0,
  className,
}: ProductLogoProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = getProductLogoUrl(name, logoUrl, seed);
  const showImage = !imageFailed;
  const styles = className ? `${logoStyles} ${className}` : logoStyles;

  if (showImage) {
    return (
      <div className={styles} title={name}>
        <img
          src={src}
          alt={`${name} logo`}
          width={64}
          height={64}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={styles} title={name}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
