"use client";

export function typeWriter(
  text: string,
  onUpdate: (partial: string) => void,
  speed = 20
) {
  let index = 0;

  const interval = setInterval(() => {
    index++;
    onUpdate(text.slice(0, index));

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);

  return () => clearInterval(interval);
}
