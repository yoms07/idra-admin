import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  completed: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateTodoInputSchema = z.object({
  title: z.string().min(1),
});

export const UpdateTodoInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoInputSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoInputSchema>;
