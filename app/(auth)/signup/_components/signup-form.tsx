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

/* -------------------------------------------------------------------------- */
/* Schema */
/* -------------------------------------------------------------------------- */

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/* Component */
/* -------------------------------------------------------------------------- */

export function SignupForm(): React.JSX.Element {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /* -------------------------------------------------------------------------- */
  /* Submit                                                                      */
  /* -------------------------------------------------------------------------- */

  const handleSignup = async (values: SignupFormValues): Promise<void> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast.error("Signup failed");
        return;
      }

      /* auto login after signup */
      await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      toast.success("Account created successfully");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unexpected error");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* UI                                                                          */
  /* -------------------------------------------------------------------------- */

  return (
    <Card className="w-full sm:max-w-md border-none">
      <CardHeader>
        <CardTitle className="text-3xl">Sign up</CardTitle>
        <CardDescription>Create your account to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit(handleSignup)}>
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
                    aria-invalid={fieldState.invalid}
                    placeholder="your@example.com"
                  />
                  {fieldState.error && (
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Button
          type="submit"
          form="signup-form"
          className="w-full text-sm"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}
