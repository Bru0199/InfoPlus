"use client";

import React, { useState, useEffect, useMemo } from "react";

export const hasTextType = (content: any) => {
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return (
      Array.isArray(parsed) && parsed.some((item: any) => item.type === "text")
    );
  } catch {
    return false;
  }
};

// export const TextMessage = ({ content }: { content: any }) => {
//   const [displayedText, setDisplayedText] = useState("");

//   // 1. Memoize the extraction so it only runs when content changes
//   const rawText = useMemo(() => {
//     try {
//       const parsed =
//         typeof content === "string" ? JSON.parse(content) : content;

//       if (Array.isArray(parsed)) {
//         // ONLY pick the object where type is "text"
//         const textObj = parsed.find((item: any) => item.type === "text");
//         return textObj ? textObj.text : null;
//       }
//       return null;
//     } catch (e) {
//       return null;
//     }
//   }, [content]);

//   // 2. Typing Effect
//   useEffect(() => {
//     if (!rawText) return;

//     let i = 0;
//     const speed = 10;
//     setDisplayedText("");

//     const interval = setInterval(() => {
//       setDisplayedText(rawText.slice(0, i));
//       i++;
//       if (i > rawText.length) clearInterval(interval);
//     }, speed);

//     return () => clearInterval(interval);
//   }, [rawText]);

//   // If no text type was found, render nothing
//   if (!rawText) return null;

//   return (
//     <div className="leading-relaxed whitespace-pre-wrap transition-opacity duration-300">
//       {displayedText}
//     </div>
//   );
// };

export const TextMessage = ({
  content,
  isLast,
}: {
  content: any;
  isLast?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  const rawText = useMemo(() => {
    try {
      const parsed =
        typeof content === "string" ? JSON.parse(content) : content;
      if (Array.isArray(parsed)) {
        const textObj = parsed.find((item: any) => item.type === "text");
        return textObj ? textObj.text : null;
      }
      return null;
    } catch {
      return null;
    }
  }, [content]);

  useEffect(() => {
    if (!rawText) return;

    // IF NOT THE LAST MESSAGE (HISTORY): Show instantly
    if (!isLast) {
      setDisplayedText(rawText);
      return;
    }

    // IF THE LAST MESSAGE (NEW): Type it out
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(rawText.slice(0, i));
      i++;
      if (i > rawText.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [rawText, isLast]);

  if (!rawText) return null;
  return (
    <div className="leading-relaxed whitespace-pre-wrap">{displayedText}</div>
  );
};
