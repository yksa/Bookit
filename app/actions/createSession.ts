"use server";

import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";

interface FormState {
  email: string;
  password: string;
  error?: string;
  success?: boolean;
}

async function createSession(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log({ email, password });

  if (!email || !password) {
    return {
      email: "",
      password: "",
      error: "Email and password are required",
    };
  }

  try {
    // Get account instance
    const { account } = await createAdminClient();

    // Generate a session
    const session = await account.createEmailPasswordSession(email, password);

    // Create cookie

    cookies().set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });

    return { email, password, success: true }; // or redirect
  } catch (error) {
    console.log("Authentication error:", error);
    return {
      email,
      password: "",
      error: "Invalid credentials",
    };
  }
}

export default createSession;
