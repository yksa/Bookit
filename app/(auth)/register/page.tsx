"use client";

import Link from "next/link";
import { useFormState } from "react-dom";

import createUser from "@/app/actions/createUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

type FormState = {
  error?: string;
  success?: boolean;
};

const defaultFormState: FormState = {
  error: "",
  success: false,
};

const RegisterPage = () => {
  const router = useRouter();

  const [state, formAction] = useFormState<FormState, FormData>(
    createUser,
    defaultFormState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);

    if (state.success) {
      toast.success("Registered successfully");
      router.push("/login");
    }
  }, [state, router]);

  return (
    <div
      className="flex flex-1 items-center justify-center"
      style={{ height: "100%" }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
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
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-4">
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
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-gray-700 font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </button>

            <p>
              Have an account?
              <Link href="/login" className="text-blue-500">
                {" "}
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
