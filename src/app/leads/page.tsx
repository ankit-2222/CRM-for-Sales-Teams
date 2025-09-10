"use client";
import Protected from "@/components/Protected";
import Topbar from "@/components/Topbar";
import CardTable from "@/components/CardTable";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ApiError, Lead } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Lead[]>("/leads");
      setLeads(res.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createLead = async () => {
    setSaving(true);
    try {
      const res = await api.post<Lead>("/leads", form);
      setLeads((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", status: "New" });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to create lead");
    } finally {
      setSaving(false);
    }
  };

  const editLead = async (lead: Lead) => {
    const name = window.prompt("Name", lead.name);
    if (name == null) return;
    const email = window.prompt("Email", lead.email);
    if (email == null) return;
    const phone = window.prompt("Phone", lead.phone);
    if (phone == null) return;
    const status =
      window.prompt("Status (New/Contacted/Qualified)", lead.status) ||
      lead.status;
    try {
      const res = await api.put<Lead>(`/leads/${lead._id}`, {
        name,
        email,
        phone,
        status,
      });
      setLeads((prev) => prev.map((l) => (l._id === lead._id ? res.data : l)));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to update lead");
    }
  };

  const deleteLead = async (lead: Lead) => {
    if (!window.confirm(`Delete ${lead.name}?`)) return;
    try {
      await api.delete(`/leads/${lead._id}`);
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to delete lead");
    }
  };

  const convertLead = async (lead: Lead) => {
    const title = window.prompt("Opportunity title", lead.name) || lead.name;
    const valueStr = window.prompt("Opportunity value", "0") || "0";
    const value = Number(valueStr) || 0;
    try {
      await api.post(`/leads/${lead._id}/convert`, { title, value });
      // Update status locally
      setLeads((prev) =>
        prev.map((l) =>
          l._id === lead._id ? { ...l, status: "Qualified" } : l
        )
      );
      alert("Converted to opportunity");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || "Failed to convert lead");
    }
  };

  return (
    <Protected>
      <div className="space-y-6">
        <Topbar
          title="Leads"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:scale-[1.02] hover:bg-blue-500 transition"
            >
              + Add Lead
            </button>
          }
        />

        {showForm && (
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                placeholder="Name"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  disabled={saving}
                  onClick={createLead}
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
                    <th className="px-3 sm:px-6 py-3">Name</th>
                    <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-3 sm:px-6 py-3 hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-3 sm:px-6 py-3">Status</th>
                    <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">
                      Owner
                    </th>
                    <th className="px-3 sm:px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l._id} className="border-t hover:bg-zinc-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div>
                          <div className="font-medium text-zinc-900">
                            {l.name}
                          </div>
                          <div className="text-xs text-zinc-500 sm:hidden">
                            {l.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                        {l.email}
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                        {l.phone}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          {l.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                        {l.ownerId}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right">
                        <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => editLead(l)}
                            className="rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-blue-600 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => convertLead(l)}
                            className="rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-emerald-600 hover:bg-emerald-50"
                          >
                            Convert
                          </button>
                          <button
                            onClick={() => deleteLead(l)}
                            className="rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
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
