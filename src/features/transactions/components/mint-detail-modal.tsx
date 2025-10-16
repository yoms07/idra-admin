"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMintById } from "@/features/mint/hooks/useMint";

interface MintDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mintId?: string;
}

export function MintDetailModal({
  open,
  onOpenChange,
  mintId,
}: MintDetailModalProps) {
  const { data, isLoading } = useMintById(mintId, undefined);

  const entries = data ? Object.entries(data) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Mint Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}
          {!isLoading && data && (
            <div className="text-sm">
              <dl className="grid grid-cols-3 gap-2">
                {entries.map(([key, value]) => (
                  <>
                    <dt className="col-span-1 font-medium break-words">
                      {key}
                    </dt>
                    <dd className="col-span-2 break-words text-muted-foreground">
                      {typeof value === "object" ? (
                        <pre className="text-xs whitespace-pre-wrap break-words">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value)
                      )}
                    </dd>
                  </>
                ))}
              </dl>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
