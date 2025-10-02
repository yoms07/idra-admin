import { z } from "zod";
import {
  CreateTodoInputSchema,
  TodoSchema,
  UpdateTodoInputSchema,
  type CreateTodoInput,
  type Todo,
  type UpdateTodoInput,
} from "../schema/todo";
import { http } from "@/lib/http/client";

const TodoListResponseSchema = z.object({
  items: z.array(TodoSchema),
});

export const todoService = {
  async list(params?: { completed?: boolean }): Promise<Todo[]> {
    const res = await http.get("/todos", { params });
    const parsed = TodoListResponseSchema.parse(res.data);
    return parsed.items;
  },
  async get(id: string): Promise<Todo> {
    const res = await http.get(`/todos/${id}`);
    return TodoSchema.parse(res.data);
  },
  async create(input: CreateTodoInput): Promise<Todo> {
    const body = CreateTodoInputSchema.parse(input);
    const res = await http.post("/todos", body);
    return TodoSchema.parse(res.data);
  },
  async update(input: UpdateTodoInput): Promise<Todo> {
    const body = UpdateTodoInputSchema.parse(input);
    const res = await http.patch(`/todos/${body.id}`, body);
    return TodoSchema.parse(res.data);
  },
  async remove(id: string): Promise<void> {
    await http.delete(`/todos/${id}`);
  },
};
