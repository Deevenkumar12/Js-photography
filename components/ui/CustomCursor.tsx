"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let rx = 0,
      ry = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
    };

    const animate = () => {
      rx += (cx - rx) * 0.15;
      ry += (cy - ry) * 0.15;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();

    const grow = () => {
      ring.style.width = "54px";
      ring.style.height = "54px";
    };
    const shrink = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
    };

    const targets = document.querySelectorAll("a,button,[data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
