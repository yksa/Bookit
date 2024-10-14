"use client";

import { useFormStatus } from "react-dom";

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-700 ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={pending} // Disable button while loading
    >
      {pending ? "Logging in..." : "Login"}
    </button>
  );
};

export default LoginButton;
