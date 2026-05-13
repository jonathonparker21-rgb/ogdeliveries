'use client';

import clsx from 'clsx';
import { useEffect } from 'react';

type AdSlotProps = {
  id: string;
  position: 'above-fold' | 'in-article' | 'sidebar';
  description?: string;
};

export default function AdSlot({ id, position, description }: AdSlotProps) {
  useEffect(() => {
    // This is where an ad network script could be triggered.
  }, [id]);

  return (
    <div
      aria-label={`Ad slot: ${position}`}
      className={clsx('ad-slot', `ad-slot--${position}`)}
      data-slot-id={id}
      data-slot-position={position}
      role="complementary"
    >
      <span className="ad-slot__label">Advertisement</span>
      <strong>{description ?? `${position} slot`}</strong>
      <p className="ad-slot__helper">Replace this box with your ad tag.</p>
    </div>
  );
}
