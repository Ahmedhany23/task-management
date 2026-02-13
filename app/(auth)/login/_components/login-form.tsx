"use client";

import * as React from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* Schema */
/* -------------------------------------------------------------------------- */

const formSchema = z.object({
  email: z.email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/* Demo credentials (fully typed) */
/* -------------------------------------------------------------------------- */

const DEMO_CREDENTIALS: LoginFormValues = {
  email: "ahmedhany.22@hotmail.com",
  password: "12345678",
};

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export function LoginForm(): React.JSX.Element {
  const router = useRouter();

  const {
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const res = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (!res) {
        toast.error("No response from server");
        return;
      }

      if (!res.ok) {
        if (res.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
          return;
        }
        toast.error(res.error || "Login failed");
        return;
      }

      toast.success("Logged in successfully");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR CATCH:", error);
      toast.error("Unexpected error");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* OAuth */
  /* -------------------------------------------------------------------------- */

  const handleOAuthSignIn = (provider: "google" | "github") => {
    // No need for 'redirect: false' usually for OAuth
    // unless you want to handle the redirect manually
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  /* -------------------------------------------------------------------------- */
  /* Autofill handler */
  /* -------------------------------------------------------------------------- */

  const handleDemoFill = (): void => {
    setValue("email", DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", DEMO_CREDENTIALS.password, {
      shouldValidate: true,
    });
  };

  return (
    <Card className="w-full sm:max-w-md border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Login</CardTitle>
        <CardDescription>
          Choose a provider or use your email to sign in.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-full transition-all hover:bg-muted"
            onClick={() => handleOAuthSignIn("google")}
          >
            <HugeiconsIcon icon={GoogleIcon} className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full transition-all hover:bg-muted"
            onClick={() => handleOAuthSignIn("github")}
          >
            <HugeiconsIcon icon={GithubIcon} className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form id="login-form" onSubmit={handleSubmit(handleLogin)}>
          <FieldGroup className="gap-4">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          type="submit"
          form="login-form"
          className="w-full text-sm font-semibold"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          Sign In with Email
        </Button>

        <div className="flex flex-col items-center gap-2 w-full mt-2">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-xs text-destructive hover:underline font-medium"
          >
            Forgot password? Try our Demo Account
          </button>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-bold hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
