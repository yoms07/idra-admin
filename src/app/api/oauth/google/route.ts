import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/auth/services/authService";
import { cookies } from "next/headers";

const saveSession = async (at: string) => {
  const cookieStore = await cookies();

  cookieStore.set("at", at, {
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
    secure: process.env.NODE_ENV === "production",
  });
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const result = await authService.googleOAuthCallback({
      code,
      state: state || undefined,
    });

    await saveSession(result.token);
    const baseUrl = `${request.headers.get("x-forwarded-proto")}://${request.headers.get("host")}`;

    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(errorUrl);
  }
}
