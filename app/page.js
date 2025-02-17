import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./pages/LoginForm";

export default async function LandingPage() {
  const session = await auth(); // Server-side authentication

  if (session) {
    redirect("/Home"); // Redirect logged-in users
  }

  return <LoginForm />; // Render the login form (client-side)
}
