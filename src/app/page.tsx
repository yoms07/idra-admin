"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useCreateTodo,
  useDeleteTodo,
  useTodoList,
  useUpdateTodo,
} from "@/features/todolist/hooks/useTodos";
import type { Todo } from "@/features/todolist/schema/todo";
import { useState } from "react";
import { useUiStore } from "@/state/stores/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import PrivyLoginButton from "@/components/auth/privy-login-button";

export default function Home() {
  const [title, setTitle] = useState("");
  const { data: todos } = useTodoList();
  const create = useCreateTodo();
  const update = useUpdateTodo();
  const remove = useDeleteTodo();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Wallet</h2>
            <ConnectButton />
          </div>

          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={toggleSidebar}>
              {isSidebarOpen ? "Close" : "Open"} Sidebar
            </Button>
            <Input
              placeholder="Add todo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button
              onClick={() =>
                title &&
                create.mutate({ title }, { onSuccess: () => setTitle("") })
              }
            >
              Add
            </Button>
            <PrivyLoginButton />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {todos?.map((t: Todo) => (
                  <li key={t.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={() =>
                        update.mutate({ id: t.id, completed: !t.completed })
                      }
                    />
                    <span className="flex-1">{t.title}</span>
                    <Button
                      variant="destructive"
                      onClick={() => remove.mutate(t.id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Sidebar</SheetTitle>
            </SheetHeader>
            <div className="mt-4 text-sm text-muted-foreground">
              Example sidebar content
            </div>
          </SheetContent>
        </Sheet>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
