"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function UnverifiedUserAlert() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="size-4" />
      <AlertTitle>Account Verification Required</AlertTitle>
      <AlertDescription>
        Your account is not yet verified. Please wait for admin verification to
        perform transactions.
      </AlertDescription>
    </Alert>
  );
}
