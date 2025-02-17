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
      redirect: false,
    });

    if (!response || response?.error) {
      // Return a general error for unexpected cases
      return { success: false, error: "Something went wrong. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.type == "CredentialsSignin" ? "Invalid Username or Password." : "An unexpected error occurred. Please try again." };
  }
}
