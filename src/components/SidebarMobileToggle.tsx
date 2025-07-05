import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export function SidebarMobileToggle({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      className="md:hidden fixed top-4 left-4 z-30 bg-white/90 rounded-full p-2 shadow-lg border border-zinc-200 hover:bg-zinc-100 transition-colors"
      aria-label="Open sidebar"
      onClick={onClick}
    >
      <Menu className="w-6 h-6 text-zinc-900" />
    </button>
  );
}
