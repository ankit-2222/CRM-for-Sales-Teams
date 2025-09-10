"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(username, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-zinc-200">
        <h1 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-zinc-900">Create Account</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-zinc-600">Name</label>
            <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-600">Email</label>
            <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-600">Password</label>
            <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:scale-[1.01] hover:bg-blue-500 disabled:opacity-60">{loading ? "Loading..." : "Sign up"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          Already have an account? <Link className="font-medium text-blue-600 hover:underline" href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
