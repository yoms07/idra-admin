import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string(),
  eventType: z.string(),
  title: z.string(),
  message: z.string(),
  status: z.string(),
  metadata: z.record(z.string(), z.any()).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  readAt: z.string().nullable(),
});

export const NotificationListResponseSchema = z.object({
  data: z.array(NotificationSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const MarkReadResponseSchema = z.object({
  data: z.object({
    count: z.number(),
    message: z.string(),
  }),
});

export type Notification = z.infer<typeof NotificationSchema>;

export type NotificationListParams = {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
};

export type NotificationListResponse = z.infer<
  typeof NotificationListResponseSchema
>;

export type MarkReadResponse = z.infer<typeof MarkReadResponseSchema>;
