"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mail, BadgeDollarSign, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const baseNavItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/leads", label: "Leads", icon: Mail },
    { href: "/opportunities", label: "Opportunities", icon: BadgeDollarSign },
  ];
  
  const adminNavItem = { href: "/admin", label: "Admin", icon: Settings };
  
  const navItems = user?.role === "admin" ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-zinc-900 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex h-screen w-72 flex-col bg-zinc-900 text-zinc-100 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 px-4 lg:px-6 py-4 lg:py-6 text-zinc-100">
          <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-full bg-blue-500" />
          <div className="text-xs lg:text-sm font-semibold">CRM for Sales Teams</div>
        </div>
        <nav className="mt-2 flex-1 px-2 lg:px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-2 lg:gap-3 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm transition ${
                  active
                    ? "bg-blue-600/20 text-white"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-blue-400" : "text-zinc-400 group-hover:text-blue-300"}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-2 lg:px-3 pb-4 lg:pb-6">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-2 lg:gap-3 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <LogOut className="h-4 w-4 text-zinc-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
