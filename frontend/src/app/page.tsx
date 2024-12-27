"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/components/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login

    try {
      // Call login API
      await login(email, password);
      // Redirect to /employee upon successful login
      router.push("/employees");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="rounded-lg border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-6 text-2xl font-bold text-center text-black dark:text-white">
          Login
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-4 py-2 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-primary py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
