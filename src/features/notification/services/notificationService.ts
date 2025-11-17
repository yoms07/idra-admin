"use client";

import { http } from "@/lib/http/client";
import {
  NotificationListResponseSchema,
  type NotificationListParams,
  type NotificationListResponse,
  MarkReadResponseSchema,
  type MarkReadResponse,
} from "../schema/notification";

export const notificationService = {
  async list(
    params?: NotificationListParams
  ): Promise<NotificationListResponse> {
    const res = await http.get("/api/notifications", { params });
    return NotificationListResponseSchema.parse(res.data);
  },

  async markRead(notificationIds: string[]): Promise<MarkReadResponse> {
    const res = await http.post("/api/notifications/mark-read", {
      notificationIds,
    });
    return MarkReadResponseSchema.parse(res.data);
  },

  async markAllRead(): Promise<MarkReadResponse> {
    const res = await http.post("/api/notifications/mark-all-read", {});
    return MarkReadResponseSchema.parse(res.data);
  },
};
