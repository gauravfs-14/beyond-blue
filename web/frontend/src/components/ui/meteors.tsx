"use client";

import { useEffect, useRef, useState } from "react";

type Meteor = {
  id: number;
  left: number; // vw
  duration: number; // s
  topOffset: number; // vh
  length: number; // px
  angle: number; // deg
};

export function MeteorsOverlay({
  maxConcurrent = 6,
}: {
  maxConcurrent?: number;
}) {
  const [active, setActive] = useState<Meteor[]>([]);
  const timerRef = useRef<number | null>(null);

  // spawn a meteor with randomized origin/direction (some from right toward left)
  const spawn = () => {
    setActive((curr) => {
      if (curr.length >= maxConcurrent) return curr;
      const fromRight = Math.random() < 0.5;
      const angleJitter = Math.random() * 20 - 10; // -10..+10 deg
      const angle = (fromRight ? 135 : 45) + angleJitter;

      let left: number;
      let topOffset: number;
      if (fromRight) {
        left = 60 + Math.random() * 45; // 60–105vw
        topOffset =
          Math.random() < 0.5
            ? 10 + Math.random() * 30
            : -8 + Math.random() * 22; // 10–40vh or -8–14vh
      } else {
        left = -12 + Math.random() * 18; // -12–6vw
        topOffset =
          Math.random() < 0.35
            ? 8 + Math.random() * 20
            : -12 + Math.random() * 18; // 8–28vh or -12–6vh
      }

      const m: Meteor = {
        id: Date.now() + Math.floor(Math.random() * 100000),
        left,
        duration: 7 + Math.random() * 8, // 7–15s
        topOffset,
        length: 50 + Math.random() * 70, // 50–120px
        angle,
      };
      // schedule removal when animation ends
      window.setTimeout(() => {
        setActive((arr) => arr.filter((x) => x.id !== m.id));
      }, m.duration * 1000);
      return [...curr, m];
    });
  };

  // run a spaced out spawner loop
  useEffect(() => {
    function loop() {
      spawn();
      const next = 2500 + Math.random() * 8000; // 2.5–10.5s between spawns (tighter cadence)
      timerRef.current = window.setTimeout(loop, next);
    }
    loop();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [maxConcurrent]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {active.map((m) => (
        <span
          key={m.id}
          className="absolute block"
          style={{
            top: `${m.topOffset}vh`,
            left: `${m.left}vw`,
            width: `${m.length}px`,
            height: `8px`,
            animation: `meteor ${m.duration}s linear 0s 1 forwards`,
            transform: `rotate(${m.angle}deg)`,
            transformOrigin: "left center",
          }}
        >
          {/* Tail: tapered wedge */}
          <span
            style={{
              position: "absolute",
              left: "-6px",
              top: "50%",
              transform: "translateY(-50%)",
              width: `${m.length * 0.9}px`,
              height: `10px`,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 100%)",
              clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
              filter: "blur(0.5px)",
              opacity: 0.45,
            }}
          />
          {/* Head */}
          <span
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translate(50%, -50%)",
              width: "2px",
              height: "2px",
              borderRadius: "9999px",
              background: "white",
              boxShadow:
                "0 0 4px 1px rgba(255,255,255,0.28), 0 0 10px 3px rgba(140,170,255,0.1)",
              opacity: 0.8,
            }}
          />
        </span>
      ))}
    </div>
  );
}
