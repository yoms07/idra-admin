"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useLogin,
  useRegister,
  useVerifyLoginOtp,
  useVerifyRegisterOtp,
} from "../hooks/authHook";
import {
  AuthError,
  EmailNotVerifiedError,
  UserNotFoundError,
  InvalidPasswordError,
  UserAlreadyRegisteredError,
  OtpInvalidError,
  OtpExpiredError,
  OtpMaxAttemptsError,
} from "../errors";
import { toast } from "sonner";

export type AuthStep = "login" | "register" | "otp" | "forgot-password";

export type AuthFormValues = {
  email: string;
  password: string;
  remember: boolean;
  name?: string;
  confirmPassword?: string;
  otp?: string;
  otpId?: string;
};

type AuthContextValue = {
  step: AuthStep;
  loading: boolean;
  switchTo: (s: AuthStep) => void;
  submitLogin: () => Promise<void>;
  submitRegister: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  submitForgotPassword: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = React.useState<AuthStep>("login");
  const [authFlow, setAuthFlow] = React.useState<"login" | "register">("login");
  const router = useRouter();
  const form = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
      name: "",
      confirmPassword: "",
      otp: "",
      otpId: "",
    },
    mode: "onChange",
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyLoginOtpMutation = useVerifyLoginOtp();
  const verifyRegisterOtpMutation = useVerifyRegisterOtp();

  const loading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    verifyLoginOtpMutation.isPending ||
    verifyRegisterOtpMutation.isPending;

  const switchTo = (target: AuthStep) => {
    setStep(target);
    form.setValue("otp", "");
    form.setValue("otpId", "");
    form.clearErrors();
  };

  const submitLogin = async () => {
    const valid = await form.trigger(["email", "password"]);
    if (!valid) return;

    const values = form.getValues();
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      form.setValue("otpId", result.otpId);
      setAuthFlow("login");
      setStep("otp");
    } catch (error) {
      if (!(error instanceof AuthError)) {
        form.setError("root", {
          message: "Login failed. Please try again.",
        });
        return;
      }

      if (error instanceof EmailNotVerifiedError) {
        toast.error(
          "Your email is not verified. Please continue to register first"
        );
        switchTo("register");
      } else if (error instanceof UserNotFoundError) {
        toast.error("User not found. Please register first");
        switchTo("register");
      } else if (error instanceof InvalidPasswordError) {
        form.setError((error.field || "password") as keyof AuthFormValues, {
          message: error.userMessage,
        });
      } else {
        form.setError(
          (error.field || "root") as keyof AuthFormValues | "root",
          {
            message: error.userMessage,
          }
        );
      }
    }
  };

  const submitRegister = async () => {
    const valid = await form.trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (!valid) return;

    const values = form.getValues();
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.name || undefined,
      });

      form.setValue("otpId", result.otpId);
      setAuthFlow("register");
      setStep("otp");
    } catch (error) {
      if (!(error instanceof AuthError)) {
        form.setError("root", {
          message: "Registration failed. Please try again.",
        });
        return;
      }

      if (error instanceof UserAlreadyRegisteredError) {
        toast.info("You already registred on IDRA. Continue to login");
        switchTo("login");
      } else {
        form.setError(
          (error.field || "root") as keyof AuthFormValues | "root",
          {
            message: error.userMessage,
          }
        );
      }
    }
  };

  const verifyOtp = async () => {
    console.log("VERIFIYING");
    const valid = await form.trigger("otp");
    if (!valid) return;

    const values = form.getValues();
    if (!values.otpId) {
      form.setError("otp", { message: "OTP ID missing. Please try again." });
      return;
    }

    try {
      if (authFlow === "login") {
        await verifyLoginOtpMutation.mutateAsync({
          otpId: values.otpId,
          email: values.email,
          code: values.otp || "",
        });
      } else {
        await verifyRegisterOtpMutation.mutateAsync({
          otpId: values.otpId,
          email: values.email,
          code: values.otp || "",
        });
      }

      router.push("/dashboard");
    } catch (error) {
      if (!(error instanceof AuthError)) {
        form.setError("otp", {
          message: "OTP verification failed. Please try again.",
        });
        return;
      }

      if (error instanceof OtpInvalidError) {
        form.setError((error.field || "otp") as keyof AuthFormValues, {
          message: error.userMessage,
        });
      } else if (error instanceof OtpExpiredError) {
        form.setError((error.field || "otp") as keyof AuthFormValues, {
          message: error.userMessage,
        });
        switchTo(authFlow);
      } else if (error instanceof OtpMaxAttemptsError) {
        form.setError((error.field || "otp") as keyof AuthFormValues, {
          message: error.userMessage,
        });
        switchTo(authFlow);
      } else {
        form.setError((error.field || "otp") as keyof AuthFormValues, {
          message: error.userMessage,
        });
      }
    }
  };

  const submitForgotPassword = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;
    // TODO: call forgot password API
    // This endpoint is not in the auth.module, so leaving as placeholder
  };

  const value: AuthContextValue = {
    step,
    loading,
    switchTo,
    submitLogin,
    submitRegister,
    verifyOtp,
    submitForgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </AuthContext.Provider>
  );
}
