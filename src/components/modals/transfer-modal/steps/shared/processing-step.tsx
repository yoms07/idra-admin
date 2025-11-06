"use client";

import * as React from "react";
import { Loader } from "@/components/common/Loader";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function ProcessingStep() {
  const { goNext } = useMultiStepModal();
  React.useEffect(() => {
    const id = setTimeout(goNext, 1200);
    return () => clearTimeout(id);
  }, [goNext]);
  return (
    <div className="p-8 text-center space-y-4 border rounded-lg">
      <Loader />
      <div className="text-sm text-muted-foreground">
        Processing your transfer...
      </div>
    </div>
  );
}
