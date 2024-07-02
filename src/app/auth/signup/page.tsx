"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "@/components/art/Logo";
import MainButton from "@/components/buttons/MainButton";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();

  useEffect(() => {}, [session]);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      terms: false,
    },
  });

  const password = watch("password");

  async function registerUser(data: any) {
    try {
      const response = await axios.post(`/api/auth/sign-up`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (response.status === 201) {
        <div>User Created</div>;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex justify-center items-center font-text flex-col ">
        <a href="/"><Logo /></a>
        <h1>You need to be an admin to register others.</h1>
        <MainButton onClick={() => router.push("/")}>
          Go back
        </MainButton>
      </div>
    )
  }


    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 font-text text-lg">
        <a
          href="/"
          className="flex items-center text-2xl font-semibold text-slate-900"
        >
          <Logo />
        </a>
        <div className="w-full rounded-lg bg-glass bg-contrast bg-opacity-20 p-8 shadow sm:max-w-md ">
          <form className="flex flex-col gap-4" action="#">
            <h1 className="text-xl font-medium leading-tight text-slate-900 md:text-2xl">
              Register an Admin
            </h1>
            <div>
              <label
                htmlFor="Name"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Full Name
              </label>
              <input
                type="text"
                id="Name"
                className="block w-full rounded bg-background p-2.5 text-slate-900 sm:text-sm"
                placeholder="John Doe"
                {...register("name", {
                  required: "required",
                })}
              />
              {errors?.name?.message && (
                <span className={"lowercase text-sm text-red-600"}>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded bg-background p-2.5 text-slate-900 sm:text-sm"
                placeholder="name@email.com"
                {...register("email", {
                  required: "O campo email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Endereço de email inválido",
                  },
                })}
              />
              {errors?.email?.message && (
                <span className={"lowercase text-sm text-red-600"}>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full rounded bg-background p-2.5 text-slate-900 sm:text-sm"
                placeholder="••••••••"
                {...register("password", {
                  required: true,
                })}
              />
              {errors.password?.type === "required" && (
                <span className={"lowercase text-sm text-red-600"}>
                  O campo de senha é obrigatório
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                className="block w-full rounded bg-background p-2.5 text-slate-900 sm:text-sm"
                placeholder="••••••••"
                {...register("confirm_password", {
                  required: "O campo confirmar a senha é obrigatório",
                  validate: (value) =>
                    value === password || "As senhas não são iguais",
                })}
              />
              {errors.confirm_password && (
                <span className={"lowercase text-sm text-red-600"}>
                  {errors.confirm_password.message}
                </span>
              )}
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                  {...register("terms", {
                    required: "você deve aceitar os Termos e Condições",
                  })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-700 ">
                  I have read and accept the{" "}
                  <a
                    className="text-slate-800 dark:text-primary-500 font-medium hover:underline"
                    href="#"
                  >
                    Terms and conditions
                  </a>
                </label>
              </div>
            </div>
            {errors.terms && (
              <span className="text-red-600">{errors.terms.message}</span>
            )}
            <MainButton onClick={() => handleSubmit(registerUser)()}>
              Sign Up
            </MainButton>
            <p className="text-sm font-light text-slate-900">
              Already have an account?{" "}
              <a
                href="/auth/sign-in?callbackUrl=/"
                className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  

}
