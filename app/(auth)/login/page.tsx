"use client";

import createSession from "@/app/actions/createSession";
import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

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
    initialState,
  );
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Logged in successfully");
      setIsAuthenticated(true);
      router.push("/");
    }
  }, [state, router, setIsAuthenticated]);

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
            <LoginButton />

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
