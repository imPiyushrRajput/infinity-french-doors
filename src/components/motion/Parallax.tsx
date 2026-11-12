"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Image that drifts vertically as it scrolls through the viewport.
 * The image is oversized by `strength` so edges never show.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  strength = 14,
  sizes = "100vw",
  priority = false,
  scale = 1,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  sizes?: string;
  priority?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  const positioned = /\babsolute\b|\bfixed\b/.test(className);
  return (
    <div ref={ref} className={`${positioned ? "" : "relative"} overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="absolute -inset-y-[18%] inset-x-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
}

/** Any content that moves at a different speed than the page. */
export function ParallaxLayer({
  children,
  className = "",
  distance = 60,
}: {
  children?: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
