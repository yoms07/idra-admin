import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";
import { IDRALogo } from "@/components/icons/idra-logo";
import { GoogleIcon } from "@/components/icons/google";

export default function Page() {
  return (
    <main className="min-h-screen h-screen w-full p-6 md:p-10">
      <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 h-full">
        {/* Left: Login Panel (no Card) */}
        <div className="flex flex-col gap-6 rounded-xl py-6 justify-center max-w-xl w-full mx-auto">
          <div className="px-6 flex flex-col items-center">
            <IDRALogo />
            <h2 className="text-4xl leading-none font-semibold text-center mt-4">
              Welcome back
            </h2>
            <p className="text-[#535862] text-center mt-2 text-md font-light">
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="px-6 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                leftElement={<Mail className="size-4" />}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                leftElement={<Lock className="size-4" />}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mt-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox id="remember" />
                <span>Remember for 30 days</span>
              </label>
              <Link
                href="#"
                className="text-sm text-tertiary font-semibold hover:underline"
              >
                Forgot password
              </Link>
            </div>

            {/* Sign in */}
            <Button className="w-full">Sign in</Button>

            {/* Sign in with Google */}
            <Button
              variant="secondary"
              className="w-full shadow-none font-figtree font-semibold flex items-center"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </div>
        </div>

        {/* Right: Media placeholder */}
        <div className="rounded-2xl border overflow-hidden bg-muted/40 w-full h-full min-h-0">
          <div className="grid h-full w-full place-items-center p-3">
            <img
              src="/images/login-page.png"
              alt="Login Page"
              className="h-full w-auto max-w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
