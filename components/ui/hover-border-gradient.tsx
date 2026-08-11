"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

// Pure CSS: the border highlight sweeps around via the `border-sweep` keyframes
// (globals.css) — no JS animation library, no per-frame main-thread work.

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-tl-[135px] rounded-br-[135px] border content-center transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px box-decoration-clone w-fit",
        containerClassName,
      )}
      {...props}
    >
      <div className={cn("w-auto text-white z-10 bg-black p-2 rounded-[inherit]", className)}>{children}</div>

      {/* Sweep layer: gradient berputar keliling border via CSS keyframes */}
      <div
        aria-hidden="true"
        className="hover-border-sweep absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none"
        style={{
          filter: "blur(2px)",
          animationDuration: `${duration * 4}s`,
          animationDirection: clockwise ? "normal" : "reverse",
        }}
      />

      {/* Highlight layer saat hover */}
      <div
        aria-hidden="true"
        className="hover-border-highlight absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none"
        style={{
          filter: "blur(2px)",
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="absolute z-1 flex-none inset-0.5 rounded-tl-[10rem] rounded-br-[10rem]" />
    </Tag>
  );
}
