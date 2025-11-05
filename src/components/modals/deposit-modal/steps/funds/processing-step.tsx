"use client";

import * as React from "react";
import { Loader } from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function ProcessingStep() {
  const { goNext } = useMultiStepModal();

  React.useEffect(() => {
    const id = setTimeout(() => {
      goNext();
    }, 1200);
    return () => clearTimeout(id);
  }, [goNext]);

  return (
    <Card className="p-8 text-center space-y-4">
      <Loader />
      <div className="text-sm text-muted-foreground">
        Processing your deposit...
      </div>
    </Card>
  );
}
