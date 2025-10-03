import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
