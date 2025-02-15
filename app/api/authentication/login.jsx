'use server'
import { signIn } from "@/auth";

export async function LoginAuth(formData) {
  try {
    if (!formData) {
      return { success: false, error: "No form data received" };
    }

    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      return { success: false, error: "Username and Password are required." };
    }

    const response = await signIn("credentials", {
      username,
      password,
      redirect: false, // Prevents redirect errors
    });

    if (!response || response?.error) {
      console.error("Login Failed:", response?.error); // Log for debugging

      // Return a specific message for invalid credentials
      if (response?.error === "CredentialsSignin") {
        return { success: false, error: "Invalid Username or Password." };
      }

      // Return a general error for unexpected cases
      return { success: false, error: "Something went wrong. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in LoginAuth:", error.type);
    return { success: false, error: error.type == "CredentialsSignin" ? "Invalid Username or Password." : "An unexpected error occurred. Please try again." };
  }
}
