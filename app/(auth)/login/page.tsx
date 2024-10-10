"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useFormState } from "react-dom";
import createSession from "@/app/actions/createSession";
import { useRouter } from "next/navigation";

interface FormState {
  email: string;
  password: string;
  error?: string;
  success?: boolean;
}

const initialState: FormState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();
  const [state, formAction] = useFormState<FormState, FormData>(
    createSession,
    initialState
  );

  console.log({ state });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Logged in successfully");
      router.push("/");
    }
  }, [state]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Login
          </h2>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded w-full py-3 px-4"
              required
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full py-3 px-4"
              required
            />
          </div>

          <div className="flex flex-col gap-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-700"
            >
              Login
            </button>

            <p className="text-center">
              No account?
              <Link href="/register" className="text-blue-500">
                {" "}
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
