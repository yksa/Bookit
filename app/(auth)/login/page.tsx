"use client";

import createSession from "@/app/actions/createSession";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false); // Track loading state
  const [state, formAction] = useFormState<FormState, FormData>(
    createSession,
    initialState,
  );
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (state.error) {
      setLoading(false); // Stop loading if there's an error
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Logged in successfully");
      setIsAuthenticated(true);
      router.push("/");
    }
  }, [state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Start loading when form is submitted

    const formData = new FormData(event.currentTarget); // Collect form data
    formAction(formData); // Pass the form data to formAction
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form onSubmit={handleSubmit}>
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
              className={`bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Login"}
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
