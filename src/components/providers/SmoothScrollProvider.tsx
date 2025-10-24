"use client";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function updateMotion(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    function updateGSAP(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    frame.update(updateMotion, true);
    gsap.ticker.add(updateGSAP);

    return () => {
      gsap.ticker.remove(updateGSAP);
      cancelFrame(updateMotion);
    };
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false, duration: 2 }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
