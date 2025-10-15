import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/features/transactions/schema/transaction";
import { PaymentStatus } from "@/features/mint/schema/mint";
import { RedeemStatus } from "@/features/redeem/schema/redeem";

interface PaymentStatusBadgeProps {
  status: TransactionStatus | PaymentStatus | RedeemStatus;
  className?: string;
}

const getStatusColor = (
  status: TransactionStatus | PaymentStatus | RedeemStatus
) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case "expired":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "waiting_payment":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "burning":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "burned":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "disbursing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusText = (
  status: TransactionStatus | PaymentStatus | RedeemStatus
) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
    case "waiting_payment":
      return "Waiting Payment";
    case "paid":
      return "Paid";
    case "burning":
      return "Burning";
    case "burned":
      return "Burned";
    case "disbursing":
      return "Disbursing";
    default:
      return "Unknown";
  }
};

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusColor(status),
        className
      )}
    >
      {getStatusText(status).toUpperCase()}
    </span>
  );
}
