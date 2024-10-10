"use server";

interface FormState {
  email: string;
  password: string;
  error?: string;
}

async function createSession(
  previousState: any,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log({ email, password });

  if (!email || !password) {
    return {
      email: "",
      password: "",
      error: "Email and password are required",
    };
  }

  try {
    // Your authentication logic here
    // ...

    return { email, password }; // or redirect
  } catch (error) {
    return {
      email,
      password: "",
      error: "Invalid credentials",
    };
  }
}

export default createSession;
