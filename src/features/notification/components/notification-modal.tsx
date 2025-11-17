"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn-io/tabs";
import { useMemo, useState } from "react";
import { useNotificationList } from "@/features/notification";
import type { Notification } from "@/features/notification";
import { Loader } from "@/components/common/Loader";
import {
  DATE_FORMAT,
  deriveAmountLabel,
  SHORT_DATE_FORMAT,
} from "../services/formatter";

type NotificationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type NotificationTabValue = "all" | "today" | "week";

const NOTIFICATION_TABS: { label: string; value: NotificationTabValue }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
];

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const isWithinDays = (source: Date, days: number) => {
  const now = new Date();
  const diff = now.getTime() - source.getTime();
  const max = days * 24 * 60 * 60 * 1000;
  return diff <= max;
};

const NotificationCard = ({ item }: { item: Notification }) => {
  const createdAt = new Date(item.createdAt);
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#FAFAFA] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-black">
          <Image
            src="/images/logo-mobile.png"
            width={48}
            height={48}
            alt="idra-coin-logo"
            className="size-12 object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-black">{item.title}</p>
          <p className="text-sm text-black">{deriveAmountLabel(item)}</p>
        </div>
      </div>
      <div className="text-right text-xs font-medium text-[#98A2B3]">
        <p>{SHORT_DATE_FORMAT.format(createdAt)}</p>
      </div>
    </div>
  );
};

export function NotificationModal({
  open,
  onOpenChange,
}: NotificationModalProps) {
  const [tabValue, setTabValue] = useState<NotificationTabValue>("all");
  const { data, isLoading, isError, refetch } = useNotificationList({
    page: 1,
    limit: 20,
  });

  const filteredNotifications = useMemo(() => {
    const notifications = data?.data ?? [];
    const now = new Date();

    return notifications.filter((notif) => {
      const createdAt = new Date(notif.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }
      if (tabValue === "today") {
        return isSameDay(createdAt, now);
      }
      if (tabValue === "week") {
        return isWithinDays(createdAt, 7);
      }
      return true;
    });
  }, [data?.data, tabValue]);

  const groupedSections = useMemo(() => {
    const sections = new Map<string, Notification[]>();
    filteredNotifications.forEach((notif) => {
      const createdAt = new Date(notif.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        return;
      }
      const key = DATE_FORMAT.format(createdAt);
      sections.set(key, [...(sections.get(key) ?? []), notif]);
    });

    return Array.from(sections.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, [filteredNotifications]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-dashed border-[#FECACA] bg-[#FFF5F5] p-6 text-center text-sm text-[#B42318]">
          Failed to load notifications.
          <button
            type="button"
            className="ml-2 font-semibold underline"
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      );
    }

    if (groupedSections.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-[#E4E7EC] p-8 text-center text-sm text-muted-foreground">
          No notifications yet.
        </div>
      );
    }

    return groupedSections.map((section) => (
      <div key={section.title} className="space-y-3 w-full">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
          {section.title}
        </p>
        <div className="space-y-3">
          {section.items.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm overflow-hidden rounded-lg border-none p-0 sm:max-w-sm">
        <div className="flex flex-col gap-6 rounded-lg bg-white p-6 sm:max-w-sm">
          <DialogHeader className="gap-2 text-center">
            <DialogTitle className="text-xl font-semibold">
              Notification
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={tabValue}
            onValueChange={(value) =>
              setTabValue(value as NotificationTabValue)
            }
          >
            <TabsList className="h-12 w-full justify-between rounded-xl border-1 border-primary-100 bg-[#FFF5F5] text-sm font-semibold">
              {NOTIFICATION_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl px-4 py-2 font-bold text-primary data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContents className="mt-4 w-full px-2">
              {NOTIFICATION_TABS.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-6 w-full"
                >
                  {renderContent()}
                </TabsContent>
              ))}
            </TabsContents>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationModal;
