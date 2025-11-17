import type { Notification } from "../schema/notification";

export const deriveAmountLabel = (notification: Notification): string => {
  const amount = notification.metadata?.amount;
  const currency = notification.metadata?.currency;
  switch (notification.eventType) {
    case "transfer_onchain":
      return `${Number(amount).toLocaleString()} IDRA`;
    case "withdrawal_completed":
      return `${Number(amount).toLocaleString()} ${currency}`;
    case "deposit_completed":
      return `${Number(amount).toLocaleString()} ${currency}`;
    case "deposit_onchain":
      return `${Number(amount).toLocaleString()} IDRA`;
  }
  return notification.message;
};

export const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
