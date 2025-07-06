import { Menu } from "lucide-react";

interface SidebarMobileToggleProps {
    onClick: () => void;
}

export function SidebarMobileToggle({ onClick }: SidebarMobileToggleProps) {
    return (
        <button
            className="md:hidden fixed top-4 left-4 z-30 bg-white/90 rounded-full p-2 shadow-lg"
            aria-label="Open sidebar"
            onClick={onClick}
        >
            <Menu className="w-6 h-6 text-zinc-900" />
        </button>
    );
}
