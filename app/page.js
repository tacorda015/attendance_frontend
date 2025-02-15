'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { LoginAuth } from "./api/authentication/login";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    const formData = new FormData(event.target);

    try {
      const result = await LoginAuth(formData);

      if (result?.success) {
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to Home page...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        router.push("/Home");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: result?.error || "Incorrect Employee Number or Password",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full min-h-screen">
      <div className="flex flex-col gap-3 items-center border shadow rounded-md min-h-96 h-full w-96 bg-white p-4 text-center">
        <div className="border shadow rounded-full w-20 h-20 grid place-items-center">Logo</div>
        <span className="font-bold text-xl mb-5">Attendance System</span>
        <span className="font-semibold text-lg">Login</span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Username</span>
            </div>
            <input type="text" name="username" placeholder="Username" className="input input-bordered w-full" required />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" required />
          </label>

          <button type="submit" className="btn btn-primary text-white" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
