"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar({ title, action }: { title: string; action?: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">{title}</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        {action}
        <div className="flex items-center gap-2 sm:gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-zinc-200">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-amber-300" />
          <span className="text-xs sm:text-sm text-zinc-700 truncate">{user?.username || "User"}</span>
          <button onClick={logout} className="rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 whitespace-nowrap">Logout</button>
        </div>
      </div>
    </div>
  );
}
