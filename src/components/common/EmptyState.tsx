import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="border rounded-md p-8 text-center grid gap-3 place-items-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <h3 className="text-base font-medium">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      )}
      {action && action}
      {actionLabel && onAction && !action && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
