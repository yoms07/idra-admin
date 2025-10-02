"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div style={{ padding: 24 }}>
      <h1>Something went wrong</h1>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
