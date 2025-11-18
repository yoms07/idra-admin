"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MetadataDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metadata: Record<string, any>;
}

export function MetadataDetailModal({
  open,
  onOpenChange,
  metadata,
}: MetadataDetailModalProps) {
  const formattedJson = JSON.stringify(metadata, null, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Metadata Details</DialogTitle>
          <DialogDescription>
            View the complete metadata information
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-[#F9FAFB] p-4">
          <pre className="text-sm text-[#0F172A] whitespace-pre-wrap break-words font-mono">
            {formattedJson}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
