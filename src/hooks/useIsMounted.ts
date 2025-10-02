import { useEffect, useRef, useState } from "react";

export function useIsMounted() {
  const mounted = useRef(false);
  const [, setTick] = useState(0);
  useEffect(() => {
    mounted.current = true;
    setTick((n) => n + 1);
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted.current;
}
