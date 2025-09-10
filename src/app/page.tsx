"use client";
import Protected from "@/components/Protected";
import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ApiError } from "@/lib/types";

export default function Page() {
  const [stats, setStats] = useState<{
    leads: number;
    opportunities: number;
    won: number;
    leadsByStatus: Record<string, number>;
    oppsByStage: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError?.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Leads", value: stats?.leads ?? 0 },
    { label: "Opportunities", value: stats?.opportunities ?? 0 },
    { label: "Won Deals", value: stats?.won ?? 0 },
  ];

  return (
    <Protected>
      <div className="space-y-6">
        <Topbar title="Dashboard" />
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-200">
            Loading...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-white p-6 text-sm text-red-600 shadow-sm ring-1 ring-zinc-200">
            {error}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-zinc-200"
                >
                  <div className="text-xs sm:text-sm text-zinc-500">
                    {c.label}
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-semibold text-zinc-900">
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-zinc-200">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-3 sm:mb-4">
                  Leads by Status
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats?.leadsByStatus || {}).map(
                    ([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="text-xs sm:text-sm text-zinc-600">
                          {status}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-zinc-900">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-zinc-200">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-3 sm:mb-4">
                  Opportunities by Stage
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats?.oppsByStage || {}).map(
                    ([stage, count]) => (
                      <div key={stage} className="flex justify-between">
                        <span className="text-xs sm:text-sm text-zinc-600">
                          {stage}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-zinc-900">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}
