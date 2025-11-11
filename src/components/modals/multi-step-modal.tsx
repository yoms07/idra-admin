"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type StepRenderContext = {
  stepIndex: number;
  stepCount: number;
  goNext: () => void;
  goPrevious: () => void;
  setStep: (index: number) => void;
  goTo: (index: number) => void;
  close: () => void;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
};

export type MultiStep = {
  id?: string;
  title?: React.ReactNode;
  // Either static children or a render function with navigation utilities
  content?: React.ReactNode;
  render?: (ctx: StepRenderContext) => React.ReactNode;
  // Optional per-step footer (overrides global renderFooter when provided)
  footer?: React.ReactNode;
  renderFooter?: (ctx: StepRenderContext) => React.ReactNode;
  // Optional per-step progress visibility override
  showProgressBar?: boolean;
  showProgressStep?: boolean;
};

export type MultiStepModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: MultiStep[];
  initialStep?: number;
  showProgressBar?: boolean;
  showProgressStep?: boolean;
  showNavigation?: boolean; // show Previous/Next default controls
  headerChildren?: React.ReactNode; // right-side or below title area
  renderFooter?: (ctx: StepRenderContext) => React.ReactNode; // custom footer
  className?: string;
};

type MultiStepContextValue = StepRenderContext & {
  titles: (React.ReactNode | undefined)[];
};

const MultiStepContext = React.createContext<MultiStepContextValue | null>(
  null
);

export function useMultiStepModal() {
  const ctx = React.useContext(MultiStepContext);
  if (!ctx)
    throw new Error("useMultiStepModal must be used inside MultiStepModal");
  return ctx;
}

export function MultiStepModal({
  open,
  onOpenChange,
  steps,
  initialStep = 0,
  showProgressBar = true,
  showProgressStep = true,
  showNavigation = true,
  headerChildren,
  renderFooter,
  className,
}: MultiStepModalProps) {
  const [index, setIndex] = React.useState(initialStep);
  const stepCount = steps.length;
  const clampedIndex = Math.min(Math.max(index, 0), Math.max(stepCount - 1, 0));
  const current = steps[clampedIndex];

  const goNext = React.useCallback(() => {
    setIndex((i) => Math.min(i + 1, stepCount - 1));
  }, [stepCount]);
  const goPrevious = React.useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);
  const setStep = React.useCallback(
    (i: number) => {
      setIndex(() => Math.min(Math.max(i, 0), Math.max(stepCount - 1, 0)));
    },
    [stepCount]
  );

  const ctx: MultiStepContextValue = React.useMemo(
    () => ({
      stepIndex: clampedIndex,
      stepCount,
      goNext,
      goPrevious,
      setStep,
      goTo: setStep,
      close: () => onOpenChange(false),
      isFirst: clampedIndex === 0,
      isLast: clampedIndex === stepCount - 1,
      canGoNext: clampedIndex < stepCount - 1,
      canGoPrevious: clampedIndex > 0,
      titles: steps.map((s) => s.title),
    }),
    [clampedIndex, stepCount, goNext, goPrevious, setStep, steps, onOpenChange]
  );

  const progress = stepCount > 1 ? ((clampedIndex + 1) / stepCount) * 100 : 0;
  const stepShowProgress = current?.showProgressBar;
  const shouldShowProgressBar = stepShowProgress ?? showProgressBar;
  const shouldShowProgressStep = current?.showProgressStep ?? showProgressStep;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-h-[85vh] flex flex-col overflow-hidden", className)}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {current?.title && (
                <DialogTitle className="text-center text-2xl py-2">
                  {current.title}
                </DialogTitle>
              )}
              <div className="mt-3">
                {shouldShowProgressBar && stepCount > 1 && (
                  <Progress value={progress} className="h-1.5" />
                )}
                {shouldShowProgressStep && stepCount > 1 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Step {clampedIndex + 1} of {stepCount}
                  </div>
                )}
              </div>
            </div>
            {headerChildren && <div className="shrink-0">{headerChildren}</div>}
          </div>
        </DialogHeader>

        <MultiStepContext.Provider value={ctx}>
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            {current?.render ? current.render(ctx) : current?.content}
          </div>
        </MultiStepContext.Provider>

        {(() => {
          // Prefer per-step footer when provided
          const stepFooter = current?.renderFooter
            ? current.renderFooter(ctx)
            : current?.footer;
          if (stepFooter) {
            return <DialogFooter>{stepFooter}</DialogFooter>;
          }
          if (renderFooter) {
            return <DialogFooter>{renderFooter(ctx)}</DialogFooter>;
          }
          if (showNavigation) {
            return (
              <DialogFooter>
                <div className="flex w-full items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={goPrevious}
                    disabled={clampedIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={goNext}
                    disabled={clampedIndex === stepCount - 1}
                  >
                    Next
                  </Button>
                </div>
              </DialogFooter>
            );
          }
          return null;
        })()}
      </DialogContent>
    </Dialog>
  );
}
