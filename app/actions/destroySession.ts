"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroySession() {
  // Retrieve the session cookie
  const sessionCookie = cookies().get("appwrite-session");

  if (!sessionCookie) {
    return {
      error: "No session found",
    };
  }

  try {
    const { account } = await createSessionClient(sessionCookie.value);

    // Delete the session
    await account.deleteSession("current");

    // Remove the cookie
    cookies().delete("appwrite-session");

    return {
      success: true,
    };
  } catch {
    return {
      error: "Error deleting session",
    };
  }
}

export default destroySession;
