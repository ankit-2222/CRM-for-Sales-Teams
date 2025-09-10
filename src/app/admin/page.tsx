"use client";
import Protected from "@/components/Protected";
import Topbar from "@/components/Topbar";
import CardTable from "@/components/CardTable";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/types";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "rep",
  });
  const [saving, setSaving] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<User[]>("/users");
      setUsers(res.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      load();
    }
  }, [user]);

  const createUser = async () => {
    setSaving(true);
    try {
      const res = await api.post<User>("/users", form);
      setUsers((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({ username: "", email: "", password: "", role: "rep" });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userToDelete: User) => {
    if (!window.confirm(`Delete user ${userToDelete.username}?`)) return;
    try {
      await api.delete(`/users/${userToDelete._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to delete user");
    }
  };

  if (user?.role !== "admin") {
    return <div>Access denied</div>;
  }

  return (
    <Protected>
      <div className="space-y-6">
        <Topbar
          title="Admin - User Management"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:scale-[1.02] hover:bg-blue-500 transition"
            >
              + Add User
            </button>
          }
        />

        {showForm && (
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  placeholder="Username"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  aria-label="Username"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  placeholder="Email"
                  type="email"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-label="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  placeholder="Password"
                  type="password"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  aria-label="Password"
                />
              </div>
              <div>
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <select
                  id="role"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  aria-label="Role"
                >
                  <option value="rep">Rep</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  disabled={saving}
                  onClick={createUser}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <CardTable>
          {loading ? (
            <div className="p-6 text-sm text-zinc-600">Loading...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="px-3 sm:px-6 py-3">Username</th>
                    <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3">Role</th>
                    <th className="px-3 sm:px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-zinc-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div>
                          <div className="font-medium text-zinc-900">
                            {u.username}
                          </div>
                          <div className="text-xs text-zinc-500 sm:hidden">
                            {u.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                        {u.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : u.role === "manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right">
                        <button
                          onClick={() => deleteUser(u)}
                          className="rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardTable>
      </div>
    </Protected>
  );
}
