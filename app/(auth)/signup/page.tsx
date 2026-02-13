import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup page",
};

const SignupPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      <div className="w-full relative h-screen hidden md:block">
        <div className="bg-primary h-full w-full absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
        <Image
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by mymind on Unsplash"
          title="Photo by mymind on Unsplash"
          fill
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
        />
      </div>
      <div className="w-full relative h-screen flex flex-col items-center justify-center">
        <SignupForm />
      </div>
    </main>
  );
};

export default SignupPage;
