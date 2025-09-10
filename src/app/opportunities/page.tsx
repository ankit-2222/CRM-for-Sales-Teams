"use client";
import Protected from "@/components/Protected";
import Topbar from "@/components/Topbar";
import CardTable from "@/components/CardTable";
import StageDropdown, { Stage } from "@/components/StageDropdown";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ApiError } from "@/lib/types";

type Opportunity = {
  _id: string;
  title: string;
  value: number;
  stage: Stage;
  ownerId: string;
};

export default function OpportunitiesPage() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Opportunity[]>("/opportunities");
        setData(res.data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError?.response?.data?.message || "Failed to load opportunities"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStage = async (id: string, stage: Stage) => {
    try {
      await api.put(`/opportunities/${id}`, { stage });
      setData((prev) => prev.map((x) => (x._id === id ? { ...x, stage } : x)));
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError?.response?.data?.message ||
          "Failed to update opportunity stage"
      );
    }
  };

  return (
    <Protected>
      <div className="space-y-6">
        <Topbar title="Opportunities" />
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
                    <th className="px-3 sm:px-6 py-3">Title</th>
                    <th className="px-3 sm:px-6 py-3">Value</th>
                    <th className="px-3 sm:px-6 py-3">Stage</th>
                    <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r._id} className="border-t hover:bg-zinc-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div>
                          <div className="font-medium text-zinc-900">
                            {r.title}
                          </div>
                          <div className="text-xs text-zinc-500 sm:hidden">
                            {r.ownerId}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        ${r.value.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <StageDropdown
                          value={r.stage}
                          onChange={(s) => updateStage(r._id, s)}
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                        {r.ownerId}
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
