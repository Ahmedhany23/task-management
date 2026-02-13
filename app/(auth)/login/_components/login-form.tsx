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
    formState: { isValid },
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
  /* Autofill handler */
  /* -------------------------------------------------------------------------- */

  const handleDemoFill = (): void => {
    setValue("email", DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", DEMO_CREDENTIALS.password, {
      shouldValidate: true,
    });
  };

  return (
    <Card className="w-full sm:max-w-md border-none">
      <CardHeader>
        <CardTitle className="text-3xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(handleLogin)}>
          <FieldGroup>
            {/* Email */}
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
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
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
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
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

      <CardFooter className="flex flex-col gap-2">
        {/* Demo button */}
        <Button
          type="button"
          variant="destructive"
          onClick={handleDemoFill}
          className="w-full text-sm cursor-pointer"
        >
          Use Demo Account
        </Button>

        <Button type="submit" form="login-form" className="w-full text-sm cursor-pointer" disabled={!isValid}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
