"use client";

import { cn } from "@/lib/utils";

type Word = {
  text: string;
  className?: string;
};

// CSS-only typewriter. Reveals characters with a stagger using compositor-friendly
// opacity/transform keyframes (defined in globals.css) instead of animating
// width/display via JS — avoids forced reflows on the hero section.
export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}) => {
  // Running index to stagger each character's reveal delay.
  let charIndex = 0;

  return (
    <div className={cn("text-4xl md:text-4xl font-bold text-start", className)}>
      {words.map((word, idx) => (
        <span key={`word-${idx}`} className="inline-block">
          {word.text.split("").map((char, index) => {
            const delay = charIndex * 0.1;
            charIndex += 1;
            return (
              <span
                key={`char-${index}`}
                className={cn("typewriter-char inline-block opacity-0", word.className)}
                style={{ animationDelay: `${delay}s` }}
              >
                {char}
              </span>
            );
          })}
          {"\u00A0"}
        </span>
      ))}
      <span
        aria-hidden="true"
        className={cn("typewriter-cursor inline-block w-1 h-4 md:h-6 lg:h-10 bg-brand-500 rounded-sm", cursorClassName)}
      />
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}) => {
  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <div className="typewriter-smooth overflow-hidden pb-2">
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {words.map((word, idx) => (
            <span key={`word-${idx}`} className="inline-block">
              {word.text.split("").map((char, index) => (
                <span key={`char-${index}`} className={cn("dark:text-white text-black", word.className)}>
                  {char}
                </span>
              ))}
              {"\u00A0"}
            </span>
          ))}{" "}
        </div>{" "}
      </div>
      <span
        aria-hidden="true"
        className={cn("typewriter-cursor block w-1 h-4 sm:h-6 xl:h-12 bg-blue-500", cursorClassName)}
      />
    </div>
  );
};
