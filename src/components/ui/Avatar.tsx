"use client";

import { useState } from "react";

type AvatarProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
};

const avatarStyles =
  "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-900";

export function Avatar({ name, avatarUrl, className }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(avatarUrl) && !imageFailed;
  const styles = className ? `${avatarStyles} ${className}` : avatarStyles;

  if (showImage) {
    return (
      <div className={styles} title={name}>
        <img
          src={avatarUrl!}
          alt={name}
          width={40}
          height={40}
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
