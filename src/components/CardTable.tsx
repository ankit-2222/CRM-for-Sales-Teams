import React from "react";

export default function CardTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
      {children}
    </div>
  );
}
