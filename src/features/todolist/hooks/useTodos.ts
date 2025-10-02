import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../queryKeys";
import { todoService } from "../services/todoService";
import { type CreateTodoInput, type UpdateTodoInput } from "../schema/todo";

export function useTodoList(params?: { completed?: boolean }) {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoService.list(params),
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTodoInput) => todoService.update(input),
    onSuccess: (todo) => {
      qc.invalidateQueries({ queryKey: todoKeys.detail(todo.id) });
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}
