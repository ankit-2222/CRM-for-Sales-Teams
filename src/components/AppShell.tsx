"use client";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/signup";
  return (
    <AuthProvider>
      {isAuth ? (
        children
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      )}
    </AuthProvider>
  );
}
