"use server";

import { ID } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";

async function createUser(
  previousState: Record<string, unknown>,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (!name || !email || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  if ((password as string).length < 8) {
    return {
      error: "Password must be at least 8 characters",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  try {
    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    return {
      success: true,
    };
  } catch (error) {
    console.log("Registeration Error ", error);
    return {
      error: "Could not create user",
    };
  }
}

export default createUser;
