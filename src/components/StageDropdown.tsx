"use client";
import React from "react";

const stages = ["Discovery", "Proposal", "Won", "Lost"] as const;
export type Stage = typeof stages[number];

export default function StageDropdown({ value, onChange }: { value: Stage; onChange: (stage: Stage) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Stage)}
      className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {stages.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
